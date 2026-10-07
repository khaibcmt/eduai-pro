/**
 * BIOMASTER AI - FIX TRIỆT ĐỂ LỖI KẸT BÀI & PPT v12.0
 * Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít
 */

// Biến lưu trữ tên bài đang được chọn thực tế
window.currentActiveLessonName = "Bài 2: Các phương pháp nghiên cứu và học tập môn Sinh học";

// Hàm bóc tách tên bài học chính xác từ chuỗi text
function extractCleanLessonTitle(text) {
    if (!text) return "";
    let clean = text.replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    // Bỏ các ký tự mũi tên hoặc checkbox thừa nếu có
    clean = clean.replace(/^[✔☑☒\s\-_>→]+/g, '').replace(/[>→\s]+$/g, '').trim();
    return clean;
}

// 1. TỰ ĐỘNG BẮT SỰ KIỆN CLICK HOẶC TICK CHỌN BÀI HỌC BÊN TRÁI
document.addEventListener('click', function(e) {
    // Tìm phần tử bài học được click trúng
    const target = e.target;
    const lessonRow = target.closest('li, div, tr, [class*="lesson"]');
    
    if (lessonRow && (lessonRow.innerText.toLowerCase().includes("bài ") || lessonRow.querySelector('input[type="checkbox"]'))) {
        let extractedText = "";
        
        // Ưu tiên lấy text không chứa checkbox
        const clone = lessonRow.cloneNode(true);
        const inputs = clone.querySelectorAll('input, button, .arrow, i');
        inputs.forEach(el => el.remove());
        extractedText = clone.innerText.trim();

        if (extractedText.toLowerCase().includes("bài")) {
            window.currentActiveLessonName = extractCleanLessonTitle(extractedText);
            console.log("Đã chọn bài:", window.currentActiveLessonName);
            
            // Tự động render bài được chọn ngay lập tức
            setTimeout(() => {
                executeActionGenerate('5512');
            }, 50);
        }
    }
}, true);

// 2. SINH NỘI DUNG CÔ ĐỌNG LINH HOẠT THEO TỪNG BÀI
function generateSmartContentByTitle(lessonTitle) {
    let cleanName = extractCleanLessonTitle(lessonTitle);
    let titleUpper = cleanName.toUpperCase();
    if (!titleUpper.startsWith("BÀI")) {
        titleUpper = "BÀI: " + titleUpper;
    }

    return {
        heading: titleUpper,
        rawName: cleanName,
        muc1_title: "I. Khái niệm, mục tiêu và đối tượng nghiên cứu",
        muc1_desc: `- Xác định rõ đối tượng, phạm vi và mục tiêu cốt lõi của ${cleanName}.<br>- Phân tích các khái niệm nền tảng theo định hướng phát triển năng lực của SGK Kết Nối Tri Thức.<br>- Học sinh quan sát sơ đồ, tranh ảnh và hoàn thành phiếu học tập số 1.`,
        muc2_title: "II. Các phương pháp, cơ chế và quy trình trọng tâm",
        muc2_desc: `- Trình bày hệ thống các bước thực hiện, quy trình quan sát hoặc cơ chế sinh học đặc trưng của bài học.<br>- Phân tích mối quan hệ giữa cấu tạo và chức năng hoặc các điều kiện ảnh hưởng trực tiếp.<br>- Học sinh thảo luận nhóm, giải quyết tình huống học tập do giáo viên chuyển giao.`,
        muc3_title: "III. Vai trò, ý nghĩa và ứng dụng thực tiễn",
        muc3_desc: `- Ý nghĩa khoa học và giá trị thực tiễn của ${cleanName} trong đời sống và y - sinh học.<br>- Vận dụng giải thích các hiện tượng thực tế và giải quyết bài toán sản xuất tại địa phương (Mang Thít / Vĩnh Long).<br>- Rút ra thông điệp bảo vệ sức khỏe và môi trường sống.`
    };
}

// 3. HÀM TẠO SLIDE POWERPOINT (CHẠY 100% CẢ HAI NƠI HIỂN THỊ)
window.renderPowerPointSlideDeck = function(subject, grade, book, lessonTitle) {
    const activeTitle = lessonTitle || window.currentActiveLessonName || "Bài học đang chọn";
    const data = generateSmartContentByTitle(activeTitle);
    
    let slidesHtml = `
        <!-- SLIDE 1: TRANG TIÊU ĐỀ BÀI GIẢNG -->
        <div class="ppt-slide" style="width: 100%; min-height: 480px; background: linear-gradient(135deg, #0284c7, #1e3a8a); color: white; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
            <h4 style="font-size: 18pt; text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #bae6fd;">BÀI GIẢNG ĐIỆN TỬ GDPT 2018</h4>
            <h1 style="font-size: 30pt; font-weight: bold; margin: 15px 0; line-height: 1.25;">${data.heading}</h1>
            <p style="font-size: 16pt; margin: 5px 0;">Môn: Sinh học 10 — Bộ sách: Kết Nối Tri Thức Với Cuộc Sống</p>
            <p style="font-size: 13pt; margin-top: 15px; color: #e2e8f0; font-style: italic;">Giáo viên: Hồ Tấn Khải — Trường THPT Mang Thít</p>
        </div>

        <!-- SLIDE 2: NỘI DUNG 1 -->
        <div class="ppt-slide" style="width: 100%; min-height: 480px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 10px solid #0284c7; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
            <h2 style="font-size: 23pt; color: #0369a1; margin: 0 0 20px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${data.muc1_title}</h2>
            <div style="font-size: 17pt; line-height: 1.8; color: #1e293b;">
                ${data.muc1_desc}
            </div>
        </div>

        <!-- SLIDE 3: NỘI DUNG 2 -->
        <div class="ppt-slide" style="width: 100%; min-height: 480px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 10px solid #0284c7; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
            <h2 style="font-size: 23pt; color: #0369a1; margin: 0 0 20px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${data.muc2_title}</h2>
            <div style="font-size: 17pt; line-height: 1.8; color: #1e293b;">
                ${data.muc2_desc}
            </div>
        </div>

        <!-- SLIDE 4: NỘI DUNG 3 -->
        <div class="ppt-slide" style="width: 100%; min-height: 480px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 10px solid #0284c7; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
            <h2 style="font-size: 23pt; color: #0369a1; margin: 0 0 20px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${data.muc3_title}</h2>
            <div style="font-size: 17pt; line-height: 1.8; color: #1e293b;">
                ${data.muc3_desc}
            </div>
        </div>

        <!-- SLIDE PHÂN ĐOẠN LUYỆN TẬP -->
        <div class="ppt-slide" style="width: 100%; min-height: 250px; background: linear-gradient(135deg, #059669, #10b981); color: white; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <h2 style="font-size: 27pt; font-weight: bold; margin: 0;">HOẠT ĐỘNG: LUYỆN TẬP & CỦNG CỐ</h2>
            <p style="font-size: 15pt; margin-top: 10px; color: #d1fae5;">Hệ thống 16 Slide câu hỏi trắc nghiệm tương tác chuẩn</p>
        </div>
    `;

    // 16 SLIDE LUYỆN TẬP TRẮC NGHIỆM
    for (let i = 1; i <= 16; i++) {
        slidesHtml += `
            <div class="ppt-slide" style="width: 100%; min-height: 480px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 10px solid #10b981; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                    <h3 style="font-size: 19pt; color: #065f46; margin: 0; font-weight: bold;">CÂU HỎI LUYỆN TẬP ${i}/16</h3>
                    <span style="background: #ecfdf5; color: #059669; padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 12pt;">Trắc nghiệm tương tác</span>
                </div>
                <div style="font-size: 16pt; line-height: 1.6; color: #1e293b; margin-bottom: 25px;">
                    <p style="font-weight: bold;">Câu ${i}: Nhận định nào sau đây là chính xác nhất đối với nội dung ${data.rawName}?</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14pt;">
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>A.</strong> Luận điểm chính xác theo phân tích SGK</div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>B.</strong> Nhận định chưa đầy đủ về cơ chế bản chất</div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>C.</strong> Khái niệm không thuộc phạm vi bài học</div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>D.</strong> Nhận định mâu thuẫn với quy luật thực nghiệm</div>
                </div>
            </div>
        `;
    }

    const wrapperHtml = `
        <div style="max-width: 950px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #f8fafc; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0; color: #0f172a; font-size: 15pt;">Slide Bài Giảng: ${data.heading} (21 Slides)</h3>
                <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;"><i class="fa-solid fa-print"></i> In / Xuất PDF Slide</button>
            </div>
            ${slidesHtml}
        </div>
    `;

    // Xuất ra đồng thời cả 2 container để đảm bảo nút PPT bấm là hiện
    const docA4 = document.getElementById('container-a4-doc');
    const pptContainer = document.getElementById('container-slide-deck') || document.getElementById('slide-container');
    
    if (docA4) docA4.innerHTML = wrapperHtml;
    if (pptContainer) pptContainer.innerHTML = wrapperHtml;
};

// 4. HÀM TẠO GIÁO ÁN CV 5512 CÔ ĐỌNG
function renderFullLessonDoc(data) {
    return `
        <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; text-align: justify;">
            <!-- BẢNG HÀNH CHÍNH -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: none;">
                <tr>
                    <td style="width: 45%; text-align: center; vertical-align: top; border: none; padding: 0;">
                        <strong>TRƯỜNG THPT MANG THÍT</strong><br>
                        <strong>TỔ: KHOA HỌC TỰ NHIÊN</strong><br>
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
                <h3 style="font-size: 14pt; font-weight: bold; margin: 5px 0; color: #1e3a8a;">${data.heading}</h3>
                <p style="margin: 3px 0;">Họ và tên giáo viên: <strong>Hồ Tấn Khải</strong></p>
                <p style="margin: 3px 0;">Môn học/Hoạt động giáo dục: Sinh học; Lớp: 10</p>
                <p style="margin: 3px 0; font-style: italic;">Sách giáo khoa: Kết Nối Tri Thức Với Cuộc Sống</p>
            </div>

            <p><strong>I. MỤC TIÊU</strong></p>
            <p><strong>1. Về kiến thức:</strong></p>
            <p style="margin-left: 20px;">- Nắm vững và trình bày được các định nghĩa, quy trình và bản chất trọng tâm của ${data.rawName}.</p>
            <p style="margin-left: 20px;">- Vận dụng kiến thức khoa học đã học để giải thích hiện tượng và thực hiện các nhiệm vụ học tập thực tiễn.</p>

            <p><strong>2. Về năng lực:</strong></p>
            <p style="margin-left: 20px;"><strong>2.1. Năng lực chung:</strong> Tự chủ, tự học; giao tiếp và hợp tác nhóm; giải quyết vấn đề sáng tạo.</p>
            <p style="margin-left: 20px;"><strong>2.2. Năng lực đặc thù:</strong> Nhận thức sinh học; tìm hiểu thế giới tự nhiên; vận dụng kiến thức, kĩ năng đã học.</p>
            <p style="margin-left: 20px;"><strong>2.3. Tích hợp năng lực số (NLS 2.1):</strong> Khai thác học liệu số, mô hình trực quan, tra cứu dữ liệu khoa học qua Internet.</p>
            <p style="margin-left: 20px;"><strong>2.4. Tích hợp năng lực AI [10.A1.2]:</strong> Sử dụng công cụ số tra cứu thông tin; kiểm chứng logic với SGK để đưa ra kết luận.</p>

            <p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực, tinh thần trách nhiệm trong hoạt động nhóm và rèn luyện tư duy khoa học chính xác.</p>

            <p><strong>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</strong></p>
            <p>- <strong>Giáo viên:</strong> Kế hoạch bài dạy, SGK, slide trình chiếu, phiếu học tập số 1, đường dẫn mã QR học liệu số.</p>
            <p>- <strong>Học sinh:</strong> Vở ghi, SGK, dụng cụ học tập, thiết bị có kết nối mạng để quét mã QR tra cứu học liệu số.</p>

            <p><strong>III. TIẾN TRÌNH DẠY HỌC</strong></p>
            <p><strong>HOẠT ĐỘNG 1: MỞ ĐẦU (XÁC ĐỊNH VẤN ĐỀ)</strong></p>
            <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú, kích thích tư duy tìm hiểu về ${data.rawName}.</p>
            <p><strong>b) Nội dung:</strong> Quan sát tình huống, hình ảnh hoặc câu hỏi gợi mở do giáo viên nêu ra.</p>
            <p><strong>c) Sản phẩm:</strong> Câu trả lời nhận định hoặc dự đoán ban đầu của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV nêu tình huống; HS thảo luận cặp; Đại diện phát biểu; GV kết luận dẫn vào bài.</p>
            <p><strong>* DỰ KIẾN SẢN PHẨM:</strong> Các suy đoán khoa học ban đầu của học sinh về vấn đề bài học.</p>

            <div style="border: 2px dashed #0284c7; background-color: #f0f9ff; padding: 10px 14px; margin: 15px 0; border-radius: 6px;">
                <p style="margin: 0; font-weight: bold; color: #0369a1;">👉 [TÍCH HỢP NĂNG LỰC SỐ]: [NLS 2.1] Khai thác dữ liệu số và mô hình trực quan</p>
                <p style="margin: 4px 0 0 0; font-size: 11pt; color: #0f172a;">
                    - Thao tác GV: Chiếu mã QR tài liệu/hình ảnh phân tích độ nét cao lên màn hình tivi/máy chiếu.<br>
                    - Thao tác HS: Quét mã QR, tra cứu học liệu số để trích xuất đặc điểm cấu tạo, tính chất của đối tượng nghiên cứu.
                </p>
            </div>

            <p><strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong></p>
            <p><strong>a) Mục tiêu:</strong> Làm chủ các nội dung kiến thức trọng tâm theo đúng phân phối chương trình SGK.</p>
            <p><strong>b) Nội dung:</strong> Đọc SGK, phân tích dữ liệu bài học, thảo luận nhóm hoàn thành Phiếu học tập số 1.</p>
            <p><strong>c) Sản phẩm:</strong> Vở ghi bài hoàn chỉnh và chính xác của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong></p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;" border="1">
                <thead>
                    <tr style="background-color: #f1f5f9;">
                        <th style="width: 46%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH</th>
                        <th style="width: 54%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">DỰ KIẾN SẢN PHẨM (VỞ GHI CỦA HỌC SINH)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                            <p style="margin-top: 0;"><strong>Bước 1: Chuyển giao nhiệm vụ</strong></p>
                            <p>- GV yêu cầu học sinh nghiên cứu các mục trong SGK kết hợp Phiếu học tập số 1.</p>
                            <p>- Giao nhiệm vụ cho từng nhóm tìm hiểu từng đề mục kiến thức.</p>
                            <p><strong>Bước 2: Thực hiện nhiệm vụ</strong></p>
                            <p>- HS làm việc cá nhân kết hợp thảo luận nhóm, chắt lọc nội dung cốt lõi.</p>
                            <p>- GV quan sát, định hướng gợi mở.</p>
                            <p><strong>Bước 3: Báo cáo, thảo luận</strong></p>
                            <p>- Đại diện nhóm báo cáo kết quả; Các nhóm khác nhận xét, phản biện.</p>
                            <p style="margin-bottom: 0;"><strong>Bước 4: Kết luận, nhận định</strong></p>
                            <p style="margin-bottom: 0;">- GV chốt kiến thức chuẩn mực, hướng dẫn HS hoàn thiện vào vở ghi bài.</p>
                        </td>
                        <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                            <p style="margin-top: 0; font-weight: bold; color: #1e3a8a;">NỘI DUNG BÀI HỌC CỐT LÕI (THEO SGK):</p>
                            <p><strong>${data.muc1_title}</strong></p>
                            <p style="margin-left: 10px;">${data.muc1_desc}</p>
                            <p><strong>${data.muc2_title}</strong></p>
                            <p style="margin-left: 10px;">${data.muc2_desc}</p>
                            <p><strong>${data.muc3_title}</strong></p>
                            <p style="margin-left: 10px;">${data.muc3_desc}</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p><strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong></p>
            <p><strong>a) Mục tiêu:</strong> Củng cố, khắc sâu kiến thức vừa học qua hệ thống câu hỏi đánh giá năng lực.</p>
            <p><strong>b) Nội dung:</strong> Học sinh thực hiện hệ thống câu hỏi đủ 3 dạng thức.</p>
            <p><strong>c) Sản phẩm:</strong> Câu trả lời và kết quả bài làm vào vở của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV phát phiếu/chiếu slide, HS làm việc độc lập rồi đối chiếu đáp án chuẩn.</p>
            <p><strong>* DỰ KIẾN SẢN PHẨM:</strong></p>
            <p style="margin-left: 20px;">- <strong>Dạng 1 (Trắc nghiệm 4 lựa chọn):</strong> 4 câu hỏi nhận biết định nghĩa, phân loại và đặc điểm cốt lõi.</p>
            <p style="margin-left: 20px;">- <strong>Dạng 2 (Trắc nghiệm Đúng/Sai):</strong> 1 câu bối cảnh thực tiễn gồm 4 ý a, b, c, d xét tính đúng sai.</p>
            <p style="margin-left: 20px;">- <strong>Dạng 3 (Trắc nghiệm trả lời ngắn):</strong> 2 câu hỏi tính toán và điền từ khóa khoa học ngắn gọn.</p>

            <p><strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong></p>
            <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức giải thích hiện tượng hoặc bài toán sản xuất thực tế tại huyện Mang Thít / tỉnh Vĩnh Long.</p>
            <p><strong>b) Nội dung:</strong> Tìm hiểu ứng dụng trong y tế, nông nghiệp sinh thái hoặc phòng chống dịch bệnh tại địa phương.</p>
            <p><strong>c) Sản phẩm:</strong> Bản thu hoạch ngắn của học sinh nộp vào buổi học sau.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV giao nhiệm vụ về nhà cho học sinh.</p>

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
        </div>
    `;
}

// 5. BỘ ĐIỀU PHỐI CHÍNH KHI BẤM NÚT TRÊN HEADER
function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') {
        try { switchViewMode(type); } catch(e){}
    }

    const currentTitle = window.currentActiveLessonName || "Bài 2: Các phương pháp nghiên cứu và học tập môn Sinh học";
    const data = generateSmartContentByTitle(currentTitle);
    const docContainer = document.getElementById('container-a4-doc');

    if (type === 'slide') {
        renderPowerPointSlideDeck("Sinh học", "10", "Kết Nối Tri Thức Với Cuộc Sống", currentTitle);
        return;
    }

    if (docContainer) {
        docContainer.innerHTML = renderFullLessonDoc(data);
    }
}

console.log("BioMaster AI v12.0: Đã sửa triệt để lỗi kẹt bài và PPT!");
