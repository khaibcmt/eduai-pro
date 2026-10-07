/**
 * BIOMASTER AI / EDUAI PRO - ALL-IN-ONE MASTER ENGINE
 * Tác giả: Thầy Hồ Tấn Khải - Trường THPT Mang Thít
 * Tích hợp: Giáo án CV 5512 + Bài giảng PPT + Ma trận & Đề thi CV 7991
 */

// 1. CƠ SỞ DỮ LIỆU KIẾN THỨC CỐT LÕI TỰ ĐỘNG THEO PHÂN PHỐI CHƯƠNG TRÌNH
const LESSON_DATABASE = {
    "bai_1": {
        title: "BÀI 1: GIỚI THIỆU KHÁI QUÁT MÔN SINH HỌC",
        shortName: "Giới thiệu khái quát môn Sinh học",
        core: [
            {
                heading: "I. Đối tượng, lĩnh vực nghiên cứu và mục tiêu môn Sinh học",
                detail: "- <strong>Đối tượng:</strong> Thế giới sinh vật gồm thực vật, động vật, vi sinh vật, nấm và con người.<br>- <strong>Lĩnh vực:</strong> Di truyền học, Sinh học tế bào, Vi sinh vật học, Sinh thái học và Tiến hóa.<br>- <strong>Mục tiêu:</strong> Hình thành năng lực sinh học, hiểu biết quy luật tự nhiên và ứng dụng vào đời sống."
            },
            {
                heading: "II. Vai trò của Sinh học trong đời sống và phát triển bền vững",
                detail: "- <strong>Kinh tế - xã hội:</strong> Cung cấp lương thực, phát triển nông nghiệp sạch, sản xuất dược phẩm và công nghệ sinh học.<br>- <strong>Bảo vệ môi trường:</strong> Tái tạo tài nguyên, xử lý ô nhiễm sinh học và bảo tồn đa dạng sinh học."
            },
            {
                heading: "III. Sinh học trong tương lai và các ngành nghề liên quan",
                detail: "- <strong>Triển vọng:</strong> Trí tuệ nhân tạo (AI) trong y học, công nghệ chỉnh sửa gen, nhiên liệu sinh học.<br>- <strong>Ngành nghề:</strong> Y học, Dược học, Nông - Lâm - Thủy sản, Công nghệ thực phẩm và Khoa học môi trường."
            }
        ],
        questions: [
            { q: "Đối tượng nghiên cứu của môn Sinh học là gì?", a: "A. Thế giới sinh vật", b: "B. Các hành tinh trong vũ trụ", c: "C. Các phản ứng hóa học vô cơ", d: "D. Cấu trúc của vỏ Trái Đất", ans: "A" },
            { q: "Lĩnh vực nào sau đây nghiên cứu về cơ chế di truyền và biến dị?", a: "A. Sinh thái học", b: "B. Di truyền học", c: "C. Giải phẫu học", d: "D. Vi sinh vật học", ans: "B" }
        ]
    },
    "bai_2": {
        title: "BÀI 2: CÁC PHƯƠNG PHÁP NGHIÊN CỨU VÀ HỌC TẬP MÔN SINH HỌC",
        shortName: "Các phương pháp nghiên cứu và học tập môn Sinh học",
        core: [
            {
                heading: "I. Các phương pháp nghiên cứu Sinh học",
                detail: "- <strong>Phương pháp quan sát:</strong> Sử dụng giác quan và kính hiển vi, kính lúp để thu thập dữ liệu.<br>- <strong>Phương pháp làm việc trong phòng thí nghiệm:</strong> Tuân thủ an toàn, thao tác hóa chất, mẫu vật vi sinh.<br>- <strong>Phương pháp thực nghiệm khoa học:</strong> Bố trí lô đối chứng và lô thực nghiệm để kiểm chứng giả thuyết."
            },
            {
                heading: "II. Các kĩ năng trong tiến trình nghiên cứu khoa học",
                detail: "- <strong>Các bước:</strong> Quan sát $\\rightarrow$ Đặt câu hỏi $\\rightarrow$ Hình thành giả thuyết $\\rightarrow$ Thiết kế thí nghiệm $\\rightarrow$ Thu thập, phân tích dữ liệu $\\rightarrow$ Kết luận."
            },
            {
                heading: "III. Ứng dụng công nghệ và trí tuệ nhân tạo (AI)",
                detail: "- Sử dụng phần mềm thống kê, ngân hàng dữ liệu gen (NCBI), mô phỏng 3D tế bào và khai thác trợ lý số để xử lý thông tin học tập."
            }
        ],
        questions: [
            { q: "Phương pháp nào dùng để kiểm chứng một giả thuyết khoa học?", a: "A. Phương pháp thực nghiệm", b: "B. Phương pháp đọc sách", c: "C. Phương pháp điều tra xã hội", d: "D. Phương pháp ghi âm", ans: "A" },
            { q: "Bước đầu tiên trong tiến trình nghiên cứu khoa học là gì?", a: "A. Quan sát và đặt câu hỏi", b: "B. Viết báo cáo", c: "C. Làm thí nghiệm", d: "D. Thảo luận nhóm", ans: "A" }
        ]
    },
    "bai_4": {
        title: "BÀI 4: KHÁI QUÁT VỀ TẾ BÀO",
        shortName: "Khái quát về tế bào",
        core: [
            {
                heading: "I. Học thuyết tế bào (Cell Theory)",
                detail: "- Tất cả các sinh vật đều được cấu tạo từ một hoặc nhiều tế bào.<br>- Tế bào là đơn vị cấu trúc và chức năng cơ bản của mọi cơ thể sống.<br>- Mọi tế bào đều sinh ra từ tế bào có trước nhờ quá trình phân chia."
            },
            {
                heading: "II. Kích thước và hình dạng tế bào",
                detail: "- Tế bào có kích thước hiển vi (từ 1 đến 100 $\\mu m$). Tỉ lệ diện tích bề mặt trên thể tích ($S/V$) lớn giúp trao đổi chất nhanh chóng."
            },
            {
                heading: "III. Cấu trúc khái quát của tế bào",
                detail: "- Gồm 3 thành phần chính: Màng sinh chất, Tế bào chất (chứa bào quan) và Nhân (hoặc vùng nhân chứa DNA)."
            }
        ],
        questions: [
            { q: "Đơn vị cơ bản cấu tạo nên mọi cơ thể sống là gì?", a: "A. Tế bào", b: "B. Mô", c: "C. Cơ quan", d: "D. Phân tử", ans: "A" },
            { q: "Thành phần nào điều khiển mọi hoạt động sống của tế bào?", a: "A. Nhân tế bào", b: "B. Màng sinh chất", c: "C. Không bào", d: "D. Lưới nội chất", ans: "A" }
        ]
    },
    "bai_24": {
        title: "BÀI 24: KHÁI QUÁT VỀ VIRUS",
        shortName: "Khái quát về virus",
        core: [
            {
                heading: "I. Khái niệm và đặc điểm chung của virus",
                detail: "- Virus là thực thể chưa có cấu tạo tế bào, kích thước siêu hiển vi (20 – 300 nm).<br>- Kí sinh nội bào bắt buộc: Chỉ nhân lên được khi ở trong tế bào vật chủ sống."
            },
            {
                heading: "II. Cấu tạo của virus",
                detail: "- <strong>Lõi axit nucleic:</strong> Chứa DNA hoặc RNA (đơn hoặc kép).<br>- <strong>Vỏ protein (capsid):</strong> Cấu tạo từ các đơn vị capsomer bảo vệ hệ gen.<br>- Một số virus có thêm <strong>vỏ ngoài</strong> cấu tạo từ lớp photpholipit kép và gai glicoprotein."
            },
            {
                heading: "III. Phân loại và ứng dụng thực tiễn",
                detail: "- <strong>Phân loại:</strong> Dựa vào axit nucleic (virus DNA, virus RNA) hoặc vật chủ (ở người, động vật, thực vật, thực khuẩn thể).<br>- <strong>Ứng dụng:</strong> Sản xuất chế phẩm sinh học, chuyển gen và điều chế vaccine tại Vĩnh Long."
            }
        ],
        questions: [
            { q: "Thành phần bắt buộc cấu tạo nên mọi hạt virus gồm:", a: "A. Lõi axit nucleic và vỏ capsid", b: "B. Màng sinh chất và nhân", c: "C. Vỏ capsid và vỏ ngoài", d: "D. Ribosome và ti thể", ans: "A" },
            { q: "Virus thể hiện đặc tính của sinh vật sống khi nào?", a: "A. Khi ở trong tế bào chủ", b: "B. Khi ở ngoài môi trường", c: "C. Khi ở trong dung dịch muối", d: "D. Khi bị đông khô", ans: "A" }
        ]
    }
};

// 2. BỘ ĐIỀU KHIỂN BẮT TÊN BÀI HỌC THÔNG MINH
function getActiveLessonKey() {
    let text = "";
    if (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) {
        text = currentSelectedLesson;
    } else {
        const activeItem = document.querySelector('.lesson-item.active, [class*="active"], input[type="checkbox"]:checked');
        if (activeItem) {
            text = activeItem.closest('li, div')?.innerText || activeItem.innerText || "";
        }
    }
    
    text = text.toLowerCase();
    if (text.includes("bài 1:") || text.includes("bài 1 ") || text.includes("giới thiệu")) return "bai_1";
    if (text.includes("bài 2:") || text.includes("bài 2 ") || text.includes("phương pháp")) return "bai_2";
    if (text.includes("bài 4:") || text.includes("bài 4 ") || text.includes("tế bào")) return "bai_4";
    if (text.includes("bài 24") || text.includes("virus")) return "bai_24";

    // Mặc định nạp dữ liệu chung theo tên bài được click
    return "bai_dynamic";
}

function getLessonData() {
    const key = getActiveLessonKey();
    if (LESSON_DATABASE[key]) return LESSON_DATABASE[key];

    // Tạo dữ liệu tự động nếu chọn các bài khác
    let title = (typeof currentSelectedLesson !== 'undefined' && currentSelectedLesson) ? currentSelectedLesson : "Bài học Sinh học 10";
    let clean = title.replace(/^(bài|bài học)\s*[:\-\s]*/gi, '').trim();
    return {
        title: `BÀI: ${clean.toUpperCase()}`,
        shortName: clean,
        core: [
            {
                heading: "I. Khái niệm và mục tiêu cốt lõi của bài học",
                detail: `- Nắm vững định nghĩa, nguồn gốc và bản chất của ${clean} theo SGK Kết Nối Tri Thức.<br>- Phân tích các mối liên hệ giữa cấu trúc và chức năng sinh học.<br>- Khai thác tranh ảnh, sơ đồ để chắt lọc kiến thức cốt lõi.`
            },
            {
                heading: "II. Cấu tạo, quy trình và cơ chế sinh học",
                detail: `- Phân tích cơ chế hoạt động, chuyển hóa năng lượng hoặc tiến trình tương tác sinh học.<br>- Vận dụng quy luật khoa học để so sánh, đối chiếu và rút ra nhận định chuyên môn.<br>- Học sinh làm việc nhóm và hoàn thành phiếu học tập số 1.`
            },
            {
                heading: "III. Ý nghĩa sinh học và ứng dụng thực tiễn",
                detail: `- Ứng dụng trong nông nghiệp công nghệ cao, y tế và đời sống tại huyện Mang Thít, tỉnh Vĩnh Long.<br>- Đề xuất giải pháp bảo vệ sinh thái và chăm sóc sức khỏe cộng đồng.`
            }
        ],
        questions: [
            { q: `Đặc điểm cốt lõi của nội dung ${clean} là gì?`, a: "A. Tuân theo quy luật thích nghi sinh học", b: "B. Không chịu ảnh hưởng môi trường", c: "C. Luôn cố định không biến đổi", d: "D. Không có cấu trúc tế bào", ans: "A" },
            { q: "Ý nghĩa thực tiễn nổi bật nhất của bài học là:", a: "A. Ứng dụng vào sản xuất và đời sống", b: "B. Phục vụ lý thuyết trừu tượng", c: "C. Thay thế các ngành khoa học khác", d: "D. Không có giá trị ứng dụng", ans: "A" }
        ]
    };
}

// 3. TẠO KẾ HOẠCH BÀI DẠY (CV 5512 + NLS 2.1 + AI)
function renderLessonPlan5512() {
    const data = getLessonData();
    const doc = document.getElementById('container-a4-doc');
    if (!doc) return;

    doc.innerHTML = `
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
                <h3 style="font-size: 14pt; font-weight: bold; margin: 5px 0; color: #1e3a8a;">${data.title}</h3>
                <p style="margin: 3px 0;">Họ và tên giáo viên: <strong>Hồ Tấn Khải</strong></p>
                <p style="margin: 3px 0;">Môn học: Sinh học — Lớp: 10 | Sách: Kết Nối Tri Thức Với Cuộc Sống</p>
            </div>

            <p><strong>I. MỤC TIÊU</strong></p>
            <p><strong>1. Về kiến thức:</strong> Nắm vững định nghĩa, cấu tạo, cơ chế và ý nghĩa thực tiễn của ${data.shortName}.</p>
            <p><strong>2. Về năng lực:</strong></p>
            <p style="margin-left: 20px;">- <em>Năng lực chung:</em> Tự chủ và tự học; giao tiếp và hợp tác nhóm; giải quyết vấn đề sáng tạo.</p>
            <p style="margin-left: 20px;">- <em>Năng lực đặc thù:</em> Nhận thức sinh học; tìm hiểu thế giới sống; vận dụng kiến thức, kĩ năng đã học.</p>
            <p style="margin-left: 20px;">- <em>Tích hợp Năng lực số (NLS 2.1):</em> Khai thác học liệu số, mô hình 3D trực quan, tra cứu dữ liệu khoa học qua Internet.</p>
            <p style="margin-left: 20px;">- <em>Tích hợp Năng lực AI [10.A1.2]:</em> Sử dụng trợ lí AI tìm kiếm tư liệu; biết đối chiếu, kiểm chứng với SGK trước khi kết luận.</p>
            <p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực, tinh thần trách nhiệm trong học tập.</p>

            <p><strong>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</strong></p>
            <p>- <strong>Giáo viên:</strong> Kế hoạch bài dạy, bài giảng slide điện tử, SGK, mã QR học liệu số, phiếu học tập số 1.</p>
            <p>- <strong>Học sinh:</strong> SGK, vở ghi, thiết bị có kết nối Internet để quét mã tra cứu học liệu số.</p>

            <p><strong>III. TIẾN TRÌNH DẠY HỌC</strong></p>
            <p><strong>HOẠT ĐỘNG 1: MỞ ĐẦU (XÁC ĐỊNH VẤN ĐỀ)</strong></p>
            <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú, phát hiện mâu thuẫn nhận thức để tiếp cận bài học.</p>
            <p><strong>b) Tổ chức thực hiện:</strong> GV trình chiếu câu hỏi tình huống thực tế; HS trao đổi cặp đôi và đưa ra dự đoán ban đầu.</p>

            <div style="border: 2px dashed #0284c7; background-color: #f0f9ff; padding: 10px 14px; margin: 15px 0; border-radius: 6px;">
                <p style="margin: 0; font-weight: bold; color: #0369a1;">👉 [TÍCH HỢP NĂNG LỰC SỐ]: [NLS 2.1] Khai thác dữ liệu số và mô hình trực quan</p>
                <p style="margin: 4px 0 0 0; font-size: 11pt; color: #0f172a;">
                    - Thao tác GV: Chiếu mã QR học liệu số và hình ảnh minh họa chất lượng cao lên màn hình tivi/máy chiếu.<br>
                    - Thao tác HS: Quét mã QR bằng thiết bị thông minh, phân tích sơ đồ để hoàn thành nhiệm vụ khởi động.
                </p>
            </div>

            <p><strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong></p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;" border="1">
                <thead>
                    <tr style="background-color: #f1f5f9;">
                        <th style="width: 46%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">HOẠT ĐỘNG CỦA GV VÀ HS</th>
                        <th style="width: 54%; padding: 8px; border: 1px solid #000; text-align: center; font-weight: bold;">DỰ KIẾN SẢN PHẨM (VỞ GHI CỦA HỌC SINH)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                            <p style="margin-top: 0;"><strong>Bước 1: Chuyển giao nhiệm vụ</strong><br>GV yêu cầu HS nghiên cứu tài liệu SGK, quan sát sơ đồ và hoàn thành Phiếu học tập số 1.</p>
                            <p><strong>Bước 2: Thực hiện nhiệm vụ</strong><br>HS làm việc cá nhân kết hợp thảo luận nhóm; GV quan sát, định hướng gợi mở.</p>
                            <p><strong>Bước 3: Báo cáo, thảo luận</strong><br>Đại diện nhóm báo cáo kết quả; các nhóm khác phản biện, đóng góp ý kiến.</p>
                            <p style="margin-bottom: 0;"><strong>Bước 4: Kết luận, nhận định</strong><br>GV chuẩn hóa kiến thức khoa học, hướng dẫn HS ghi chép nội dung cốt lõi vào vở.</p>
                        </td>
                        <td style="padding: 10px; border: 1px solid #000; vertical-align: top;">
                            <p style="margin-top: 0; font-weight: bold; color: #1e3a8a;">NỘI DUNG BÀI HỌC CỐT LÕI (THEO SGK):</p>
                            ${data.core.map(c => `
                                <p style="font-weight: bold; margin-bottom: 2px;">${c.heading}</p>
                                <div style="margin-left: 10px; margin-bottom: 8px;">${c.detail}</div>
                            `).join('')}
                        </td>
                    </tr>
                </tbody>
            </table>

            <p><strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong></p>
            <p>GV trình chiếu các câu hỏi trắc nghiệm khách quan; HS độc lập suy nghĩ và chọn đáp án đúng để củng cố kiến thức vừa học.</p>

            <p><strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong></p>
            <p>Liên hệ giải thích các hiện tượng thực tiễn trong nông nghiệp, phòng ngừa dịch bệnh và bảo vệ môi trường tại huyện Mang Thít, tỉnh Vĩnh Long.</p>
        </div>
    `;
}

// 4. TẠO SLIDE POWERPOINT (NỘI DUNG CỐT LÕI + 16 SLIDE LUYỆN TẬP)
function renderSlideDeckPPT() {
    const data = getLessonData();
    const doc = document.getElementById('container-a4-doc');
    if (!doc) return;

    let slidesHtml = `
        <!-- SLIDE 1: TRANG TIÊU ĐỀ -->
        <div class="ppt-slide" style="width: 100%; min-height: 480px; background: linear-gradient(135deg, #0284c7, #1e3a8a); color: white; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
            <h4 style="font-size: 18pt; text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #bae6fd;">BÀI GIẢNG ĐIỆN TỬ GDPT 2018</h4>
            <h1 style="font-size: 32pt; font-weight: bold; margin: 15px 0; line-height: 1.25;">${data.title}</h1>
            <p style="font-size: 16pt; margin: 5px 0;">Môn: Sinh học 10 — Bộ sách: Kết Nối Tri Thức Với Cuộc Sống</p>
            <p style="font-size: 13pt; margin-top: 15px; color: #e2e8f0; font-style: italic;">Giáo viên thực hiện: Hồ Tấn Khải — Trường THPT Mang Thít</p>
        </div>
    `;

    // CÁC SLIDE BÀI HỌC (FONT TO >= 32PT CHO TIÊU ĐỀ, >= 18PT CHO NỘI DUNG)
    data.core.forEach((c, idx) => {
        slidesHtml += `
            <div class="ppt-slide" style="width: 100%; min-height: 480px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 10px solid #0284c7; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                    <h2 style="font-size: 24pt; color: #0369a1; margin: 0; font-weight: bold;">${c.heading}</h2>
                    <span style="background: #e0f2fe; color: #0284c7; padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 12pt;">Nội dung ${idx + 1}</span>
                </div>
                <div style="font-size: 18pt; line-height: 1.8; color: #1e293b;">
                    ${c.detail}
                </div>
            </div>
        `;
    });

    // PHÂN ĐOẠN LUYỆN TẬP
    slidesHtml += `
        <div class="ppt-slide" style="width: 100%; min-height: 250px; background: linear-gradient(135deg, #059669, #10b981); color: white; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <h2 style="font-size: 28pt; font-weight: bold; margin: 0;">HOẠT ĐỘNG: LUYỆN TẬP & CỦNG CỐ</h2>
            <p style="font-size: 16pt; margin-top: 10px; color: #d1fae5;">Hệ thống 16 Slide câu hỏi trắc nghiệm tương tác chuẩn</p>
        </div>
    `;

    // 16 SLIDE CÂU HỎI LUYỆN TẬP
    for (let i = 1; i <= 16; i++) {
        const qData = data.questions[(i - 1) % data.questions.length];
        slidesHtml += `
            <div class="ppt-slide" style="width: 100%; min-height: 480px; background: #ffffff; border: 2px solid #cbd5e1; border-top: 10px solid #10b981; border-radius: 12px; padding: 40px; margin-bottom: 25px; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
                    <h3 style="font-size: 20pt; color: #065f46; margin: 0; font-weight: bold;">CÂU HỎI LUYỆN TẬP ${i}/16</h3>
                    <span style="background: #ecfdf5; color: #059669; padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 12pt;">Trắc nghiệm tương tác</span>
                </div>
                <div style="font-size: 18pt; line-height: 1.6; color: #1e293b; margin-bottom: 25px;">
                    <p style="font-weight: bold;">Câu ${i}: ${qData.q}</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 15pt;">
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: ${qData.ans === 'A' ? '#ecfdf5; border-color: #10b981;' : '#f8fafc;'}"><strong>${qData.a}</strong></div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: ${qData.ans === 'B' ? '#ecfdf5; border-color: #10b981;' : '#f8fafc;'}"><strong>${qData.b}</strong></div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: ${qData.ans === 'C' ? '#ecfdf5; border-color: #10b981;' : '#f8fafc;'}"><strong>${qData.c}</strong></div>
                    <div style="padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: ${qData.ans === 'D' ? '#ecfdf5; border-color: #10b981;' : '#f8fafc;'}"><strong>${qData.d}</strong></div>
                </div>
            </div>
        `;
    }

    doc.innerHTML = `
        <div style="max-width: 950px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #f8fafc; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0; color: #0f172a; font-size: 15pt;">Slide Trình Chiếu: ${data.shortName} (${data.core.length + 17} Slides)</h3>
                <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;"><i class="fa-solid fa-print"></i> In / Xuất PDF Slide</button>
            </div>
            ${slidesHtml}
        </div>
    `;
}

// 5. TẠO MA TRẬN ĐỀ THI & ĐẶC TẢ ĐỀ KIỂM TRA (CHUẨN CV 7991)
function renderMatrixAndExam7991() {
    const data = getLessonData();
    const doc = document.getElementById('container-a4-doc');
    if (!doc) return;

    doc.innerHTML = `
        <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: none;">
                <tr>
                    <td style="width: 45%; text-align: center; vertical-align: top; border: none;">
                        <strong>TRƯỜNG THPT MANG THÍT</strong><br>
                        <strong>TỔ: KHOA HỌC TỰ NHIÊN</strong>
                    </td>
                    <td style="width: 55%; text-align: center; vertical-align: top; border: none;">
                        <strong>MA TRẬN & ĐẶC TẢ ĐỀ KIỂM TRA ĐÁNH GIÁ</strong><br>
                        <strong>MÔN: SINH HỌC 10 (THEO CÔNG VĂN 7991)</strong>
                    </td>
                </tr>
            </table>

            <!-- BẢNG CẤU HÌNH TỰ CHỌN SỐ CÂU THEO BÀI VÀ MỨC ĐỘ -->
            <div style="background: #f8fafc; border: 2px solid #0284c7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <h3 style="color: #0369a1; margin-top: 0; font-size: 13pt;">⚙️ KHUNG CẤU HÌNH SỐ CÂU HỎI MA TRẬN CHO TỪNG PHẦN:</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 11pt;">
                    <div><label>Biết (Nhiều lựa chọn):</label><input type="number" id="cfg-biet" value="8" style="width: 100%; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px;"></div>
                    <div><label>Hiểu (Nhiều lựa chọn):</label><input type="number" id="cfg-hieu" value="6" style="width: 100%; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px;"></div>
                    <div><label>Vận dụng (Đúng/Sai):</label><input type="number" id="cfg-vd" value="2" style="width: 100%; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px;"></div>
                    <div><label>Vận dụng cao (Trả lời ngắn):</label><input type="number" id="cfg-vdc" value="2" style="width: 100%; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px;"></div>
                </div>
            </div>

            <!-- BẢNG MA TRẬN 7991 -->
            <p style="text-align: center; font-weight: bold; font-size: 14pt;">BẢNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;" border="1">
                <thead>
                    <tr style="background: #f1f5f9; text-align: center; font-weight: bold;">
                        <th rowspan="2" style="padding: 6px;">TT</th>
                        <th rowspan="2" style="padding: 6px;">Chủ đề / Bài học</th>
                        <th colspan="4" style="padding: 6px;">Mức độ nhận thức</th>
                        <th rowspan="2" style="padding: 6px;">Tổng số câu</th>
                        <th rowspan="2" style="padding: 6px;">Tỉ lệ %</th>
                    </tr>
                    <tr style="background: #f8fafc; text-align: center;">
                        <th style="padding: 4px;">Nhận biết</th>
                        <th style="padding: 4px;">Thông hiểu</th>
                        <th style="padding: 4px;">Vận dụng</th>
                        <th style="padding: 4px;">Vận dụng cao</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center; padding: 6px;">1</td>
                        <td style="padding: 6px;"><strong>${data.title}</strong></td>
                        <td style="text-align: center; padding: 6px;">8 câu (TN 4 LC)</td>
                        <td style="text-align: center; padding: 6px;">6 câu (TN 4 LC)</td>
                        <td style="text-align: center; padding: 6px;">2 câu (Đúng/Sai)</td>
                        <td style="text-align: center; padding: 6px;">2 câu (Ngắn)</td>
                        <td style="text-align: center; padding: 6px; font-weight: bold;">18 câu</td>
                        <td style="text-align: center; padding: 6px; font-weight: bold;">100%</td>
                    </tr>
                    <tr style="background: #f1f5f9; font-weight: bold; text-align: center;">
                        <td colspan="2" style="padding: 6px;">Tổng điểm quy đổi</td>
                        <td style="padding: 6px;">4,0 điểm</td>
                        <td style="padding: 6px;">3,0 điểm</td>
                        <td style="padding: 6px;">2,0 điểm</td>
                        <td style="padding: 6px;">1,0 điểm</td>
                        <td style="padding: 6px;">18 câu</td>
                        <td style="padding: 6px;">10,0 điểm</td>
                    </tr>
                </tbody>
            </table>

            <!-- ĐỀ THI MINH HỌA XUẤT RA -->
            <p style="text-align: center; font-weight: bold; font-size: 14pt; margin-top: 30px;">ĐỀ KIỂM TRA ĐÁNH GIÁ NĂNG LỰC (MINH HỌA)</p>
            <p><strong>PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (4,0 ĐIỂM)</strong></p>
            <p style="margin-left: 15px;"><strong>Câu 1:</strong> ${data.questions[0].q}<br>
            A. ${data.questions[0].a} &nbsp;&nbsp;&nbsp;&nbsp; B. ${data.questions[0].b}<br>
            C. ${data.questions[0].c} &nbsp;&nbsp;&nbsp;&nbsp; D. ${data.questions[0].d}</p>

            <p style="margin-left: 15px;"><strong>Câu 2:</strong> ${data.questions[1].q}<br>
            A. ${data.questions[1].a} &nbsp;&nbsp;&nbsp;&nbsp; B. ${data.questions[1].b}<br>
            C. ${data.questions[1].c} &nbsp;&nbsp;&nbsp;&nbsp; D. ${data.questions[1].d}</p>

            <p><strong>PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (2,0 ĐIỂM)</strong></p>
            <p style="margin-left: 15px;"><strong>Câu 1:</strong> Xét các nhận định sau đây về nội dung ${data.shortName}:<br>
            a) Nội dung phản ánh đúng bản chất khoa học thực nghiệm. [ĐÚNG]<br>
            b) Không có khả năng ứng dụng vào nông nghiệp địa phương. [SAI]<br>
            c) Cần phối hợp quan sát và thực nghiệm để làm sáng tỏ cơ chế. [ĐÚNG]<br>
            d) Là đối tượng không chịu sự chi phối của quy luật sinh học. [SAI]</p>

            <p><strong>PHẦN III: CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (1,0 ĐIỂM)</strong></p>
            <p style="margin-left: 15px;"><strong>Câu 1:</strong> Hãy nêu ngắn gọn vai trò quan trọng nhất của ${data.shortName} đối với sản xuất nông nghiệp tại tỉnh Vĩnh Long?</p>
        </div>
    `;
}

// 6. BỘ ĐIỀU PHỐI TOÀN HỆ THỐNG
function executeActionGenerate(type) {
    if (typeof switchViewMode === 'function') {
        try { switchViewMode(type); } catch(e){}
    }

    if (type === '5512') {
        renderLessonPlan5512();
    } else if (type === 'slide') {
        renderSlideDeckPPT();
    } else if (type === '7991') {
        renderMatrixAndExam7991();
    }
}

// 7. LẮNG NGHE SỰ KIỆN CLICK CHỌN BÀI HỌC BÊN TRÁI
document.addEventListener('click', function(e) {
    const item = e.target.closest('.lesson-item, [onclick*="selectLesson"], [class*="lesson"], li, tr');
    if (item && (item.innerText.toLowerCase().includes("bài ") || item.querySelector('input[type="checkbox"]'))) {
        const clone = item.cloneNode(true);
        clone.querySelectorAll('input, button, i').forEach(el => el.remove());
        const txt = clone.innerText.trim();
        if (txt.toLowerCase().includes("bài")) {
            window.currentSelectedLesson = txt;
            console.log("[BioMaster]: Đã chuyển sang bài:", window.currentSelectedLesson);
            setTimeout(() => {
                renderLessonPlan5512();
            }, 50);
        }
    }
}, true);

console.log("BioMaster AI Master Engine: Đã khởi chạy thành công 100%!");
