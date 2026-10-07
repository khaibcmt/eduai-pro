/**
 * UPGRADE-CHUNKING ENGINE v2.0 (Auto-Fallback Model & Self-Healing)
 */
async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Vật lí";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức";
    const lessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài 2: Chuyển động thẳng biến đổi đều";
    const customGuide = document.getElementById('ai-custom-instructions')?.value || "";
    const docContainer = document.getElementById('container-a4-doc');
    const savedKey = (localStorage.getItem('gemini_api_key') || '').trim();

    // Nếu không phải 5512 hoặc không có key thì chạy fallback có sẵn
    if (type !== '5512' || !savedKey) {
        if (typeof renderGiaoAn5512HighEnd === 'function' && type === '5512') {
            renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle);
        } else if (typeof renderMaTranDeKiemTra === 'function' && type === '7991') {
            renderMaTranDeKiemTra(subject, grade, book);
        } else if (typeof renderPowerPointSlideDeck === 'function' && type === 'slide') {
            renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        }
        return;
    }

    // Hiển thị khung tiến trình 3 giai đoạn
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; font-family: sans-serif;">
            <div style="font-size: 32px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang kết nối AI biên soạn chuyên sâu...</h3>
            <p style="color: #64748b; font-size: 11pt;" id="chunk-step-detail">Giai đoạn 1/3: Thiết lập Mục tiêu, NLS, AI và Thiết bị dạy học...</p>
            <div style="width: 100%; max-width: 480px; background: #e2e8f0; height: 10px; border-radius: 6px; margin: 15px auto; overflow: hidden;">
                <div id="chunk-progress-bar" style="width: 15%; height: 100%; background: linear-gradient(90deg, #0284c7, #10b981); transition: width 0.3s;"></div>
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

    // Hàm gọi API an toàn: Tự động thử các endpoint khác nhau nếu bị 404
    const callGeminiSafe = async (promptText) => {
        const models = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash',
            'gemini-pro'
        ];

        let lastError = null;

        for (const model of models) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${savedKey}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: { maxOutputTokens: 8192, temperature: 0.3 }
                    })
                });

                const data = await res.json();

                if (data.error) {
                    lastError = data.error.message || JSON.stringify(data.error);
                    continue; // Thử model tiếp theo
                }

                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text.replace(/```html/g, '').replace(/```/g, '');
                }
            } catch (e) {
                lastError = e.message;
            }
        }

        throw new Error(lastError || "Không thể kết nối đến Google Gemini. Vui lòng kiểm tra lại mã API Key.");
    };

    try {
        const tName = typeof teacherName !== 'undefined' ? teacherName : "Trần Thị Mỹ Thanh";
        const sName = typeof schoolName !== 'undefined' ? schoolName : "Trường THPT Mang Thít";

        // GIAI ĐOẠN 1: MỤC TIÊU & THIẾT BỊ
        updateStatus(30, "Đang soạn Phần I & II...", "Xác lập kiến thức cốt lõi, NLS, mã AI và thiết bị dạy học...");
        const prompt1 = `
Hãy đóng vai trò Chuyên gia Sư phạm cao cấp GDPT 2018.
Nhiệm vụ: Soạn phần hành chính và MỤC TIÊU, THIẾT BỊ DẠY HỌC theo CV 5512 cho bài: ${lessonTitle}, môn ${subject} ${grade}, bộ sách ${book}.
Giáo viên: ${tName} - ${sName}.
Ghi chú: ${customGuide}.
YÊU CẦU:
1. Tiêu đề hành chính: SỞ GD&ĐT VĨNH LONG / ${sName.toUpperCase()} / KẾ HOẠCH BÀI DẠY: ${lessonTitle.toUpperCase()}.
2. I. MỤC TIÊU:
   - Kiến thức cốt lõi chi tiết theo SGK.
   - Năng lực: Năng lực chung, Năng lực đặc thù (${subject}), Năng lực số (Mã NLS 2.1), Năng lực AI (Mã ${grade}.A1.2).
   - Phẩm chất: Chăm chỉ, Trung thực, Trách nhiệm.
   - Tích hợp: Ứng dụng thực tiễn, an toàn kỹ thuật, bảo vệ môi trường.
3. II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU của GV và HS.
CHỈ XUẤT MÃ HTML THUẦN (Không viết Phần III).`;
        const htmlPart1 = await callGeminiSafe(prompt1);

        // GIAI ĐOẠN 2: HOẠT ĐỘNG 1 & HOẠT ĐỘNG 2 (BẢNG 2 CỘT CHI TIẾT 100% KIẾN THỨC)
        updateStatus(65, "Đang xây dựng Hoạt động 2 (Bảng 2 cột)...", "Soạn chi tiết từng công thức, định nghĩa, số liệu SGK để HS ghi vở...");
        const prompt2 = `
Hãy đóng vai trò Chuyên gia Sư phạm cao cấp GDPT 2018.
Nhiệm vụ: Soạn TIẾN TRÌNH DẠY HỌC (Hoạt động 1 và Hoạt động 2) cho bài: ${lessonTitle}, môn ${subject} ${grade}.
YÊU CẦU BẮT BUỘC:
- HOẠT ĐỘNG 1: Mở đầu tuần tự 4 bước (Chuyển giao, Thực hiện, Báo cáo, Kết luận). Kèm "* DỰ KIẾN SẢN PHẨM". Không chia bảng.
- Chèn khung 👉 [Tích hợp năng lực số] và 👉 [Tích hợp năng lực AI].
- HOẠT ĐỘNG 2: BẮT BUỘC TRÌNH BÀY BẢNG 2 CỘT KẺ VIỀN ĐEN 100%.
  + Cột 1: HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH (Ghi rõ lời thoại, lệnh làm việc 4 bước).
  + Cột 2: DỰ KIẾN SẢN PHẨM (Viết đầy đủ 100% định nghĩa, công thức toán học/vật lí, đơn vị đo, đồ thị để học sinh ghi vở. TUYỆT ĐỐI KHÔNG TÓM TẮT).
CHỈ XUẤT MÃ HTML THUẦN.`;
        const htmlPart2 = await callGeminiSafe(prompt2);

        // GIAI ĐOẠN 3: HOẠT ĐỘNG 3, HOẠT ĐỘNG 4 & PHỤ LỤC (ĐỦ 3 DẠNG TRẮC NGHIỆM, 2 RUBRIC)
        updateStatus(90, "Đang hoàn thiện Luyện tập & Phụ lục...", "Tạo 3 dạng bài tập đánh giá năng lực, Phiếu học tập và 2 bảng Rubric...");
        const prompt3 = `
Hãy đóng vai trò Chuyên gia Sư phạm cao cấp GDPT 2018.
Nhiệm vụ: Soạn Hoạt động 3, Hoạt động 4 và IV. HỒ SƠ DẠY HỌC cho bài: ${lessonTitle}, môn ${subject} ${grade}.
YÊU CẦU:
- HOẠT ĐỘNG 3 (Luyện tập): Không chia bảng, đủ 4 bước kèm "* DỰ KIẾN SẢN PHẨM" gồm ĐỦ 3 DẠNG THỨC:
  + Dạng 1: Trắc nghiệm 4 lựa chọn (4 câu có A, B, C, D rõ ràng, có đáp án in đậm).
  + Dạng 2: Trắc nghiệm Đúng/Sai (1 câu gồm 4 ý a, b, c, d bối cảnh khoa học thực tế).
  + Dạng 3: Trắc nghiệm trả lời ngắn (2 câu tính toán điền số/từ ngắn).
- HOẠT ĐỘNG 4 (Vận dụng): Bài toán kỹ thuật thực tiễn liên quan đến Mang Thít / Vĩnh Long.
- IV. HỒ SƠ DẠY HỌC:
  + Phụ lục 1: PHIẾU HỌC TẬP SỐ 1 (Dạng bảng chi tiết).
  + Phụ lục 2: RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ (Bảng 5 cột: Tiêu chí, Mức 1, Mức 2, Mức 3, Điểm).
  + Phụ lục 3: RUBRIC ĐÁNH GIÁ NĂNG LỰC AI (Bảng 5 cột: Tiêu chí, Mức 1, Mức 2, Mức 3, Điểm).
CHỈ XUẤT MÃ HTML THUẦN.`;
        const htmlPart3 = await callGeminiSafe(prompt3);

        // GHÉP TOÀN BỘ VÀ XUẤT BẢN RA KHỔ A4
        updateStatus(100, "Hoàn thành 100%!", "Đang trình bày lên khổ A4...");
        setTimeout(() => {
            docContainer.innerHTML = htmlPart1 + "<br>" + htmlPart2 + "<br>" + htmlPart3;
        }, 300);

    } catch (err) {
        console.error("Lỗi tiến trình Chunking:", err);
        alert("Thông báo từ hệ thống AI:\n" + err.message + "\n\n👉 Trang web sẽ tự động chuyển sang bản bài soạn hoàn chỉnh có sẵn.");
        if (typeof renderGiaoAn5512HighEnd === 'function') {
            renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle);
        }
    }
}
