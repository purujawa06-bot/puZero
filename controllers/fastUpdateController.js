// @path controllers/fastUpdateController.js
// @type write

const fs = require('fs');
const path = require('path');

// --- FILTER KONFIGURASI ---
const IGNORE_DIRS = ['node_modules', '.git', '.cache', '.config'];
const IGNORE_FILES = ['package-lock.json','tailwind.css'];
const IGNORE_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff', '.avif',
    '.mp4', '.webm', '.mkv', '.avi', '.mov', '.flv',
    '.mp3', '.wav', '.ogg', '.flac', '.aac',
    '.woff', '.woff2', '.ttf', '.otf', '.eot',
    '.zip', '.tar', '.gz', '.rar', '.7z', '.pdf', '.exe', '.bin',
    '.map'
];

exports.getFastUpdatePage = (req, res) => {
    res.render('fastupdate');
};

exports.downloadContext = (req, res) => {
    const rootDir = path.join(__dirname, '../');
    let contextData = "=== PUZERO PROJECT CONTEXT ===\n\n";

    function readDirectory(dir) {
        let files;
        try { files = fs.readdirSync(dir); } catch (e) { return; }

        for (const file of files) {
            // Skip hidden files & folders
            if (file.startsWith('.')) continue;

            const fullPath = path.join(dir, file);
            let stat;
            try { stat = fs.statSync(fullPath); } catch (e) { continue; }

            const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

            if (stat.isDirectory()) {
                if (IGNORE_DIRS.includes(file)) continue;
                readDirectory(fullPath);
            } else {
                if (IGNORE_FILES.includes(file)) continue;
                const ext = path.extname(file).toLowerCase();
                if (IGNORE_EXTENSIONS.includes(ext)) continue;

                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    contextData += `\n--- BEGIN: ${relativePath} ---\n`;
                    contextData += content;
                    contextData += `\n--- END: ${relativePath} ---\n`;
                } catch (err) { /* skip binary */ }
            }
        }
    }

    try {
        readDirectory(rootDir);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="context.txt"');
        res.send(contextData);
    } catch (error) {
        res.status(500).send("Terjadi kesalahan saat mengekstrak konteks.");
    }
};

exports.applyUpdate = (req, res) => {
    try {
        const base64Data = req.body;
        const decodedText = Buffer.from(base64Data, 'base64').toString('utf8');

        const rootDir = path.resolve(path.join(__dirname, '../'));
        let report = [];

        // Ekstrak blok <execution_N>...</execution_N>
        const execBlockRegex = /<execution_\d+>([\s\S]*?)<\/execution_\d+>/gi;
        let blockMatch;

        while ((blockMatch = execBlockRegex.exec(decodedText)) !== null) {
            const blockContent = blockMatch[1].trim();

            // IZINKAN: cat heredoc — cat << 'EOF' > path\ncontent\nEOF
            const catMatch = blockContent.match(/^cat\s+<<\s+'?EOF'?\s+>\s+(\S+)\n([\s\S]*?)\nEOF\s*$/);
            if (catMatch) {
                const relPath = catMatch[1].trim();
                const content = catMatch[2];

                const absPath = path.resolve(path.join(rootDir, relPath));
                if (!absPath.startsWith(rootDir)) {
                    report.push(`🚫 Blocked (Path Traversal): ${relPath}`);
                    continue;
                }

                const dirName = path.dirname(absPath);
                if (!fs.existsSync(dirName)) fs.mkdirSync(dirName, { recursive: true });
                fs.writeFileSync(absPath, content, 'utf8');
                report.push(`✅ Written: ${relPath}`);
                continue;
            }

            // IZINKAN: rm path
            const rmMatch = blockContent.match(/^rm\s+(\S+)$/);
            if (rmMatch) {
                const relPath = rmMatch[1].trim();
                const absPath = path.resolve(path.join(rootDir, relPath));

                if (!absPath.startsWith(rootDir)) {
                    report.push(`🚫 Blocked (Path Traversal): ${relPath}`);
                    continue;
                }

                if (fs.existsSync(absPath)) {
                    fs.unlinkSync(absPath);
                    report.push(`✅ Deleted: ${relPath}`);
                } else {
                    report.push(`⚠️ Not Found (Delete Skip): ${relPath}`);
                }
                continue;
            }

            const preview = blockContent.split('\n')[0].substring(0, 60);
            report.push(`🚫 Blocked (Command Not Allowed): ${preview}...`);
        }

        if (report.length === 0) {
            return res.status(400).send("Tidak ada blok <execution_N> valid yang ditemukan.");
        }

        setTimeout(() => {
            console.log("🔄 Sistem di-restart oleh Fast Update...");
            process.exit(0);
        }, 1000);

        res.status(200).send(report.join('\n') + '\n\nSistem sedang memuat ulang...');

    } catch (error) {
        console.error(error);
        res.status(500).send(`Error saat apply update: ${error.message}`);
    }
};
