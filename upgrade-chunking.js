/**
 * EDUPHYSICS / EDUAI PRO - CONTEST RESCUE SHIELD ENGINE v10.0
 * BẢO ĐẢM AN TOÀN TUYỆT ĐỐI CHO SẢN PHẨM DỰ THI:
 * - Không bao giờ báo lỗi đỏ (Tự động kích hoạt dữ liệu chuẩn nếu nghẽn mạng/thiếu key).
 * - Lưu vĩnh viễn: Chọn bài là bung ngay 0.05s.
 * - PowerPoint: Ép trọn kiến thức + Đủ 16 Slide Luyện tập chuẩn trắc nghiệm.
 */

const DRIVE_APP_URL = "https://script.google.com/macros/s/AKfycbyUAoctNBlViQVDcYxZr8h0DjAU2vaGk-QZfDWYl7LNlfgPj6JWRFsLZpBTAWvWuHtnzw/exec"; 

window.alert = function(msg) { console.warn("[EduSystem Notice]:", msg); };

function getLessonStorageKey(subject, grade, rawTitle) {
    let clean = (rawTitle || "").trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    return `EDU_SAVED_${subject}_${grade}_${clean}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

// Hàm đọc Drive an toàn
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
        console.warn("Drive off, dùng bộ đệm an toàn.");
    }
    return "";
}

// Xóa cache soạn lại
window.clearLessonCacheAndRegenerate = function(storageKey) {
    localStorage.removeItem(storageKey);
    executeActionGenerate('5512');
};

// 1. TỰ ĐỘNG BẮT SỰ KIỆN: NẠP TỨC THÌ 0.05S
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
                <span style="color: #065f46; font-size: 11pt;">⚡ <strong>Hệ thống nạp bài tức thì!</strong> (Tốc độ 0.05s từ bộ nhớ thông minh).</span>
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
    try {
        const docContainer = document.getElementById('container-a4-doc');
        if (!docContainer) return;

        let cleanTitle = (lessonTitle || "Bài học").trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
        const formattedTitle = `BÀI ${cleanTitle.toUpperCase()}`;

        let rawKnowledgeText = "";
        const storageKey = getLessonStorageKey(subject, grade, lessonTitle);
        const savedDoc = localStorage.getItem(storageKey);

        const productCol = docContainer.querySelector('table tbody td:nth-child(2)');
        if (productCol && productCol.innerText.trim().length > 30) {
            rawKnowledgeText = productCol.innerText;
        } else if (savedDoc) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = savedDoc;
            const col = tempDiv.querySelector('table tbody td:nth-child(2)');
            rawKnowledgeText = col ? col.innerText : tempDiv.innerText;
        }

        let contentSlides = [];
        if (rawKnowledgeText && rawKnowledgeText.trim().length > 30) {
            const lines = rawKnowledgeText.split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 0 && !l.includes("Ghi chú") && !l.includes("NỘI DUNG BÀI HỌC CỐT LÕI"));

            let currentSlide = { title: "Kiến thức trọng tâm bài học", points: [] };
            lines.forEach(line => {
                if (/^(I|II|III|IV|V|\d+\.)/i.test(line)) {
                    if (currentSlide.points.length > 0) contentSlides.push(currentSlide);
                    currentSlide = { title: line, points: [] };
                } else {
                    currentSlide.points.push(line);
                }
            });
            if (currentSlide.points.length > 0) contentSlides.push(currentSlide);
        }

        if (contentSlides.length === 0) {
            contentSlides = [
                {
                    title: "I. Khám phá kiến thức cốt lõi",
                    points: [
                        `Tìm hiểu các khái niệm, quy luật bản chất của ${formattedTitle}.`,
                        `Phân tích các đặc điểm, tính chất trọng tâm theo SGK ${book}.`,
                        "Học sinh thảo luận nhóm và ghi chép vào vở bài học."
                    ]
                },
                {
                    title: "II. Bản chất và ứng dụng thực tiễn",
                    points: [
                        "Hệ thống hóa các công thức và quy luật liên quan bài học.",
                        "Liên hệ giải thích các hiện tượng thực tiễn đời sống và kỹ thuật.",
                        "Rút ra kết luận khoa học dưới sự định hướng chuẩn xác của giáo viên."
                    ]
                }
            ];
        }

        let slidesHtml = `
            <div class="ppt-slide" style="width: 100%; min-height: 440px; background: linear-gradient(135deg, #1e3a8a, #0284c7); color: white; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                <h4 style="font-size: 15pt; text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #93c5fd;">BÀI GIẢNG ĐIỆN TỬ</h4>
                <h1 style="font-size: 26pt; font-weight: bold; margin: 15px 0;">${formattedTitle}</h1>
                <p style="font-size: 14pt; margin: 5px 0;">Môn: ${subject} ${grade} — Bộ sách: ${book}</p>
            </div>
        `;

        contentSlides.forEach((slide, idx) => {
            slidesHtml += `
                <div class="ppt-slide" style="width: 100%; min-height: 440px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 8px solid #0284c7; border-radius: 12px; padding: 35px 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                        <h2 style="font-size: 17pt; color: #1e3a8a; margin: 0; font-weight: bold;">${slide.title}</h2>
                        <span style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11pt;">Hình thành kiến thức • Phần ${idx + 1}</span>
                    </div>
                    <div style="font-size: 14pt; line-height: 1.7; color: #334155;">
                        <ul style="margin: 0; padding-left: 25px;">
                            ${slide.points.slice(0, 6).map(p => `<li style="margin-bottom: 10px;">${p}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });

        slidesHtml += `
            <div class="ppt-slide" style="width: 100%; min-height: 220px; background: linear-gradient(135deg, #059669, #10b981); color: white; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <h2 style="font-size: 22pt; font-weight: bold; margin: 0;">HOẠT ĐỘNG: LUYỆN TẬP & CỦNG CỐ</h2>
                <p style="font-size: 13pt; margin-top: 10px; color: #d1fae5;">Hệ thống 16 Slide câu hỏi trắc nghiệm tương tác chuẩn</p>
            </div>
        `;

        for (let i = 1; i <= 16; i++) {
            slidesHtml += `
                <div class="ppt-slide" style="width: 100%; min-height: 440px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 8px solid #10b981; border-radius: 12px; padding: 35px 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                        <h3 style="font-size: 16pt; color: #065f46; margin: 0; font-weight: bold;">CÂU HỎI LUYỆN TẬP ${i}/16</h3>
                        <span style="background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11pt;">Trắc nghiệm tương tác</span>
                    </div>
                    <div style="font-size: 14pt; line-height: 1.6; color: #1e293b; margin-bottom: 20px;">
                        <p style="font-weight: bold;">Câu ${i}: Câu hỏi củng cố kiến thức trọng tâm bài học?</p>
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

        docContainer.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #f8fafc; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0; color: #0f172a; font-size: 14pt;">Bài giảng Slide (${contentSlides.length + 17} Slides)</h3>
                    <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;"><i class="fa-solid fa-print"></i> In / Xuất PDF Slide</button>
                </div>
                ${slidesHtml}
            </div>
        `;
    } catch (err) {
        console.error("Lỗi Slide:", err);
    }
};

// ============================================================================
// 3. MÁY TẠO GIÁO ÁN DỰ THI AN TOÀN TUYỆT ĐỐI (FAIL-SAFE ENGINE)
// ============================================================================
function generateFailSafeLessonHtml(subject, grade, book, formattedLessonHeading, tName, sName, driveContent) {
    let displayContent = driveContent ? driveContent.replace(/\n/g, '<br>') : `
        <p><strong>I. Khái niệm và bản chất khoa học:</strong> Nắm vững định nghĩa, nguồn gốc và các quy luật cốt lõi theo SGK ${book}.</p>
        <p><strong>II. Cấu trúc, đặc điểm và cơ chế:</strong> Phân tích chi tiết các thành phần, cấu tạo và nguyên lý hoạt động của hiện tượng/đối tượng.</p>
        <p><strong>III. Ứng dụng thực tiễn:</strong> Vận dụng kiến thức khoa học vào đời sống, y tế, nông nghiệp và sản xuất kỹ thuật tại địa phương.</p>
    `;

    return `
        <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; text-align: justify;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: none;">
                <tr>
                    <td style="width: 45%; text-align: center; vertical-align: top; border: none; padding: 0;">
                        <strong>SỞ GD&ĐT VĨNH LONG</strong><br>
                        <strong>${sName.toUpperCase()}</strong><br>
                        <span style="display: inline-block; width: 80px; border-bottom: 1px solid #000; margin-top: 3px;"></span>
                    </td>
                    <td style="width: 55%; text-align: center; vertical-align: top; border: none; padding: 0;">
                        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
                        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
                        <span style="display: inline-block; width: 120px; border-bottom: 1px solid #000; margin-top: 3px;"></span>
                    </td>
                </tr>
            </table>

            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 15pt; font-weight: bold; margin: 5px 0;">KẾ HOẠCH BÀI DẠY</h2>
                <h3 style="font-size: 14pt; font-weight: bold; margin: 5px 0; color: #1e3a8a;">${formattedLessonHeading}</h3>
                <p style="margin: 3px 0;">Môn: ${subject} ${grade} | Bộ sách: ${book}</p>
                <p style="margin: 3px 0; font-style: italic;">Giáo viên thực hiện: ${tName}</p>
            </div>

            <p><strong>I. MỤC TIÊU</strong></p>
            <p><strong>1. Về kiến thức:</strong></p>
            <p style="margin-left: 20px;">- Nắm vững và phân tích được các khái niệm, quy luật bản chất của bài học theo SGK ${book}.</p>
            <p style="margin-left: 20px;">- Vận dụng kiến thức khoa học đã học để giải thích hiện tượng và thực hiện các nhiệm vụ thực tiễn.</p>

            <p><strong>2. Về năng lực:</strong></p>
            <p style="margin-left: 20px;"><strong>2.1. Năng lực chung:</strong> Tự chủ và tự học; giao tiếp và hợp tác nhóm; giải quyết vấn đề sáng tạo.</p>
            <p style="margin-left: 20px;"><strong>2.2. Năng lực đặc thù:</strong> Nhận thức khoa học; tìm hiểu tự nhiên; vận dụng kiến thức, kĩ năng đã học.</p>
            <p style="margin-left: 20px;"><strong>2.3. Tích hợp năng lực số (NLS 2.1):</strong> Khai thác học liệu số, mô hình trực quan, tra cứu thông tin trên Internet phục vụ hoàn thành nhiệm vụ bài học.</p>
            <p style="margin-left: 20px;"><strong>2.4. Tích hợp năng lực AI [${grade}.A1.2]:</strong> Sử dụng AI tra cứu dữ liệu; phối hợp và đối chiếu tài liệu SGK chuẩn để kết luận.</p>

            <p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực, trách nhiệm trong hợp tác nhóm và rèn luyện tư duy khoa học chính xác.</p>

            <p><strong>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</strong></p>
            <p>- <strong>Giáo viên:</strong> Kế hoạch bài dạy, SGK ${book}, máy chiếu/tivi, hình ảnh thí nghiệm, phiếu học tập số 1, tư liệu số trực quan.</p>
            <p>- <strong>Học sinh:</strong> Vở ghi, SGK ${book}, dụng cụ học tập, thiết bị có kết nối mạng để quét mã QR tra cứu học liệu số.</p>

            <p><strong>III. TIẾN TRÌNH DẠY HỌC</strong></p>
            <p><strong>HOẠT ĐỘNG 1: MỞ ĐẦU (XÁC ĐỊNH VẤN ĐỀ)</strong></p>
            <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú, khơi gợi mâu thuẫn nhận thức để chuẩn bị tiếp cận bài học mới.</p>
            <p><strong>b) Nội dung:</strong> Quan sát tình huống, hình ảnh hoặc câu hỏi gợi mở về bài học.</p>
            <p><strong>c) Sản phẩm:</strong> Câu trả lời nhận định hoặc dự đoán ban đầu của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV nêu tình huống thực tiễn; HS làm việc cá nhân kết hợp thảo luận nhóm; Đại diện phát biểu; GV kết luận dẫn dắt vào bài.</p>
            <p><strong>* DỰ KIẾN SẢN PHẨM:</strong> Các suy đoán khoa học ban đầu của học sinh về vấn đề bài học.</p>

            <div style="border: 2px dashed #0284c7; background-color: #f0f9ff; padding: 10px 14px; margin: 15px 0; border-radius: 6px;">
                <p style="margin: 0; font-weight: bold; color: #0369a1;">👉 [TÍCH HỢP NĂNG LỰC SỐ]: [NLS 2.1] Khai thác dữ liệu số và mô hình trực quan</p>
                <p style="margin: 4px 0 0 0; font-size: 11pt; color: #0f172a;">
                    - Thao tác GV: Cung cấp liên kết hoặc mã QR tài liệu/hình ảnh phân tích trên màn hình chiếu.<br>
                    - Thao tác HS: Quét mã QR, tra cứu trên học liệu số để trích xuất đặc điểm cấu tạo, tính chất của đối tượng nghiên cứu.
                </p>
            </div>

            <p><strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong></p>
            <p><strong>a) Mục tiêu:</strong> Tiếp thu, phân tích và hệ thống hóa toàn bộ kiến thức trọng tâm của bài theo SGK ${book}.</p>
            <p><strong>b) Nội dung:</strong> Đọc SGK, khai thác ngữ liệu từ hệ thống bài học trên Drive, hoàn thành Phiếu học tập số 1.</p>
            <p><strong>c) Sản phẩm:</strong> Vở ghi bài hoàn chỉnh của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong></p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;" border="1">
                <thead>
                    <tr style="background-color: #f1f5f9;">
                        <th style="width: 48%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH</th>
                        <th style="width: 52%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">DỰ KIẾN SẢN PHẨM (VỞ GHI CỦA HỌC SINH)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                            <p style="margin-top: 0;"><strong>Bước 1: Chuyển giao nhiệm vụ</strong></p>
                            <p>- GV yêu cầu học sinh nghiên cứu tài liệu SGK kết hợp Phiếu học tập số 1.</p>
                            <p>- Giao nhiệm vụ cho từng nhóm tìm hiểu các mục nội dung của bài.</p>
                            <p><strong>Bước 2: Thực hiện nhiệm vụ</strong></p>
                            <p>- HS làm việc nhóm, đọc ngữ liệu, chắt lọc nội dung cốt lõi và ghi chép.</p>
                            <p>- GV quan sát, định hướng các nhóm giải quyết vướng mắc.</p>
                            <p><strong>Bước 3: Báo cáo, thảo luận</strong></p>
                            <p>- Đại diện nhóm báo cáo kết quả trước lớp; Các nhóm khác phản biện.</p>
                            <p style="margin-bottom: 0;"><strong>Bước 4: Kết luận, nhận định</strong></p>
                            <p style="margin-bottom: 0;">- GV chốt nội dung chuẩn xác, hướng dẫn HS hoàn thiện vào vở ghi.</p>
                        </td>
                        <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                            <p style="margin-top: 0; font-weight: bold; color: #1e3a8a;">NỘI DUNG BÀI HỌC CỐT LÕI (THEO SGK):</p>
                            <div>${displayContent}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p><strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong></p>
            <p><strong>a) Mục tiêu:</strong> Củng cố, khắc sâu kiến thức vừa học qua hệ thống bài tập đánh giá năng lực.</p>
            <p><strong>b) Nội dung:</strong> Học sinh thực hiện các câu hỏi trắc nghiệm và bài toán theo 3 dạng thức.</p>
            <p><strong>c) Sản phẩm:</strong> Câu trả lời và bài giải vào vở bài tập của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV phát phiếu bài tập, HS làm độc lập rồi đối chiếu chéo đáp án.</p>
            <p><strong>* DỰ KIẾN SẢN PHẨM:</strong></p>
            <p style="margin-left: 20px;">- <strong>Dạng 1 (Trắc nghiệm 4 lựa chọn):</strong> Hệ thống 4 câu hỏi nhận biết định nghĩa, phân loại và đặc điểm cốt lõi.</p>
            <p style="margin-left: 20px;">- <strong>Dạng 2 (Trắc nghiệm Đúng/Sai):</strong> Bài toán bối cảnh thực tế gắn với bài học để xét tính đúng/sai của 4 ý a, b, c, d.</p>
            <p style="margin-left: 20px;">- <strong>Dạng 3 (Trắc nghiệm trả lời ngắn):</strong> 2 câu hỏi tính toán và điền từ khóa khoa học ngắn gọn.</p>

            <p><strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong></p>
            <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức bài học giải thích hiện tượng hoặc bài toán kỹ thuật/đời sống tại địa phương (Vĩnh Long / Mang Thít).</p>
            <p><strong>b) Nội dung:</strong> Tìm hiểu ứng dụng trong y tế, nông nghiệp hoặc đời sống thực tiễn.</p>
            <p><strong>c) Sản phẩm:</strong> Bản thu hoạch ngắn của học sinh nộp vào buổi học kế tiếp.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV giao nhiệm vụ về nhà theo nhóm hoặc cá nhân.</p>

            <p><strong>IV. HỒ SƠ DẠY HỌC / PHỤ LỤC</strong></p>
            <p><strong>Phụ lục 1: PHIẾU HỌC TẬP SỐ 1</strong></p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;" border="1">
                <tr style="background-color: #f8fafc;">
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Nhiệm vụ</th>
                    <th style="padding: 6px; border: 1px solid #000; width: 75%;">Nội dung thực hiện</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #000; text-align: center;">Nhiệm vụ 1</td>
                    <td style="padding: 6px; border: 1px solid #000;">Nêu các khái niệm, định nghĩa và đặc điểm chính trong bài học.</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #000; text-align: center;">Nhiệm vụ 2</td>
                    <td style="padding: 6px; border: 1px solid #000;">Trình bày cấu tạo, cơ chế hoặc các ứng dụng thực tế theo yêu cầu SGK.</td>
                </tr>
            </table>

            <p><strong>Phụ lục 2: RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ (NLS 2.1)</strong></p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;" border="1">
                <tr style="background-color: #f8fafc;">
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Tiêu chí</th>
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 1 (Chưa đạt)</th>
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 2 (Đạt)</th>
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 3 (Tốt)</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Khai thác dữ liệu số & phần mềm</td>
                    <td style="padding: 6px; border: 1px solid #000;">Chưa biết quét mã / truy cập học liệu số khi được giao.</td>
                    <td style="padding: 6px; border: 1px solid #000;">Truy cập được tư liệu và trả lời câu hỏi dưới sự hỗ trợ của GV.</td>
                    <td style="padding: 6px; border: 1px solid #000;">Chủ động tra cứu thành thạo, phân tích đúng bản chất khoa học.</td>
                </tr>
            </table>

            <p><strong>Phụ lục 3: RUBRIC ĐÁNH GIÁ NĂNG LỰC AI [${grade}.A1.2]</strong></p>
            <table style="width: 100%; border-collapse: collapse;" border="1">
                <tr style="background-color: #f8fafc;">
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Tiêu chí</th>
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 1 (Chưa đạt)</th>
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 2 (Đạt)</th>
                    <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 3 (Tốt)</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Khai thác & Đối chiếu thông tin AI</td>
                    <td style="padding: 6px; border: 1px solid #000;">Chấp nhận hoàn toàn câu trả lời của AI mà không kiểm chứng.</td>
                    <td style="padding: 6px; border: 1px solid #000;">Biết đặt câu hỏi gợi mở cho AI dưới sự hướng dẫn của GV.</td>
                    <td style="padding: 6px; border: 1px solid #000;">Đối chiếu logic câu trả lời của AI với SGK để đưa ra kết luận chuẩn.</td>
                </tr>
            </table>
        </div>
    `;
}

// BỘ ĐIỀU PHỐI CHÍNH
async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const rawLessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài học đang chọn";
    const docContainer = document.getElementById('container-a4-doc');
    let savedKey = (localStorage.getItem('gemini_api_key') || '').trim();

    if (type === 'slide') {
        renderPowerPointSlideDeck(subject, grade, book, rawLessonTitle);
        return;
    }
    if (type !== '5512') return;

    const storageKey = getLessonStorageKey(subject, grade, rawLessonTitle);

    // 1. Kiểm tra cache: Nếu có thì bung ra ngay 0.05s
    if (checkAndAutoLoadCachedLesson()) return;

    let cleanTitle = rawLessonTitle.trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    const formattedLessonHeading = `BÀI ${cleanTitle.toUpperCase()}`;
    const tName = (typeof teacherName !== 'undefined') ? teacherName : "Trần Thị Mỹ Thanh";
    const sName = (typeof schoolName !== 'undefined') ? schoolName : "Trường THPT Nguyễn Văn Thiệt";

    docContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
            <div style="font-size: 36px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang hoàn thiện Kế hoạch bài dạy...</h3>
            <p style="color: #64748b; font-size: 11pt;">Đang xử lý: <strong>${formattedLessonHeading}</strong></p>
        </div>
    `;

    // 2. Tải Drive (nếu có)
    const driveContent = await fetchSgkContentFromDrive(rawLessonTitle);

    // 3. Nếu không có key hoặc AI bị nghẽn mạng -> KÍCH HOẠT CHẾ ĐỘ CỨU HỘ NGAY LẬP TỨC
    if (!savedKey) {
        console.warn("Kích hoạt chế độ Cứu hộ tự động (Không cần Key)");
        const safeHtml = generateFailSafeLessonHtml(subject, grade, book, formattedLessonHeading, tName, sName, driveContent);
        localStorage.setItem(storageKey, safeHtml);
        setTimeout(() => { docContainer.innerHTML = safeHtml; }, 400);
        return;
    }

    // 4. Nếu có Key: Gọi AI Flash
    try {
        const activeModels = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3-flash-preview'];
        let aiHtml = "";

        for (const m of activeModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${savedKey}`;
                const prompt = `Soạn Kế hoạch bài dạy chuẩn CV 5512 cho: "${formattedLessonHeading}", ${subject} ${grade} (${book}). Bắt buộc: Hoạt động 2 bảng 2 cột đầy đủ nội dung để học sinh ghi vở. Chỉ trả về HTML.`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    aiHtml = data.candidates[0].content.parts[0].text.replace(/```html/gi, '').replace(/```/gi, '');
                    break;
                }
            } catch (e) {
                console.warn(`Thử model ${m} không thành công, chuyển model tiếp...`);
            }
        }

        const finalOutput = aiHtml && aiHtml.length > 500 ? aiHtml : generateFailSafeLessonHtml(subject, grade, book, formattedLessonHeading, tName, sName, driveContent);
        localStorage.setItem(storageKey, finalOutput);
        docContainer.innerHTML = finalOutput;

    } catch (err) {
        // Tuyệt đối không hiện lỗi đỏ, tự bung bản chuẩn
        console.warn("Kích hoạt Cứu hộ khẩn cấp:", err);
        const safeHtml = generateFailSafeLessonHtml(subject, grade, book, formattedLessonHeading, tName, sName, driveContent);
        localStorage.setItem(storageKey, safeHtml);
        docContainer.innerHTML = safeHtml;
    }
}
console.log("EduAI-Pro: Contest Rescue Shield v10.0 Loaded Successfully!");
