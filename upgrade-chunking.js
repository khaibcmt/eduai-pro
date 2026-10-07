/**
 * UPGRADE-CHUNKING ENGINE v1.1 (Fixed Error Handling & API Safety)
 */
async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Vật lí";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức";
    const lessonTitle = currentSelectedLesson || "Bài học đang chọn";
    const customGuide = document.getElementById('ai-custom-instructions')?.value || "";
    const docContainer = document.getElementById('container-a4-doc');
    const savedKey = (localStorage.getItem('gemini_api_key') || '').trim();

    // Nếu không phải tạo giáo án hoặc không có key, chạy fallback có sẵn
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
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang khởi tạo tiến trình soạn chuyên sâu 100% SGK...</h3>
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

    try {
        const callGeminiPart = async (promptText) => {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${savedKey}`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { maxOutputTokens: 8192, temperature: 0.3 }
                })
            });

            const d = await res.json();

            // Bắt lỗi nếu API key không hợp lệ hoặc bị từ chối
            if (d.error) {
                throw new Error("Google API báo lỗi: " + (d.error.message || JSON.stringify(d.error)));
            }
            if (!d.candidates || d.candidates.length === 0 || !d.candidates[0].content) {
                throw new Error("Mô hình không trả về nội dung (Có thể do chạm bộ lọc an toàn hoặc token).");
            }

            return d.candidates[0].content.parts[0].text.replace(/```html/g, '').replace(/```/g, '');
        };

        // GIAI ĐOẠN 1: MỤC TIÊU & THIẾT BỊ
        updateStatus(30, "Đang soạn Phần I & II...", "Xác lập kiến thức cốt lõi, NLS, mã AI và thiết bị dạy học...");
        const prompt1 = `
${typeof MASTER_PROMPT_GIAOAN !== 'undefined' ? MASTER_PROMPT_GIAOAN : ''}
NHIỆM VỤ GIAI ĐOẠN 1: Soạn phần hành chính đầu trang và MỤC TIÊU, THIẾT BỊ DẠY HỌC cho bài: ${lessonTitle}, môn ${subject} ${grade}, sách ${book}.
Giáo viên: ${typeof teacherName !== 'undefined' ? teacherName : 'Trần Thị Mỹ Thanh'} - ${typeof schoolName !== 'undefined' ? schoolName : 'Trường THPT Mang Thít'}.
Chỉ dẫn bổ sung: ${customGuide}.
YÊU CẦU:
- Bảng hành chính (SỞ GD&ĐT VĨNH LONG / TRƯỜNG THPT MANG THÍT / CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM).
- Tiêu đề KẾ HOẠCH BÀI DẠY: ${lessonTitle.toUpperCase()}.
- I. MỤC TIÊU (1. Kiến thức; 2. Năng lực gồm 2.1 chung, 2.2 đặc thù, 2.3 Năng lực số có mã NLS, 2.4 Năng lực AI có mã lớp ${grade}.A1...; 3. Phẩm chất; 4. Tích hợp).
- II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU.
CHỈ TRẢ VỀ MÃ HTML THUẦN (Không viết Phần III).`;
        const htmlPart1 = await callGeminiPart(prompt1);

        // GIAI ĐOẠN 2: HOẠT ĐỘNG 1 & HOẠT ĐỘNG 2
        updateStatus(65, "Đang xây dựng Hoạt động 2 (Bảng 2 cột)...", "Soạn chi tiết từng đề mục, công thức, số liệu SGK để HS ghi vở...");
        const prompt2 = `
${typeof MASTER_PROMPT_GIAOAN !== 'undefined' ? MASTER_PROMPT_GIAOAN : ''}
NHIỆM VỤ GIAI ĐOẠN 2: Soạn TIẾN TRÌNH DẠY HỌC (Hoạt động 1 và Hoạt động 2) cho bài: ${lessonTitle}, môn ${subject} ${grade}.
YÊU CẦU ĐẶC BIỆT NGHIÊM NGẶT:
- HOẠT ĐỘNG 1: Dạng văn bản 4 bước, không chia bảng. Kèm "* DỰ KIẾN SẢN PHẨM".
- Khung 👉 [Tích hợp năng lực số] và 👉 [Tích hợp năng lực AI].
- HOẠT ĐỘNG 2: BẮT BUỘC BẢNG 2 CỘT KẺ VIỀN ĐEN 100%. 
  + Cột 1: "HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH" (Đủ 4 bước: Chuyển giao, Thực hiện, Báo cáo, Kết luận).
  + Cột 2: "DỰ KIẾN SẢN PHẨM" (BẮT BUỘC VIẾT ĐẦY ĐỦ 100% KIẾN THỨC, ĐỊNH NGHĨA, CÔNG THỨC, ĐỒ THỊ, BẢN CHẤT SGK ĐỂ HỌC SINH GHI VỞ. TUYỆT ĐỐI KHÔNG TÓM TẮT HAY DÙNG CỤM TỪ 'v.v...', '...').
CHỈ TRẢ VỀ MÃ HTML THUẦN.`;
        const htmlPart2 = await callGeminiPart(prompt2);

        // GIAI ĐOẠN 3: HOẠT ĐỘNG 3, HOẠT ĐỘNG 4 & PHỤ LỤC
        updateStatus(90, "Đang hoàn thiện Luyện tập & Phụ lục...", "Tạo 3 dạng bài tập đánh giá năng lực, Phiếu học tập và 2 bảng Rubric...");
        const prompt3 = `
${typeof MASTER_PROMPT_GIAOAN !== 'undefined' ? MASTER_PROMPT_GIAOAN : ''}
NHIỆM VỤ GIAI ĐOẠN 3: Soạn Hoạt động 3, Hoạt động 4 và IV. HỒ SƠ DẠY HỌC / PHỤ LỤC cho bài: ${lessonTitle}, môn ${subject} ${grade}.
YÊU CẦU:
- HOẠT ĐỘNG 3 (Luyện tập): Không chia bảng, đủ 4 bước kèm "* DỰ KIẾN SẢN PHẨM" gồm ĐỦ 3 DẠNG THỨC:
  + Dạng 1: Trắc nghiệm 4 lựa chọn (4 câu có A, B, C, D rõ ràng, không gạch ngang trước đáp án).
  + Dạng 2: Trắc nghiệm Đúng/Sai (1 câu gồm 4 ý a, b, c, d với câu dẫn bối cảnh khoa học thực nghiệm).
  + Dạng 3: Trắc nghiệm trả lời ngắn (2 câu tính toán điền số/từ ngắn).
- HOẠT ĐỘNG 4 (Vận dụng): Tình huống thực tiễn gắn với địa phương Mang Thít / Vĩnh Long.
- IV. HỒ SƠ DẠY HỌC:
  + Phụ lục 1: PHIẾU HỌC TẬP SỐ 1 (Dạng bảng chi tiết).
  + Phụ lục 2: RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ (Bảng 5 cột kẻ đen).
  + Phụ lục 3: RUBRIC ĐÁNH GIÁ NĂNG LỰC AI (Bảng 5 cột kẻ đen).
CHỈ TRẢ VỀ MÃ HTML THUẦN.`;
        const htmlPart3 = await callGeminiPart(prompt3);

        // GHÉP TOÀN BỘ VÀ XUẤT BẢN
        updateStatus(100, "Hoàn thành 100%!", "Đang trình bày lên khổ A4...");
        setTimeout(() => {
            docContainer.innerHTML = htmlPart1 + "<br>" + htmlPart2 + "<br>" + htmlPart3;
        }, 300);

    } catch (err) {
        console.error("Lỗi tiến trình Chunking:", err);
        alert("Lỗi gọi AI: " + err.message + "\nHệ thống sẽ chuyển sang chế độ soạn bài nội hàm có sẵn.");
        if (typeof renderGiaoAn5512HighEnd === 'function') {
            renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle);
        }
    }
}
