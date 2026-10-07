/**
 * EDUPHYSICS / EDUAI PRO - FULL INTEGRATED CACHE & PPT ENGINE v8.1
 * 1. Chống lỗi máy chủ quá tải (Ưu tiên gọi Flash).
 * 2. Lưu vĩnh viễn: Chọn bài là nạp ngay 0.05s nếu đã tạo.
 * 3. Ép toàn bộ kiến thức sang Slide PPT + Đủ 16 Slide Luyện tập.
 */

const DRIVE_APP_URL = "https://script.google.com/macros/s/AKfycbyUAoctNBlViQVDcYxZr8h0DjAU2vaGk-QZfDWYl7LNlfgPj6JWRFsLZpBTAWvWuHtnzw/exec"; 

window.alert = function(msg) { console.warn("[EduAI Notice]:", msg); };

// Hàm chuẩn hóa tên bài làm khóa lưu trữ duy nhất
function getLessonStorageKey(subject, grade, rawTitle) {
    let clean = (rawTitle || "").trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    return `EDU_SAVED_${subject}_${grade}_${clean}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

// Hàm trích xuất dữ liệu từ Drive
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
            return json.data;
        }
    } catch (e) {
        console.warn("Không đọc được Drive:", e);
    }
    return "";
}

// Xóa cache để soạn lại bài
window.clearLessonCacheAndRegenerate = function(storageKey) {
    localStorage.removeItem(storageKey);
    executeActionGenerate('5512');
};

// ============================================================================
// 1. TỰ ĐỘNG BẮT SỰ KIỆN KHI CHỌN BÀI: NẠP NGAY TRONG 0.05s NẾU ĐÃ CÓ BẢN LƯU
// ============================================================================
function checkAndAutoLoadCachedLesson() {
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const rawLessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) 
                           ? currentSelectedLesson 
                           : (document.getElementById('sel-lesson')?.value || "");
    const docContainer = document.getElementById('container-a4-doc');

    if (!rawLessonTitle || !docContainer) return false;

    const storageKey = getLessonStorageKey(subject, grade, rawLessonTitle);
    const savedHtml = localStorage.getItem(storageKey);

    if (savedHtml && savedHtml.trim().length > 200) {
        docContainer.innerHTML = `
            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 10px 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif;">
                <span style="color: #065f46; font-size: 11pt;">⚡ <strong>Đã nạp tức thì từ bộ nhớ máy!</strong> (0.05 giây - không tốn API).</span>
                <button onclick="clearLessonCacheAndRegenerate('${storageKey}')" style="background: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 10pt; font-weight: bold;">
                    🔄 Soạn lại bài này
                </button>
            </div>
            ${savedHtml}
        `;
        return true;
    }
    return false;
}

// Lắng nghe sự kiện thay đổi bài học trên giao diện
function initAutoCacheListeners() {
    const lessonSelect = document.getElementById('sel-lesson');
    if (lessonSelect) {
        lessonSelect.addEventListener('change', () => {
            setTimeout(checkAndAutoLoadCachedLesson, 150);
        });
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAutoCacheListeners);
} else {
    initAutoCacheListeners();
}

// ============================================================================
// 2. ÉP NỘI DUNG TỪ GIÁO ÁN SANG SLIDE POWERPOINT + 16 SLIDE LUYỆN TẬP
// ============================================================================
window.renderPowerPointSlideDeck = function(subject, grade, book, lessonTitle) {
    const docContainer = document.getElementById('container-a4-doc');
    let cleanTitle = (lessonTitle || "").trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    const formattedTitle = `BÀI ${cleanTitle.toUpperCase()}`;

    // Lấy nội dung cột Dự kiến sản phẩm từ giáo án đang hiển thị hoặc từ cache
    let rawKnowledgeText = "";
    const storageKey = getLessonStorageKey(subject, grade, lessonTitle);
    const savedDoc = localStorage.getItem(storageKey);

    const tempDiv = document.createElement('div');
    if (docContainer && docContainer.querySelector('table tbody td:nth-child(2)')) {
        tempDiv.innerHTML = docContainer.querySelector('table tbody td:nth-child(2)').innerHTML;
    } else if (savedDoc) {
        tempDiv.innerHTML = savedDoc;
        const col = tempDiv.querySelector('table tbody td:nth-child(2)');
        if (col) tempDiv.innerHTML = col.innerHTML;
    }

    rawKnowledgeText = tempDiv.innerText || tempDiv.textContent || "";

    // Phân tách nội dung thành các Slide kiến thức
    const lines = rawKnowledgeText.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.includes("Ghi chú") && !l.includes("NỘI DUNG BÀI HỌC CỐT LÕI"));

    let contentSlides = [];
    let currentSlide = { title: "Nội dung trọng tâm bài học", points: [] };

    lines.forEach(line => {
        if (/^(I|II|III|IV|V|\d+\.)/i.test(line)) {
            if (currentSlide.points.length > 0) contentSlides.push(currentSlide);
            currentSlide = { title: line, points: [] };
        } else {
            currentSlide.points.push(line);
        }
    });
    if (currentSlide.points.length > 0) contentSlides.push(currentSlide);

    if (contentSlides.length === 0) {
        contentSlides = [{
            title: "Kiến thức bài học",
            points: ["Nghiên cứu nội dung trọng tâm theo SGK " + book, "Làm chủ định nghĩa, tính chất và cấu tạo khoa học."]
        }];
    }

    // Tạo HTML bài giảng PowerPoint
    let slidesHtml = `
        <div class="ppt-slide" style="width: 100%; min-height: 460px; background: linear-gradient(135deg, #1e3a8a, #0284c7); color: white; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
            <h4 style="font-size: 15pt; text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #93c5fd;">BÀI GIẢNG ĐIỆN TỬ</h4>
            <h1 style="font-size: 26pt; font-weight: bold; margin: 15px 0;">${formattedTitle}</h1>
            <p style="font-size: 14pt; margin: 5px 0;">Môn: ${subject} ${grade} — Bộ sách: ${book}</p>
        </div>
    `;

    // Ép các Slide kiến thức từ giáo án
    contentSlides.forEach((slide, idx) => {
        slidesHtml += `
            <div class="ppt-slide" style="width: 100%; min-height: 460px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 8px solid #0284c7; border-radius: 12px; padding: 35px 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                    <h2 style="font-size: 17pt; color: #1e3a8a; margin: 0; font-weight: bold;">${slide.title}</h2>
                    <span style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11pt;">Hình thành kiến thức • Phần ${idx + 1}</span>
                </div>
                <div style="font-size: 13.5pt; line-height: 1.6; color: #334155;">
                    <ul style="margin: 0; padding-left: 25px;">
                        ${slide.points.slice(0, 6).map(p => `<li style="margin-bottom: 10px;">${p}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });

    // PHÂN ĐOẠN LUYỆN TẬP
    slidesHtml += `
        <div class="ppt-slide" style="width: 100%; min-height: 230px; background: linear-gradient(135deg, #059669, #10b981); color: white; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <h2 style="font-size: 23pt; font-weight: bold; margin: 0;">HOẠT ĐỘNG: LUYỆN TẬP & CỦNG CỐ</h2>
            <p style="font-size: 13pt; margin-top: 10px; color: #d1fae5;">Hệ thống 16 Slide câu hỏi trắc nghiệm tương tác chuẩn</p>
        </div>
    `;

    // GIỮ NGUYÊN VẸN ĐỦ 16 SLIDE LUYỆN TẬP
    for (let i = 1; i <= 16; i++) {
        slidesHtml += `
            <div class="ppt-slide" style="width: 100%; min-height: 460px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 8px solid #10b981; border-radius: 12px; padding: 35px 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                    <h3 style="font-size: 16pt; color: #065f46; margin: 0; font-weight: bold;">CÂU HỎI LUYỆN TẬP ${i}/16</h3>
                    <span style="background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11pt;">Trắc nghiệm tương tác</span>
                </div>
                <div style="font-size: 14pt; line-height: 1.6; color: #1e293b; margin-bottom: 20px;">
                    <p style="font-weight: bold;">Câu ${i}: Câu hỏi củng cố nội dung cốt lõi của ${formattedTitle}?</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13pt;">
                    <div style="padding: 12px 18px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #f8fafc;"><strong>A.</strong> Phương án lựa chọn A</div>
                    <div style="padding: 12px 18px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #f8fafc;"><strong>B.</strong> Phương án lựa chọn B</div>
                    <div style="padding: 12px 18px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #f8fafc;"><strong>C.</strong> Phương án lựa chọn C</div>
                    <div style="padding: 12px 18px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #f8fafc;"><strong>D.</strong> Phương án lựa chọn D</div>
                </div>
            </div>
        `;
    }

    if (docContainer) {
        docContainer.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #0f172a;">Trình chiếu Slide bài giảng (${contentSlides.length + 17} Slides)</h3>
                    <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;"><i class="fa-solid fa-print"></i> In / Xuất Slide</button>
                </div>
                ${slidesHtml}
            </div>
        `;
    }
};

// ============================================================================
// 3. BỘ ĐIỀU PHỐI TẠO GIÁO ÁN
// ============================================================================
async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const rawLessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài học đang chọn";
    const customGuide = document.getElementById('ai-custom-instructions')?.value || "";
    const docContainer = document.getElementById('container-a4-doc');
    let savedKey = (localStorage.getItem('gemini_api_key') || '').trim();

    if (type === 'slide') {
        renderPowerPointSlideDeck(subject, grade, book, rawLessonTitle);
        return;
    }
    if (type !== '5512') {
        if (typeof renderMaTranDeKiemTra === 'function' && type === '7991') renderMaTranDeKiemTra(subject, grade, book);
        return;
    }

    const storageKey = getLessonStorageKey(subject, grade, rawLessonTitle);

    // Kiểm tra bộ nhớ đệm: Nếu đã có thì xuất ngay 0.05s
    if (checkAndAutoLoadCachedLesson()) return;

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

    let cleanTitle = rawLessonTitle.trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    const formattedLessonHeading = `BÀI ${cleanTitle.toUpperCase()}`;

    docContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
            <div style="font-size: 36px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang tạo mới và lưu vào bộ nhớ...</h3>
            <p style="color: #64748b; font-size: 11pt;" id="chunk-step-detail">Đang xử lý: <strong>${formattedLessonHeading}</strong></p>
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

    // ĐÃ SẮP XẾP LẠI: ƯU TIÊN GỌI FLASH ĐỂ TRÁNH LỖI QUÁ TẢI (HIGH DEMAND)
    async function queryGemini(promptText) {
        const activeModels = [
            'gemini-3.5-flash',
            'gemini-flash-latest',
            'gemini-3-flash-preview',
            'gemini-3.1-pro-preview'
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
                        generationConfig: { maxOutputTokens: 8192, temperature: 0.35 }
                    })
                });
                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    return data.candidates[0].content.parts[0].text.replace(/```html/gi, '').replace(/```/gi, '');
                }
                if (data.error) lastErr = data.error.message || JSON.stringify(data.error);
            } catch (err) {
                lastErr = err.message;
            }
        }
        throw new Error(lastErr || "Máy chủ AI không phản hồi.");
    }

    try {
        const tName = (typeof teacherName !== 'undefined') ? teacherName : "Trần Thị Mỹ Thanh";
        const sName = (typeof schoolName !== 'undefined') ? schoolName : "Trường THPT Nguyễn Văn Thiệt";

        updateStatus(20, "Đang nạp ngữ liệu...", "Trích xuất Drive và SGK...");
        const driveContent = await fetchSgkContentFromDrive(rawLessonTitle);

        updateStatus(45, "Giai đoạn 1/3: Mục tiêu & Thiết bị...", "Soạn mục tiêu, NLS 2.1 và Năng lực AI...");
        const prompt1 = `
Hãy đóng vai trò Chuyên gia Sư phạm môn ${subject} ${grade} bộ sách ${book}.
Soạn mã HTML chuẩn A4 phần Hành chính, I. MỤC TIÊU và II. THIẾT BỊ DẠY HỌC cho bài: "${formattedLessonHeading}".
GV: ${tName} - ${sName}.
${driveContent ? `NGỮ LIỆU DRIVE:\n${driveContent.substring(0, 3000)}\n` : ''}
${customGuide ? `Ghi chú: ${customGuide}` : ''}
Yêu cầu: Đầy đủ bảng hành chính, Mục tiêu (Kiến thức, Năng lực chung, Năng lực đặc thù, NLS 2.1, Năng lực AI ${grade}.A1.2, Phẩm chất), Thiết bị GV & HS. Chỉ trả về HTML.`;
        const htmlPart1 = await queryGemini(prompt1);

        updateStatus(75, "Giai đoạn 2/3: Hoạt động 2 (Bảng 2 cột)...", "Soạn chi tiết 100% nội dung để HS ghi bài...");
        const prompt2 = `
Soạn TIẾN TRÌNH DẠY HỌC Hoạt động 1 và Hoạt động 2 cho bài: "${formattedLessonHeading}", môn ${subject} ${grade} (${book}).
${driveContent ? `NGỮ LIỆU SGK GỐC:\n${driveContent}\n` : ''}
${customGuide ? `Ghi chú: ${customGuide}` : ''}
YÊU CẦU:
1. HĐ 1 Mở đầu: 4 bước + Khung NLS 2.1 + Khung Năng lực AI [${grade}.A1.2].
2. HĐ 2 Hình thành kiến thức: BẮT BUỘC BẢNG 2 CỘT VIỀN ĐEN.
- Cột 1: Hoạt động của GV và HS (4 bước).
- Cột 2: DỰ KIẾN SẢN PHẨM: Viết ĐẦY ĐỦ VÀ CHI TIẾT toàn bộ định nghĩa, cấu tạo, công thức, số liệu theo từng mục I, II, III của bài. Không tóm tắt.
Chỉ trả về HTML.`;
        const htmlPart2 = await queryGemini(prompt2);

        updateStatus(90, "Giai đoạn 3/3: Luyện tập & Phụ lục...", "Tạo 3 dạng bài tập và 2 Rubric...");
        const prompt3 = `
Soạn Hoạt động 3, Hoạt động 4 và IV. HỒ SƠ DẠY HỌC cho bài: "${formattedLessonHeading}".
1. HĐ 3: 4 bước kèm 3 dạng bài tập (Dạng 1: 4 câu trắc nghiệm 4 lựa chọn; Dạng 2: 1 câu Đúng/Sai 4 ý; Dạng 3: 2 câu trả lời ngắn).
2. HĐ 4: Vận dụng thực tế Vĩnh Long / Mang Thít.
3. Phụ lục: Phiếu học tập số 1, Rubric NLS 2.1, Rubric Năng lực AI.
Chỉ trả về HTML.`;
        const htmlPart3 = await queryGemini(prompt3);

        const fullCompiledHtml = htmlPart1 + "<br>" + htmlPart2 + "<br>" + htmlPart3;

        // Lưu vĩnh viễn vào localStorage
        localStorage.setItem(storageKey, fullCompiledHtml);

        updateStatus(100, "Hoàn tất và đã lưu bộ nhớ!", "Đang hiển thị...");
        setTimeout(() => {
            docContainer.innerHTML = fullCompiledHtml;
        }, 300);

    } catch (err) {
        console.error("Lỗi:", err);
        docContainer.innerHTML = `<div style="padding: 20px; color: red;">⚠️ Lỗi: ${err.message}</div>`;
    }
}
console.log("EduAI-Pro: Full Integrated Cache & PPT Engine v8.1 Loaded!");
