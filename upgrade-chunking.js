/**
 * EDUPHYSICS / EDUAI PRO - RAG AI GENERATOR ENGINE v6.0
 * Kết hợp: Trích xuất SGK từ Drive + Sinh nội dung chuyên sâu bằng Gemini AI
 * Chuẩn mực CV 5512 + NLS 2.1 + AI + Không bị lặp chữ Bài
 */

// 1. CẤU HÌNH LIÊN KẾT GOOGLE APPS SCRIPT ĐỌC DRIVE
const DRIVE_APP_URL = "https://script.google.com/macros/s/AKfycbyUAoctNBlViQVDcYxZr8h0DjAU2vaGk-QZfDWYl7LNlfgPj6JWRFsLZpBTAWvWuHtnzw/exec"; 

window.alert = function(msg) { console.warn("[EduAI Notice]:", msg); };

// Hàm trích xuất dữ liệu từ Drive (nếu có để làm ngữ liệu nền tảng)
async function fetchSgkContentFromDrive(lessonName) {
    if (!DRIVE_APP_URL || DRIVE_APP_URL.trim() === "" || DRIVE_APP_URL.includes("DÁN_URL")) return "";
    const cleanLesson = lessonName.trim();
    const matchLessonNum = cleanLesson.match(/bài\s*\d+/i);
    const searchKeyword = matchLessonNum ? matchLessonNum[0] : cleanLesson;

    try {
        const fetchUrl = `${DRIVE_APP_URL.trim()}?lesson=${encodeURIComponent(searchKeyword)}`;
        const res = await fetch(fetchUrl);
        const json = await res.json();
        if (json && json.status === "success" && json.data && json.data.trim().length > 20) {
            console.log("Đã nạp thành công ngữ liệu SGK từ Drive!");
            return json.data;
        }
    } catch (e) {
        console.warn("Không kết nối được Drive Web App, chuyển sang chế độ AI tri thức chuẩn:", e);
    }
    return "";
}

// 2. BỘ ĐIỀU PHỐI VÀ BIÊN SOẠN BẰNG GEMINI AI
async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const rawLessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài học đang chọn";
    const customGuide = document.getElementById('ai-custom-instructions')?.value || "";
    const docContainer = document.getElementById('container-a4-doc');
    let savedKey = (localStorage.getItem('gemini_api_key') || '').trim();

    if (type !== '5512') {
        if (typeof renderMaTranDeKiemTra === 'function' && type === '7991') {
            renderMaTranDeKiemTra(subject, grade, book);
        } else if (typeof renderPowerPointSlideDeck === 'function' && type === 'slide') {
            renderPowerPointSlideDeck(subject, grade, book, rawLessonTitle);
        }
        return;
    }

    if (!savedKey) {
        if (docContainer) {
            docContainer.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; font-family: sans-serif;">
                    <p style="color: #ef4444; font-size: 14pt; font-weight: bold;">⚠️ Chưa có mã API Key của Google AI!</p>
                    <p style="color: #475569;">Vui lòng bấm vào nút <strong>Cài API AI</strong> ở góc trên đầu trang và dán mã khóa vào.</p>
                </div>
            `;
        }
        return;
    }

    // Tự động chuẩn hóa tiêu đề bài học (loại bỏ lặp từ "BÀI")
    let cleanTitle = rawLessonTitle.trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    const formattedLessonHeading = `BÀI ${cleanTitle.toUpperCase()}`;

    docContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
            <div style="font-size: 36px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang kích hoạt AI và tra cứu Drive...</h3>
            <p style="color: #64748b; font-size: 11pt;" id="chunk-step-detail">Khởi tạo kế hoạch bài dạy: <strong>${formattedLessonHeading}</strong></p>
            <div style="width: 100%; max-width: 460px; background: #e2e8f0; height: 10px; border-radius: 6px; margin: 15px auto; overflow: hidden;">
                <div id="chunk-progress-bar" style="width: 15%; height: 100%; background: linear-gradient(90deg, #0284c7, #10b981); transition: width 0.4s;"></div>
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

    // Hàm gọi AI qua danh mục model thế hệ 3 khả dụng
    async function queryGemini(promptText) {
        const activeModels = [
            'gemini-3.1-pro-preview',
            'gemini-3.5-flash',
            'gemini-3-flash-preview',
            'gemini-flash-latest'
        ];

        let lastErr = "";
        for (const m of activeModels) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${savedKey}`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: { 
                            maxOutputTokens: 8192, 
                            temperature: 0.35 
                        }
                    })
                });

                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    return data.candidates[0].content.parts[0].text.replace(/```html/gi, '').replace(/```/gi, '');
                }
                if (data.error) {
                    lastErr = data.error.message || JSON.stringify(data.error);
                }
            } catch (err) {
                lastErr = err.message;
            }
        }
        throw new Error(lastErr || "Máy chủ AI không phản hồi.");
    }

    try {
        const tName = (typeof teacherName !== 'undefined') ? teacherName : "Trần Thị Mỹ Thanh";
        const sName = (typeof schoolName !== 'undefined') ? schoolName : "Trường THPT Nguyễn Văn Thiệt";

        // BƯỚC 0: TẢI NGỮ LIỆU TỪ DRIVE (NẾU CÓ)
        updateStatus(20, "Đang tra cứu ngữ liệu từ Drive...", "Đọc nội dung SGK từ Google Apps Script...");
        const driveContent = await fetchSgkContentFromDrive(rawLessonTitle);

        // GIAI ĐOẠN 1: MỤC TIÊU & THIẾT BỊ
        updateStatus(40, "Giai đoạn 1/3: Soạn Mục tiêu & Thiết bị...", "Xác lập kiến thức cốt lõi, NLS 2.1 và Năng lực AI...");
        const prompt1 = `
Hãy đóng vai trò Chuyên gia Sư phạm GDPT 2018 cao cấp môn ${subject}.
Nhiệm vụ: Viết mã HTML chuẩn trang A4 gồm phần Hành chính, I. MỤC TIÊU và II. THIẾT BỊ DẠY HỌC cho bài học: "${formattedLessonHeading}", môn ${subject} ${grade}, bộ sách ${book}.
Giáo viên: ${tName} - ${sName}.
${driveContent ? `NGỮ LIỆU THAM KHẢO TỪ DRIVE:\n${driveContent.substring(0, 3000)}\n` : ''}
${customGuide ? `Yêu cầu bổ sung của GV: ${customGuide}` : ''}

YÊU CẦU ĐỊNH DẠNG:
- Bảng hành chính đầu trang (SỞ GD&ĐT VĨNH LONG / ${sName.toUpperCase()} / CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM).
- Tên KẾ HOẠCH BÀI DẠY: ${formattedLessonHeading}.
- I. MỤC TIÊU:
  + 1. Kiến thức: Nêu chi tiết các kiến thức cốt lõi HS cần đạt theo SGK ${book}.
  + 2. Năng lực: Gồm 2.1 Năng lực chung; 2.2 Năng lực đặc thù môn ${subject}; 2.3 Năng lực số: Mã [NLS 2.1]; 2.4 Năng lực AI: Mã [${grade}.A1.2] (Phối hợp cùng AI, kiểm chứng và ra quyết định).
  + 3. Phẩm chất: Chăm chỉ, Trung thực, Trách nhiệm.
- II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU của Giáo viên và Học sinh.
CHỈ TRẢ VỀ CÁC THẺ HTML THUẦN (div, table, p, h2, h3...). Không dùng ký hiệu markdown.`;
        const htmlPart1 = await queryGemini(prompt1);

        // GIAI ĐOẠN 2: HOẠT ĐỘNG 1 & HOẠT ĐỘNG 2 (BẢNG 2 CỘT CHI TIẾT ĐỂ GHI VỞ)
        updateStatus(70, "Giai đoạn 2/3: Soạn Hoạt động 2 (Bảng 2 cột)...", "Sinh chi tiết nội dung từng đề mục, định nghĩa, sơ đồ/công thức...");
        const prompt2 = `
Hãy đóng vai trò Chuyên gia Sư phạm môn ${subject} ${grade} bộ sách ${book}.
Nhiệm vụ: Soạn TIẾN TRÌNH DẠY HỌC (Hoạt động 1 và Hoạt động 2) cho bài: "${formattedLessonHeading}".
${driveContent ? `NGỮ LIỆU GỐC TRÍCH XUẤT TỪ GOOGLE DRIVE:\n${driveContent}\n` : ''}
${customGuide ? `Ghi chú chuyên môn: ${customGuide}` : ''}

QUY CHUẨN BẮT BUỘC:
1. HOẠT ĐỘNG 1: Mở đầu 4 bước (Chuyển giao, Thực hiện, Báo cáo, Kết luận) kèm mục "* DỰ KIẾN SẢN PHẨM". Không chia bảng.
2. Hai khung tích hợp:
   - 👉 [Tích hợp năng lực số]: [NLS 2.1] Khai thác mô hình, học liệu số, tra cứu.
   - 👉 [Tích hợp năng lực AI]: [Mã ${grade}.A1.2] Khai thác AI tra cứu dữ liệu; đối chiếu SGK để kết luận.
3. HOẠT ĐỘNG 2: BẮT BUỘC TRÌNH BÀY DẠNG BẢNG 2 CỘT KẺ VIỀN ĐEN 100%.
   - Cột 1: HOẠT ĐỘNG CỦA GV VÀ HS (Ghi chi tiết 4 bước Chuyển giao, Thực hiện, Báo cáo, Kết luận).
   - Cột 2: DỰ KIẾN SẢN PHẨM (NỘI DUNG GHI VỞ CỦA HỌC SINH):
     + BẮT BUỘC VIẾT ĐẦY ĐỦ NỘI DUNG CHI TIẾT (các định nghĩa, đặc điểm, cấu tạo, công thức/sơ đồ), KHÔNG ĐƯỢC để trống, KHÔNG ghi chung chung tóm tắt.
     + Phân chia theo đúng các đề mục I, II, III chuẩn mực của bài trong SGK.
CHỈ TRẢ VỀ MÃ HTML THUẦN.`;
        const htmlPart2 = await queryGemini(prompt2);

        // GIAI ĐOẠN 3: HOẠT ĐỘNG 3, HOẠT ĐỘNG 4 & PHỤ LỤC
        updateStatus(90, "Giai đoạn 3/3: Soạn Luyện tập, Vận dụng & Phụ lục...", "Tạo 3 dạng bài tập đánh giá năng lực và 2 Rubric...");
        const prompt3 = `
Hãy đóng vai trò Chuyên gia Sư phạm môn ${subject} ${grade}.
Nhiệm vụ: Viết mã HTML cho Hoạt động 3, Hoạt động 4 và IV. HỒ SƠ DẠY HỌC cho bài: "${formattedLessonHeading}".
${customGuide ? `Ghi chú chuyên môn: ${customGuide}` : ''}

YÊU CẦU:
1. HOẠT ĐỘNG 3 (Luyện tập): 4 bước kèm "* DỰ KIẾN SẢN PHẨM" gồm ĐỦ 3 DẠNG THỨC:
   - Dạng 1: Trắc nghiệm 4 lựa chọn (4 câu cụ thể có A, B, C, D rõ ràng, in đậm đáp án đúng).
   - Dạng 2: Trắc nghiệm Đúng/Sai (1 câu gồm 4 ý a, b, c, d bối cảnh khoa học thực tế).
   - Dạng 3: Trắc nghiệm trả lời ngắn (2 câu hỏi tự luận ngắn/điền số).
2. HOẠT ĐỘNG 4 (Vận dụng): Bài toán kỹ thuật/đời sống thực tiễn gắn với Vĩnh Long / Mang Thít.
3. IV. HỒ SƠ DẠY HỌC / PHỤ LỤC:
   - Phụ lục 1: PHIẾU HỌC TẬP SỐ 1 (Dạng bảng phân tích).
   - Phụ lục 2: RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ (Bảng 5 cột kẻ đen: Tiêu chí, Mức 1, Mức 2, Mức 3, Điểm).
   - Phụ lục 3: RUBRIC ĐÁNH GIÁ NĂNG LỰC AI (Bảng 5 cột kẻ đen: Tiêu chí, Mức 1, Mức 2, Mức 3, Điểm).
CHỈ TRẢ VỀ MÃ HTML THUẦN.`;
        const htmlPart3 = await queryGemini(prompt3);

        updateStatus(100, "Hoàn thành 100% nội dung giáo án!", "Đang trình bày lên khổ A4...");
        setTimeout(() => {
            docContainer.innerHTML = htmlPart1 + "<br>" + htmlPart2 + "<br>" + htmlPart3;
        }, 300);

    } catch (err) {
        console.error("Lỗi:", err);
        docContainer.innerHTML = `
            <div style="padding: 25px; background: #fef2f2; border: 2px solid #ef4444; border-radius: 10px; color: #991b1b; font-family: sans-serif; max-width: 650px; margin: 30px auto; text-align: left;">
                <h4 style="margin: 0 0 10px 0; font-size: 13pt; font-weight: bold;">⚠️ Thông Báo Kết Nối:</h4>
                <p style="font-size: 11pt; margin: 5px 0;"><strong>Chi tiết:</strong> ${err.message}</p>
                <hr style="border: 0; border-top: 1px solid #fca5a5; margin: 12px 0;">
                <p style="font-size: 10pt; line-height: 1.6; color: #7f1d1d;">
                    👉 <strong>Cách xử lý:</strong><br>
                    1. Kiểm tra lại mã API Key trên Google AI Studio.<br>
                    2. Bấm vào nút <strong>Cài API AI</strong> trên web để lưu lại khóa API.
                </p>
            </div>
        `;
    }
}
console.log("EduAI-Pro: RAG AI Generator Engine v6.0 Loaded Successfully!");
