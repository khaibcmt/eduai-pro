/**
 * ==============================================================================
 * BIOMASTER AI - MODULE CẬP NHẬT TÍNH NĂNG ĐỘC LẬP
 * GV: Hồ Tấn Khải - THPT Mang Thít
 * Cập nhật: Thêm Tự luận (3 mức độ) & Bổ sung cột Biết cho Trả lời ngắn
 * ==============================================================================
 */

// 1. CẬP NHẬT DANH SÁCH MÔ HÌNH HỢP LỆ THEO CHỈ DẪN CỦA GOOGLE
window.FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash"
];

// 2. KHAI BÁO MA TRẬN TỔNG ĐỦ 4 PHẦN (CÓ TỰ LUẬN & ĐỦ CỘT BIẾT)
window.matrixGlobalTotals = {
    p1_b: 6,
    p1_h: 4,
    p1_vd: 2,
    p2_b: 4,  // Số ý Biết (Đúng/Sai)
    p2_h: 4,  // Số ý Hiểu (Đúng/Sai)
    p2_vd: 2, // Số ý Vận dụng (Đúng/Sai)
    p3_b: 2,  // MỚI: Biết (Trả lời ngắn)
    p3_h: 2,  // Hiểu (Trả lời ngắn)
    p3_vd: 2, // Vận dụng (Trả lời ngắn)
    p4_b: 1,  // MỚI: Biết (Tự luận)
    p4_h: 1,  // MỚI: Hiểu (Tự luận)
    p4_vd: 1  // MỚI: Vận dụng (Tự luận)
};

// Ghi đè hàm phân bổ số câu/số ý tự động về từng bài học
window.distributeMatrixFromTotals = function() {
    const lessons = (selectedLessonsForExam && selectedLessonsForExam.length > 0) 
        ? selectedLessonsForExam 
        : [currentSelectedLesson];
    const numLessons = lessons.length;

    window.examMatrixCustomCounts = {};
    lessons.forEach(les => {
        window.examMatrixCustomCounts[les] = { 
            p1_b: 0, p1_h: 0, p1_vd: 0, 
            p2_b: 0, p2_h: 0, p2_vd: 0, 
            p3_b: 0, p3_h: 0, p3_vd: 0,
            p4_b: 0, p4_h: 0, p4_vd: 0 
        };
    });

    const fields = [
        'p1_b', 'p1_h', 'p1_vd', 
        'p2_b', 'p2_h', 'p2_vd', 
        'p3_b', 'p3_h', 'p3_vd',
        'p4_b', 'p4_h', 'p4_vd'
    ];

    fields.forEach(f => {
        const total = parseInt(window.matrixGlobalTotals[f]) || 0;
        const base = Math.floor(total / numLessons);
        let remainder = total % numLessons;

        lessons.forEach((les, idx) => {
            window.examMatrixCustomCounts[les][f] = base + (idx < remainder ? 1 : 0);
        });
    });
};

// Ghi đè giao diện bảng Ma trận & Đề kiểm tra mẫu
window.renderMaTranDeKiemTra = function(subject, grade, book) {
    const docContainer = document.getElementById('container-a4-doc');
    const lessons = (selectedLessonsForExam && selectedLessonsForExam.length > 0) 
        ? selectedLessonsForExam 
        : [currentSelectedLesson];

    const countP1 = (parseInt(matrixGlobalTotals.p1_b)||0) + (parseInt(matrixGlobalTotals.p1_h)||0) + (parseInt(matrixGlobalTotals.p1_vd)||0);
    const countP2 = (parseInt(matrixGlobalTotals.p2_b)||0) + (parseInt(matrixGlobalTotals.p2_h)||0) + (parseInt(matrixGlobalTotals.p2_vd)||0);
    const countP3 = (parseInt(matrixGlobalTotals.p3_b)||0) + (parseInt(matrixGlobalTotals.p3_h)||0) + (parseInt(matrixGlobalTotals.p3_vd)||0);
    const countP4 = (parseInt(matrixGlobalTotals.p4_b)||0) + (parseInt(matrixGlobalTotals.p4_h)||0) + (parseInt(matrixGlobalTotals.p4_vd)||0);

    // 1. Dựng câu hỏi Phần I
    let p1Html = "";
    let p1Index = 1;
    lessons.forEach(les => {
        const num = (parseInt(examMatrixCustomCounts[les]?.p1_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p1_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p1_vd)||0);
        for (let k = 1; k <= num; k++) {
            p1Html += `
                <p style="margin: 3px 0;"><strong>Câu ${p1Index}:</strong> [${les}] Đặc điểm cốt lõi nào sau đây phản ánh chính xác nhất bản chất khoa học của bài học?</p>
                <p style="margin: 1px 0 1px 20px;">A. Không tuân thủ các quy luật tự nhiên &nbsp;&nbsp;&nbsp;&nbsp; <u><strong>B</strong></u>. Luôn bảo đảm tính toàn vẹn và thích nghi sinh thái</p>
                <p style="margin: 1px 0 3px 20px;">C. Diễn ra hoàn toàn ngẫu nhiên &nbsp;&nbsp;&nbsp;&nbsp; D. Hoàn toàn độc lập với môi trường</p>
            `;
            p1Index++;
        }
    });

    // 2. Dựng câu hỏi Phần II (Đúng/Sai)
    let p2Html = "";
    let p2Index = 1;
    lessons.forEach(les => {
        const numY = (parseInt(examMatrixCustomCounts[les]?.p2_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p2_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p2_vd)||0);
        const soCau = Math.max(1, Math.ceil(numY / 4));
        for (let k = 1; k <= soCau; k++) {
            p2Html += `
                <p style="margin: 4px 0;"><strong>Câu ${p2Index}:</strong> [${les}] Trong một nghiên cứu khoa học thực nghiệm về điều kiện phát triển nông nghiệp:</p>
                <p style="margin: 1px 0 1px 20px;"><u><strong>a)</strong></u> [Biết] Nhiệt độ và độ ẩm tối ưu giúp quá trình chuyển hóa đạt hiệu suất cao nhất.</p>
                <p style="margin: 1px 0 1px 20px;"><strong>b)</strong> [Hiểu] Mọi tác nhân gây hại đều làm tăng tốc độ sinh trưởng của cá thể sinh vật.</p>
                <p style="margin: 1px 0 1px 20px;"><u><strong>c)</strong></u> [Vận dụng] Nắm vững quy luật giúp nông dân chủ động phòng ngừa dịch bệnh nâng cao năng suất.</p>
                <p style="margin: 1px 0 3px 20px;"><strong>d)</strong> [Hiểu] Các biến đổi nội tại diễn ra hoàn toàn tự phát mà không cần năng lượng trao đổi.</p>
            `;
            p2Index++;
        }
    });

    // 3. Dựng câu hỏi Phần III (Trả lời ngắn có Biết - Hiểu - VD)
    let p3Html = "";
    let p3Index = 1;
    lessons.forEach(les => {
        const num = (parseInt(examMatrixCustomCounts[les]?.p3_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p3_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p3_vd)||0);
        for (let k = 1; k <= num; k++) {
            p3Html += `
                <p style="margin: 3px 0;"><strong>Câu ${p3Index}:</strong> [${les}] Một cấu trúc sinh học ban đầu trải qua ${p3Index + 1} đợt phân bào liên tiếp sẽ tạo ra bao nhiêu cấu trúc con?</p>
                <p style="margin: 1px 0 6px 20px; font-weight: bold; color: #0284c7;">Đáp án là: <u>${Math.pow(2, p3Index + 1)}</u></p>
            `;
            p3Index++;
        }
    });

    // 4. Dựng câu hỏi Phần IV (Tự luận)
    let p4Html = "";
    let p4Index = 1;
    lessons.forEach(les => {
        const num = (parseInt(examMatrixCustomCounts[les]?.p4_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p4_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p4_vd)||0);
        for (let k = 1; k <= num; k++) {
            p4Html += `
                <p style="margin: 5px 0;"><strong>Câu ${p4Index} (Tự luận):</strong> [${les}]</p>
                <p style="margin: 2px 0 2px 15px;">a) Trình bày bản chất cơ chế sinh học cốt lõi của nội dung bài học.</p>
                <p style="margin: 2px 0 6px 15px;">b) Từ kiến thức đã học, hãy đề xuất 02 giải pháp kỹ thuật ứng dụng thực tiễn vào sản xuất nông nghiệp hoặc bảo vệ sức khỏe tại địa phương huyện Mang Thít, tỉnh Vĩnh Long.</p>
            `;
            p4Index++;
        }
    });

    docContainer.innerHTML = `
        <table style="width: 100%; border: none; margin-bottom: 12px;">
            <tr style="border: none;">
                <td style="border: none; width: 45%; text-align: center; vertical-align: top; padding: 0;">
                    <p style="margin: 0; font-size: 11pt;">SỞ GD&ĐT VĨNH LONG</p>
                    <p style="margin: 0; font-weight: bold; font-size: 11pt;">${schoolName.toUpperCase()}</p>
                    <div style="width: 80px; height: 1px; background: #000; margin: 3px auto 0 auto;"></div>
                </td>
                <td style="border: none; width: 55%; text-align: center; vertical-align: top; padding: 0;">
                    <p style="margin: 0; font-weight: bold; font-size: 11pt;">HỒ SƠ KHẢO THÍ VÀ ĐÁNH GIÁ NĂNG LỰC</p>
                    <p style="margin: 0; font-style: italic; font-size: 11pt;">Theo Quyết định số 7991/BGDĐT</p>
                    <div style="width: 120px; height: 1px; background: #000; margin: 3px auto 0 auto;"></div>
                </td>
            </tr>
        </table>

        <div style="text-align: center; margin: 12px 0;">
            <h2 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase;">MA TRẬN, BẢN ĐẶC TẢ VÀ ĐỀ KIỂM TRA ĐỊNH KỲ</h2>
            <p style="margin: 2px 0 0 0; font-style: italic; font-size: 12pt;">Môn học: ${subject} ${grade} • Thời gian làm bài: 45 phút</p>
        </div>

        <p style="font-weight: bold; margin: 12px 0 4px 0;">MỤC 1: KHUNG MA TRẬN ĐỀ KIỂM TRA (CHỈNH SỐ CÂU/Ý TRỰC TIẾP)</p>
        <table>
            <thead>
                <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                    <th rowspan="2" style="width: 25px;">TT</th>
                    <th rowspan="2" style="width: 140px;">Chủ đề / Bài học</th>
                    <th colspan="3">Phần I (Nhiều lựa chọn)</th>
                    <th colspan="3" style="color: #15803d;">Phần II (Đúng/Sai - Số Ý)</th>
                    <th colspan="3" style="color: #0284c7;">Phần III (Trả lời ngắn)</th>
                    <th colspan="3" style="color: #b91c1c;">Phần IV (Tự luận)</th>
                    <th rowspan="2">Tổng cộng</th>
                </tr>
                <tr style="background: #F0F4F8; text-align: center; font-size: 9pt;">
                    <th>Biết</th><th>Hiểu</th><th>VD</th>
                    <th style="color: #15803d;">Biết</th><th style="color: #15803d;">Hiểu</th><th style="color: #15803d;">VD</th>
                    <th style="color: #0284c7;">Biết</th><th style="color: #0284c7;">Hiểu</th><th style="color: #0284c7;">VD</th>
                    <th style="color: #b91c1c;">Biết</th><th style="color: #b91c1c;">Hiểu</th><th style="color: #b91c1c;">VD</th>
                </tr>
            </thead>
            <tbody>
                ${lessons.map((les, i) => {
                    const c = examMatrixCustomCounts[les] || {};
                    const sumP1 = (parseInt(c.p1_b)||0) + (parseInt(c.p1_h)||0) + (parseInt(c.p1_vd)||0);
                    const sumP2 = (parseInt(c.p2_b)||0) + (parseInt(c.p2_h)||0) + (parseInt(c.p2_vd)||0);
                    const sumP3 = (parseInt(c.p3_b)||0) + (parseInt(c.p3_h)||0) + (parseInt(c.p3_vd)||0);
                    const sumP4 = (parseInt(c.p4_b)||0) + (parseInt(c.p4_h)||0) + (parseInt(c.p4_vd)||0);
                    return `
                        <tr>
                            <td style="text-align: center;">${i + 1}</td>
                            <td><strong style="font-size: 10pt;">${les}</strong></td>
                            <td style="text-align: center; background: #fafafa;">${c.p1_b || 0}</td>
                            <td style="text-align: center; background: #fafafa;">${c.p1_h || 0}</td>
                            <td style="text-align: center; background: #fafafa;">${c.p1_vd || 0}</td>
                            
                            <td style="text-align: center; background: #f0fdf4; font-weight: bold;">${c.p2_b || 0}</td>
                            <td style="text-align: center; background: #f0fdf4; font-weight: bold;">${c.p2_h || 0}</td>
                            <td style="text-align: center; background: #f0fdf4; font-weight: bold;">${c.p2_vd || 0}</td>

                            <td style="text-align: center; background: #f0f9ff; font-weight: bold;">${c.p3_b || 0}</td>
                            <td style="text-align: center; background: #f0f9ff; font-weight: bold;">${c.p3_h || 0}</td>
                            <td style="text-align: center; background: #f0f9ff; font-weight: bold;">${c.p3_vd || 0}</td>

                            <td style="text-align: center; background: #fef2f2; font-weight: bold;">${c.p4_b || 0}</td>
                            <td style="text-align: center; background: #fef2f2; font-weight: bold;">${c.p4_h || 0}</td>
                            <td style="text-align: center; background: #fef2f2; font-weight: bold;">${c.p4_vd || 0}</td>

                            <td style="text-align: center; font-weight: bold; background: #f1f5f9; font-size: 9.5pt;">${sumP1}c \vert{}${sumP2}ý | ${sumP3}c \vert{}${sumP4}tl</td>
                        </tr>
                    `;
                }).join('')}
                
                <tr style="background: #dbeafe; font-weight: bold; text-align: center; border-top: 2px solid #1e40af;">
                    <td colspan="2" style="color: #1e3a8a;">TỔNG CỘNG:</td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p1_b}" onchange="updateGlobalTotalField('p1_b', this.value)" style="width: 32px; text-align: center; border: 1px solid #2563eb; border-radius: 4px;"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p1_h}" onchange="updateGlobalTotalField('p1_h', this.value)" style="width: 32px; text-align: center; border: 1px solid #2563eb; border-radius: 4px;"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p1_vd}" onchange="updateGlobalTotalField('p1_vd', this.value)" style="width: 32px; text-align: center; border: 1px solid #2563eb; border-radius: 4px;"></td>
                    
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p2_b}" onchange="updateGlobalTotalField('p2_b', this.value)" style="width: 32px; text-align: center; border: 1px solid #16a34a; border-radius: 4px; background: #dcfce7;" title="Số ý Biết"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p2_h}" onchange="updateGlobalTotalField('p2_h', this.value)" style="width: 32px; text-align: center; border: 1px solid #16a34a; border-radius: 4px; background: #dcfce7;" title="Số ý Hiểu"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p2_vd}" onchange="updateGlobalTotalField('p2_vd', this.value)" style="width: 32px; text-align: center; border: 1px solid #16a34a; border-radius: 4px; background: #dcfce7;" title="Số ý Vận dụng"></td>

                    <td><input type="number" min="0" value="${matrixGlobalTotals.p3_b}" onchange="updateGlobalTotalField('p3_b', this.value)" style="width: 32px; text-align: center; border: 1px solid #0284c7; border-radius: 4px; background: #e0f2fe;" title="TL ngắn Biết"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p3_h}" onchange="updateGlobalTotalField('p3_h', this.value)" style="width: 32px; text-align: center; border: 1px solid #0284c7; border-radius: 4px; background: #e0f2fe;" title="TL ngắn Hiểu"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p3_vd}" onchange="updateGlobalTotalField('p3_vd', this.value)" style="width: 32px; text-align: center; border: 1px solid #0284c7; border-radius: 4px; background: #e0f2fe;" title="TL ngắn Vận dụng"></td>

                    <td><input type="number" min="0" value="${matrixGlobalTotals.p4_b}" onchange="updateGlobalTotalField('p4_b', this.value)" style="width: 32px; text-align: center; border: 1px solid #dc2626; border-radius: 4px; background: #fee2e2;" title="Tự luận Biết"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p4_h}" onchange="updateGlobalTotalField('p4_h', this.value)" style="width: 32px; text-align: center; border: 1px solid #dc2626; border-radius: 4px; background: #fee2e2;" title="Tự luận Hiểu"></td>
                    <td><input type="number" min="0" value="${matrixGlobalTotals.p4_vd}" onchange="updateGlobalTotalField('p4_vd', this.value)" style="width: 32px; text-align: center; border: 1px solid #dc2626; border-radius: 4px; background: #fee2e2;" title="Tự luận Vận dụng"></td>

                    <td style="color: #b91c1c; font-size: 9.5pt;">${countP1}c | ${countP2}ý | ${countP3}c | ${countP4}tl</td>
                </tr>
            </tbody>
        </table>

        <div style="page-break-before: always; margin-top: 25px;"></div>
        <p style="font-weight: bold; margin: 15px 0 4px 0;">MỤC 2: ĐỀ KIỂM TRA CHÍNH THỨC</p>
        
        <p style="font-weight: bold; color: #1e40af; margin: 8px 0 2px 0;">PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (${countP1} câu)</p>
        ${p1Html || '<p style="font-style: italic;">(Không có câu hỏi ở phần này)</p>'}

        <p style="font-weight: bold; color: #1e40af; margin: 12px 0 2px 0;">PHẦN II. Câu trắc nghiệm đúng/sai (${countP2} ý lệnh hỏi)</p>
        ${p2Html || '<p style="font-style: italic;">(Không có câu hỏi ở phần này)</p>'}

        <p style="font-weight: bold; color: #1e40af; margin: 12px 0 2px 0;">PHẦN III. Câu trắc nghiệm trả lời ngắn (${countP3} câu)</p>
        ${p3Html || '<p style="font-style: italic;">(Không có câu hỏi ở phần này)</p>'}

        <p style="font-weight: bold; color: #1e40af; margin: 12px 0 2px 0;">PHẦN IV. Tự luận (${countP4} câu)</p>
        ${p4Html || '<p style="font-style: italic;">(Không có câu hỏi ở phần này)</p>'}
    `;
};

// 3. GHI ĐÈ HÀM GỌI AI: HỖ TRỢ TẠO ĐỀ THI ĐẦY ĐỦ 4 PHẦN KÈM TỰ LUẬN
window.executeActionAI = async function() {
    const savedKey = (localStorage.getItem('gemini_api_key') || '').trim();
    if (!savedKey) {
        openAIKeyModal();
        alert("Thầy vui lòng nhập và lưu Gemini API Key trước!");
        return;
    }

    const preferredModel = localStorage.getItem('gemini_preferred_model') || 'auto';
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const book = document.getElementById('sel-book').value;
    const lessonTitle = currentSelectedLesson;
    const customGuide = document.getElementById('ai-custom-instructions') ? document.getElementById('ai-custom-instructions').value.trim() : "";
    const docContainer = document.getElementById('container-a4-doc');
    const statusInd = document.getElementById('content-source-indicator');

    let filePromptPart = "";
    if (uploadedFileContent && uploadedFileContent.trim() !== "") {
        filePromptPart = `\n- NGỮ LIỆU BỔ SUNG: """${uploadedFileContent.slice(0, 8000)}"""`;
    }

    // --- A. CHẾ ĐỘ SLIDE 16:9 BẰNG AI ---
    if (currentActiveMode === 'slide') {
        statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang tạo Slide 16:9...</span>`;
        const promptSlide = `Bạn là chuyên gia sư phạm. Hãy thiết kế bài giảng PowerPoint môn ${subject} ${grade} (${book}) cho bài: "${lessonTitle}".
Ghi chú: ${customGuide}${filePromptPart}
Yêu cầu trả về DUY NHẤT một mảng JSON thuần túy (không bọc text ngoài):
[
  {
    "tag": "KHỞI ĐỘNG",
    "title": "Tên slide",
    "body": "Nội dung ngắn gọn dạng HTML <p> hoặc <div>."
  }
]
Tạo từ 8 đến 10 slide gồm: Khởi động, Khám phá kiến thức (3 slide), Câu hỏi tương tác trắc nghiệm (3 slide), Vận dụng địa phương huyện Mang Thít Vĩnh Long.`;

        try {
            const aiResult = await fetchGeminiWithCascade(promptSlide, savedKey, preferredModel);
            let raw = aiResult.text.replace(/```json/gi, '').replace(/```/gi, '').trim();
            const newSlides = JSON.parse(raw);
            if (Array.isArray(newSlides) && newSlides.length > 0) {
                slideDeckData = newSlides;
                currentSlideIndex = 0;
                renderCurrentSlide();
                statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã tạo ${newSlides.length} Slide bằng AI!</span>`;
                alert(`Đã hoàn thành tạo ${newSlides.length} Slide bài giảng bằng AI!`);
            } else {
                throw new Error("Dữ liệu JSON không hợp lệ");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi tạo slide AI: " + e.message);
            renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        }
        return;
    }

    // --- HIỂN THỊ CHỜ CHO 5512 VÀ 7991 ---
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 75px 20px; font-family: sans-serif;">
            <div style="font-size: 38px; color: #9333ea; margin-bottom: 16px;"><i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i></div>
            <h3 style="font-size: 15pt; font-weight: bold; color: #0f172a;" id="ai-loading-status">Đang kết nối Gemini...</h3>
            <p style="color: #64748b; font-size: 11pt; margin-top: 6px;">
                Đang xử lý: <strong>${currentActiveMode === '5512' ? 'KHBD 5512' : 'Đề kiểm tra 7991 (4 Phần)'}</strong> - ${lessonTitle}
            </p>
        </div>
    `;
    statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang biên soạn...</span>`;

    try {
        // --- B. CHẾ ĐỘ ĐỀ THI 7991 BẰNG AI (ĐỦ 4 PHẦN) ---
        if (currentActiveMode === '7991') {
            const lessons = (selectedLessonsForExam && selectedLessonsForExam.length > 0) ? selectedLessonsForExam.join(', ') : lessonTitle;
            const promptExam = `Bạn là chuyên gia khảo thí THPT môn ${subject} ${grade}. Hãy biên soạn ĐỀ KIỂM TRA ĐỊNH KỲ bám sát Quyết định 7991/BGDĐT cho: ${lessons}. Bộ sách: ${book}.
Ma trận yêu cầu cụ thể:
1. PHẦN I (Trắc nghiệm 4 lựa chọn): ${matrixGlobalTotals.p1_b} câu Biết, ${matrixGlobalTotals.p1_h} câu Hiểu, ${matrixGlobalTotals.p1_vd} câu Vận dụng (in đậm hoặc gạch chân đáp án đúng).
2. PHẦN II (Trắc nghiệm Đúng/Sai): ${(parseInt(matrixGlobalTotals.p2_b)||0) + (parseInt(matrixGlobalTotals.p2_h)||0) + (parseInt(matrixGlobalTotals.p2_vd)||0)} Ý LỆNH HỎI (${matrixGlobalTotals.p2_b} ý Biết, ${matrixGlobalTotals.p2_h} ý Hiểu, ${matrixGlobalTotals.p2_vd} ý Vận dụng). Mỗi câu gồm bối cảnh và 4 ý a, b, c, d, ghi rõ [ĐÚNG] hoặc [SAI].
3. PHẦN III (Trắc nghiệm Trả lời ngắn): Gồm ${matrixGlobalTotals.p3_b} câu Biết, ${matrixGlobalTotals.p3_h} câu Hiểu, ${matrixGlobalTotals.p3_vd} câu Vận dụng. Mỗi câu điền số/từ ngắn, kèm đáp án chuẩn.
4. PHẦN IV (Tự luận): Gồm ${matrixGlobalTotals.p4_b} câu Biết, ${matrixGlobalTotals.p4_h} câu Hiểu, ${matrixGlobalTotals.p4_vd} câu Vận dụng (yêu cầu phân tích cơ chế và đề xuất giải pháp thực tế nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long).
KÈM BẢNG ĐÁP ÁN VÀ THANG ĐIỂM BAREM CHI TIẾT TỪNG PHẦN Ở CUỐI ĐỀ.
Định dạng HTML thuần túy không bọc markdown. Font Times New Roman 13pt.`;

            const aiResult = await fetchGeminiWithCascade(promptExam, savedKey, preferredModel);
            let out = aiResult.text.replace(/^```html/i, '').replace(/```$/i, '').trim();
            docContainer.innerHTML = out;
            temporaryAIGeneratedDoc = out;
            showAIReviewBar();
            statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã tạo xong Đề thi 7991 (4 Phần) qua [${aiResult.modelUsed}]!</span>`;
            return;
        }

        // --- C. CHẾ ĐỘ GIÁO ÁN 5512 BẰNG AI ---
        const info = getDynamicNlsAiInfo(lessonTitle, grade);
        const prompt5512 = `Bạn là chuyên gia sư phạm THPT. Hãy biên soạn nội dung kiến thức chuyên môn bám sát SGK ${book} của bài: "${lessonTitle}", môn ${subject} ${grade}.
Cấu trúc:
1. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (Bảng 2 cột viền đen: Hoạt động GV-HS và Dự kiến sản phẩm ghi vở).
2. HOẠT ĐỘNG 3: LUYỆN TẬP (Trắc nghiệm 4 lựa chọn, Đúng/Sai, Trả lời ngắn).
3. HOẠT ĐỘNG 4: VẬN DỤNG (Tình huống gắn với huyện Mang Thít Vĩnh Long).
Ghi chú: ${customGuide}${filePromptPart}
Định dạng HTML không bọc markdown. Font Times New Roman 13pt.`;

        const aiResult = await fetchGeminiWithCascade(prompt5512, savedKey, preferredModel);
        let textOut = aiResult.text.replace(/^```html/i, '').replace(/```$/i, '').trim();
        const fixedAiHtml = sanitizeAndFixAIActivities(textOut);

        renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle, fixedAiHtml);
        temporaryAIGeneratedDoc = docContainer.innerHTML;
        showAIReviewBar();
        statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã bơm kiến thức 5512 qua [${aiResult.modelUsed}]!</span>`;

    } catch (error) {
        console.error("Lỗi AI:", error);
        statusInd.innerHTML = `<span class="text-amber-400 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> AI gặp sự cố</span>`;
        displayContentForCurrentLesson();
        alert("Lỗi AI: " + error.message);
    }
};

// Tự động phân bổ lại ma trận và hiển thị ngay khi nạp file
if (typeof distributeMatrixFromTotals === 'function') {
    distributeMatrixFromTotals();
    if (typeof displayContentForCurrentLesson === 'function') {
        displayContentForCurrentLesson();
    }
}
