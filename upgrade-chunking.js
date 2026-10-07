/**
 * EDUPHYSICS / EDUAI PRO - FULL CONTENT DIRECT PARSER ENGINE
 * Tự động bóc tách nội dung chi tiết từ Drive điền vào từng mục giáo án CV 5512
 */

const DRIVE_APP_URL = "https://script.google.com/macros/s/AKfycbyUAoctNBlViQVDcYxZr8h0DjAU2vaGk-QZfDWYl7LNlfgPj6JWRFsLZpBTAWvWuHtnzw/exec"; 

window.alert = function(msg) { console.warn("[EduSystem Notice]:", msg); };

// Hàm lấy dữ liệu từ Google Drive
async function fetchSgkContentFromDrive(lessonName) {
    if (!DRIVE_APP_URL || DRIVE_APP_URL.trim() === "" || DRIVE_APP_URL.includes("DÁN_URL")) return "";

    const cleanLesson = lessonName.trim();
    const cacheKey = "eduai_sgk_v4_" + cleanLesson.toLowerCase();

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData && cachedData.trim().length > 30) {
        return cachedData;
    }

    const matchLessonNum = cleanLesson.match(/bài\s*\d+/i);
    const searchKeyword = matchLessonNum ? matchLessonNum[0] : cleanLesson;

    try {
        const fetchUrl = `${DRIVE_APP_URL.trim()}?lesson=${encodeURIComponent(searchKeyword)}`;
        const res = await fetch(fetchUrl);
        const json = await res.json();

        if (json && json.status === "success" && json.data && json.data.trim().length > 10) {
            localStorage.setItem(cacheKey, json.data);
            return json.data;
        }
    } catch (e) {
        console.error("[Drive Error]:", e);
    }
    return "";
}

// Hàm chia nhỏ văn bản từ Drive thành các phần kiến thức
function parseContentSections(rawText) {
    if (!rawText || rawText.trim().length < 20) {
        return {
            mainBody: "Nội dung đang được cập nhật từ tệp tài liệu Google Drive...",
            summary: "Nắm vững các khái niệm và bản chất của bài học.",
            exercises: "Thực hiện hệ thống câu hỏi cuối bài trong SGK."
        };
    }

    // Tách dòng và làm sạch
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Tạo cấu trúc phân đoạn trực tiếp
    let formattedBody = "";
    lines.forEach(line => {
        if (/^(I|II|III|IV|V|\d+\.)/i.test(line)) {
            formattedBody += `<p style="font-weight: bold; color: #1e3a8a; margin-top: 10px; margin-bottom: 4px;">${line}</p>`;
        } else if (/^-\s*/.test(line)) {
            formattedBody += `<p style="margin: 2px 0 2px 15px;">${line}</p>`;
        } else {
            formattedBody += `<p style="margin: 4px 0; text-indent: 15px;">${line}</p>`;
        }
    });

    return {
        mainBody: formattedBody,
        summary: lines.slice(0, 3).join("; "),
        exercises: lines.filter(l => l.toLowerCase().includes("câu") || l.toLowerCase().includes("bài tập")).slice(0, 4).join("<br>") || "Học sinh hoàn thành các câu hỏi thảo luận và bài tập trong SGK."
    };
}

async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const rawLessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài học đang chọn";
    const customGuide = document.getElementById('ai-custom-instructions')?.value || "";
    const docContainer = document.getElementById('container-a4-doc');

    if (type !== '5512') return;

    let cleanTitle = rawLessonTitle.trim().replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    const formattedLessonHeading = `BÀI ${cleanTitle.toUpperCase()}`;

    docContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
            <div style="font-size: 36px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;">Đang tải và đồng bộ nội dung từ Drive...</h3>
            <p style="color: #64748b;">${formattedLessonHeading}</p>
        </div>
    `;

    try {
        const tName = (typeof teacherName !== 'undefined') ? teacherName : "Trần Thị Mỹ Thanh";
        const sName = (typeof schoolName !== 'undefined') ? schoolName : "Trường THPT Nguyễn Văn Thiệt";

        // Lấy nội dung thô từ Drive và bóc tách
        const rawContent = await fetchSgkContentFromDrive(rawLessonTitle);
        const parsed = parseContentSections(rawContent);

        const fullLessonHtml = `
            <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; text-align: justify;">
                <!-- HÀNH CHÍNH -->
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

                <!-- I. MỤC TIÊU -->
                <p><strong>I. MỤC TIÊU</strong></p>
                <p><strong>1. Về kiến thức:</strong></p>
                <p style="margin-left: 20px;">- Trình bày và phân tích được các nội dung trọng tâm của ${formattedLessonHeading}: ${parsed.summary}.</p>
                <p style="margin-left: 20px;">- Vận dụng kiến thức khoa học đã học để giải thích hiện tượng và thực hiện các nhiệm vụ học tập liên quan.</p>

                <p><strong>2. Về năng lực:</strong></p>
                <p style="margin-left: 20px;"><strong>2.1. Năng lực chung:</strong> Tự chủ, tự học; giao tiếp và hợp tác nhóm; giải quyết vấn đề sáng tạo.</p>
                <p style="margin-left: 20px;"><strong>2.2. Năng lực đặc thù:</strong> Nhận thức khoa học; tìm hiểu tự nhiên; vận dụng kiến thức, kĩ năng đã học.</p>
                <p style="margin-left: 20px;"><strong>2.3. Tích hợp năng lực số (NLS 2.1):</strong> Khai thác học liệu số, phần mềm tra cứu, mô phỏng trực quan phục vụ tìm hiểu nội dung bài học.</p>

                <p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực, có tinh thần trách nhiệm trong học tập và hợp tác nhóm.</p>

                <!-- II. THIẾT BỊ DẠY HỌC -->
                <p><strong>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</strong></p>
                <p>- <strong>Giáo viên:</strong> Giáo án, SGK ${book}, máy chiếu/tivi, hình ảnh/video trực quan, Phiếu học tập số 1.</p>
                <p>- <strong>Học sinh:</strong> Vở ghi, SGK ${book}, dụng cụ học tập, thiết bị có kết nối Internet để tra cứu tư liệu khi được giao nhiệm vụ.</p>

                <!-- III. TIẾN TRÌNH DẠY HỌC -->
                <p><strong>III. TIẾN TRÌNH DẠY HỌC</strong></p>

                <p><strong>HOẠT ĐỘNG 1: MỞ ĐẦU (XÁC ĐỊNH VẤN ĐỀ)</strong></p>
                <p><strong>a) Mục tiêu:</strong> Tạo hứng thú, kích thích tư duy tìm hiểu về ${formattedLessonHeading}.</p>
                <p><strong>b) Nội dung:</strong> Quan sát hình ảnh, tình huống gợi mở để phát hiện vấn đề học tập.</p>
                <p><strong>c) Sản phẩm:</strong> Câu trả lời dự đoán, nhận định ban đầu của học sinh.</p>
                <p><strong>d) Tổ chức thực hiện:</strong></p>
                <p style="margin-left: 20px;">- <em>Bước 1 (Chuyển giao):</em> GV đưa ra tình huống thực tế gắn liền với ${formattedLessonHeading}.</p>
                <p style="margin-left: 20px;">- <em>Bước 2 (Thực hiện):</em> HS thảo luận nhanh theo cặp.</p>
                <p style="margin-left: 20px;">- <em>Bước 3 (Báo cáo):</em> Đại diện 1-2 HS phát biểu nhận định.</p>
                <p style="margin-left: 20px;">- <em>Bước 4 (Kết luận):</em> GV ghi nhận và dẫn dắt vào bài mới.</p>
                <p style="margin-left: 20px;"><strong>* DỰ KIẾN SẢN PHẨM:</strong> Các suy đoán ban đầu của học sinh về chủ đề bài học.</p>

                <!-- KHUNG NĂNG LỰC SỐ -->
                <div style="border: 2px dashed #0284c7; background-color: #f0f9ff; padding: 10px 14px; margin: 15px 0; border-radius: 6px;">
                    <p style="margin: 0; font-weight: bold; color: #0369a1;">👉 [TÍCH HỢP NĂNG LỰC SỐ]: [NLS 2.1] Khai thác dữ liệu số và mô hình trực quan</p>
                    <p style="margin: 4px 0 0 0; font-size: 11pt; color: #0f172a;">
                        - Thao tác GV: Cung cấp liên kết hoặc mã QR tài liệu/hình ảnh phân tích trên màn hình chiếu.<br>
                        - Thao tác HS: Quét mã QR, tra cứu trên học liệu số để trích xuất đặc điểm cấu tạo, tính chất của đối tượng nghiên cứu.
                    </p>
                </div>

                <p><strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong></p>
                <p><strong>a) Mục tiêu:</strong> Chiếm lĩnh toàn bộ kiến thức cốt lõi của ${formattedLessonHeading} theo SGK ${book}.</p>
                <p><strong>b) Nội dung:</strong> Đọc tài liệu SGK từ dữ liệu bài học, thảo luận nhóm hoàn thành Phiếu học tập số 1.</p>
                <p><strong>c) Sản phẩm:</strong> Vở ghi của học sinh với đầy đủ định nghĩa, sơ đồ và nội dung chi tiết.</p>
                <p><strong>d) Tổ chức thực hiện:</strong></p>

                <!-- BẢNG 2 CỘT CV 5512 -->
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;" border="1">
                    <thead>
                        <tr style="background-color: #f1f5f9;">
                            <th style="width: 45%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH</th>
                            <th style="width: 55%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">DỰ KIẾN SẢN PHẨM (NỘI DUNG GHI VỞ CỦA HỌC SINH)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                                <p style="margin-top: 0;"><strong>Bước 1: Chuyển giao nhiệm vụ</strong></p>
                                <p>- GV yêu cầu học sinh đọc nội dung bài học, kết hợp Phiếu học tập số 1.</p>
                                <p>- Giao các nhóm phân tích từng đề mục kiến thức.</p>
                                
                                <p><strong>Bước 2: Thực hiện nhiệm vụ</strong></p>
                                <p>- Học sinh làm việc cá nhân kết hợp thảo luận nhóm.</p>
                                <p>- GV theo dõi, hỗ trợ gợi mở định hướng.</p>

                                <p><strong>Bước 3: Báo cáo, thảo luận</strong></p>
                                <p>- Đại diện các nhóm trình bày kết quả.</p>
                                <p>- Lớp nhận xét, phản biện, bổ sung.</p>

                                <p style="margin-bottom: 0;"><strong>Bước 4: Kết luận, nhận định</strong></p>
                                <p style="margin-bottom: 0;">- GV chuẩn hóa kiến thức, hướng dẫn học sinh ghi chép bài vào vở.</p>
                            </td>
                            <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                                <p style="margin-top: 0; font-weight: bold; color: #1e3a8a;">NỘI DUNG CHI TIẾT TRÍCH XUẤT TỪ SGK / DRIVE:</p>
                                <div>
                                    ${parsed.mainBody}
                                </div>
                                ${customGuide ? `<hr style="margin: 8px 0; border: none; border-top: 1px dashed #94a3b8;"><p style="font-style: italic; color: #0f766e;"><strong>Ghi chú chuyên môn:</strong> ${customGuide}</p>` : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p><strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong></p>
                <p><strong>a) Mục tiêu:</strong> Củng cố và khắc sâu kiến thức vừa học.</p>
                <p><strong>b) Nội dung:</strong> Giải quyết hệ thống bài tập trắc nghiệm và câu hỏi tự luận theo nội dung bài.</p>
                <p><strong>c) Sản phẩm:</strong> Câu trả lời và kết quả bài làm vào vở của học sinh.</p>
                <p><strong>d) Tổ chức thực hiện:</strong> GV phát đề, HS làm bài độc lập rồi thảo luận đáp án.</p>
                <p><strong>* DỰ KIẾN SẢN PHẨM:</strong></p>
                <div style="margin-left: 20px;">
                    ${parsed.exercises}
                </div>

                <p><strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong></p>
                <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức bài học để giải thích các vấn đề thực tiễn trong đời sống và sản xuất.</p>
                <p><strong>b) Nội dung:</strong> Liên hệ thực tế địa phương (Vĩnh Long / Mang Thít) về các ứng dụng liên quan.</p>
                <p><strong>c) Sản phẩm:</strong> Bài viết hoặc báo cáo thu hoạch ngắn nộp vào tiết sau.</p>
                <p><strong>d) Tổ chức thực hiện:</strong> Giao việc về nhà theo nhóm hoặc cá nhân.</p>
                <p><strong>* DỰ KIẾN SẢN PHẨM:</strong> Bản thu hoạch giải quyết tình huống thực tế của học sinh.</p>

                <!-- IV. HỒ SƠ DẠY HỌC / PHỤ LỤC -->
                <p><strong>IV. HỒ SƠ DẠY HỌC / PHỤ LỤC</strong></p>
                <p><strong>Phụ lục 1: PHIẾU HỌC TẬP SỐ 1</strong></p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;" border="1">
                    <tr style="background-color: #f8fafc;">
                        <th style="padding: 6px; border: 1px solid #000; width: 25%;">Nhiệm vụ</th>
                        <th style="padding: 6px; border: 1px solid #000; width: 75%;">Nội dung thực hiện</th>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #000; text-align: center;">Nhiệm vụ 1</td>
                        <td style="padding: 6px; border: 1px solid #000;">Nêu các khái niệm, định nghĩa và đặc điểm chính của ${formattedLessonHeading}.</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #000; text-align: center;">Nhiệm vụ 2</td>
                        <td style="padding: 6px; border: 1px solid #000;">Phân tích cấu trúc, cơ chế hoạt động hoặc các quy tắc vận dụng theo tài liệu SGK.</td>
                    </tr>
                </table>

                <p><strong>Phụ lục 2: RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ (NLS 2.1)</strong></p>
                <table style="width: 100%; border-collapse: collapse;" border="1">
                    <tr style="background-color: #f8fafc;">
                        <th style="padding: 6px; border: 1px solid #000; width: 25%;">Tiêu chí</th>
                        <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 1 (Chưa đạt)</th>
                        <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 2 (Đạt)</th>
                        <th style="padding: 6px; border: 1px solid #000; width: 25%;">Mức 3 (Tốt)</th>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Khai thác dữ liệu số & học liệu trực tuyến</td>
                        <td style="padding: 6px; border: 1px solid #000;">Chưa biết quét mã hoặc truy cập học liệu số khi được giao nhiệm vụ.</td>
                        <td style="padding: 6px; border: 1px solid #000;">Truy cập được tư liệu và trả lời câu hỏi dưới sự hướng dẫn của giáo viên.</td>
                        <td style="padding: 6px; border: 1px solid #000;">Chủ động tra cứu thành thạo, phân tích đúng bản chất khoa học của bài học.</td>
                    </tr>
                </table>
            </div>
        `;

        docContainer.innerHTML = fullLessonHtml;
    } catch (err) {
        console.error("Lỗi:", err);
        docContainer.innerHTML = `<div style="padding: 20px; color: red;">⚠️ Lỗi: ${err.message}</div>`;
    }
}
