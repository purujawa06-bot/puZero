// @path controllers/fastUpdateController.js
// @type write

const fs = require('fs');
const path = require('path');

// --- KONFIGURASI DOWNLOADER CONTEXT ---
const IGNORE_DIRS = ['node_modules'];
const IGNORE_FILES = ['package-lock.json'];

exports.getFastUpdatePage = (req, res) => {
    // Render file fastupdate.ejs tanpa layout utama
    res.render('fastupdate');
};

exports.downloadContext = (req, res) => {
    const rootDir = path.join(__dirname, '../');
    let contextData = "=== PUZERO PROJECT CONTEXT ===\n\n";

    function readDirectory(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            // Abaikan file/folder tersembunyi (dimulai dengan titik)
            if (file.startsWith('.')) continue;

            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

            if (stat.isDirectory()) {
                // Abaikan direktori yang masuk blacklist
                if (IGNORE_DIRS.includes(file)) continue;
                readDirectory(fullPath);
            } else {
                // Abaikan file yang masuk blacklist
                if (IGNORE_FILES.includes(file)) continue;

                // Baca semua file sebagai UTF-8 (tanpa filter ekstensi ketat)
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    contextData += `\n--- BEGIN: ${relativePath} ---\n`;
                    contextData += content;
                    contextData += `\n--- END: ${relativePath} ---\n`;
                } catch (err) {
                    console.error(`Gagal membaca file: ${relativePath}`);
                }
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
        // 1. Ambil body (Base64) dan Decode ke UTF-8
        const base64Data = req.body;
        const decodedText = Buffer.from(base64Data, 'base64').toString('utf8');

        const rootDir = path.join(__dirname, '../');
        let report = [];

        // 2. Ekstrak kode blok (Mendukung semua bahasa atau tanpa tag bahasa)
        const blockRegex = /```(?:\w+)?\n([\s\S]*?)```/gi;
        let match;

        while ((match = blockRegex.exec(decodedText)) !== null) {
            const blockContent = match[1];

            // 3. Cari @path dan @type di dalam blok
            const pathMatch = blockContent.match(/\/\/\s*@path\s+(.+)/i);
            const typeMatch = blockContent.match(/\/\/\s*@type\s+(write|delete)/i);

            if (pathMatch && typeMatch) {
                const filePath = path.join(rootDir, pathMatch[1].trim());
                const actionType = typeMatch[1].trim().toLowerCase();

                if (actionType === 'delete') {
                    // --- LOGIKA DELETE ---
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        report.push(`✅ Deleted: ${pathMatch[1].trim()}`);
                    } else {
                        report.push(`⚠️ Not Found (Delete Skip): ${pathMatch[1].trim()}`);
                    }
                } else if (actionType === 'write') {
                    // --- LOGIKA WRITE ---
                    // Buat folder jika belum ada
                    const dirName = path.dirname(filePath);
                    if (!fs.existsSync(dirName)) {
                        fs.mkdirSync(dirName, { recursive: true });
                    }

                    // Bersihkan tag @path dan @type dari konten yang akan disave
                    let cleanContent = blockContent
                        .replace(/\/\/\s*@path\s+(.+)\n/i, '')
                        .replace(/\/\/\s*@type\s+(.+)\n/i, '')
                        .replace(/^\n/, ''); // Hapus baris kosong pertama jika ada

                    fs.writeFileSync(filePath, cleanContent, 'utf8');
                    report.push(`✅ Written: ${pathMatch[1].trim()}`);
                }
            }
        }

        if (report.length === 0) {
            return res.status(400).send("Format tidak valid atau tidak ada aksi yang ditemukan.");
        }

        // 4. Restart Server otomatis
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