/**
 * BIOMASTER AI - CORE ENGINE (BẢN GỐC ỔN ĐỊNH)
 * Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít
 */

// 1. HÀM LẤY TÊN BÀI HỌC ĐANG CHỌN TRÊN GIAO DIỆN
function getSelectedLesson() {
    if (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) {
        return currentSelectedLesson.trim();
    }
    const activeEl = document.querySelector('.lesson-item.active, [class*="active"]');
    if (activeEl) {
        return activeEl.innerText.replace(/[\n\r]/g, ' ').trim();
    }
    const sel = document.getElementById('sel-lesson');
    if (sel && sel.value) return sel.value.trim();

    return "Bài 1: Giới thiệu khái quát môn Sinh học";
}

// 2. TẠO SLIDE POWERPOINT (NỘI DUNG TRỌNG TÂM + 16 SLIDE LUYỆN TẬP)
window.renderPowerPointSlideDeck = function(subject, grade, book, lessonTitle) {
    const docContainer = document.getElementById('container-a4-doc');
    if (!docContainer) return;

    const title = lessonTitle || getSelectedLesson();
    let cleanTitle = title.replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '').trim();
    const formattedTitle = `BÀI ${cleanTitle.toUpperCase()}`;

    let slidesHtml = `
        <!-- SLIDE 1: TIÊU ĐỀ -->
        <div class="ppt-slide" style="width: 100%; min-height: 460px; background: linear-gradient(135deg, #0284c7, #1e3a8a); color: white; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
            <h4 style="font-size: 16pt; text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #bae6fd;">BÀI GIẢNG ĐIỆN TỬ GDPT 2018</h4>
            <h1 style="font-size: 30pt; font-weight: bold; margin: 15px 0;">${formattedTitle}</h1>
            <p style="font-size: 15pt; margin: 5px 0;">Môn: ${subject} ${grade} — Bộ sách: ${book}</p>
            <p style="font-size: 13pt; margin-top: 15px; color: #e2e8f0; font-style: italic;">Giáo viên: Hồ Tấn Khải — Trường THPT Mang Thít</p>
        </div>

        <!-- SLIDE 2: NỘI DUNG TRỌNG TÂM -->
        <div class="ppt-slide" style="width: 100%; min-height: 460px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 8px solid #0284c7; border-radius: 12px; padding: 35px 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="font-size: 20pt; color: #1e3a8a; margin: 0; font-weight: bold;">I. Khám phá kiến thức cốt lõi</h2>
                <span style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11pt;">Khám phá</span>
            </div>
            <div style="font-size: 16pt; line-height: 1.8; color: #334155;">
                <ul style="padding-left: 25px; margin: 0;">
                    <li style="margin-bottom: 12px;">Nghiên cứu khái niệm, bản chất khoa học và cấu trúc của bài học theo SGK.</li>
                    <li style="margin-bottom: 12px;">Phân tích các cơ chế, đặc điểm chức năng thông qua tranh ảnh, sơ đồ và mô hình trực quan.</li>
                    <li>Học sinh làm việc nhóm, trao đổi và ghi chép kiến thức trọng tâm vào vở.</li>
                </ul>
            </div>
        </div>

        <!-- PHÂN ĐOẠN LUYỆN TẬP -->
        <div class="ppt-slide" style="width: 100%; min-height: 220px; background: linear-gradient(135deg, #059669, #10b981); color: white; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <h2 style="font-size: 24pt; font-weight: bold; margin: 0;">HOẠT ĐỘNG: LUYỆN TẬP & CỦNG CỐ</h2>
            <p style="font-size: 14pt; margin-top: 10px; color: #d1fae5;">Hệ thống 16 Slide câu hỏi trắc nghiệm tương tác chuẩn</p>
        </div>
    `;

    // 16 SLIDE LUYỆN TẬP
    for (let i = 1; i <= 16; i++) {
        slidesHtml += `
            <div class="ppt-slide" style="width: 100%; min-height: 460px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 8px solid #10b981; border-radius: 12px; padding: 35px 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                    <h3 style="font-size: 18pt; color: #065f46; margin: 0; font-weight: bold;">CÂU HỎI LUYỆN TẬP ${i}/16</h3>
                    <span style="background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11pt;">Trắc nghiệm tương tác</span>
                </div>
                <div style="font-size: 16pt; line-height: 1.6; color: #1e293b; margin-bottom: 25px;">
                    <p style="font-weight: bold;">Câu ${i}: Nhận định nào sau đây là chính xác về nội dung bài học?</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14pt;">
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>A.</strong> Đáp án chính xác theo nội dung SGK</div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>B.</strong> Nhận định chưa đầy đủ về mặt cơ chế</div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>C.</strong> Khái niệm không thuộc phạm vi bài học</div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;"><strong>D.</strong> Nhận định mâu thuẫn với quy luật thực nghiệm</div>
                </div>
            </div>
        `;
    }

    const wrapper = `
        <div style="max-width: 950px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #f8fafc; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0; color: #0f172a; font-size: 14pt;">Trình chiếu Slide: ${formattedTitle} (18 Slides)</h3>
                <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;"><i class="fa-solid fa-print"></i> In / Xuất PDF Slide</button>
            </div>
            ${slidesHtml}
        </div>
    `;

    docContainer.innerHTML = wrapper;
};

// 3. TẠO GIÁO ÁN CV 5512 DỰ PHÒNG AN TOÀN (NẾU KHÔNG CÓ AI HOẶC MẤT MẠNG)
function getOfflineLessonPlanHtml(subject, grade, book, formattedTitle) {
    return `
        <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; text-align: justify;">
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
                <h3 style="font-size: 14pt; font-weight: bold; margin: 5px 0; color: #1e3a8a;">${formattedTitle}</h3>
                <p style="margin: 3px 0;">Họ và tên giáo viên: <strong>Hồ Tấn Khải</strong></p>
                <p style="margin: 3px 0;">Môn học/Hoạt động giáo dục: ${subject}; Lớp: ${grade}</p>
                <p style="margin: 3px 0; font-style: italic;">Sách giáo khoa: ${book}</p>
            </div>

            <p><strong>I. MỤC TIÊU</strong></p>
            <p><strong>1. Về kiến thức:</strong></p>
            <p style="margin-left: 20px;">- Trình bày được các khái niệm, quy luật và kiến thức cốt lõi của bài học theo SGK ${book}.</p>
            <p style="margin-left: 20px;">- Vận dụng kiến thức khoa học đã học để phân tích hiện tượng và giải quyết các bài tập thực tiễn.</p>

            <p><strong>2. Về năng lực:</strong></p>
            <p style="margin-left: 20px;"><strong>2.1. Năng lực chung:</strong> Tự chủ và tự học; giao tiếp và hợp tác nhóm; giải quyết vấn đề sáng tạo.</p>
            <p style="margin-left: 20px;"><strong>2.2. Năng lực đặc thù:</strong> Nhận thức khoa học; tìm hiểu tự nhiên; vận dụng kiến thức, kĩ năng đã học.</p>
            <p style="margin-left: 20px;"><strong>2.3. Tích hợp năng lực số (NLS 2.1):</strong> Khai thác học liệu số, mô hình trực quan, tra cứu dữ liệu khoa học qua Internet.</p>
            <p style="margin-left: 20px;"><strong>2.4. Tích hợp năng lực AI [${grade}.A1.2]:</strong> Khai thác dữ liệu từ trợ lí số; đối chiếu, kiểm chứng với tài liệu chuẩn SGK để rút ra kết luận.</p>

            <p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực, trách nhiệm trong làm việc nhóm và bảo vệ môi trường.</p>

            <p><strong>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</strong></p>
            <p>- <strong>Giáo viên:</strong> Kế hoạch bài dạy, bài giảng slide, SGK ${book}, phiếu học tập số 1, đường dẫn mã QR học liệu số.</p>
            <p>- <strong>Học sinh:</strong> SGK ${book}, vở ghi bài, thiết bị có kết nối mạng để quét mã QR tra cứu học liệu số.</p>

            <p><strong>III. TIẾN TRÌNH DẠY HỌC</strong></p>
            <p><strong>HOẠT ĐỘNG 1: MỞ ĐẦU (XÁC ĐỊNH VẤN ĐỀ)</strong></p>
            <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú, khơi gợi nhu cầu tìm hiểu kiến thức mới của học sinh.</p>
            <p><strong>b) Nội dung:</strong> Quan sát tình huống, hình ảnh gợi mở do giáo viên nêu ra.</p>
            <p><strong>c) Sản phẩm:</strong> Câu trả lời nhận định hoặc dự đoán ban đầu của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV chuyển giao nhiệm vụ; HS thảo luận cặp; Đại diện phát biểu; GV kết luận dẫn dắt vào bài mới.</p>
            <p><strong>* DỰ KIẾN SẢN PHẨM:</strong> Các suy đoán khoa học ban đầu của học sinh về vấn đề bài học.</p>

            <div style="border: 2px dashed #0284c7; background-color: #f0f9ff; padding: 10px 14px; margin: 15px 0; border-radius: 6px;">
                <p style="margin: 0; font-weight: bold; color: #0369a1;">👉 [TÍCH HỢP NĂNG LỰC SỐ]: [NLS 2.1] Khai thác dữ liệu số và mô hình trực quan</p>
                <p style="margin: 4px 0 0 0; font-size: 11pt; color: #0f172a;">
                    - Thao tác GV: Chiếu mã QR liên kết học liệu số và mô hình mô phỏng lên màn hình chiếu.<br>
                    - Thao tác HS: Quét mã QR, tra cứu hình thái và cấu trúc đối tượng để hoàn thành nhiệm vụ được giao.
                </p>
            </div>

            <p><strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong></p>
            <p><strong>a) Mục tiêu:</strong> Tiếp thu đầy đủ, làm chủ các kiến thức trọng tâm của bài theo đúng SGK ${book}.</p>
            <p><strong>b) Nội dung:</strong> Đọc tài liệu SGK, khai thác nội dung bài giảng, thảo luận hoàn thành Phiếu học tập số 1.</p>
            <p><strong>c) Sản phẩm:</strong> Nội dung vở ghi bài hoàn chỉnh và chính xác của học sinh.</p>
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
                            <p>- Phân chia nhiệm vụ cụ thể cho các nhóm tìm hiểu từng phần nội dung.</p>
                            <p><strong>Bước 2: Thực hiện nhiệm vụ</strong></p>
                            <p>- HS làm việc cá nhân kết hợp thảo luận nhóm, chắt lọc kiến thức cốt lõi.</p>
                            <p>- GV theo dõi, gợi mở định hướng các nhóm.</p>
                            <p><strong>Bước 3: Báo cáo, thảo luận</strong></p>
                            <p>- Đại diện nhóm báo cáo sản phẩm; Lớp nhận xét, phản biện, bổ sung.</p>
                            <p style="margin-bottom: 0;"><strong>Bước 4: Kết luận, nhận định</strong></p>
                            <p style="margin-bottom: 0;">- GV chốt kiến thức chuẩn mực, hướng dẫn HS hoàn thiện vào vở ghi bài.</p>
                        </td>
                        <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                            <p style="margin-top: 0; font-weight: bold; color: #1e3a8a;">NỘI DUNG BÀI HỌC CỐT LÕI (THEO SGK):</p>
                            <p><strong>I. Khái niệm và bản chất khoa học:</strong> Nắm vững định nghĩa, nguồn gốc và các quy luật cốt lõi theo SGK ${book}.</p>
                            <p><strong>II. Cấu trúc, đặc điểm và cơ chế:</strong> Phân tích chi tiết các thành phần cấu tạo, nguyên lý hoạt động và điều kiện xảy ra hiện tượng.</p>
                            <p><strong>III. Ứng dụng thực tiễn:</strong> Vận dụng kiến thức khoa học vào sản xuất nông nghiệp, bảo vệ sức khỏe và đời sống tại địa phương.</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p><strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong></p>
            <p><strong>a) Mục tiêu:</strong> Củng cố, khắc sâu kiến thức vừa học qua hệ thống bài tập đánh giá năng lực.</p>
            <p><strong>b) Nội dung:</strong> Học sinh thực hiện các câu hỏi trắc nghiệm theo 3 dạng thức.</p>
            <p><strong>c) Sản phẩm:</strong> Đáp án làm bài vào vở của học sinh.</p>
            <p><strong>d) Tổ chức thực hiện:</strong> GV phát đề/chiếu slide, HS làm bài độc lập và đối chiếu kết quả.</p>
            <p><strong>* DỰ KIẾN SẢN PHẨM:</strong></p>
            <p style="margin-left: 20px;">- <strong>Dạng 1 (Trắc nghiệm 4 lựa chọn):</strong> 4 câu hỏi nhận biết định nghĩa, phân loại và đặc điểm cấu trúc.</p>
            <p style="margin-left: 20px;">- <strong>Dạng 2 (Trắc nghiệm Đúng/Sai):</strong> 1 câu bối cảnh thực tiễn gồm 4 ý a, b, c, d xét tính đúng sai.</p>
            <p style="margin-left: 20px;">- <strong>Dạng 3 (Trắc nghiệm trả lời ngắn):</strong> 2 câu hỏi phân tích và điền từ khóa khoa học ngắn gọn.</p>

            <p><strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong></p>
            <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức giải thích hiện tượng hoặc bài toán sản xuất thực tế tại huyện Mang Thít / tỉnh Vĩnh Long.</p>
            <p><strong>b) Nội dung:</strong> Tìm hiểu ứng dụng trong y tế, nông nghiệp sinh thái hoặc đời sống thực tiễn.</p>
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
}

// 4. BỘ ĐIỀU PHỐI CHÍNH
async function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') switchViewMode(type);

    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const rawLessonTitle = getSelectedLesson();
    const docContainer = document.getElementById('container-a4-doc');
    let savedKey = (localStorage.getItem('gemini_api_key') || '').trim();

    let cleanTitle = rawLessonTitle.replace(/^(bài|bài học|chủ đề)\s*[:\-\s]*/gi, '').trim();
    const formattedTitle = `BÀI ${cleanTitle.toUpperCase()}`;

    if (type === 'slide') {
        renderPowerPointSlideDeck(subject, grade, book, rawLessonTitle);
        return;
    }
    if (type !== '5512') return;

    // Nếu không có API Key, nạp ngay bản giáo án chuẩn không cần chờ
    if (!savedKey) {
        if (docContainer) {
            docContainer.innerHTML = getOfflineLessonPlanHtml(subject, grade, book, formattedTitle);
        }
        return;
    }

    // Hiển thị trạng thái tải
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
            <div style="font-size: 36px; color: #0284c7; margin-bottom: 12px;"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3 style="font-size: 16pt; font-weight: bold; color: #0f172a;">Đang tạo kế hoạch bài dạy bằng AI...</h3>
            <p style="color: #64748b; font-size: 11pt;">Đang xử lý: <strong>${formattedTitle}</strong></p>
        </div>
    `;

    // Gọi Gemini AI với danh sách model Flash ổn định
    try {
        const activeModels = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3-flash-preview'];
        let aiHtml = "";

        for (const m of activeModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${savedKey}`;
                const prompt = `Soạn Kế hoạch bài dạy chuẩn CV 5512 cho bài: "${formattedTitle}", môn ${subject} ${grade} (${book}). Bắt buộc: Phần hành chính ghi Giáo viên Hồ Tấn Khải - Trường THPT Mang Thít, Hoạt động 2 trình bày dạng BẢNG 2 CỘT có đầy đủ nội dung để học sinh ghi vở, tích hợp [NLS 2.1] và [${grade}.A1.2]. Chỉ trả về HTML.`;
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
                console.warn(`Lỗi khi gọi model ${m}, chuyển sang model kế tiếp.`);
            }
        }

        docContainer.innerHTML = (aiHtml && aiHtml.length > 500) ? aiHtml : getOfflineLessonPlanHtml(subject, grade, book, formattedTitle);

    } catch (err) {
        // Tự động chuyển về bản chuẩn nếu mạng lỗi
        console.warn("Lỗi mạng AI, kích hoạt chế độ an toàn:", err);
        docContainer.innerHTML = getOfflineLessonPlanHtml(subject, grade, book, formattedTitle);
    }
}

// 5. LẮNG NGHE SỰ KIỆN CLICK BÀI HỌC BÊN TRÁI
document.addEventListener('click', function(e) {
    const clickedItem = e.target.closest('.lesson-item, [onclick*="selectLesson"], [class*="lesson"]');
    if (clickedItem) {
        setTimeout(() => {
            executeActionGenerate('5512');
        }, 80);
    }
});

console.log("BioMaster AI: Đã tải thành công Core Engine ổn định!");
