/**
 * ==============================================================================
 * BIOMASTER AI - MODULE CẬP NHẬT TÍNH NĂNG ĐỘC LẬP
 * GV: Hồ Tấn Khải - THPT Mang Thít
 * Bám sát chuẩn 3 tệp chỉ dẫn:
 * 1. AI- TẠO GIÁO ÁN.docx (CV 5512 Cải tiến High-End, NLS 1007 & Năng lực AI)
 * 2. AI- TẠO SLIDE PPT.docx (Slide 16:9 Typography >= 34pt, Hệ màu 60-30-10)
 * 3. AI. TẠO ĐỀ.docx (Ma trận 4 phần đầy đủ: Tổng câu, Tổng điểm từng phần, thang 10đ)
 * ==============================================================================
 */

// 1. DANH SÁCH MÔ HÌNH GOOGLE GEMINI HỢP LỆ
window.FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash"
];

// 2. KHAI BÁO MA TRẬN 4 PHẦN & KHỐNG CHẾ ĐIỂM SỐ (THANG 10 ĐIỂM CHUẨN)
window.matrixGlobalTotals = {
    p1_b: 6, p1_h: 4, p1_vd: 2,  // Phần I: 12 câu
    p2_b: 4, p2_h: 4, p2_vd: 2,  // Phần II: 10 ý Đúng/Sai
    p3_b: 2, p3_h: 2, p3_vd: 1,  // Phần III: 5 câu ngắn
    p4_b: 1, p4_h: 1, p4_vd: 1   // Phần IV: 3 câu tự luận
};

window.matrixPartScores = {
    p1: 3.0,  // Điểm Phần I (Trắc nghiệm 4 lựa chọn)
    p2: 3.0,  // Điểm Phần II (Trắc nghiệm Đúng/Sai)
    p3: 1.5,  // Điểm Phần III (Trả lời ngắn)
    p4: 2.5   // Điểm Phần IV (Tự luận) -> Tổng toàn bài = 10.0 điểm
};

// 3. TỰ ĐỘNG PHÂN BỔ SỐ CÂU/Ý CHO CÁC BÀI HỌC ĐƯỢC CHỌN
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

    const fields = ['p1_b', 'p1_h', 'p1_vd', 'p2_b', 'p2_h', 'p2_vd', 'p3_b', 'p3_h', 'p3_vd', 'p4_b', 'p4_h', 'p4_vd'];
    fields.forEach(f => {
        const total = parseInt(window.matrixGlobalTotals[f]) || 0;
        const base = Math.floor(total / numLessons);
        let remainder = total % numLessons;

        lessons.forEach((les, idx) => {
            window.examMatrixCustomCounts[les][f] = base + (idx < remainder ? 1 : 0);
        });
    });
};

window.updateGlobalTotalField = function(field, value) {
    window.matrixGlobalTotals[field] = parseInt(value) || 0;
    window.distributeMatrixFromTotals();
    window.renderMaTranDeKiemTra(
        document.getElementById('sel-subject').value,
        document.getElementById('sel-grade').value,
        document.getElementById('sel-book').value
    );
};

window.updatePartScoreField = function(part, value) {
    window.matrixPartScores[part] = parseFloat(value) || 0;
    window.renderMaTranDeKiemTra(
        document.getElementById('sel-subject').value,
        document.getElementById('sel-grade').value,
        document.getElementById('sel-book').value
    );
};

// 4. HIỂN THỊ NỘI DUNG & KIỂM TRA BẢN LƯU LOCALSTORAGE CHO CẢ SLIDE VÀ VĂN BẢN
window.displayContentForCurrentLesson = function() {
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const book = document.getElementById('sel-book').value;
    const lessonTitle = currentSelectedLesson;
    const docContainer = document.getElementById('container-a4-doc');
    const statusInd = document.getElementById('content-source-indicator');

    const aiKey = getAICacheKey(currentActiveMode, subject, grade, lessonTitle);
    const cachedData = localStorage.getItem(aiKey);

    if (currentActiveMode === 'slide') {
        if (cachedData) {
            try {
                slideDeckData = JSON.parse(cachedData);
                currentSlideIndex = 0;
                renderCurrentSlide();
                statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã nạp Slide bài giảng từ AI (Đã lưu)</span>`;
                return;
            } catch(e) {
                console.error("Lỗi đọc cache slide:", e);
            }
        }
        statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check text-[10px]"></i> Bản slide nội hàm có sẵn</span>`;
        renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        return;
    }

    if (cachedData) {
        docContainer.innerHTML = cachedData;
        statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã nạp nội dung từ AI (Đã kiểm duyệt)</span>`;
        return;
    }

    statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check text-[10px]"></i> Bản gốc nội hàm có sẵn</span>`;
    if (currentActiveMode === '5512') {
        renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle);
    } else if (currentActiveMode === '7991') {
        distributeMatrixFromTotals();
        renderMaTranDeKiemTra(subject, grade, book);
    }
};

// 5. NÚT LƯU BÀI VÀ NÚT QUAY VỀ BẢN GỐC NỘI HÀM
window.saveCurrentAIContent = function() {
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const lessonTitle = currentSelectedLesson;
    const aiKey = getAICacheKey(currentActiveMode, subject, grade, lessonTitle);

    if (currentActiveMode === 'slide') {
        if (slideDeckData && slideDeckData.length > 0) {
            localStorage.setItem(aiKey, JSON.stringify(slideDeckData));
            hideAIReviewBar();
            renderLessonListUI();
            const statusInd = document.getElementById('content-source-indicator');
            statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-check-double text-[10px]"></i> Đã lưu Slide AI thành công!</span>`;
            alert("Đã lưu bộ Slide AI thành công! Những lần sau chọn bài này sẽ tự động nạp slide của Thầy.");
            return;
        }
    }

    if (!temporaryAIGeneratedDoc) {
        temporaryAIGeneratedDoc = document.getElementById('container-a4-doc').innerHTML;
    }

    localStorage.setItem(aiKey, temporaryAIGeneratedDoc);
    hideAIReviewBar();
    renderLessonListUI();
    const statusInd = document.getElementById('content-source-indicator');
    statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-check-double text-[10px]"></i> Đã lưu bài AI vào máy thành công!</span>`;
    alert("Đã lưu bài soạn AI thành công! Những lần sau chọn bài này sẽ tự động nạp ngay.");
};

window.discardCurrentAIContent = function() {
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const book = document.getElementById('sel-book').value;
    const lessonTitle = currentSelectedLesson;
    const aiKey = getAICacheKey(currentActiveMode, subject, grade, lessonTitle);

    localStorage.removeItem(aiKey);
    temporaryAIGeneratedDoc = null;
    hideAIReviewBar();
    renderLessonListUI();

    if (currentActiveMode === 'slide') {
        renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        alert("Đã hủy bỏ Slide AI và trở về bản Slide bài giảng nội hàm có sẵn!");
    } else {
        displayContentForCurrentLesson();
        alert("Đã xóa bài soạn AI và trở về bản gốc nội hàm chuẩn mực!");
    }
};

// 6. GHI ĐÈ BẢNG MA TRẬN 4 PHẦN CÓ RIÊNG TỔNG CÂU VÀ TỔNG ĐIỂM TỪNG PHẦN (VỪA KHÍT TRANG 1 A4)
window.renderMaTranDeKiemTra = function(subject, grade, book) {
    const docContainer = document.getElementById('container-a4-doc');
    const lessons = (selectedLessonsForExam && selectedLessonsForExam.length > 0) 
        ? selectedLessonsForExam 
        : [currentSelectedLesson];

    const countP1 = (parseInt(matrixGlobalTotals.p1_b)||0) + (parseInt(matrixGlobalTotals.p1_h)||0) + (parseInt(matrixGlobalTotals.p1_vd)||0);
    const countP2 = (parseInt(matrixGlobalTotals.p2_b)||0) + (parseInt(matrixGlobalTotals.p2_h)||0) + (parseInt(matrixGlobalTotals.p2_vd)||0);
    const countP3 = (parseInt(matrixGlobalTotals.p3_b)||0) + (parseInt(matrixGlobalTotals.p3_h)||0) + (parseInt(matrixGlobalTotals.p3_vd)||0);
    const countP4 = (parseInt(matrixGlobalTotals.p4_b)||0) + (parseInt(matrixGlobalTotals.p4_h)||0) + (parseInt(matrixGlobalTotals.p4_vd)||0);

    const scoreP1 = parseFloat(matrixPartScores.p1) || 0;
    const scoreP2 = parseFloat(matrixPartScores.p2) || 0;
    const scoreP3 = parseFloat(matrixPartScores.p3) || 0;
    const scoreP4 = parseFloat(matrixPartScores.p4) || 0;
    const totalScore = (scoreP1 + scoreP2 + scoreP3 + scoreP4).toFixed(1);

    const p1PerQ = countP1 > 0 ? (scoreP1 / countP1).toFixed(2) : 0;
    const p3PerQ = countP3 > 0 ? (scoreP3 / countP3).toFixed(2) : 0;
    const p4PerQ = countP4 > 0 ? (scoreP4 / countP4).toFixed(2) : 0;

    let p1Html = "", p1Idx = 1;
    lessons.forEach(les => {
        const num = (parseInt(examMatrixCustomCounts[les]?.p1_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p1_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p1_vd)||0);
        for (let k = 1; k <= num; k++) {
            p1Html += `
                <p style="margin: 3px 0 1px 0;"><strong>Câu ${p1Idx}:</strong> [${les}] Đặc điểm cốt lõi nào sau đây phản ánh chính xác nhất bản chất khoa học của bài học?</p>
                <p style="margin: 1px 0 1px 20px;">A. Không tuân thủ các quy luật tự nhiên &nbsp;&nbsp;&nbsp;&nbsp; <u><strong>B</strong></u>. Luôn bảo đảm tính toàn vẹn và thích nghi sinh thái</p>
                <p style="margin: 1px 0 3px 20px;">C. Diễn ra hoàn toàn ngẫu nhiên &nbsp;&nbsp;&nbsp;&nbsp; D. Hoàn toàn độc lập với môi trường</p>
            `;
            p1Idx++;
        }
    });

    let p2Html = "", p2Idx = 1;
    lessons.forEach(les => {
        const numY = (parseInt(examMatrixCustomCounts[les]?.p2_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p2_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p2_vd)||0);
        const soCau = Math.max(1, Math.ceil(numY / 4));
        for (let k = 1; k <= soCau; k++) {
            p2Html += `
                <p style="margin: 4px 0 1px 0;"><strong>Câu ${p2Idx}:</strong> [${les}] Trong một nghiên cứu khoa học thực nghiệm về điều kiện phát triển nông nghiệp:</p>
                <p style="margin: 1px 0 1px 20px;"><u><strong>a)</strong></u> [Biết] Nhiệt độ và độ ẩm tối ưu giúp quá trình chuyển hóa đạt hiệu suất cao nhất.</p>
                <p style="margin: 1px 0 1px 20px;"><strong>b)</strong> [Hiểu] Mọi tác nhân gây hại đều làm tăng tốc độ sinh trưởng của cá thể sinh vật.</p>
                <p style="margin: 1px 0 1px 20px;"><u><strong>c)</strong></u> [Vận dụng] Nắm vững quy luật giúp nông dân chủ động phòng ngừa dịch bệnh nâng cao năng suất.</p>
                <p style="margin: 1px 0 3px 20px;"><strong>d)</strong> [Hiểu] Các biến đổi nội tại diễn ra hoàn toàn tự phát mà không cần năng lượng trao đổi.</p>
            `;
            p2Idx++;
        }
    });

    let p3Html = "", p3Idx = 1;
    lessons.forEach(les => {
        const num = (parseInt(examMatrixCustomCounts[les]?.p3_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p3_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p3_vd)||0);
        for (let k = 1; k <= num; k++) {
            p3Html += `
                <p style="margin: 3px 0 1px 0;"><strong>Câu ${p3Idx}:</strong> [${les}] Một cấu trúc sinh học ban đầu trải qua ${p3Idx + 1} đợt phân bào liên tiếp sẽ tạo ra bao nhiêu cấu trúc con?</p>
                <p style="margin: 1px 0 4px 20px; font-weight: bold; color: #0284c7;">Đáp án: <u>${Math.pow(2, p3Idx + 1)}</u></p>
            `;
            p3Idx++;
        }
    });

    let p4Html = "", p4Idx = 1;
    lessons.forEach(les => {
        const num = (parseInt(examMatrixCustomCounts[les]?.p4_b)||0) + (parseInt(examMatrixCustomCounts[les]?.p4_h)||0) + (parseInt(examMatrixCustomCounts[les]?.p4_vd)||0);
        for (let k = 1; k <= num; k++) {
            p4Html += `
                <p style="margin: 5px 0 2px 0;"><strong>Câu ${p4Idx} (Tự luận - ${p4PerQ} điểm):</strong> [${les}]</p>
                <p style="margin: 1px 0 1px 15px;">a) Phân tích cơ chế và bản chất quy luật sinh học được nêu trong bài học.</p>
                <p style="margin: 1px 0 5px 15px;">b) Hãy đề xuất 02 giải pháp kỹ thuật cụ thể ứng dụng vào sản xuất hoặc bảo vệ môi trường nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long.</p>
            `;
            p4Idx++;
        }
    });

    docContainer.innerHTML = `
        <!-- ==================== TRANG 1: KHUNG MA TRẬN 4 PHẦN ĐẦY ĐỦ CÓ TỔNG CÂU & ĐIỂM (VỪA KHÍT A4) ==================== -->
        <div style="page-break-after: always; min-height: 252mm; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <table style="width: 100%; border: none; margin-bottom: 4px;">
                    <tr style="border: none;">
                        <td style="border: none; width: 45%; text-align: center; vertical-align: top; padding: 0;">
                            <p style="margin: 0; font-size: 10pt;">SỞ GD&ĐT VĨNH LONG</p>
                            <p style="margin: 0; font-weight: bold; font-size: 10pt;">${schoolName.toUpperCase()}</p>
                            <div style="width: 70px; height: 1px; background: #000; margin: 2px auto 0 auto;"></div>
                        </td>
                        <td style="border: none; width: 55%; text-align: center; vertical-align: top; padding: 0;">
                            <p style="margin: 0; font-weight: bold; font-size: 10pt;">HỒ SƠ KHẢO THÍ VÀ MA TRẬN ĐỀ KIỂM TRA</p>
                            <p style="margin: 0; font-style: italic; font-size: 9.5pt;">Khung chuẩn Quyết định số 7991/BGDĐT</p>
                            <div style="width: 100px; height: 1px; background: #000; margin: 2px auto 0 auto;"></div>
                        </td>
                    </tr>
                </table>

                <div style="text-align: center; margin: 5px 0 7px 0;">
                    <h2 style="margin: 0; font-size: 11.5pt; font-weight: bold; text-transform: uppercase;">KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (THANG ĐIỂM 10.0)</h2>
                    <p style="margin: 1px 0 0 0; font-style: italic; font-size: 9.5pt;">Môn học: ${subject} ${grade} • Thời gian: 45 phút • Bộ sách: ${book}</p>
                </div>

                <!-- BẢNG MA TRẬN ĐỦ 4 PHẦN CÓ CỘT TỔNG CÂU VÀ TỔNG ĐIỂM TỪNG PHẦN -->
                <table style="width: 100%; border-collapse: collapse; font-size: 7.5pt; margin: 3px 0;">
                    <thead>
                        <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                            <th rowspan="2" style="width: 20px; padding: 3px 1px;">TT</th>
                            <th rowspan="2" style="width: 125px; padding: 3px 3px; text-align: left;">Chủ đề / Bài học</th>
                            
                            <!-- PHẦN I -->
                            <th colspan="3" style="padding: 2px 1px; background: #f1f5f9;">Phần I (Nhiều LC)</th>
                            <th rowspan="2" style="width: 28px; padding: 2px 1px; background: #e2e8f0; font-weight: bold;">Tổng P1</th>

                            <!-- PHẦN II -->
                            <th colspan="3" style="padding: 2px 1px; color: #15803d; background: #e8f5e9;">Phần II (Đúng/Sai)</th>
                            <th rowspan="2" style="width: 28px; padding: 2px 1px; color: #15803d; background: #dcfce7; font-weight: bold;">Tổng P2</th>

                            <!-- PHẦN III -->
                            <th colspan="3" style="padding: 2px 1px; color: #0284c7; background: #e1f5fe;">Phần III (Ngắn)</th>
                            <th rowspan="2" style="width: 28px; padding: 2px 1px; color: #0284c7; background: #bae6fd; font-weight: bold;">Tổng P3</th>

                            <!-- PHẦN IV -->
                            <th colspan="3" style="padding: 2px 1px; color: #b91c1c; background: #ffebee;">Phần IV (Tự luận)</th>
                            <th rowspan="2" style="width: 28px; padding: 2px 1px; color: #b91c1c; background: #fecaca; font-weight: bold;">Tổng P4</th>

                            <!-- TỔNG TOÀN BÀI -->
                            <th rowspan="2" style="width: 45px; padding: 2px 1px; background: #e0e7ff; font-weight: bold;">Tổng bài</th>
                        </tr>
                        <tr style="background: #F0F4F8; text-align: center; font-size: 7pt;">
                            <th style="width: 18px; padding: 2px 0;">B</th><th style="width: 18px; padding: 2px 0;">H</th><th style="width: 18px; padding: 2px 0;">VD</th>
                            <th style="width: 18px; padding: 2px 0; color: #15803d; background: #e8f5e9;">B</th><th style="width: 18px; padding: 2px 0; color: #15803d; background: #e8f5e9;">H</th><th style="width: 18px; padding: 2px 0; color: #15803d; background: #e8f5e9;">VD</th>
                            <th style="width: 18px; padding: 2px 0; color: #0284c7; background: #e1f5fe;">B</th><th style="width: 18px; padding: 2px 0; color: #0284c7; background: #e1f5fe;">H</th><th style="width: 18px; padding: 2px 0; color: #0284c7; background: #e1f5fe;">VD</th>
                            <th style="width: 18px; padding: 2px 0; color: #b91c1c; background: #ffebee;">B</th><th style="width: 18px; padding: 2px 0; color: #b91c1c; background: #ffebee;">H</th><th style="width: 18px; padding: 2px 0; color: #b91c1c; background: #ffebee;">VD</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lessons.map((les, i) => {
                            const c = examMatrixCustomCounts[les] || {};
                            const s1 = (parseInt(c.p1_b)||0) + (parseInt(c.p1_h)||0) + (parseInt(c.p1_vd)||0);
                            const s2 = (parseInt(c.p2_b)||0) + (parseInt(c.p2_h)||0) + (parseInt(c.p2_vd)||0);
                            const s3 = (parseInt(c.p3_b)||0) + (parseInt(c.p3_h)||0) + (parseInt(c.p3_vd)||0);
                            const s4 = (parseInt(c.p4_b)||0) + (parseInt(c.p4_h)||0) + (parseInt(c.p4_vd)||0);
                            const sumAll = s1 + s2 + s3 + s4;
                            return `
                                <tr>
                                    <td style="text-align: center; padding: 2px 1px;">${i + 1}</td>
                                    <td style="padding: 2px 3px; line-height: 1.1;"><strong>${les}</strong></td>
                                    
                                    <!-- Phần I -->
                                    <td style="text-align: center; padding: 2px 0;">${c.p1_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0;">${c.p1_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0;">${c.p1_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; font-weight: bold; background: #f8fafc;">${s1}c</td>
                                    
                                    <!-- Phần II -->
                                    <td style="text-align: center; padding: 2px 0; background: #f0fdf4;">${c.p2_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0fdf4;">${c.p2_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0fdf4;">${c.p2_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; font-weight: bold; background: #dcfce7; color: #15803d;">${s2}ý</td>

                                    <!-- Phần III -->
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff;">${c.p3_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff;">${c.p3_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff;">${c.p3_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; font-weight: bold; background: #bae6fd; color: #0284c7;">${s3}c</td>

                                    <!-- Phần IV -->
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2;">${c.p4_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2;">${c.p4_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2;">${c.p4_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; font-weight: bold; background: #fecaca; color: #b91c1c;">${s4}tl</td>

                                    <td style="text-align: center; font-weight: bold; background: #e0e7ff; color: #3730a3; padding: 2px 1px;">
                                        ${sumAll} mục
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                        
                        <!-- DÒNG 1: TỔNG SỐ CÂU/Ý TỪNG MỨC ĐỘ & TỔNG CÂU TỪNG PHẦN -->
                        <tr style="background: #eff6ff; font-weight: bold; text-align: center; border-top: 2px solid #1e40af;">
                            <td colspan="2" style="color: #1e3a8a; text-align: right; padding: 3px 4px;">TỔNG CÂU / Ý (Khống chế):</td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_b}" onchange="updateGlobalTotalField('p1_b', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #2563eb; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_h}" onchange="updateGlobalTotalField('p1_h', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #2563eb; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_vd}" onchange="updateGlobalTotalField('p1_vd', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #2563eb; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #fff;"></td>
                            <td style="background: #e2e8f0; color: #1e3a8a; font-size: 8pt;">${countP1} câu</td>
                            
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_b}" onchange="updateGlobalTotalField('p2_b', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #16a34a; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #dcfce7;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_h}" onchange="updateGlobalTotalField('p2_h', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #16a34a; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #dcfce7;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_vd}" onchange="updateGlobalTotalField('p2_vd', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #16a34a; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #dcfce7;"></td>
                            <td style="background: #dcfce7; color: #15803d; font-size: 8pt;">${countP2} ý</td>

                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_b}" onchange="updateGlobalTotalField('p3_b', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #0284c7; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #e0f2fe;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_h}" onchange="updateGlobalTotalField('p3_h', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #0284c7; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #e0f2fe;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_vd}" onchange="updateGlobalTotalField('p3_vd', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #0284c7; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #e0f2fe;"></td>
                            <td style="background: #bae6fd; color: #0284c7; font-size: 8pt;">${countP3} câu</td>

                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_b}" onchange="updateGlobalTotalField('p4_b', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #dc2626; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #fee2e2;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_h}" onchange="updateGlobalTotalField('p4_h', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #dc2626; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #fee2e2;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_vd}" onchange="updateGlobalTotalField('p4_vd', this.value)" style="width: 20px; height: 17px; text-align: center; border: 1px solid #dc2626; font-size: 7.5pt; border-radius: 2px; font-weight: bold; background: #fee2e2;"></td>
                            <td style="background: #fecaca; color: #b91c1c; font-size: 8pt;">${countP4} câu</td>

                            <td style="color: #3730a3; font-size: 7.5pt; background: #e0e7ff; padding: 2px 1px;">
                                ${countP1}c|${countP2}ý|${countP3}c|${countP4}tl
                            </td>
                        </tr>

                        <!-- DÒNG 2: TỔNG SỐ ĐIỂM TỪNG PHẦN VÀ TỔNG ĐIỂM TOÀN BÀI (10.0 ĐIỂM) -->
                        <tr style="background: #fefce8; font-weight: bold; text-align: center; border-top: 1px solid #ca8a04;">
                            <td colspan="2" style="color: #854d0e; text-align: right; padding: 3px 4px;">TỔNG ĐIỂM TỪNG PHẦN:</td>
                            <td colspan="4" style="padding: 2px; background: #fef9c3;">
                                <input type="number" step="0.25" min="0" value="${scoreP1}" onchange="updatePartScoreField('p1', this.value)" style="width: 36px; height: 17px; text-align: center; border: 1px solid #ca8a04; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 6.8pt; color: #64748b; display: inline-block; margin-left: 2px;">(${p1PerQ}đ/câu)</span>
                            </td>
                            <td colspan="4" style="padding: 2px; background: #f0fdf4;">
                                <input type="number" step="0.25" min="0" value="${scoreP2}" onchange="updatePartScoreField('p2', this.value)" style="width: 36px; height: 17px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 6.8pt; color: #15803d; display: inline-block; margin-left: 2px;">(Lũy tiến ý)</span>
                            </td>
                            <td colspan="4" style="padding: 2px; background: #f0f9ff;">
                                <input type="number" step="0.25" min="0" value="${scoreP3}" onchange="updatePartScoreField('p3', this.value)" style="width: 36px; height: 17px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 6.8pt; color: #0369a1; display: inline-block; margin-left: 2px;">(${p3PerQ}đ/câu)</span>
                            </td>
                            <td colspan="4" style="padding: 2px; background: #fef2f2;">
                                <input type="number" step="0.25" min="0" value="${scoreP4}" onchange="updatePartScoreField('p4', this.value)" style="width: 36px; height: 17px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 6.8pt; color: #b91c1c; display: inline-block; margin-left: 2px;">(${p4PerQ}đ/câu)</span>
                            </td>
                            <td style="color: #b91c1c; font-size: 8.5pt; background: #fee2e2;">
                                <strong>${totalScore} Đ</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style="font-weight: bold; font-size: 8.5pt; margin: 5px 0 2px 0;">BẢN ĐẶC TẢ YÊU CẦU CẦN ĐẠT CỦA CÁC CHỦ ĐỀ:</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 7.5pt; margin-bottom: 4px;">
                    <thead>
                        <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                            <th style="width: 25px; padding: 2px;">TT</th>
                            <th style="width: 135px; padding: 2px;">Chủ đề</th>
                            <th style="padding: 2px;">Mức độ đánh giá & Yêu cầu cần đạt (GDPT 2018)</th>
                            <th style="width: 70px; padding: 2px;">Số câu thực tế</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lessons.map((les, idx) => {
                            const c = examMatrixCustomCounts[les] || {};
                            const sum = (parseInt(c.p1_b)||0)+(parseInt(c.p1_h)||0)+(parseInt(c.p1_vd)||0)+(parseInt(c.p2_b)||0)+(parseInt(c.p2_h)||0)+(parseInt(c.p2_vd)||0)+(parseInt(c.p3_b)||0)+(parseInt(c.p3_h)||0)+(parseInt(c.p3_vd)||0)+(parseInt(c.p4_b)||0)+(parseInt(c.p4_h)||0)+(parseInt(c.p4_vd)||0);
                            return `
                                <tr>
                                    <td style="text-align: center; padding: 2px;">${idx + 1}</td>
                                    <td style="padding: 2px;"><strong>${les}</strong></td>
                                    <td style="padding: 2px; font-size: 7pt; line-height: 1.15;">
                                        - <em>Biết:</em> Nhận biết cấu trúc, đối tượng và khái niệm cốt lõi theo SGK Kết nối tri thức.<br>
                                        - <em>Hiểu:</em> Phân tích cơ chế sinh học, so sánh biến đổi và giải thích thực nghiệm.<br>
                                        - <em>Vận dụng:</em> Giải quyết tình huống thực tiễn sinh học và nông nghiệp địa phương.
                                    </td>
                                    <td style="text-align: center; font-weight: bold; padding: 2px;">${sum} mục</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div style="border-top: 1px dashed #cbd5e1; padding-top: 3px; font-size: 7.5pt; color: #475569;">
                <table style="width: 100%; border: none;">
                    <tr style="border: none;">
                        <td style="border: none; width: 60%; vertical-align: top; padding: 0;">
                            * <strong>Hướng dẫn Thầy:</strong> Chỉnh trực tiếp ô số câu/ý và điểm số ở 2 dòng chân bảng. Đề thi ở trang sau sẽ tự động cập nhật số câu và barem điểm tương ứng.
                        </td>
                        <td style="border: none; width: 40%; text-align: center; vertical-align: top; padding: 0;">
                            <p style="margin: 0; font-style: italic;">Mang Thít, ngày ...... tháng ...... năm 202...</p>
                            <p style="margin: 1px 0 0 0; font-weight: bold;">TỔ TRƯỞNG CHUYÊN MÔN DUYỆT</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- ==================== TRANG 2 TRỞ ĐI: ĐỀ KIỂM TRA ĐỊNH KỲ ==================== -->
        <div>
            <div style="text-align: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase;">ĐỀ KIỂM TRA ĐỊNH KỲ CHÍNH THỨC</h3>
                <p style="margin: 2px 0 0 0; font-style: italic; font-size: 11pt;">Môn học: ${subject} ${grade} • Thời gian làm bài: 45 phút (Không kể phát đề)</p>
            </div>

            <p style="font-weight: bold; color: #1e40af; margin: 10px 0 2px 0;">
                PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (${countP1} câu - ${scoreP1} điểm, mỗi câu đúng được ${p1PerQ} điểm)
            </p>
            ${p1Html || '<p style="font-style: italic; font-size: 10.5pt;">(Không có câu hỏi ở phần này)</p>'}

            <p style="font-weight: bold; color: #1e40af; margin: 14px 0 2px 0;">
                PHẦN II. Câu trắc nghiệm đúng/sai (${countP2} ý lệnh hỏi - ${scoreP2} điểm. Điểm lũy tiến: đúng 1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ)
            </p>
            ${p2Html || '<p style="font-style: italic; font-size: 10.5pt;">(Không có câu hỏi ở phần này)</p>'}

            <p style="font-weight: bold; color: #1e40af; margin: 14px 0 2px 0;">
                PHẦN III. Câu trắc nghiệm trả lời ngắn (${countP3} câu - ${scoreP3} điểm, mỗi câu đúng được ${p3PerQ} điểm)
            </p>
            ${p3Html || '<p style="font-style: italic; font-size: 10.5pt;">(Không có câu hỏi ở phần này)</p>'}

            <p style="font-weight: bold; color: #1e40af; margin: 14px 0 2px 0;">
                PHẦN IV. Tự luận (${countP4} câu - ${scoreP4} điểm)
            </p>
            ${p4Html || '<p style="font-style: italic; font-size: 10.5pt;">(Không có câu hỏi ở phần này)</p>'}

            <div style="margin-top: 25px; text-align: right; font-style: italic; font-weight: bold;">
                Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít
            </div>
        </div>
    `;
};

// 7. GHI ĐÈ HÀM GỌI AI BÁM SÁT 3 TỆP CHỈ DẪN SƯ PHẠM
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
        filePromptPart = `\n- NGỮ LIỆU BỔ SUNG TỪ TÀI LIỆU TẢI LÊN: """${uploadedFileContent.slice(0, 8000)}"""`;
    }

    // ==================== [A] SOẠN SLIDE BÁM SÁT TỆP: AI- TẠO SLIDE PPT.docx ====================
    if (currentActiveMode === 'slide') {
        statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang thiết kế Slide 16:9 Typography >= 34pt...</span>`;
        
        const promptSlide = `Bạn là "CHUYÊN GIA THIẾT KẾ BÀI GIẢNG SƯ PHẠM VÀ HỘI GIẢNG TOÀN QUỐC" theo chuẩn Công văn 5512/BGDĐT-GDTrH và CT GDPT 2018.
Nhiệm vụ: Thiết kế bộ slide bài giảng 16:9 cho bài: "${lessonTitle}", môn ${subject} ${grade}, bộ sách "Kết nối tri thức với cuộc sống".
CHỈ DẪN GIÁO VIÊN: """${customGuide || "Ưu tiên làm nổi bật kiến thức trọng tâm SGK, các quy luật sinh học và bài tập liên hệ thực tiễn huyện Mang Thít, tỉnh Vĩnh Long."}"""${filePromptPart}

BỘ NGUYÊN TẮC THIẾT KẾ BẮT BUỘC (CRITICAL DESIGN RULES):
1. PHÂN CẤP CỠ CHỮ TUYỆT ĐỐI: Tất cả các chữ trên slide BẮT BUỘC từ 34pt trở lên (Tiêu đề 51-52pt, Thẻ mục 41-42pt, Nội dung 38-40pt). Tuyệt đối không có cỡ chữ dưới 34pt.
2. BẢNG MÃ MÀU 60-30-10 MÔN SINH HỌC/NÔNG NGHIỆP: Nền tối/Xanh rừng sâu #0F2922, chữ trắng/kem sáng, nhấn Vàng Gold #D78C0F & Đỏ cam #C02626.
3. TIẾN TRÌNH DẠY HỌC 4 HOẠT ĐỘNG:
   - HĐ 1 (Mở đầu): Slide 1 Bìa bài học; Slide 2 Tình huống có vấn đề kèm 2 câu hỏi định hướng tư duy.
   - HĐ 2 (Hình thành kiến thức): Mỗi mục SGK một slide. NGAY SAU MỖI MỤC LỚN BẮT BUỘC CÓ 1 SLIDE ĐỘC LẬP: "[KIẾN THỨC CỐT LÕI CẦN GHI NHỚ - MỤC ... (NỘI DUNG GHI VỞ)]".
   - HĐ 3 (Luyện tập):
     * Dạng 1: Đủ 6 câu trắc nghiệm 4 lựa chọn nằm trên 6 slides riêng biệt.
     * Dạng 2: Đủ 4 câu trắc nghiệm Đúng/Sai đa ý nằm trên 4 slides riêng biệt (bối cảnh đồ thị/thực nghiệm/y học/môi trường).
     * Dạng 3: Đủ 6 câu trắc nghiệm trả lời ngắn nằm trên 6 slides riêng biệt (đáp án số/chuỗi số <= 4 ký tự).
     * Tất cả các câu hỏi đều có nút/khối đáp án ẩn (chỉ hiển thị khi bấm, không lộ đáp án khi chiếu).
   - HĐ 4 (Vận dụng): 1 Slide dự án học tập thực tế huyện Mang Thít, tỉnh Vĩnh Long kèm Rubric đánh giá ngắn gọn.
   - Cuối sản phẩm ghi: "Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít".

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC: Trả về DUY NHẤT một mảng JSON thuần túy (không bọc text ngoài):
[
  {
    "tag": "HOẠT ĐỘNG 1: KHỞI ĐỘNG",
    "title": "TÌNH HUỐNG MỞ ĐẦU",
    "body": "<div class='space-y-3 text-lg'><p>Nội dung câu hỏi tình huống...</p></div>"
  }
]`;

        try {
            const aiResult = await fetchGeminiWithCascade(promptSlide, savedKey, preferredModel);
            let raw = aiResult.text.replace(/```json/gi, '').replace(/```/gi, '').trim();
            const newSlides = JSON.parse(raw);

            if (Array.isArray(newSlides) && newSlides.length > 0) {
                slideDeckData = newSlides;
                currentSlideIndex = 0;
                renderCurrentSlide();
                showAIReviewBar();
                statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> AI đã tạo ${newSlides.length} slide chuẩn Hội giảng! Thầy bấm "Lưu Lại" để hoàn tất.</span>`;
            } else {
                throw new Error("Dữ liệu JSON không hợp lệ");
            }
        } catch (e) {
            console.error("Lỗi slide AI:", e);
            alert("Lỗi tạo slide AI: " + e.message + ". Đang nạp bản slide mẫu.");
            renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        }
        return;
    }

    // ==================== [B] SOẠN GIÁO ÁN & ĐỀ THI ====================
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 75px 20px; font-family: sans-serif;">
            <div style="font-size: 38px; color: #9333ea; margin-bottom: 16px;"><i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i></div>
            <h3 style="font-size: 15pt; font-weight: bold; color: #0f172a;" id="ai-loading-status">Đang kết nối Gemini...</h3>
            <p style="color: #64748b; font-size: 11pt; margin-top: 6px;">
                Đang biên soạn: <strong>${currentActiveMode === '5512' ? 'Kế hoạch bài dạy CV 5512 High-End' : 'Hồ sơ khảo thí & Đề thi 7991 (4 Phần)'}</strong> - ${lessonTitle}
            </p>
        </div>
    `;
    statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang biên soạn dữ liệu...</span>`;

    try {
        // --- [B1] ĐỀ THI BÁM SÁT: AI. TẠO ĐỀ.docx ---
        if (currentActiveMode === '7991') {
            const lessons = (selectedLessonsForExam && selectedLessonsForExam.length > 0) ? selectedLessonsForExam.join(', ') : lessonTitle;
            const promptExam = `Bạn là chuyên gia khảo thí THPT hàng đầu Việt Nam môn ${subject} ${grade}. Hãy biên soạn HỒ SƠ KHẢO THÍ VÀ ĐỀ KIỂM TRA ĐỊNH KỲ bám sát Quyết định 7991/BGDĐT cho: ${lessons}. Bộ sách: ${book}.
CHỈ DẪN GIÁO VIÊN: """${customGuide}"""${filePromptPart}

YÊU CẦU ĐÚNG MA TRẬN VÀ THANG ĐIỂM KHỐNG CHẾ 10.0 ĐIỂM:
1. PHẦN I (Trắc nghiệm 4 lựa chọn - ${matrixPartScores.p1} điểm): ${matrixGlobalTotals.p1_b} câu Biết, ${matrixGlobalTotals.p1_h} câu Hiểu, ${matrixGlobalTotals.p1_vd} câu Vận dụng (in đậm hoặc gạch chân đáp án đúng).
2. PHẦN II (Trắc nghiệm Đúng/Sai - ${matrixPartScores.p2} điểm): ${(parseInt(matrixGlobalTotals.p2_b)||0) + (parseInt(matrixGlobalTotals.p2_h)||0) + (parseInt(matrixGlobalTotals.p2_vd)||0)} Ý LỆNH HỎI (${matrixGlobalTotals.p2_b} ý Biết, ${matrixGlobalTotals.p2_h} ý Hiểu, ${matrixGlobalTotals.p2_vd} ý Vận dụng). Mỗi câu gồm bối cảnh nghiên cứu thực nghiệm và 4 ý a, b, c, d có [ĐÚNG] hoặc [SAI].
3. PHẦN III (Trắc nghiệm Trả lời ngắn - ${matrixPartScores.p3} điểm): Gồm ${matrixGlobalTotals.p3_b} câu Biết, ${matrixGlobalTotals.p3_h} câu Hiểu, ${matrixGlobalTotals.p3_vd} câu Vận dụng. Mỗi câu điền số/từ ngắn kèm đáp án.
4. PHẦN IV (Tự luận - ${matrixPartScores.p4} điểm): Gồm ${matrixGlobalTotals.p4_b} câu Biết, ${matrixGlobalTotals.p4_h} câu Hiểu, ${matrixGlobalTotals.p4_vd} câu Vận dụng (yêu cầu phân tích cơ chế và giải pháp thực tế nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long).

KÈM BẢNG ĐÁP ÁN VÀ THANG ĐIỂM BAREM CHI TIẾT TỪNG PHẦN ĐỦ 10.0 ĐIỂM Ở CUỐI ĐỀ.
Cuối bài ghi: "Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít".
Định dạng HTML thuần túy không bọc markdown. Font Times New Roman 13pt.`;

            const aiResult = await fetchGeminiWithCascade(promptExam, savedKey, preferredModel);
            let out = aiResult.text.replace(/^```html/i, '').replace(/```$/i, '').trim();
            docContainer.innerHTML = out;
            temporaryAIGeneratedDoc = out;
            showAIReviewBar();
            statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã tạo xong Đề thi 7991 (4 Phần) qua [${aiResult.modelUsed}]!</span>`;
            return;
        }

        // --- [B2] GIÁO ÁN BÁM SÁT: AI- TẠO GIÁO ÁN.docx ---
        const info = getDynamicNlsAiInfo(lessonTitle, grade);
        const prompt5512 = `Bạn là "SIÊU AI SƯ PHẠM & KIẾN TẠO GIÁO ÁN ĐẲNG CẤP HIGH-END" am hiểu tường tận Công văn 5512/BGDĐT-GDTrH và Khung năng lực số 1007/QĐ-BGDĐT.
Nhiệm vụ: Biên soạn nội dung chuyên môn bám sát SGK Kết nối tri thức cho bài: "${lessonTitle}", môn ${subject} ${grade}.
CHỈ DẪN GIÁO VIÊN: """${customGuide}"""${filePromptPart}

BỘ QUY TẮC BẮT BUỘC THEO CV 5512 CẢI TIẾN HIGH-END:
1. HOẠT ĐỘNG 2 (Hình thành kiến thức mới): BẮT BUỘC TRÌNH BÀY DẠNG BẢNG 2 CỘT KẺ VIỀN ĐEN 100%.
   - Cột 1 (Bên trái): "HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH" (Đủ 4 bước: Bước 1 Chuyển giao nhiệm vụ -> Bước 2 Thực hiện nhiệm vụ -> Bước 3 Báo cáo, thảo luận -> Bước 4 Kết luận, nhận định).
   - Cột 2 (Bên phải): "DỰ KIẾN SẢN PHẨM" (Kiến thức chuẩn hóa, chi tiết. KHÔNG ghi "nội dung bài học" trên tiêu đề cột).
   - Tích hợp Năng lực số: 👉 [Tích hợp năng lực số]: [${info.nls}] - Ghi rõ thao tác GV và HS.
   - Tích hợp Năng lực AI: 👉 [Tích hợp năng lực AI]: [Mã ${info.aiCode}] - Ghi rõ vị trí AI can thiệp và vị trí Con người giữ quyền kiểm soát tối cao & ra quyết định. Không tích hợp cả 2 năng lực vào cùng 1 hoạt động.
2. HOẠT ĐỘNG 3 (Luyện tập): TUYỆT ĐỐI KHÔNG CHIA BẢNG. Trình bày văn bản 4 bước kèm "* DỰ KIẾN SẢN PHẨM" gồm đủ 3 dạng:
   - Dạng 1: Trắc nghiệm 4 lựa chọn (4 câu hỏi có đáp án in đậm).
   - Dạng 2: Trắc nghiệm Đúng / Sai (1 câu hỏi gồm 4 ý a, b, c, d bối cảnh thực nghiệm khoa học, ghi rõ [ĐÚNG] hoặc [SAI]).
   - Dạng 3: Trắc nghiệm trả lời ngắn (2 câu điền từ/số).
3. HOẠT ĐỘNG 4 (Vận dụng): TUYỆT ĐỐI KHÔNG CHIA BẢNG. Trình bày văn bản 4 bước và "* DỰ KIẾN SẢN PHẨM" gắn với thực tế tại huyện Mang Thít, tỉnh Vĩnh Long.
4. KHÔNG ghi phân bổ số phút ở tiêu đề các hoạt động. Dùng dấu gạch ngang (-) ở đầu dòng, KHÔNG dùng (-) trước các đáp án trắc nghiệm.
Cuối bài ghi: "Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít".
Định dạng HTML thuần túy không bọc markdown. Font Times New Roman 13pt.`;

        const aiResult = await fetchGeminiWithCascade(prompt5512, savedKey, preferredModel);
        let textOut = aiResult.text.replace(/^```html/i, '').replace(/```$/i, '').trim();
        const fixedAiHtml = sanitizeAndFixAIActivities(textOut);

        renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle, fixedAiHtml);
        temporaryAIGeneratedDoc = docContainer.innerHTML;
        showAIReviewBar();
        statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã bơm kiến thức 5512 chuẩn mực qua [${aiResult.modelUsed}]!</span>`;

    } catch (error) {
        console.error("Lỗi AI:", error);
        statusInd.innerHTML = `<span class="text-amber-400 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> AI gặp sự cố</span>`;
        displayContentForCurrentLesson();
        alert("Lỗi AI: " + error.message);
    }
};

// 8. TỰ ĐỘNG CHẠY PHÂN BỔ VÀ HIỂN THỊ KHI LOAD SCRIPT
if (typeof distributeMatrixFromTotals === 'function') {
    distributeMatrixFromTotals();
    if (typeof displayContentForCurrentLesson === 'function') {
        displayContentForCurrentLesson();
    }
}
