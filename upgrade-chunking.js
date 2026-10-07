/**
 * EDUPHYSICS / EDUAI PRO - DIRECT DRIVE ENGINE (AUTO-FORMAT ALL LESSONS)
 * Tự động đọc dữ liệu SGK từ Google Drive và xuất giáo án chuẩn CV 5512 + NLS
 */

// 1. CẤU HÌNH ĐƯỜNG DẪN GOOGLE APPS SCRIPT ĐỌC DRIVE
const DRIVE_APP_URL = "https://script.google.com/macros/s/AKfycbyUAoctNBlViQVDcYxZr8h0DjAU2vaGk-QZfDWYl7LNlfgPj6JWRFsLZpBTAWvWuHtnzw/exec"; 

// Chặn các popup cảnh báo cũ làm gián đoạn
window.alert = function(msg) { console.warn("[EduSystem Notice]:", msg); };

// Hàm hỗ trợ trích xuất nội dung bài học từ Google Drive kèm Cache vĩnh viễn
async function fetchSgkContentFromDrive(lessonName) {
    if (!DRIVE_APP_URL || DRIVE_APP_URL.trim() === "" || DRIVE_APP_URL.includes("DÁN_URL")) {
        return "";
    }

    // Kiểm tra bộ nhớ đệm trên máy trước (Tải tức thì 0.05s)
    const cacheKey = "eduai_sgk_" + lessonName.trim().toLowerCase();
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        console.log("Nạp bài học tức thì từ Cache trình duyệt!");
        return cachedData;
    }

    try {
        const fetchUrl = `${DRIVE_APP_URL.trim()}?lesson=${encodeURIComponent(lessonName)}`;
        const res = await fetch(fetchUrl);
        const json = await res.json();
        if (json && json.status === "success" && json.data) {
            localStorage.setItem(cacheKey, json.data);
            return json.data;
        }
    } catch (e) {
        console.warn("Không kết nối được Drive Web App:", e);
    }
    return "";
}

// 2. BỘ ĐIỀU PHỐI VÀ XUẤT GIÁO ÁN TRỰC TIẾP
async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const lessonTitle = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài học đang chọn";
    const customGuide = document.getElementById('ai-custom-instructions')?.value || "";
    const docContainer = document.getElementById('container-a4-doc');

    if (type !== '5512') {
        if (typeof renderMaTranDeKiemTra === 'function' && type === '7991') {
            renderMaTranDeKiemTra(subject, grade, book);
        } else if (typeof renderPowerPointSlideDeck === 'function' && type === 'slide') {
            renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        }
        return;
    }

    // CHUẨN HÓA TIÊU ĐỀ CHO TẤT CẢ CÁC BÀI HỌC (LOẠI BỎ LẶP CHỮ "BÀI")
    // Ví dụ: "Bài 24: Khái quát về virus" -> "BÀI 24: KHÁI QUÁT VỀ VIRUS"
    // Ví dụ: "BÀI: Bài 24" -> "BÀI 24"
    let cleanTitle = lessonTitle.trim();
    // Bóc tách toàn bộ các tiền tố "Bài", "Bài:", "Bài -" ở đầu chuỗi
    cleanTitle = cleanTitle.replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '');
    
    // Tạo tiêu đề chuẩn thể thức văn bản hành chính
    const formattedLessonHeading = `BÀI ${cleanTitle.toUpperCase()}`;

    // Hiển thị trạng thái đang nạp từ Drive
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
            <div style="font-size: 36px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang trích xuất dữ liệu bài học...</h3>
            <p style="color: #64748b; font-size: 11pt;" id="chunk-step-detail">Đang xử lý: <strong>${formattedLessonHeading}</strong></p>
        </div>
    `;

    try {
        const tName = (typeof teacherName !== 'undefined') ? teacherName : "Trần Thị Mỹ Thanh";
        const sName = (typeof schoolName !== 'undefined') ? schoolName : "Trường THPT Nguyễn Văn Thiệt";

        // Trích xuất văn bản SGK từ Drive
        let driveContent = await fetchSgkContentFromDrive(lessonTitle);

        // Chuẩn bị nội dung hiển thị ở cột sản phẩm ghi vở
        let displayDriveText = driveContent ? driveContent.replace(/\n/g, '<br>') : `Học sinh ghi chép đầy đủ các định nghĩa cốt lõi, công thức, số liệu và ví dụ minh họa theo đúng phân phối bài học SGK môn ${subject} ${grade} (${book}).`;

        // Tạo khung HTML chuẩn giáo án CV 5512 + Năng lực số
        const fullLessonHtml = `
            <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; text-align: justify;">
                <!-- BẢNG HÀNH CHÍNH CHUẨN CÔNG VĂN -->
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
                <p style="margin-left: 20px;">- Nắm vững các khái niệm, cấu trúc, bản chất và hệ thống quy tắc cốt lõi của bài học theo SGK ${book}.</p>
                <p style="margin-left: 20px;">- Vận dụng kiến thức lý thuyết để phân tích hiện tượng, giải quyết các nhiệm vụ thực tiễn liên quan.</p>

                <p><strong>2. Về năng lực:</strong></p>
                <p style="margin-left: 20px;"><strong>2.1. Năng lực chung:</strong> Tự chủ và tự học; giao tiếp và hợp tác nhóm; giải quyết vấn đề sáng tạo.</p>
                <p style="margin-left: 20px;"><strong>2.2. Năng lực đặc thù:</strong> Nhận thức khoa học; tìm hiểu tự nhiên; vận dụng kiến thức, kĩ năng đã học.</p>
                <p style="margin-left: 20px;"><strong>2.3. Tích hợp năng lực số (NLS 2.1):</strong> Học sinh biết tra cứu dữ liệu học tập, phần mềm trực tuyến, tương tác mô hình mô phỏng phục vụ khai thác nội dung bài học.</p>

                <p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực, tinh thần trách nhiệm trong hợp tác nhóm và đảm bảo tính chính xác khoa học.</p>

                <!-- II. THIẾT BỊ DẠY HỌC -->
                <p><strong>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</strong></p>
                <p>- <strong>Giáo viên:</strong> Giáo án, SGK ${book}, máy chiếu/tivi, tư liệu hình ảnh, video trực quan, Phiếu học tập số 1, mã QR tài liệu số.</p>
                <p>- <strong>Học sinh:</strong> Vở ghi, SGK ${book}, dụng cụ học tập, thiết bị kết nối Internet để tra cứu học liệu số khi được chuyển giao nhiệm vụ.</p>

                <!-- III. TIẾN TRÌNH DẠY HỌC -->
                <p><strong>III. TIẾN TRÌNH DẠY HỌC</strong></p>

                <p><strong>HOẠT ĐỘNG 1: MỞ ĐẦU (XÁC ĐỊNH VẤN ĐỀ)</strong></p>
                <p><strong>a) Mục tiêu:</strong> Tạo mâu thuẫn nhận thức, khơi gợi nhu cầu tìm hiểu kiến thức mới.</p>
                <p><strong>b) Nội dung:</strong> Quan sát tình huống thực tế, tranh ảnh hoặc hiện tượng đời sống do GV nêu ra.</p>
                <p><strong>c) Sản phẩm:</strong> Câu trả lời dự đoán, nhận định ban đầu của học sinh.</p>
                <p><strong>d) Tổ chức thực hiện:</strong></p>
                <p style="margin-left: 20px;">- <em>Bước 1 (Chuyển giao):</em> GV giao nhiệm vụ khởi động liên quan trực tiếp đến bài học ${formattedLessonHeading}.</p>
                <p style="margin-left: 20px;">- <em>Bước 2 (Thực hiện):</em> HS thảo luận nhanh theo bàn để tìm hướng giải quyết.</p>
                <p style="margin-left: 20px;">- <em>Bước 3 (Báo cáo):</em> Đại diện một số học sinh phát biểu ý kiến.</p>
                <p style="margin-left: 20px;">- <em>Bước 4 (Kết luận):</em> GV ghi nhận ý kiến, dẫn dắt kết nối chính xác vào bài mới.</p>
                <p style="margin-left: 20px;"><strong>* DỰ KIẾN SẢN PHẨM:</strong> Các suy đoán khoa học ban đầu của học sinh.</p>

                <!-- KHUNG NĂNG LỰC SỐ -->
                <div style="border: 2px dashed #0284c7; background-color: #f0f9ff; padding: 10px 14px; margin: 15px 0; border-radius: 6px;">
                    <p style="margin: 0; font-weight: bold; color: #0369a1;">👉 [TÍCH HỢP NĂNG LỰC SỐ]: [NLS 2.1] Khai thác dữ liệu số và mô hình trực quan</p>
                    <p style="margin: 4px 0 0 0; font-size: 11pt; color: #0f172a;">
                        - Thao tác GV: Cung cấp liên kết hoặc mã QR tài liệu/hình ảnh phân tích độ nét cao trên máy chiếu.<br>
                        - Thao tác HS: Quét mã QR, tra cứu trên học liệu số để trích xuất đặc điểm cấu tạo, tính chất của đối tượng nghiên cứu.
                    </p>
                </div>

                <p><strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong></p>
                <p><strong>a) Mục tiêu:</strong> Tiếp thu và làm chủ các nội dung kiến thức trọng tâm theo SGK ${book}.</p>
                <p><strong>b) Nội dung:</strong> Nghiên cứu tài liệu SGK, khai thác ngữ liệu từ hệ thống bài giảng, hoàn thành phiếu học tập số 1.</p>
                <p><strong>c) Sản phẩm:</strong> Nội dung vở ghi hoàn chỉnh của học sinh.</p>
                <p><strong>d) Tổ chức thực hiện:</strong></p>

                <!-- BẢNG 2 CỘT CHUẨN 100% CÔNG VĂN 5512 -->
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
                                <p>- GV yêu cầu học sinh nghiên cứu các mục kiến thức trong SGK.</p>
                                <p>- Phân chia nhiệm vụ cụ thể cho từng nhóm để hoàn thành Phiếu học tập số 1.</p>
                                
                                <p><strong>Bước 2: Thực hiện nhiệm vụ</strong></p>
                                <p>- HS làm việc cá nhân kết hợp thảo luận nhóm, chắt lọc nội dung cốt lõi.</p>
                                <p>- GV theo dõi, hỗ trợ gợi mở định hướng.</p>

                                <p><strong>Bước 3: Báo cáo, thảo luận</strong></p>
                                <p>- Đại diện nhóm báo cáo sản phẩm.</p>
                                <p>- Các nhóm khác nhận xét, bổ sung câu hỏi làm rõ.</p>

                                <p style="margin-bottom: 0;"><strong>Bước 4: Kết luận, nhận định</strong></p>
                                <p style="margin-bottom: 0;">- GV chốt nội dung kiến thức chuẩn xác, hướng dẫn học sinh ghi bài vào vở.</p>
                            </td>
                            <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                                <p style="margin-top: 0; font-weight: bold; color: #1e3a8a;">NỘI DUNG BÀI HỌC CỐT LÕI (THEO SGK):</p>
                                <div>
                                    ${displayDriveText}
                                </div>
                                ${customGuide ? `<hr style="margin: 8px 0; border: none; border-top: 1px dashed #94a3b8;"><p style="font-style: italic; color: #0f766e;"><strong>Ghi chú bổ sung của GV:</strong> ${customGuide}</p>` : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p><strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong></p>
                <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức củng cố kỹ năng thông qua hệ thống câu hỏi đánh giá năng lực.</p>
                <p><strong>b) Nội dung:</strong> Học sinh thực hiện hệ thống câu hỏi đủ 3 dạng thức.</p>
                <p><strong>c) Sản phẩm:</strong> Câu trả lời và kết quả bài làm vào vở của học sinh.</p>
                <p><strong>d) Tổ chức thực hiện:</strong> GV phát phiếu / chiếu đề, HS độc lập làm bài và đối chiếu đáp án chuẩn.</p>
                <p><strong>* DỰ KIẾN SẢN PHẨM:</strong></p>
                <p style="margin-left: 20px;">- <strong>Dạng 1 (Trắc nghiệm 4 lựa chọn):</strong> Các câu hỏi nhận biết khái niệm, đặc điểm và vai trò cốt lõi.</p>
                <p style="margin-left: 20px;">- <strong>Dạng 2 (Trắc nghiệm Đúng/Sai):</strong> Bài toán bối cảnh thực tế gắn với bài học để xét tính đúng/sai của 4 ý a, b, c, d.</p>
                <p style="margin-left: 20px;">- <strong>Dạng 3 (Trắc nghiệm trả lời ngắn):</strong> Câu hỏi điền từ khóa hoặc số liệu ngắn gọn.</p>

                <p><strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong></p>
                <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức vào thực tiễn đời sống, sản xuất và y tế / nông nghiệp địa phương.</p>
                <p><strong>b) Nội dung:</strong> Tìm hiểu biện pháp ứng dụng hoặc giải thích các hiện tượng xung quanh.</p>
                <p><strong>c) Sản phẩm:</strong> Bản thu hoạch ngắn của học sinh nộp vào buổi học kế tiếp.</p>
                <p><strong>d) Tổ chức thực hiện:</strong> GV giao nhiệm vụ về nhà theo nhóm hoặc cá nhân.</p>
                <p><strong>* DỰ KIẾN SẢN PHẨM:</strong> Bài báo cáo vận dụng thực tiễn của học sinh.</p>

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
                        <td style="padding: 6px; border: 1px solid #000;">Nêu các khái niệm, định nghĩa và đặc điểm chính trong bài học.</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #000; text-align: center;">Nhiệm vụ 2</td>
                        <td style="padding: 6px; border: 1px solid #000;">Trình bày cấu tạo, cơ chế hoặc các ứng dụng thực tế theo yêu cầu SGK.</td>
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
                        <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Khai thác dữ liệu số & phần mềm</td>
                        <td style="padding: 6px; border: 1px solid #000;">Chưa biết quét mã / truy cập học liệu số khi được giao.</td>
                        <td style="padding: 6px; border: 1px solid #000;">Truy cập được tư liệu và trả lời câu hỏi dưới sự hỗ trợ của GV.</td>
                        <td style="padding: 6px; border: 1px solid #000;">Chủ động tra cứu thành thạo, phân tích đúng bản chất khoa học.</td>
                    </tr>
                </table>
            </div>
        `;

        docContainer.innerHTML = fullLessonHtml;

    } catch (err) {
        console.error("Lỗi:", err);
        docContainer.innerHTML = `
            <div style="padding: 20px; background: #fff1f2; border: 2px solid #f43f5e; border-radius: 8px; color: #9f1239; font-family: sans-serif;">
                <p><strong>⚠️ Lỗi:</strong> ${err.message}</p>
            </div>
        `;
    }
}
console.log("EduAI-Pro: Direct Drive Engine (Auto-Format All Lessons) Loaded Successfully!");
