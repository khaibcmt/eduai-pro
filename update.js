// ============================================================================
// FILE CẬP NHẬT NHANH (update.js) - BIOMASTER AI
// Sau này cần nâng cấp tính năng hoặc đổi Model AI, chỉ cần dán code vào đây!
// ============================================================================

// 1. CẬP NHẬT DANH SÁCH MODEL AI (Nếu sau này Google ra model mới)
window.ACTIVE_GEMINI_MODELS = [
    { id: 'gemini-3.5-flash-lite', name: '3.5 Flash-Lite (Câu trả lời nhanh nhất)' },
    { id: 'gemini-3.8-flash', name: '3.8 Flash (Trợ giúp toàn diện)', default: true },
    { id: 'gemini-3.1-pro-preview', name: '3.1 Pro (Suy luận nâng cao)' }
];

// Tự động đồng bộ danh sách model lên thanh chọn trên Header
(function syncModelDropdown() {
    const sel = document.getElementById('sel-gemini-model');
    if (!sel || !window.ACTIVE_GEMINI_MODELS) return;
    const saved = localStorage.getItem('selected_gemini_model');
    sel.innerHTML = window.ACTIVE_GEMINI_MODELS.map(m => {
        const isSelected = saved ? (saved === m.id) : !!m.default;
        return `<option value="${m.id}" class="bg-slate-900 text-white" ${isSelected ? 'selected' : ''}>${m.name}</option>`;
    }).join('');
})();

// 2. GHI ĐÈ HÀM GỌI API GEMINI (Luôn ưu tiên chạy hàm trong update.js này)
window.callGeminiDirect = async function(apiKey, selectedModel, promptText, requireJson = false) {
    const fallbackChain = [
        selectedModel,
        ...window.ACTIVE_GEMINI_MODELS.map(m => m.id)
    ].filter((v, i, a) => a.indexOf(v) === i);

    let lastError = null;

    for (const modelName of fallbackChain) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const genConfig = {
                temperature: 0.7,
                maxOutputTokens: 8192
            };
            if (requireJson) {
                genConfig.responseMimeType = "application/json";
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: genConfig
                })
            });

            const rawText = await res.text();
            let data = null;
            try {
                data = JSON.parse(rawText);
            } catch (e) {
                throw new Error(`Phản hồi máy chủ không hợp lệ (HTTP ${res.status})`);
            }

            if (!res.ok) {
                const errMsg = data?.error?.message || `Lỗi HTTP ${res.status}`;
                if (res.status === 404 || errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('no longer available')) {
                    lastError = new Error(errMsg);
                    continue;
                }
                throw new Error(errMsg);
            }

            const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textOut || textOut.trim() === '') {
                throw new Error(`Mô hình ${modelName} không trả về văn bản.`);
            }
            return textOut;
        } catch (err) {
            lastError = err;
        }
    }

    throw lastError || new Error("Không thể kết nối đến Google Gemini API.");
};

// 3. VÙNG MỞ RỘNG: Sau này cần sửa hàm nào, thầy chỉ cần bảo tôi viết hàm đó rồi dán nối tiếp xuống dưới đây.
