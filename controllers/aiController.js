exports.getChatPage = (req, res) => {
    const data = {
        title: 'PuZero | Gemini 3 Flash AI',
        page: 'pages/ai-chat'
    };

    if (req.headers['hx-request']) {
        res.render('pages/ai-chat', data);
    } else {
        res.render('layout', data);
    }
};

exports.chatResponse = async (req, res) => {
    const { prompt, userid, system, replyTo } = req.body;
    const finalPrompt = replyTo ? `[Replying to: ${replyTo}]\n\n${prompt}` : prompt;

    try {
        const response = await fetch('https://puruboy-api.vercel.app/api/ai/puruai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userid: userid,
                prompt: finalPrompt,
                model: "puruboy-flash",
                system: system || "Kamu adalah AI asisten dari PuZero yang ramah dan membantu."
            })
        });

        const data = await response.json();
        if (!data.success) throw new Error("Gagal mendapatkan respon");

        const aiText = data.result[0].parts[0].text;
        
        // Return HTML fragment for HTMX
        res.send(`
            <div class="flex flex-col items-start space-y-2 group mb-4 opacity-0 animate-fade-in" style="animation: fadeIn 0.5s forwards">
                <div class="max-w-[85%] w-full bg-white border border-slate-100 p-5 rounded-2xl rounded-tl-none shadow-sm relative overflow-hidden">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-6 h-6 bg-gradient-to-tr from-primary to-accent rounded-lg flex items-center justify-center shrink-0">
                             <i class="ph-fill ph-lightning text-white text-[10px]"></i>
                        </div>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">PuZero AI</span>
                    </div>
                    <div class="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed overflow-x-auto ai-content">${aiText}</div>
                </div>
                <button data-reply="${encodeURIComponent(aiText.replace(/\n/g, ' '))}" onclick="setReply(decodeURIComponent(this.getAttribute('data-reply')))" class="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider">
                    <i class="ph-bold ph-arrow-u-up-left"></i> Reply
                </button>
            </div>
            <script>
                (function() {
                    const lastMsg = document.querySelector('.ai-content:last-child');
                    if (lastMsg && typeof marked !== 'undefined') {
                        lastMsg.innerHTML = marked.parse(lastMsg.textContent);
                    }
                    // Persist to history
                    if(window.PuZeroState) {
                        window.PuZeroState.chatHistory.push({ role: 'model', text: \`${aiText.replace(/`/g, '\\`')}\` });
                        window.PuZeroState.save();
                    }
                })();
            </script>
        `);

    } catch (error) {
        res.send(`<div class="p-4 text-red-500 text-xs">❌ Error: ${error.message}</div>`);
    }
};
