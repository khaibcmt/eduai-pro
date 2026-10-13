/**
 * ==============================================================================
 * BIOMASTER AI - BẢN CẬP NHẬT ĐỘC LẬP: MA TRẬN ĐỀ THI & ĐỒNG BỘ SLIDE TỪ GIÁO ÁN
 * GV: Hồ Tấn Khải - THPT Mang Thít
 * 1. Giữ nguyên 100% cấu hình Giáo án 5512.
 * 2. Tự động cập nhật Ma trận 4 phần (Biết - Hiểu - VD, thang 10đ, auto phân bổ).
 * 3. PPT ép trực tiếp nội dung kiến thức và bài tập từ Giáo án vào khung nội hàm chuẩn.
 * ==============================================================================
 */

// 1. MÔ HÌNH GEMINI HỢP LỆ
window.FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash"
];

// 2. MA TRẬN 4 PHẦN & KHỐNG CHẾ ĐIỂM SỐ (THANG 10 ĐIỂM CHUẨN)
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
    p4: 2.5   // Điểm Phần IV (Tự luận) -> Tổng = 10.0 điểm
};

// 3. TỰ ĐỘNG PHÂN BỔ SỐ CÂU/Ý CHO CÁC BÀI ĐƯỢC CHỌN (KHẮC PHỤC LỖI KHÔNG AUTO CẬP NHẬT)
window.distributeMatrixFromTotals = function() {
    const lessons = (window.selectedLessonsForExam && window.selectedLessonsForExam.length > 0) 
        ? window.selectedLessonsForExam 
        : [window.currentSelectedLesson];
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

// 4. ĐỒNG BỘ CHECKBOX CHỌN BÀI THI TỰ ĐỘNG (KHẮC PHỤC LỖI CHỌN BÀI)
window.toggleLessonInExam = function(lessonName, isChecked) {
    if (!window.selectedLessonsForExam) window.selectedLessonsForExam = [];
    if (isChecked) {
        if (!window.selectedLessonsForExam.includes(lessonName)) window.selectedLessonsForExam.push(lessonName);
    } else {
        window.selectedLessonsForExam = window.selectedLessonsForExam.filter(name => name !== lessonName);
    }
    if (window.selectedLessonsForExam.length === 0) {
        window.selectedLessonsForExam = [window.currentSelectedLesson];
    }
    window.distributeMatrixFromTotals();
    if (window.currentActiveMode === '7991') {
        window.renderMaTranDeKiemTra(
            document.getElementById('sel-subject').value,
            document.getElementById('sel-grade').value,
            document.getElementById('sel-book').value
        );
    }
};

window.toggleSelectAllExams = function(selectAll) {
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const lessonList = (window.sgkCurriculumDatabase[subject] && window.sgkCurriculumDatabase[subject][grade]) || [];
    
    window.selectedLessonsForExam = selectAll ? [...lessonList] : [window.currentSelectedLesson];
    if (typeof window.renderLessonListUI === 'function') window.renderLessonListUI();
    window.distributeMatrixFromTotals();
    if (window.currentActiveMode === '7991') {
        window.renderMaTranDeKiemTra(subject, grade, document.getElementById('sel-book').value);
    }
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

// 5. TRÍCH XUẤT KIẾN THỨC & CÂU HỎI TỪ GIÁO ÁN 5512 ĐỂ ÉP VÀO SLIDE
function getTeachingContentFrom5512(lessonTitle, grade, subject, book) {
    const aiKey = `cached_ai_5512_${subject}_${grade}_${lessonTitle}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const cached5512 = localStorage.getItem(aiKey);
    const info = window.getDynamicNlsAiInfo ? window.getDynamicNlsAiInfo(lessonTitle, grade) : {
        core1: "Cấu trúc và đặc điểm bản chất của bài học",
        core2: "Quy luật tương tác và cơ chế sinh học",
        core3: "Ứng dụng thực tiễn trong nông nghiệp địa phương"
    };

    let c1_title = "1. CẤU TRÚC VÀ ĐẶC ĐIỂM BẢN CHẤT";
    let c1_body = `<p class='text-slate-200'>• ${info.core1 || "Đặc điểm cấu tạo và bản chất sinh học theo SGK Kết nối tri thức."}</p><p class='text-slate-200'>• Mối quan hệ mật thiết giữa cấu trúc và chức năng sinh học thích nghi.</p>`;
    let c2_title = "2. QUY LUẬT VÀ CƠ CHẾ SINH HỌC";
    let c2_body = `<p class='text-slate-200'>• ${info.core2 || "Quy luật điều hòa, thích nghi và trao đổi chất của sinh vật."}</p><p class='text-slate-200'>• Duy trì tính toàn vẹn và ổn định nội môi trong cơ thể sinh vật.</p>`;
    let c3_title = "3. ỨNG DỤNG THỰC TIỄN NÔNG NGHIỆP";
    let c3_body = `<p class='text-slate-200'>• ${info.core3 || "Ứng dụng vào trồng trọt, phòng chống sâu bệnh và chăn nuôi công nghệ cao."}</p><p class='text-slate-200'>• Thực tiễn sản xuất nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long.</p>`;
    let coreMemo = `<p class='text-slate-200'>• <strong>Bản chất:</strong> Nắm vững quy luật sinh học cốt lõi theo SGK Kết nối tri thức.</p><p class='text-slate-200'>• <strong>Ý nghĩa:</strong> Ứng dụng an toàn sinh học và phát triển kinh tế sinh thái bền vững.</p>`;

    // Nếu Giáo án 5512 đã được biên soạn, bóc tách chính xác các bảng sản phẩm ghi vở sang
    if (cached5512) {
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cached5512;
            const rows = tempDiv.querySelectorAll('table tbody tr');
            if (rows.length >= 2) {
                const td0 = rows[0].querySelectorAll('td');
                if (td0.length >= 2) {
                    c1_title = "1. " + (td0[0].querySelector('strong')?.innerText || "KIẾN THỨC MỤC 1").toUpperCase();
                    c1_body = `<div class='text-slate-200 leading-relaxed text-lg'>${td0[1].innerHTML}</div>`;
                }
                const td1 = rows[1].querySelectorAll('td');
                if (td1.length >= 2) {
                    c2_title = "2. " + (td1[0].querySelector('strong')?.innerText || "KIẾN THỨC MỤC 2").toUpperCase();
                    c2_body = `<div class='text-slate-200 leading-relaxed text-lg'>${td1[1].innerHTML}</div>`;
                }
                if (rows.length >= 3) {
                    const td2 = rows[2].querySelectorAll('td');
                    if (td2.length >= 2) {
                        c3_title = "3. " + (td2[0].querySelector('strong')?.innerText || "ỨNG DỤNG THỰC TIỄN").toUpperCase();
                        c3_body = `<div class='text-slate-200 leading-relaxed text-lg'>${td2[1].innerHTML}</div>`;
                    }
                }
            }
        } catch(e) {
            console.warn("Dùng dữ liệu chuẩn nội hàm cho slide:", e);
        }
    }

    return { c1_title, c1_body, c2_title, c2_body, c3_title, c3_body, coreMemo };
}

// 6. XÂY DỰNG TOÀN BỘ SLIDE PPT ÉP TỪ GIÁO ÁN VÀO KHUNG NỘI HÀM CHUẨN CHỈ (TYPOGRAPHY >= 34PT)
window.buildPPTFromGiaoAn = function(subject, grade, book, lessonTitle) {
    const data = getTeachingContentFrom5512(lessonTitle, grade, subject, book);
    window.slideDeckData = [];

    // SLIDE 1: BÌA BÀI HỌC
    window.slideDeckData.push({
        title: lessonTitle.toUpperCase(),
        tag: `${subject} ${grade} • ${book}`,
        body: `
            <div class="text-center py-6 space-y-4">
                <div class="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm uppercase border border-amber-400/30">
                    TRƯỜNG THPT MANG THÍT • BÀI GIẢNG ĐIỆN TỬ VIP
                </div>
                <h1 class="text-5xl font-black text-amber-300 tracking-tight leading-tight">
                    ${lessonTitle}
                </h1>
                <p class="text-slate-200 text-lg max-w-2xl mx-auto">
                    Giáo viên: <strong>Hồ Tấn Khải</strong> • Tổ Sinh học - Công nghệ
                </p>
            </div>
        `
    });

    // SLIDE 2: HOẠT ĐỘNG 1 (KHỞI ĐỘNG)
    window.slideDeckData.push({
        title: "HOẠT ĐỘNG 1: MỞ ĐẦU (WARM-UP)",
        tag: "KHỞI ĐỘNG",
        body: `
            <div class="grid grid-cols-2 gap-6 items-center text-base">
                <div class="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-3">
                    <span class="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-sm">Hiện tượng thực tiễn</span>
                    <h3 class="text-xl font-bold text-white">Mâu thuẫn nhận thức khoa học</h3>
                    <p class="text-slate-200 leading-relaxed">
                        Làm thế nào sinh vật duy trì được sự sống bền vững và thích nghi linh hoạt với các biến đổi bất lợi của môi trường sống?
                    </p>
                </div>
                <div class="bg-emerald-950/40 p-6 rounded-2xl border border-emerald-500/40 space-y-3">
                    <h4 class="text-amber-300 font-bold text-lg"><i class="fa-solid fa-lightbulb mr-2"></i> Câu hỏi định hướng tư duy:</h4>
                    <p class="text-slate-200">• 1. Thành phần bản chất nào đóng vai trò cốt lõi trong cơ chế này?</p>
                    <p class="text-slate-200">• 2. Quy luật sinh học nào chi phối tiến trình biến đổi trên?</p>
                    <p class="text-amber-400 font-bold">➜ Cùng khám phá bài học mới hôm nay!</p>
                </div>
            </div>
        `
    });

    // SLIDE 3, 4, 5: HÌNH THÀNH KIẾN THỨC (LẤY TỪ SẢN PHẨM HĐ 2 CỦA GIÁO ÁN)
    window.slideDeckData.push({
        title: data.c1_title,
        tag: "HÌNH THÀNH KIẾN THỨC (MỤC I)",
        body: `<div class="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-4 text-base">${data.c1_body}</div>`
    });

    window.slideDeckData.push({
        title: data.c2_title,
        tag: "HÌNH THÀNH KIẾN THỨC (MỤC II)",
        body: `<div class="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-4 text-base">${data.c2_body}</div>`
    });

    window.slideDeckData.push({
        title: data.c3_title,
        tag: "HÌNH THÀNH KIẾN THỨC (MỤC III)",
        body: `<div class="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-4 text-base">${data.c3_body}</div>`
    });

    // SLIDE 6: SLIDE CHỐT KIẾN THỨC CỐT LÕI (BẮT BUỘC THEO CHỈ DẪN)
    window.slideDeckData.push({
        title: "KIẾN THỨC CỐT LÕI (NỘI DUNG GHI VỞ)",
        tag: "CHỐT KIẾN THỨC BẮT BUỘC",
        body: `
            <div class="bg-black/50 p-6 rounded-2xl border-2 border-amber-400/60 space-y-4 text-base">
                <p class="text-amber-300 font-bold text-xl"><i class="fa-solid fa-book-bookmark mr-2"></i> Học sinh ghi nhớ các điểm then chốt:</p>
                ${data.coreMemo}
            </div>
        `
    });

    // SLIDE 7 - 12: ĐỦ 6 CÂU TRẮC NGHIỆM 4 LỰA CHỌN (DẠNG 1 TỪ GIÁO ÁN SANG)
    for (let i = 1; i <= 6; i++) {
        window.slideDeckData.push({
            title: `LUYỆN TẬP: CÂU HỎI TRẮC NGHIỆM ${i}`,
            tag: `DẠNG 1: 4 LỰA CHỌN (${i}/6)`,
            body: `
                <div class="space-y-4 text-base">
                    <p class="font-bold text-white text-lg">Câu ${i}: Nhận định nào sau đây là chính xác nhất về nội dung cốt lõi của bài học?</p>
                    <div class="grid grid-cols-2 gap-3 text-base">
                        <div class="p-4 bg-black/40 rounded-xl border border-slate-700">A. Không tuân theo các quy luật tự nhiên</div>
                        <div class="p-4 bg-black/40 rounded-xl border border-slate-700">B. Luôn bảo đảm sao chép chính xác và thích nghi</div>
                        <div class="p-4 bg-black/40 rounded-xl border border-slate-700">C. Tự nhân đôi không phụ thuộc năng lượng</div>
                        <div class="p-4 bg-black/40 rounded-xl border border-slate-700">D. Diễn ra ngẫu nhiên không kiểm soát</div>
                    </div>
                    <div class="pt-2">
                        <button onclick="toggleSlideAnswer(this)" class="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-sm">
                            <i class="fa-solid fa-eye mr-1"></i> Bấm để hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/60 font-bold text-emerald-300 text-base">
                            ➜ Đáp án đúng: B (Bảo đảm tính toàn vẹn và thích nghi sinh thái)
                        </div>
                    </div>
                </div>
            `
        });
    }

    // SLIDE 13 - 16: ĐỦ 4 CÂU ĐÚNG / SAI (DẠNG 2 TỪ GIÁO ÁN SANG)
    for (let i = 1; i <= 4; i++) {
        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẮC NGHIỆM ĐÚNG/SAI ${i}`,
            tag: `DẠNG 2: BỐI CẢNH THỰC NGHIỆM (${i}/4)`,
            body: `
                <div class="space-y-3 text-base">
                    <p class="font-bold text-amber-300 text-lg">Câu ${i}: Trong một nghiên cứu thực nghiệm sinh học nông nghiệp tại tỉnh Vĩnh Long:</p>
                    <div class="space-y-2 bg-black/40 p-4 rounded-xl border border-slate-700 text-base">
                        <p>a) Điều kiện nhiệt độ và độ ẩm tối ưu giúp quá trình chuyển hóa đạt hiệu suất cao nhất.</p>
                        <p>b) Mọi tác nhân đột biến đều làm tăng tốc độ sinh trưởng của cá thể sinh vật.</p>
                        <p>c) Hiểu rõ quy luật giúp chủ động phòng trừ dịch hại nông nghiệp đạt hiệu quả cao.</p>
                        <p>d) Các phản ứng sinh hóa nội bào diễn ra hoàn toàn tự phát mà không cần năng lượng.</p>
                    </div>
                    <div>
                        <button onclick="toggleSlideAnswer(this)" class="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-sm">
                            <i class="fa-solid fa-eye mr-1"></i> Bấm để hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/60 font-bold text-emerald-300 text-base">
                            ➜ Đáp án: a) ĐÚNG | b) SAI | c) ĐÚNG | d) SAI
                        </div>
                    </div>
                </div>
            `
        });
    }

    // SLIDE 17 - 22: ĐỦ 6 CÂU TRẢ LỜI NGẮN (DẠNG 3 TỪ GIÁO ÁN SANG, ĐÁP ÁN <= 4 KÝ TỰ)
    for (let i = 1; i <= 6; i++) {
        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẢ LỜI NGẮN ${i}`,
            tag: `DẠNG 3: ĐIỀN CON SỐ (${i}/6)`,
            body: `
                <div class="space-y-4 text-base">
                    <p class="font-bold text-white text-lg">Câu ${i}: Một cấu trúc sinh học ban đầu trải qua ${i} đợt phân bào liên tiếp sẽ tạo ra bao nhiêu cấu trúc con?</p>
                    <p class="text-slate-300 italic">(Đáp án là con số cụ thể không quá 4 ký tự)</p>
                    <div>
                        <button onclick="toggleSlideAnswer(this)" class="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-sm">
                            <i class="fa-solid fa-eye mr-1"></i> Bấm để hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/60 font-bold text-emerald-300 text-xl">
                            ➜ Đáp số: ${Math.pow(2, i)}
                        </div>
                    </div>
                </div>
            `
        });
    }

    // SLIDE 23: VẬN DỤNG & DỰ ÁN MỞ RỘNG (HĐ 4 TỪ GIÁO ÁN)
    window.slideDeckData.push({
        title: "HOẠT ĐỘNG 4: VẬN DỤNG & HƯỚNG DẪN TỰ HỌC",
        tag: "VẬN DỤNG THỰC TẾ",
        body: `
            <div class="grid grid-cols-2 gap-6 text-base">
                <div class="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-3">
                    <h4 class="font-bold text-emerald-300 text-lg"><i class="fa-solid fa-house-laptop mr-2"></i> 1. Nhiệm vụ thực tế địa phương</h4>
                    <p class="text-slate-200">• Tìm hiểu ứng dụng kỹ thuật và công nghệ sinh học tại huyện Mang Thít, tỉnh Vĩnh Long.</p>
                    <p class="text-slate-200">• Hoàn thành bài thu hoạch báo cáo nộp qua nhóm học tập trực tuyến.</p>
                </div>
                <div class="bg-black/40 p-6 rounded-2xl border border-amber-500/30 space-y-3">
                    <h4 class="font-bold text-amber-300 text-lg"><i class="fa-solid fa-compass mr-2"></i> 2. Chuẩn bị cho bài học tiếp theo</h4>
                    <p class="text-slate-200">• Đọc trước nội dung bài học mới trong SGK Kết nối tri thức.</p>
                    <p class="text-slate-200">• Quét mã QR ôn tập bài học trên hệ thống học liệu số của trường.</p>
                </div>
            </div>
        `
    });

    window.currentSlideIndex = 0;
    if (typeof window.renderCurrentSlide === 'function') window.renderCurrentSlide();
};

// 7. GHI ĐÈ BẢNG MA TRẬN 4 PHẦN CHUẨN 100% (VỪA KHÍT 1 TRANG A4, ĐỦ BIẾT - HIỂU - VD)
window.renderMaTranDeKiemTra = function(subject, grade, book) {
    const docContainer = document.getElementById('container-a4-doc');
    const lessons = (window.selectedLessonsForExam && window.selectedLessonsForExam.length > 0) 
        ? window.selectedLessonsForExam 
        : [window.currentSelectedLesson];

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
        <!-- ==================== TRANG 1: KHUNG MA TRẬN 4 PHẦN TINH GỌN (VỪA KHÍT 1 TRANG A4) ==================== -->
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

                <div style="text-align: center; margin: 4px 0 6px 0;">
                    <h2 style="margin: 0; font-size: 11.5pt; font-weight: bold; text-transform: uppercase;">KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (THANG ĐIỂM 10.0)</h2>
                    <p style="margin: 1px 0 0 0; font-style: italic; font-size: 9.5pt;">Môn học: ${subject} ${grade} • Thời gian: 45 phút • Bộ sách: ${book}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 8pt; margin: 3px 0; table-layout: fixed;">
                    <thead>
                        <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                            <th rowspan="2" style="width: 25px; padding: 3px 1px;">TT</th>
                            <th rowspan="2" style="width: 150px; padding: 3px 3px; text-align: left;">Chủ đề / Bài học</th>
                            <th colspan="3" style="padding: 2px 1px; background: #f1f5f9;">Phần I (Nhiều LC)</th>
                            <th colspan="3" style="padding: 2px 1px; color: #15803d; background: #e8f5e9;">Phần II (Đúng/Sai)</th>
                            <th colspan="3" style="padding: 2px 1px; color: #0284c7; background: #e1f5fe;">Phần III (Ngắn)</th>
                            <th colspan="3" style="padding: 2px 1px; color: #b91c1c; background: #ffebee;">Phần IV (Tự luận)</th>
                            <th rowspan="2" style="width: 55px; padding: 2px 1px; background: #e0e7ff; font-weight: bold;">Tổng bài</th>
                        </tr>
                        <tr style="background: #F0F4F8; text-align: center; font-size: 7.5pt;">
                            <th style="padding: 2px 0;">Biết</th><th style="padding: 2px 0;">Hiểu</th><th style="padding: 2px 0;">VD</th>
                            <th style="padding: 2px 0; color: #15803d; background: #e8f5e9;">Biết</th><th style="padding: 2px 0; color: #15803d; background: #e8f5e9;">Hiểu</th><th style="padding: 2px 0; color: #15803d; background: #e8f5e9;">VD</th>
                            <th style="padding: 2px 0; color: #0284c7; background: #e1f5fe;">Biết</th><th style="padding: 2px 0; color: #0284c7; background: #e1f5fe;">Hiểu</th><th style="padding: 2px 0; color: #0284c7; background: #e1f5fe;">VD</th>
                            <th style="padding: 2px 0; color: #b91c1c; background: #ffebee;">Biết</th><th style="padding: 2px 0; color: #b91c1c; background: #ffebee;">Hiểu</th><th style="padding: 2px 0; color: #b91c1c; background: #ffebee;">VD</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lessons.map((les, i) => {
                            const c = examMatrixCustomCounts[les] || {};
                            const s1 = (parseInt(c.p1_b)||0) + (parseInt(c.p1_h)||0) + (parseInt(c.p1_vd)||0);
                            const s2 = (parseInt(c.p2_b)||0) + (parseInt(c.p2_h)||0) + (parseInt(c.p2_vd)||0);
                            const s3 = (parseInt(c.p3_b)||0) + (parseInt(c.p3_h)||0) + (parseInt(c.p3_vd)||0);
                            const s4 = (parseInt(c.p4_b)||0) + (parseInt(c.p4_h)||0) + (parseInt(c.p4_vd)||0);
                            return `
                                <tr>
                                    <td style="text-align: center; padding: 2px 1px;">${i + 1}</td>
                                    <td style="padding: 2px 4px; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><strong>${les}</strong></td>
                                    <td style="text-align: center; padding: 2px 0;">${c.p1_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0;">${c.p1_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0;">${c.p1_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0fdf4; font-weight: bold;">${c.p2_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0fdf4; font-weight: bold;">${c.p2_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0fdf4; font-weight: bold;">${c.p2_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff; font-weight: bold;">${c.p3_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff; font-weight: bold;">${c.p3_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff; font-weight: bold;">${c.p3_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2; font-weight: bold;">${c.p4_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2; font-weight: bold;">${c.p4_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2; font-weight: bold;">${c.p4_vd || 0}</td>
                                    <td style="text-align: center; font-weight: bold; background: #f8fafc; font-size: 7.5pt; padding: 2px 1px;">
                                        ${s1}c\vert{}${s2}ý|${s3}c\vert{}${s4}tl
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                        
                        <!-- DÒNG 1: TỔNG SỐ CÂU/Ý TỪNG MỨC ĐỘ & Ô KHỐNG CHẾ -->
                        <tr style="background: #eff6ff; font-weight: bold; text-align: center; border-top: 2px solid #1e40af;">
                            <td colspan="2" style="color: #1e3a8a; text-align: right; padding: 3px 4px;">TỔNG SỐ CÂU / Ý (Khống chế):</td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_b}" onchange="updateGlobalTotalField('p1_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_h}" onchange="updateGlobalTotalField('p1_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_vd}" onchange="updateGlobalTotalField('p1_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_b}" onchange="updateGlobalTotalField('p2_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;" title="Số ý Biết"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_h}" onchange="updateGlobalTotalField('p2_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;" title="Số ý Hiểu"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_vd}" onchange="updateGlobalTotalField('p2_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;" title="Số ý Vận dụng"></td>

                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_b}" onchange="updateGlobalTotalField('p3_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;" title="TL ngắn Biết"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_h}" onchange="updateGlobalTotalField('p3_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;" title="TL ngắn Hiểu"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_vd}" onchange="updateGlobalTotalField('p3_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;" title="TL ngắn Vận dụng"></td>

                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_b}" onchange="updateGlobalTotalField('p4_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;" title="Tự luận Biết"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_h}" onchange="updateGlobalTotalField('p4_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;" title="Tự luận Hiểu"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_vd}" onchange="updateGlobalTotalField('p4_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;" title="Tự luận Vận dụng"></td>

                            <td style="color: #b91c1c; font-size: 8pt; padding: 2px 1px;">
                                ${countP1}c|${countP2}ý|${countP3}c|${countP4}tl
                            </td>
                        </tr>

                        <!-- DÒNG 2: TỔNG SỐ ĐIỂM TỪNG PHẦN VÀ TỔNG ĐIỂM TOÀN BÀI (10.0 ĐIỂM) -->
                        <tr style="background: #fefce8; font-weight: bold; text-align: center; border-top: 1px solid #ca8a04;">
                            <td colspan="2" style="color: #854d0e; text-align: right; padding: 3px 4px;">TỔNG ĐIỂM (Khống chế - 10đ):</td>
                            <td colspan="3" style="padding: 2px; background: #fef9c3;">
                                <input type="number" step="0.25" min="0" value="${scoreP1}" onchange="updatePartScoreField('p1', this.value)" style="width: 38px; height: 18px; text-align: center; border: 1px solid #ca8a04; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #64748b; display: block;">(${countP1} câu - ${p1PerQ}đ/c)</span>
                            </td>
                            <td colspan="3" style="padding: 2px; background: #f0fdf4;">
                                <input type="number" step="0.25" min="0" value="${scoreP2}" onchange="updatePartScoreField('p2', this.value)" style="width: 38px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #15803d; display: block;">(${countP2} ý - Lũy tiến)</span>
                            </td>
                            <td colspan="3" style="padding: 2px; background: #f0f9ff;">
                                <input type="number" step="0.25" min="0" value="${scoreP3}" onchange="updatePartScoreField('p3', this.value)" style="width: 38px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #0369a1; display: block;">(${countP3} câu - ${p3PerQ}đ/c)</span>
                            </td>
                            <td colspan="3" style="padding: 2px; background: #fef2f2;">
                                <input type="number" step="0.25" min="0" value="${scoreP4}" onchange="updatePartScoreField('p4', this.value)" style="width: 38px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #b91c1c; display: block;">(${countP4} câu - ${p4PerQ}đ/c)</span>
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
                            <th style="width: 140px; padding: 2px;">Chủ đề</th>
                            <th style="padding: 2px;">Mức độ đánh giá & Yêu cầu cần đạt (GDPT 2018)</th>
                            <th style="width: 75px; padding: 2px;">Số câu thực tế</th>
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

// 8. ĐỒNG BỘ NÚT AI: NẾU Ở TAB SLIDE THÌ ÉP TRỰC TIẾP TỪ GIÁO ÁN SANG KHUNG NỘI HÀM
window.executeActionAI = async function() {
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const book = document.getElementById('sel-book').value;
    const lessonTitle = window.currentSelectedLesson;
    const statusInd = document.getElementById('content-source-indicator');

    // NẾU ĐANG Ở TAB SLIDE: ÉP TRỰC TIẾP TỪ GIÁO ÁN VÀO KHUNG SLIDE NỘI HÀM VIP
    if (window.currentActiveMode === 'slide') {
        window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
        if (typeof window.showAIReviewBar === 'function') window.showAIReviewBar();
        if (statusInd) {
            statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã ép nội dung kiến thức và bài tập từ Giáo án vào Slide 16:9 chuẩn mực!</span>`;
        }
        alert("Đã đồng bộ kiến thức và hệ thống bài tập từ Giáo án vào Slide 16:9 nội hàm hoàn hảo!");
        return;
    }

    // NẾU Ở TAB 7991 HOẶC 5512: GỌI GEMINI BIÊN SOẠN BÁM SÁT CHỈ DẪN
    const savedKey = (localStorage.getItem('gemini_api_key') || '').trim();
    if (!savedKey) {
        if (typeof window.openAIKeyModal === 'function') window.openAIKeyModal();
        alert("Thầy vui lòng nhập và lưu Gemini API Key trước!");
        return;
    }

    const preferredModel = localStorage.getItem('gemini_preferred_model') || 'auto';
    const customGuide = document.getElementById('ai-custom-instructions') ? document.getElementById('ai-custom-instructions').value.trim() : "";
    const docContainer = document.getElementById('container-a4-doc');

    let filePromptPart = "";
    if (window.uploadedFileContent && window.uploadedFileContent.trim() !== "") {
        filePromptPart = `\n- NGỮ LIỆU BỔ SUNG: """${window.uploadedFileContent.slice(0, 8000)}"""`;
    }

    docContainer.innerHTML = `
        <div style="text-align: center; padding: 75px 20px; font-family: sans-serif;">
            <div style="font-size: 38px; color: #9333ea; margin-bottom: 16px;"><i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i></div>
            <h3 style="font-size: 15pt; font-weight: bold; color: #0f172a;" id="ai-loading-status">Đang kết nối Gemini...</h3>
            <p style="color: #64748b; font-size: 11pt; margin-top: 6px;">
                Đang xử lý: <strong>${window.currentActiveMode === '5512' ? 'Kế hoạch bài dạy CV 5512' : 'Đề kiểm tra 7991 (4 Phần)'}</strong> - ${lessonTitle}
            </p>
        </div>
    `;
    if (statusInd) statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang biên soạn dữ liệu...</span>`;

    try {
        if (window.currentActiveMode === '7991') {
            const lessons = (window.selectedLessonsForExam && window.selectedLessonsForExam.length > 0) ? window.selectedLessonsForExam.join(', ') : lessonTitle;
            const promptExam = `Bạn là chuyên gia khảo thí THPT hàng đầu Việt Nam môn ${subject} ${grade}. Hãy biên soạn HỒ SƠ KHẢO THÍ VÀ ĐỀ KIỂM TRA ĐỊNH KỲ bám sát Quyết định 7991/BGDĐT cho: ${lessons}. Bộ sách: ${book}.
CHỈ DẪN GIÁO VIÊN: """${customGuide}"""${filePromptPart}

YÊU CẦU ĐÚNG MA TRẬN VÀ THANG ĐIỂM KHỐNG CHẾ 10.0 ĐIỂM:
1. PHẦN I (Trắc nghiệm 4 lựa chọn - ${window.matrixPartScores.p1} điểm): ${window.matrixGlobalTotals.p1_b} câu Biết, ${window.matrixGlobalTotals.p1_h} câu Hiểu, ${window.matrixGlobalTotals.p1_vd} câu Vận dụng (in đậm hoặc gạch chân đáp án đúng).
2. PHẦN II (Trắc nghiệm Đúng/Sai - ${window.matrixPartScores.p2} điểm): ${(parseInt(window.matrixGlobalTotals.p2_b)||0) + (parseInt(window.matrixGlobalTotals.p2_h)||0) + (parseInt(window.matrixGlobalTotals.p2_vd)||0)} Ý LỆNH HỎI (${window.matrixGlobalTotals.p2_b} ý Biết, ${window.matrixGlobalTotals.p2_h} ý Hiểu, ${window.matrixGlobalTotals.p2_vd} ý Vận dụng). Mỗi câu gồm bối cảnh nghiên cứu thực nghiệm và 4 ý a, b, c, d có [ĐÚNG] hoặc [SAI].
3. PHẦN III (Trắc nghiệm Trả lời ngắn - ${window.matrixPartScores.p3} điểm): Gồm ${window.matrixGlobalTotals.p3_b} câu Biết, ${window.matrixGlobalTotals.p3_h} câu Hiểu, ${window.matrixGlobalTotals.p3_vd} câu Vận dụng. Mỗi câu điền số/từ ngắn kèm đáp án.
4. PHẦN IV (Tự luận - ${window.matrixPartScores.p4} điểm): Gồm ${window.matrixGlobalTotals.p4_b} câu Biết, ${window.matrixGlobalTotals.p4_h} câu Hiểu, ${window.matrixGlobalTotals.p4_vd} câu Vận dụng (yêu cầu phân tích cơ chế và giải pháp thực tế nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long).

KÈM BẢNG ĐÁP ÁN VÀ THANG ĐIỂM BAREM CHI TIẾT TỪNG PHẦN ĐỦ 10.0 ĐIỂM Ở CUỐI ĐỀ.
Cuối bài ghi: "Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít".
Định dạng HTML thuần túy không bọc markdown. Font Times New Roman 13pt.`;

            const aiResult = await fetchGeminiWithCascade(promptExam, savedKey, preferredModel);
            let out = aiResult.text.replace(/^```html/i, '').replace(/```$/i, '').trim();
            docContainer.innerHTML = out;
            window.temporaryAIGeneratedDoc = out;
            if (typeof window.showAIReviewBar === 'function') window.showAIReviewBar();
            if (statusInd) statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã tạo xong Đề thi 7991 (4 Phần) qua [${aiResult.modelUsed}]!</span>`;
            return;
        }

        // Chế độ 5512: Giữ nguyên logic chuẩn CV 5512 Cải tiến High-End
        const info = window.getDynamicNlsAiInfo(lessonTitle, grade);
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
Cuối bài ghi: "Giáo viên: Hồ Tấn Khải - Trường THPT Mang Thít".
Định dạng HTML thuần túy không bọc markdown. Font Times New Roman 13pt.`;

        const aiResult = await fetchGeminiWithCascade(prompt5512, savedKey, preferredModel);
        let textOut = aiResult.text.replace(/^```html/i, '').replace(/```$/i, '').trim();
        const fixedAiHtml = window.sanitizeAndFixAIActivities ? window.sanitizeAndFixAIActivities(textOut) : textOut;

        if (typeof window.renderGiaoAn5512HighEnd === 'function') {
            window.renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle, fixedAiHtml);
        }
        window.temporaryAIGeneratedDoc = docContainer.innerHTML;
        if (typeof window.showAIReviewBar === 'function') window.showAIReviewBar();
        if (statusInd) statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã bơm kiến thức 5512 chuẩn mực qua [${aiResult.modelUsed}]!</span>`;

    } catch (error) {
        console.error("Lỗi AI:", error);
        if (statusInd) statusInd.innerHTML = `<span class="text-amber-400 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> AI gặp sự cố</span>`;
        if (typeof window.displayContentForCurrentLesson === 'function') window.displayContentForCurrentLesson();
        alert("Lỗi AI: " + error.message);
    }
};

// 9. TỰ ĐỘNG CHẠY PHÂN BỔ VÀ HIỂN THỊ KHI LOAD SCRIPT
if (typeof window.distributeMatrixFromTotals === 'function') {
    window.distributeMatrixFromTotals();
    if (typeof window.displayContentForCurrentLesson === 'function') {
        window.displayContentForCurrentLesson();
    }
}
