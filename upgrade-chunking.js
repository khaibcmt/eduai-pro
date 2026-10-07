/**
 * EDUPHYSICS / EDUAI PRO - DIRECT DRIVE ENGINE (NO-AI VERSION)
 * Tự động đọc dữ liệu SGK từ Google Drive và xuất giáo án chuẩn CV 5512 + NLS
 */

// 1. CẤU HÌNH ĐƯỜNG DẪN GOOGLE APPS SCRIPT ĐỌC DRIVE
const DRIVE_APP_URL = "https://script.google.com/macros/s/AKfycbyUAoctNBlViQVDcYxZr8h0DjAU2vaGk-QZfDWYl7LNlfgPj6JWRFsLZpBTAWvWuHtnzw/exec"; 

// Chặn các popup cảnh báo cũ
window.alert = function(msg) { console.warn("[EduSystem Notice]:", msg); };

// Hàm hỗ trợ trích xuất nội dung bài học từ Google Drive
async function fetchSgkContentFromDrive(lessonName) {
    if (!DRIVE_APP_URL || DRIVE_APP_URL.trim() === "" || DRIVE_APP_URL.includes("DÁN_URL")) {
        return "";
    }
    try {
        const fetchUrl = `${DRIVE_APP_URL.trim()}?lesson=${encodeURIComponent(lessonName)}`;
        const res = await fetch(fetchUrl);
        const json = await res.json();
        if (json && json.status === "success" && json.data) {
            console.log("Đã nạp thành công ngữ liệu SGK từ Drive!");
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

    const subject = document.getElementById('sel-subject')?.value || "Vật lí";
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

    // Hiển thị trạng thái đang nạp từ Drive
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
            <div style="font-size: 36px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;" id="chunk-status-text">Đang trích xuất dữ liệu bài học từ Google Drive...</h3>
            <p style="color: #64748b; font-size: 11pt;" id="chunk-step-detail">Bài: <strong>${lessonTitle}</strong></p>
        </div>
    `;

    try {
        const tName = (typeof teacherName !== 'undefined') ? teacherName : "Trần Thị Mỹ Thanh";
        const sName = (typeof schoolName !== 'undefined') ? schoolName : "Trường THPT Mang Thít";

        // Trích xuất văn bản SGK từ Drive
        let driveContent = await fetchSgkContentFromDrive(lessonTitle);

        // Chuẩn bị nội dung hiển thị ở cột sản phẩm
        let displayDriveText = driveContent ? driveContent.replace(/\n/g, '<br>') : "Học sinh ghi chép đầy đủ các định nghĩa cốt lõi, công thức và ví dụ minh họa theo đúng nội dung bài học trong SGK " + book + ".";

        // Tạo khung HTML chuẩn giáo án CV 5512 + Năng lực số
        const fullLessonHtml = `
            <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; text-align: justify;">
                <!-- HÀNH CHÍNH -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: none;">
                    <tr>
                        <td style="width: 45%; text-align: center; vertical-align: top; border: none;">
                            <strong>SỞ GD&ĐT VĨNH LONG</strong><br>
                            <strong>${sName.toUpperCase()}</strong><br>
                            -------------------
                        </td>
                        <td style="width: 55%; text-align: center; vertical-align: top; border: none;">
                            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
                            <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
                            -------------------
                        </td>
                    </tr>
                </table>

                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="font-size: 15pt; font-weight: bold; margin: 5px 0;">KẾ HOẠCH BÀI DẠY</h2>
                    <h3 style="font-size: 14pt; font-weight: bold; margin: 5px 0; color: #1e3a8a;">BÀI: ${lessonTitle.toUpperCase()}</h3>
                    <p style="margin: 3px 0;">Môn: ${subject} ${grade} | Bộ sách: ${book}</p>
                    <p style="margin: 3px 0; font-style: italic;">Giáo viên thực hiện: ${tName}</p>
                </div>

                <!-- I. MỤC TIÊU -->
                <p><strong>I. MỤC TIÊU</strong></p>
                <p><strong>1. Về kiến thức:</strong></p>
                <p style="margin-left: 20px;">- Nắm vững các khái niệm, định nghĩa và hệ thống công thức cốt lõi của bài học theo SGK ${book}.</p>
                <p style="margin-left: 20px;">- Biết vận dụng kiến thức lý thuyết để giải quyết các bài toán định tính, định lượng và hiện tượng thực tiễn.</p>

                <p><strong>2. Về năng lực:</strong></p>
                <p style="margin-left: 20px;"><strong>2.1. Năng lực chung:</strong> Tự chủ, tự học; giao tiếp và hợp tác nhóm hiệu quả; giải quyết vấn đề sáng tạo.</p>
                <p style="margin-left: 20px;"><strong>2.2. Năng lực đặc thù:</strong> Nhận thức khoa học vật lí/công nghệ; tìm hiểu tự nhiên; vận dụng kiến thức, kĩ năng đã học.</p>
                <p style="margin-left: 20px;"><strong>2.3. Tích hợp năng lực số (NLS 2.1):</strong> Học sinh biết tra cứu tài liệu học tập, mô hình mô phỏng số, tương tác với học liệu trực tuyến phục vụ tìm hiểu bài học.</p>

                <p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực, có tinh thần trách nhiệm trong học tập và bảo đảm an toàn thực nghiệm.</p>

                <!-- II. THIẾT BỊ DẠY HỌC -->
                <p><strong>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</strong></p>
                <p>- <strong>Giáo viên:</strong> Giáo án, SGK ${book}, máy chiếu/tivi, hình ảnh thí nghiệm, phiếu học tập số 1, đường dẫn tài liệu số.</p>
                <p>- <strong>Học sinh:</strong> Vở ghi, SGK ${book}, dụng cụ học tập, thiết bị có kết nối Internet để tra cứu mô phỏng khi được hướng dẫn.</p>

                <!-- III. TIẾN TRÌNH DẠY HỌC -->
                <p><strong>III. TIẾN TRÌNH DẠY HỌC</strong></p>

                <p><strong>HOẠT ĐỘNG 1: MỞ ĐẦU (XÁC ĐỊNH VẤN ĐỀ)</strong></p>
                <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú, khơi gợi kiến thức nền tảng để bước vào bài học.</p>
                <p><strong>b) Nội dung:</strong> Quan sát hiện tượng thực tế, thảo luận câu hỏi định hướng của giáo viên.</p>
                <p><strong>c) Sản phẩm:</strong> Câu trả lời dự đoán ban đầu của học sinh ghi trên bảng phụ hoặc giấy nháp.</p>
                <p><strong>d) Tổ chức thực hiện:</strong></p>
                <p style="margin-left: 20px;">- <em>Bước 1 (Chuyển giao):</em> GV đưa ra tình huống thực tế hoặc đoạn video ngắn liên quan đến bài học ${lessonTitle}.</p>
                <p style="margin-left: 20px;">- <em>Bước 2 (Thực hiện):</em> HS thảo luận cặp đôi để tìm câu trả lời.</p>
                <p style="margin-left: 20px;">- <em>Bước 3 (Báo cáo):</em> Đại diện 1-2 HS trình bày suy nghĩ.</p>
                <p style="margin-left: 20px;">- <em>Bước 4 (Kết luận):</em> GV nhận xét, tạo điểm tựa dẫn dắt vào bài học mới.</p>
                <p style="margin-left: 20px;"><strong>* DỰ KIẾN SẢN PHẨM:</strong> Các ý kiến suy đoán ban đầu của học sinh về vấn đề bài học.</p>

                <!-- KHUNG NĂNG LỰC SỐ -->
                <div style="border: 2px dashed #0284c7; background-color: #f0f9ff; padding: 10px 14px; margin: 15px 0; border-radius: 6px;">
                    <p style="margin: 0; font-weight: bold; color: #0369a1;">👉 [TÍCH HỢP NĂNG LỰC SỐ]: [NLS 2.1] Khai thác học liệu số và mô hình mô phỏng</p>
                    <p style="margin: 4px 0 0 0; font-size: 11pt; color: #0f172a;">
                        - Thao tác GV: Cung cấp mã QR / liên kết mô phỏng hiện tượng trên màn hình.<br>
                        - Thao tác HS: Truy cập bằng điện thoại/máy tính hoặc quan sát trực quan, rút ra nhận xét tương quan các đại lượng.
                    </p>
                </div>

                <p><strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong></p>
                <p><strong>a) Mục tiêu:</strong> Hình thành đầy đủ các khái niệm, định nghĩa, công thức toán học và quy tắc của bài học theo SGK ${book}.</p>
                <p><strong>b) Nội dung:</strong> Đọc tài liệu SGK, khai thác ngữ liệu từ kho dữ liệu bài học, làm việc nhóm hoàn thành phiếu học tập.</p>
                <p><strong>c) Sản phẩm:</strong> Vở ghi của học sinh với đầy đủ nội dung kiến thức chuẩn mực.</p>
                <p><strong>d) Tổ chức thực hiện:</strong></p>

                <!-- BẢNG 2 CỘT CHUẨN CV 5512 -->
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
                                <p>- GV yêu cầu học sinh nghiên cứu SGK kết hợp Phiếu học tập số 1.</p>
                                <p>- Phân công các nhóm thảo luận từng nội dung mục lớn của bài.</p>
                                
                                <p><strong>Bước 2: Thực hiện nhiệm vụ</strong></p>
                                <p>- HS đọc SGK, thảo luận nhóm, ghi nhận định nghĩa và biểu thức công thức.</p>
                                <p>- GV theo dõi, hỗ trợ các nhóm gặp khó khăn.</p>

                                <p><strong>Bước 3: Báo cáo, thảo luận</strong></p>
                                <p>- Đại diện nhóm lên bảng trình bày kết quả phiếu học tập.</p>
                                <p>- Các nhóm khác đặt câu hỏi phản biện, bổ sung.</p>

                                <p style="margin-bottom: 0;"><strong>Bước 4: Kết luận, nhận định</strong></p>
                                <p style="margin-bottom: 0;">- GV chốt lại nội dung chuẩn xác, hướng dẫn HS hoàn thiện vào vở ghi.</p>
                            </td>
                            <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                                <p style="margin-top: 0; font-weight: bold; color: #1e3a8a;">NỘI DUNG BÀI HỌC THEO SGK:</p>
                                <div>
                                    ${displayDriveText}
                                </div>
                                ${customGuide ? `<hr style="margin: 8px 0; border: none; border-top: 1px dashed #94a3b8;"><p style="font-style: italic; color: #0f766e;"><strong>Ghi chú chuyên môn:</strong> ${customGuide}</p>` : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p><strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong></p>
                <p><strong>a) Mục tiêu:</strong> Củng cố, khắc sâu kiến thức vừa học thông qua hệ thống bài tập đánh giá năng lực.</p>
                <p><strong>b) Nội dung:</strong> Học sinh thực hiện hệ thống bài tập trắc nghiệm và tự luận ngắn.</p>
                <p><strong>c) Sản phẩm:</strong> Đáp án của học sinh làm vào vở bài tập.</p>
                <p><strong>d) Tổ chức thực hiện:</strong> GV phát đề/chiếu slide, HS làm việc độc lập rồi trao đổi chéo kết quả.</p>
                <p><strong>* DỰ KIẾN SẢN PHẨM:</strong></p>
                <p style="margin-left: 20px;">- <strong>Dạng 1 (Trắc nghiệm 4 lựa chọn):</strong> Các câu hỏi nhận biết định nghĩa, đơn vị và công thức cơ bản.</p>
                <p style="margin-left: 20px;">- <strong>Dạng 2 (Trắc nghiệm Đúng/Sai):</strong> Phân tích một bối cảnh thực tế gắn với bài học để xét tính đúng/sai của 4 mệnh đề a, b, c, d.</p>
                <p style="margin-left: 20px;">- <strong>Dạng 3 (Trắc nghiệm trả lời ngắn):</strong> Bài toán tính toán nhanh kết quả đại lượng đặc trưng.</p>

                <p><strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong></p>
                <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức bài học giải thích hiện tượng hoặc bài toán thực tiễn tại địa phương (Mang Thít / Vĩnh Long).</p>
                <p><strong>b) Nội dung:</strong> Tìm hiểu ứng dụng kỹ thuật và đời sống hàng ngày.</p>
                <p><strong>c) Sản phẩm:</strong> Báo cáo tóm tắt hoặc bài viết ngắn của học sinh nộp vào buổi học sau.</p>
                <p><strong>d) Tổ chức thực hiện:</strong> GV giao nhiệm vụ về nhà, HS làm việc cá nhân hoặc nhóm nhỏ.</p>
                <p><strong>* DỰ KIẾN SẢN PHẨM:</strong> Bản thu hoạch giải quyết bài toán vận dụng thực tiễn của học sinh.</p>

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
                        <td style="padding: 6px; border: 1px solid #000;">Nêu các khái niệm, định nghĩa chính trong bài học.</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #000; text-align: center;">Nhiệm vụ 2</td>
                        <td style="padding: 6px; border: 1px solid #000;">Viết các công thức toán học, chú thích tên đại lượng và đơn vị đo chuẩn trong hệ SI.</td>
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
                        <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Khai thác học liệu số & phần mềm</td>
                        <td style="padding: 6px; border: 1px solid #000;">Chưa biết thao tác mở link/mô phỏng được giao.</td>
                        <td style="padding: 6px; border: 1px solid #000;">Truy cập và xem được mô hình với sự hướng dẫn của GV.</td>
                        <td style="padding: 6px; border: 1px solid #000;">Thao tác thành thạo, tự điều chỉnh thông số và rút ra kết luận khoa học.</td>
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
console.log("EduAI-Pro: Direct Drive Engine (No-AI) Loaded Successfully!");
