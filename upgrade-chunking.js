// Chặn mọi popup alert cũ làm gián đoạn
window.alert = function(msg) { console.warn("[EduAI Intercepted Alert]:", msg); };

async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Vật lí";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const lessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài 2: Chuyển động thẳng biến đổi đều";
    const customGuide = document.getElementById('ai-custom-instructions')?.value || "";
    const docContainer = document.getElementById('container-a4-doc');
    
    // Tự động làm sạch mã API Key (loại bỏ mọi khoảng trắng vô tình copy phải)
    let savedKey = (localStorage.getItem('gemini_api_key') || '').trim();

    if (type !== '5512') {
        if (typeof renderMaTranDeKiemTra === 'function' && type === '7991') {
            renderMaTranDeKiemTra(subject, grade, book);
        } else if (typeof renderPowerPointSlideDeck === 'function' && type === 'slide') {
            renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        }
        return;
    }

    // Hiển thị giao diện tạo bài trực quan
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; font-family: sans-serif;">
            <div style="font-size: 32px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang kết nối Google AI Studio...</h3>
            <p style="color: #64748b; font-size: 11pt;" id="chunk-step-detail">Khởi tạo tiến trình phân tích bài học...</p>
            <div style="width: 100%; max-width: 480px; background: #e2e8f0; height: 10px; border-radius: 6px; margin: 15px auto; overflow: hidden;">
                <div id="chunk-progress-bar" style="width: 20%; height: 100%; background: linear-gradient(90deg, #0284c7, #10b981); transition: width 0.4s;"></div>
            </div>
        </div>
    `;

    const updateStatus = (percent, statusText, stepText) => {
        const bar = document.getElementById('chunk-progress-bar');
        const sTxt = document.getElementById('chunk-status-text');
        const stTxt = document.getElementById('chunk-step-detail');
        if (bar) bar.style.width = percent + '%';
        if (sTxt) sTxt.innerText = statusText;
        if (stTxt) stTxt.innerText = stepText;
    };

    // Hàm gọi AI linh hoạt đa model
    async function queryGemini(promptText) {
        const endpoints = [
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${savedKey}`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${savedKey}`,
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${savedKey}`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${savedKey}`
        ];

        for (const url of endpoints) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: { maxOutputTokens: 8192, temperature: 0.3 }
                    })
                });

                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    return data.candidates[0].content.parts[0].text.replace(/```html/g, '').replace(/```/g, '');
                }
            } catch (err) {
                console.log("Endpoint thử nghiệm thất bại, chuyển endpoint tiếp theo:", url);
            }
        }
        return null;
    }

    const tName = (typeof teacherName !== 'undefined') ? teacherName : "Trần Thị Mỹ Thanh";
    const sName = (typeof schoolName !== 'undefined') ? schoolName : "Trường THPT Mang Thít";

    if (savedKey) {
        updateStatus(35, "Google AI đang tiếp nhận yêu cầu...", "Đang biên soạn Mục tiêu & Thiết bị theo CV 5512...");
        
        const p1 = `Đóng vai trò Chuyên gia Sư phạm GDPT 2018. Hãy viết mã HTML khổ A4 mục I. MỤC TIÊU (kiến thức, năng lực chung, năng lực đặc thù ${subject}, mã NLS 2.1, mã AI ${grade}.A1.2, phẩm chất) và II. THIẾT BỊ DẠY HỌC cho bài: ${lessonTitle}, môn ${subject} ${grade}, bộ sách ${book}. GV: ${tName} - ${sName}. Chỉ xuất mã HTML thuần.`;
        const res1 = await queryGemini(p1);

        if (res1) {
            updateStatus(70, "Google AI đang tạo Hoạt động 2...", "Xây dựng bảng 2 cột kiến thức chi tiết 100% SGK...");
            const p2 = `Viết mã HTML Hoạt động 2 dạng BẢNG 2 CỘT KẺ VIỀN ĐEN 100% cho bài: ${lessonTitle}, môn ${subject} ${grade}. Cột 1: HOẠT ĐỘNG CỦA GV VÀ HS (4 bước). Cột 2: DỰ KIẾN SẢN PHẨM (chi tiết kiến thức, công thức, định nghĩa đầy đủ để HS ghi vở). Đính kèm khung Năng lực số và Năng lực AI. Chỉ xuất mã HTML.`;
            const res2 = await queryGemini(p2);

            updateStatus(90, "Google AI đang tạo bài tập và phụ lục...", "Hệ thống trắc nghiệm 3 dạng và 2 bảng Rubric...");
            const p3 = `Viết mã HTML Hoạt động 3 Luyện tập (đủ 3 dạng thức trắc nghiệm), Hoạt động 4 Vận dụng thực tế Mang Thít - Vĩnh Long, và IV. Phụ lục (Phiếu học tập, Rubric NLS, Rubric AI) cho bài: ${lessonTitle}, môn ${subject} ${grade}. Chỉ xuất mã HTML.`;
            const res3 = await queryGemini(p3);

            if (res2 && res3) {
                updateStatus(100, "Hoàn tất!", "Đang trình bày lên khổ A4...");
                docContainer.innerHTML = res1 + "<br>" + res2 + "<br>" + res3;
                return;
            }
        }
    }

    // Nếu không có API Key hoặc kết nối mạng chặn Google AI, kích hoạt Engine nội hàm
    console.warn("Kích hoạt Engine nội hàm chất lượng cao...");
    updateStatus(100, "Hoàn tất!", "Trình bày giáo án chuẩn mực...");
    if (typeof renderGiaoAn5512HighEnd === 'function') {
        renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle);
    }
}
