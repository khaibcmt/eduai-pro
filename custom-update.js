/**
 * ==============================================================================
 * BIOMASTER AI - KHẮC PHỤC TRIỆT ĐỂ: CHỐNG TRÀN CHỮ VÀ VỠ VIỀN SLIDE PPT 16:9
 * GV: Hồ Tấn Khải - Trường THPT Mang Thít
 * 1. Bố cục Anti-Overflow chuẩn thị giác: Khóa cứng tỷ lệ 16:9, không tràn viền.
 * 2. Tự động co giãn nội dung linh hoạt, giữ vững tiêu đề và chân trang định danh.
 * 3. Tinh gọn lưới câu hỏi trắc nghiệm (Dạng 1, 2, 3) có nút xem đáp án chống lộ.
 * ==============================================================================
 */

// 1. DANH SÁCH MÔ HÌNH GEMINI HỢP LỆ
window.FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash"
];

// 2. KHỞI TẠO BỘ NHỚ MA TRẬN 4 PHẦN (THANG 10 ĐIỂM)
window.BIOMASTER_MATRIX = {
    totals: {
        p1_b: 6, p1_h: 4, p1_vd: 2,
        p2_b: 4, p2_h: 4, p2_vd: 2,
        p3_b: 2, p3_h: 2, p3_vd: 1,
        p4_b: 1, p4_h: 1, p4_vd: 1
    },
    scores: {
        p1: 3.0,
        p2: 3.0,
        p3: 1.5,
        p4: 2.5
    },
    counts: {}
};

// 3. XÁC ĐỊNH CHẾ ĐỘ ĐANG CHỌN
window.getRealActiveMode = function() {
    const tab7991 = document.getElementById('btn-tab-7991');
    const tabSlide = document.getElementById('btn-tab-slide');
    if (tab7991 && tab7991.classList.contains('bg-blue-600')) return '7991';
    if (tabSlide && tabSlide.classList.contains('bg-blue-600')) return 'slide';
    return '5512';
};

window.getRealSelectedLessons = function() {
    const checkedBoxes = document.querySelectorAll('#lesson-items-container input[type="checkbox"]:checked');
    if (checkedBoxes.length > 0) {
        return Array.from(checkedBoxes).map(cb => {
            const textSpan = cb.parentElement.querySelector('span');
            return textSpan ? textSpan.innerText.replace(/AI/g, '').trim() : "";
        }).filter(t => t.length > 0);
    }
    const currentTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim();
    return [currentTitle || "Bài 1: Giới thiệu khái quát môn Sinh học"];
};

// 4. TIỆN ÍCH LỚP HỌC TRÊN SLIDE
window.slideTimerInterval = null;
window.startSlideTimer = function(seconds) {
    clearInterval(window.slideTimerInterval);
    let left = seconds;
    const timerBox = document.getElementById('custom-slide-timer-box');
    if (!timerBox) return;
    timerBox.classList.remove('hidden');
    timerBox.innerText = `⏱ ${left}s`;
    window.slideTimerInterval = setInterval(() => {
        left--;
        if (left <= 0) {
            clearInterval(window.slideTimerInterval);
            timerBox.innerText = "⏱ HẾT GIỜ!";
        } else {
            timerBox.innerText = `⏱ ${left}s`;
        }
    }, 1000);
};

window.pickRandomStudent = function() {
    const num = Math.floor(Math.random() * 45) + 1;
    alert(`🎯 Xin mời học sinh có số thứ tự [ ${num} ] trả lời câu hỏi!`);
};

window.toggleSlideFullscreen = function() {
    const elem = document.getElementById('container-slide-presentation');
    if (!elem) return;
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
};

window.toggleSlideAnswer = function(btn) {
    if (!btn) return;
    const ansBox = btn.nextElementSibling;
    if (ansBox) {
        ansBox.classList.toggle('hidden');
        btn.innerHTML = ansBox.classList.contains('hidden') 
            ? `<i class="fa-solid fa-eye mr-2"></i> Hiển thị đáp án đúng`
            : `<i class="fa-solid fa-eye-slash mr-2"></i> Ẩn đáp án`;
    }
};

// 5. TRÌNH VẼ SLIDE ANTI-OVERFLOW (CHỐNG TRÀN CHỮ VÀ VỠ VIỀN TUYỆT ĐỐI)
window.renderSlideSafe = function() {
    let container = document.getElementById('container-slide-presentation');
    const docContainer = document.getElementById('container-a4-doc');

    if (docContainer) {
        docContainer.classList.add('hidden');
        docContainer.style.setProperty('display', 'none', 'important');
    }

    if (!container) {
        container = document.createElement('div');
        container.id = 'container-slide-presentation';
        if (docContainer && docContainer.parentElement) {
            docContainer.parentElement.appendChild(container);
        }
    }

    container.classList.remove('hidden');
    container.style.setProperty('display', 'block', 'important');
    container.style.setProperty('visibility', 'visible', 'important');

    if (!window.slideDeckData || !Array.isArray(window.slideDeckData) || window.slideDeckData.length === 0) {
        const subject = document.getElementById('sel-subject')?.value || "Sinh học";
        const grade = document.getElementById('sel-grade')?.value || "10";
        const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
        const les = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";
        window.buildPPTFromGiaoAn(subject, grade, book, les);
        return;
    }

    if (window.currentSlideIndex < 0) window.currentSlideIndex = 0;
    if (window.currentSlideIndex >= window.slideDeckData.length) window.currentSlideIndex = window.slideDeckData.length - 1;

    const currentIdx = window.currentSlideIndex;
    const totalSlides = window.slideDeckData.length;
    const slide = window.slideDeckData[currentIdx];

    // Khung Canvas 16:9 có chống tràn viền tuyệt đối
    container.innerHTML = `
        <style>
            .custom-slide-scroll::-webkit-scrollbar { width: 5px; }
            .custom-slide-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
            .custom-slide-scroll::-webkit-scrollbar-thumb { background: rgba(215, 140, 15, 0.5); border-radius: 4px; }
            .custom-slide-scroll::-webkit-scrollbar-thumb:hover { background: rgba(215, 140, 15, 0.8); }
        </style>

        <div class="w-full flex flex-col gap-2 font-sans" style="user-select: none;">
            <!-- THANH ĐIỀU KHIỂN SLIDE TINH GỌN -->
            <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700/80 px-3 py-2 rounded-xl shadow-lg backdrop-blur">
                <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-xs md:text-sm border border-amber-500/30">
                        Slide ${currentIdx + 1} / ${totalSlides}
                    </span>
                    <span class="text-xs text-slate-300 hidden md:inline font-medium">
                        (Dùng phím ◄ / ► hoặc phím Cách để chuyển trang)
                    </span>
                    <span id="custom-slide-timer-box" class="hidden px-2 py-0.5 rounded bg-red-600/30 text-red-400 font-bold text-xs border border-red-500/40"></span>
                </div>

                <div class="flex items-center gap-1.5">
                    <button onclick="window.prevSlideCustom()" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition flex items-center gap-1">
                        <i class="fa-solid fa-chevron-left"></i> Trước
                    </button>
                    <button onclick="window.nextSlideCustom()" class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1 shadow-md">
                        Tiếp <i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button onclick="window.startSlideTimer(30)" title="Đếm ngược 30 giây" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 text-xs">
                        <i class="fa-solid fa-stopwatch"></i> 30s
                    </button>
                    <button onclick="window.pickRandomStudent()" title="Gọi ngẫu nhiên học sinh" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-600 text-xs">
                        <i class="fa-solid fa-dice"></i> Gọi HS
                    </button>
                    <button onclick="window.toggleSlideFullscreen()" title="Toàn màn hình" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs">
                        <i class="fa-solid fa-expand"></i>
                    </button>
                </div>
            </div>

            <!-- KHUNG CANVAS 16:9 ANTI-OVERFLOW (CỐ ĐỊNH TỶ LỆ, BẢO VỆ VIỀN TUYỆT ĐỐI) -->
            <div class="w-full rounded-2xl shadow-2xl p-6 md:p-8 relative flex flex-col justify-between overflow-hidden" 
                 style="background: linear-gradient(145deg, #0F2922 0%, #071713 100%); border: 2.5px solid #D78C0F; aspect-ratio: 16/9; max-height: calc(100vh - 210px); box-sizing: border-box;">
                
                <!-- PHẦN 1: TIÊU ĐỀ SLIDE (KHÔNG BỊ CO ÉP) -->
                <div class="flex-shrink-0 space-y-1.5 pb-2 border-b border-emerald-800/40">
                    <div class="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs uppercase tracking-wide border border-amber-400/30">
                        ${slide.tag || "BÀI GIẢNG ĐIỆN TỬ"}
                    </div>
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-black text-amber-300 tracking-tight leading-snug line-clamp-2">
                        ${slide.title || ""}
                    </h2>
                </div>

                <!-- PHẦN 2: NỘI DUNG SLIDE (FLEX CO GIÃN THÔNG MINH, CHỐNG TRÀN XUỐNG DƯỚI) -->
                <div class="flex-1 min-h-0 overflow-y-auto custom-slide-scroll flex flex-col justify-center my-2 text-slate-100 text-base md:text-lg lg:text-xl leading-relaxed">
                    ${slide.body || ""}
                </div>

                <!-- PHẦN 3: CHÂN TRANG ĐỊNH DANH (CỐ ĐỊNH Ở ĐÁY, KHÔNG BỊ ĐẨY MẤT) -->
                <div class="flex-shrink-0 flex items-center justify-between border-t border-emerald-800/50 pt-2.5 text-xs text-slate-300 font-medium">
                    <span>Trường THPT Mang Thít • Tổ Sinh học - Công nghệ</span>
                    <span class="font-bold text-amber-300">Giáo viên: Hồ Tấn Khải</span>
                </div>
            </div>
        </div>
    `;
};
window.renderCurrentSlide = window.renderSlideSafe;

window.nextSlideCustom = function() {
    if (window.slideDeckData && window.currentSlideIndex < window.slideDeckData.length - 1) {
        window.currentSlideIndex++;
        window.renderSlideSafe();
    }
};

window.prevSlideCustom = function() {
    if (window.slideDeckData && window.currentSlideIndex > 0) {
        window.currentSlideIndex--;
        window.renderSlideSafe();
    }
};

// 6. BỘ BÓC TÁCH THÔNG MINH TỪ GIÁO ÁN VÀ TẠO BỘ SLIDE ANTI-OVERFLOW
window.buildPPTFromGiaoAn = function(subject, grade, book, lessonTitle) {
    const lesTitle = String(lessonTitle || document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học");
    const aiKey = `cached_ai_5512_${subject}_${grade}_${lesTitle}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const cached5512 = localStorage.getItem(aiKey);

    const info = window.getDynamicNlsAiInfo ? window.getDynamicNlsAiInfo(lesTitle, grade) : {
        core1: "Đối tượng và các lĩnh vực nghiên cứu sinh học hiện đại",
        core2: "Mục tiêu và vai trò của sinh học đối với sự phát triển bền vững",
        core3: "Các ngành nghề sinh học và ứng dụng thực tiễn tại địa phương"
    };

    const knowledgeSections = [];

    // Bóc tách bảng Hoạt động 2 (loại bỏ hoàn toàn bảng hành chính)
    if (cached5512) {
        try {
            const parserDiv = document.createElement('div');
            parserDiv.innerHTML = cached5512;

            const allTables = Array.from(parserDiv.querySelectorAll('table'));
            const act2Tables = allTables.filter(tbl => {
                const txt = tbl.innerText.toUpperCase();
                const isHeaderTable = txt.includes('CỘNG HÒA') || txt.includes('QUỐC HIỆU') || txt.includes('SỞ GD&ĐT') || txt.includes('HỒ SƠ');
                const isAct2Table = txt.includes('DỰ KIẾN SẢN PHẨM') || txt.includes('HOẠT ĐỘNG CỦA GIÁO VIÊN') || txt.includes('HOẠT ĐỘNG 2');
                return !isHeaderTable && isAct2Table;
            });

            act2Tables.forEach(tbl => {
                const rows = Array.from(tbl.querySelectorAll('tr'));
                rows.forEach((row) => {
                    const cells = row.querySelectorAll('td, th');
                    if (cells.length >= 2) {
                        const c0 = cells[0].innerText.trim();
                        const c1 = cells[1].innerHTML.trim();

                        if (c0.toUpperCase().includes('HOẠT ĐỘNG CỦA GIÁO VIÊN') || cells[1].innerText.toUpperCase().includes('DỰ KIẾN SẢN PHẨM')) return;
                        if (c0.includes('CỘNG HÒA') || c1.includes('CỘNG HÒA') || c0.includes('SỞ GD&ĐT')) return;

                        let subTitle = cells[0].querySelector('strong, b')?.innerText?.trim();
                        if (!subTitle) {
                            const lines = c0.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                            subTitle = lines.find(l => /^hoạt động|mục|i\.|ii\.|iii\.|1\.|2\./i.test(l)) || lines[0] || `Nội dung ${knowledgeSections.length + 1}`;
                        }
                        subTitle = subTitle.replace(/^[-*•\s]+/, '').trim();
                        if (subTitle.length > 55) subTitle = subTitle.substring(0, 55) + '...';

                        if (c1.length > 15) {
                            knowledgeSections.push({
                                title: subTitle.toUpperCase(),
                                body: `<div class="space-y-2 leading-relaxed">${c1}</div>`
                            });
                        }
                    }
                });
            });
        } catch(e) {
            console.error("Lỗi bóc tách giáo án:", e);
        }
    }

    if (knowledgeSections.length === 0) {
        knowledgeSections.push({
            title: `I. ${info.core1 ? info.core1.slice(0, 50).toUpperCase() : "ĐẶC ĐIỂM VÀ CẤU TRÚC BẢN CHẤT"}`,
            body: `<div class="space-y-2.5"><p>• ${info.core1 || "Bản chất và cấu trúc sinh học nền tảng theo SGK Kết nối tri thức."}</p><p>• Cơ chế tương tác và biến đổi năng lượng thích nghi bảo đảm sự sống.</p></div>`
        });
        knowledgeSections.push({
            title: `II. ${info.core2 ? info.core2.slice(0, 50).toUpperCase() : "QUY LUẬT VÀ CƠ CHẾ SINH HỌC"}`,
            body: `<div class="space-y-2.5"><p>• ${info.core2 || "Quy luật điều hòa và ổn định nội môi trong cơ thể sinh vật."}</p><p>• Duy trì tính toàn vẹn và nâng cao khả năng chống chịu trước môi trường.</p></div>`
        });
        knowledgeSections.push({
            title: `III. ${info.core3 ? info.core3.slice(0, 50).toUpperCase() : "ỨNG DỤNG THỰC TIỄN NÔNG NGHIỆP"}`,
            body: `<div class="space-y-2.5"><p>• ${info.core3 || "Ứng dụng khoa học kỹ thuật vào sản xuất nông nghiệp công nghệ cao."}</p><p>• Thực tiễn sản xuất và bảo vệ hệ sinh thái tại huyện Mang Thít, tỉnh Vĩnh Long.</p></div>`
        });
    }

    window.slideDeckData = [];

    // 1. SLIDE BÌA
    window.slideDeckData.push({
        title: lesTitle.toUpperCase(),
        tag: `${subject} ${grade} • ${book}`,
        body: `
            <div class="text-center py-4 space-y-3">
                <p class="text-amber-300 font-bold text-xl md:text-2xl uppercase tracking-widest">
                    TRƯỜNG THPT MANG THÍT
                </p>
                <p class="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto pt-2">
                    Giáo viên thực hiện: <strong class="text-white">Hồ Tấn Khải</strong>
                </p>
                <p class="text-emerald-400 font-semibold text-base md:text-lg">
                    Chương trình Giáo dục Phổ thông 2018
                </p>
            </div>
        `
    });

    // 2. SLIDE HOẠT ĐỘNG 1: KHỞI ĐỘNG
    window.slideDeckData.push({
        title: "HOẠT ĐỘNG 1: MỞ ĐẦU (WARM-UP)",
        tag: "KHỞI ĐỘNG",
        body: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-base md:text-lg">
                <div class="bg-black/40 p-4 md:p-5 rounded-xl border border-emerald-500/30 space-y-2">
                    <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">Hiện tượng thực tế</span>
                    <p class="font-bold text-white text-lg md:text-xl">Mâu thuẫn nhận thức khoa học</p>
                    <p class="text-slate-200 leading-relaxed text-sm md:text-base">
                        Làm thế nào cơ thể sinh vật duy trì sự sống bền vững và thích ứng linh hoạt với điều kiện môi trường luôn biến đổi?
                    </p>
                </div>
                <div class="bg-emerald-950/40 p-4 md:p-5 rounded-xl border border-emerald-500/40 space-y-2.5">
                    <p class="text-amber-300 font-bold text-lg"><i class="fa-solid fa-lightbulb mr-2"></i> Câu hỏi định hướng tư duy:</p>
                    <p class="text-slate-200 text-sm md:text-base">1. Yếu tố bản chất nào đóng vai trò cốt lõi trong cơ chế này?</p>
                    <p class="text-slate-200 text-sm md:text-base">2. Quy luật tự nhiên nào chi phối trực tiếp tiến trình trên?</p>
                    <p class="text-amber-400 font-bold text-sm md:text-base">➜ Hãy cùng khám phá bài học mới!</p>
                </div>
            </div>
        `
    });

    // 3. CÁC SLIDE HÌNH THÀNH KIẾN THỨC THEO ĐỀ MỤC
    knowledgeSections.forEach((sec, idx) => {
        window.slideDeckData.push({
            title: sec.title,
            tag: `HÌNH THÀNH KIẾN THỨC (MỤC ${idx + 1})`,
            body: `<div class="bg-black/40 p-4 md:p-5 rounded-xl border border-emerald-500/30 text-base md:text-lg leading-relaxed">${sec.body}</div>`
        });
    });

    // 4. SLIDE CHỐT KIẾN THỨC CỐT LÕI
    window.slideDeckData.push({
        title: "KIẾN THỨC CỐT LÕI (NỘI DUNG GHI VỞ)",
        tag: "CHỐT KIẾN THỨC BẮT BUỘC",
        body: `
            <div class="bg-black/50 p-4 md:p-5 rounded-xl border-2 border-amber-400/60 space-y-2.5 text-base md:text-lg">
                <p class="text-amber-300 font-bold text-lg md:text-xl"><i class="fa-solid fa-book-bookmark mr-2"></i> Học sinh ghi nhớ các điểm then chốt:</p>
                <p class="text-slate-200">• <strong>Bản chất:</strong> Nắm vững định nghĩa, cấu trúc và quy luật cơ bản theo SGK Kết nối tri thức.</p>
                <p class="text-slate-200">• <strong>Cơ chế:</strong> Diễn biến chuyển hóa, tương tác thích nghi bảo đảm ổn định di truyền.</p>
                <p class="text-slate-200">• <strong>Ý nghĩa:</strong> Ứng dụng khoa học kỹ thuật vào sản xuất nông nghiệp và đời sống tại địa phương.</p>
            </div>
        `
    });

    // 5. SLIDE DẠNG 1: 4 LỰA CHỌN (TỐI ƯU GỌN GÀNG, CHỐNG TRÀN NÚT ĐÁP ÁN)
    for (let i = 1; i <= 6; i++) {
        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẮC NGHIỆM ${i}`,
            tag: `DẠNG 1: 4 LỰA CHỌN (${i}/6)`,
            body: `
                <div class="space-y-3">
                    <p class="font-bold text-white text-base md:text-xl leading-snug">Câu ${i}: Nhận định nào sau đây phản ánh chính xác nhất bản chất khoa học của bài học?</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base">
                        <div class="p-2.5 bg-black/40 rounded-lg border border-slate-700">A. Không tuân theo các quy luật di truyền</div>
                        <div class="p-2.5 bg-black/40 rounded-lg border border-slate-700">B. Luôn bảo đảm sao chép chính xác và thích nghi</div>
                        <div class="p-2.5 bg-black/40 rounded-lg border border-slate-700">C. Tự nhân đôi không phụ thuộc năng lượng</div>
                        <div class="p-2.5 bg-black/40 rounded-lg border border-slate-700">D. Diễn ra ngẫu nhiên không kiểm soát</div>
                    </div>
                    <div class="pt-1">
                        <button onclick="window.toggleSlideAnswer(this)" class="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-xs md:text-sm flex items-center">
                            <i class="fa-solid fa-eye mr-2"></i> Hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-2.5 bg-emerald-950/90 rounded-lg border border-emerald-500/60 font-bold text-emerald-300 text-sm md:text-base">
                            ➜ Đáp án đúng: B (Bảo đảm tính toàn vẹn và thích nghi sinh thái)
                        </div>
                    </div>
                </div>
            `
        });
    }

    // 6. SLIDE DẠNG 2: ĐÚNG / SAI
    for (let i = 1; i <= 4; i++) {
        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẮC NGHIỆM ĐÚNG/SAI ${i}`,
            tag: `DẠNG 2: BỐI CẢNH THỰC NGHIỆM (${i}/4)`,
            body: `
                <div class="space-y-2.5">
                    <p class="font-bold text-amber-300 text-base md:text-lg leading-snug">Câu ${i}: Trong một nghiên cứu khoa học thực nghiệm về điều kiện môi trường sống:</p>
                    <div class="space-y-1.5 bg-black/40 p-3 rounded-lg border border-slate-700 text-xs md:text-base">
                        <p>a) Điều kiện nhiệt độ và độ ẩm tối ưu giúp quá trình chuyển hóa đạt hiệu suất cao nhất.</p>
                        <p>b) Mọi tác nhân đột biến đều làm tăng tốc độ sinh trưởng của cá thể sinh vật.</p>
                        <p>c) Nắm vững quy luật giúp nông dân chủ động phòng trừ dịch hại nâng cao năng suất.</p>
                        <p>d) Các biến đổi nội tại diễn ra hoàn toàn tự phát mà không cần năng lượng trao đổi.</p>
                    </div>
                    <div>
                        <button onclick="window.toggleSlideAnswer(this)" class="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-xs md:text-sm flex items-center">
                            <i class="fa-solid fa-eye mr-2"></i> Hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-2.5 bg-emerald-950/90 rounded-lg border border-emerald-500/60 font-bold text-emerald-300 text-sm md:text-base">
                            ➜ Đáp án: a) ĐÚNG | b) SAI | c) ĐÚNG | d) SAI
                        </div>
                    </div>
                </div>
            `
        });
    }

    // 7. SLIDE DẠNG 3: TRẢ LỜI NGẮN
    for (let i = 1; i <= 6; i++) {
        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẢ LỜI NGẮN ${i}`,
            tag: `DẠNG 3: ĐIỀN CON SỐ (${i}/6)`,
            body: `
                <div class="space-y-3">
                    <p class="font-bold text-white text-base md:text-xl leading-snug">Câu ${i}: Một cấu trúc sinh học ban đầu trải qua ${i + 1} đợt phân bào liên tiếp sẽ tạo ra bao nhiêu cấu trúc con?</p>
                    <p class="text-slate-300 italic text-xs md:text-sm">(Đáp án là con số cụ thể không quá 4 ký tự)</p>
                    <div>
                        <button onclick="window.toggleSlideAnswer(this)" class="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-xs md:text-sm flex items-center">
                            <i class="fa-solid fa-eye mr-2"></i> Hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-2.5 bg-emerald-950/90 rounded-lg border border-emerald-500/60 font-bold text-emerald-300 text-lg md:text-xl">
                            ➜ Đáp án chính xác: ${Math.pow(2, i + 1)}
                        </div>
                    </div>
                </div>
            `
        });
    }

    // 8. SLIDE HOẠT ĐỘNG 4: VẬN DỤNG & DỰ ÁN
    window.slideDeckData.push({
        title: "HOẠT ĐỘNG 4: VẬN DỤNG THỰC TẾ",
        tag: "VẬN DỤNG & DỰ ÁN",
        body: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                <div class="bg-black/40 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                    <h4 class="font-bold text-emerald-300 text-base md:text-lg"><i class="fa-solid fa-house-laptop mr-2"></i> 1. Nhiệm vụ thực tế địa phương</h4>
                    <p class="text-slate-200">• Tìm hiểu ứng dụng kỹ thuật và công nghệ sinh học tại huyện Mang Thít, tỉnh Vĩnh Long.</p>
                    <p class="text-slate-200">• Hoàn thành bài thu hoạch báo cáo nộp qua nhóm học tập trực tuyến.</p>
                </div>
                <div class="bg-black/40 p-4 rounded-xl border border-amber-500/30 space-y-2">
                    <h4 class="font-bold text-amber-300 text-base md:text-lg"><i class="fa-solid fa-compass mr-2"></i> 2. Chuẩn bị cho bài học tiếp theo</h4>
                    <p class="text-slate-200">• Đọc trước nội dung bài học mới trong SGK Kết nối tri thức.</p>
                    <p class="text-slate-200">• Quét mã QR ôn tập bài học trên hệ thống học liệu số của trường.</p>
                </div>
            </div>
        `
    });

    window.currentSlideIndex = 0;
    window.renderSlideSafe();
};

// 7. GHI ĐÈ CHUYỂN TAB ĐỂ MỞ KHÓA DOM BẮT BUỘC
window.switchViewTab = function(mode) {
    const btn5512 = document.getElementById('btn-tab-5512');
    const btnSlide = document.getElementById('btn-tab-slide');
    const btn7991 = document.getElementById('btn-tab-7991');
    const docContainer = document.getElementById('container-a4-doc');
    let slideContainer = document.getElementById('container-slide-presentation');
    const btnDoc = document.getElementById('btn-export-doc');
    const btnPptx = document.getElementById('btn-export-pptx');
    const aiBtnLabel = document.getElementById('ai-action-btn-label');

    [btn5512, btnSlide, btn7991].forEach(b => {
        if (b) {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('text-slate-300');
        }
    });

    const activeBtn = mode === '5512' ? btn5512 : (mode === 'slide' ? btnSlide : btn7991);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-300');
        activeBtn.classList.add('bg-blue-600', 'text-white');
    }

    if (mode === 'slide') {
        if (docContainer) {
            docContainer.classList.add('hidden');
            docContainer.style.setProperty('display', 'none', 'important');
        }
        if (!slideContainer) {
            slideContainer = document.createElement('div');
            slideContainer.id = 'container-slide-presentation';
            if (docContainer && docContainer.parentElement) docContainer.parentElement.appendChild(slideContainer);
        }
        slideContainer.classList.remove('hidden');
        slideContainer.style.setProperty('display', 'block', 'important');
        slideContainer.style.setProperty('visibility', 'visible', 'important');

        if (btnDoc) btnDoc.classList.add('hidden');
        if (btnPptx) btnPptx.classList.remove('hidden');
        if (aiBtnLabel) aiBtnLabel.innerText = "TẠO SLIDE GIẢNG DẠY BẰNG AI";

        const subject = document.getElementById('sel-subject')?.value || "Sinh học";
        const grade = document.getElementById('sel-grade')?.value || "10";
        const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
        const les = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";
        window.buildPPTFromGiaoAn(subject, grade, book, les);
    } else {
        if (docContainer) {
            docContainer.classList.remove('hidden');
            docContainer.style.setProperty('display', 'block', 'important');
        }
        if (slideContainer) {
            slideContainer.classList.add('hidden');
            slideContainer.style.setProperty('display', 'none', 'important');
        }
        if (btnDoc) btnDoc.classList.remove('hidden');
        if (btnPptx) btnPptx.classList.add('hidden');

        if (mode === '5512') {
            if (aiBtnLabel) aiBtnLabel.innerText = "SOẠN KẾ HOẠCH BÀI DẠY BẰNG AI";
            window.displayContentForCurrentLesson();
        } else if (mode === '7991') {
            if (aiBtnLabel) aiBtnLabel.innerText = "TẠO ĐỀ THI 7991 BẰNG AI";
            window.distributeMatrixFromTotals();
            window.renderMaTranDeKiemTra(
                document.getElementById('sel-subject')?.value || "Sinh học",
                document.getElementById('sel-grade')?.value || "10",
                document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống"
            );
        }
    }
};

// 8. ĐỒNG BỘ HIỂN THỊ KHI CHỌN BÀI HỌC Ở CỘT TRÁI
window.displayContentForCurrentLesson = function() {
    const realMode = window.getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";
    const docContainer = document.getElementById('container-a4-doc');
    let slideContainer = document.getElementById('container-slide-presentation');
    const statusInd = document.getElementById('content-source-indicator');

    const aiKey = `cached_ai_${realMode}_${subject}_${grade}_${lessonTitle}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const cachedData = localStorage.getItem(aiKey);

    if (realMode === 'slide') {
        if (docContainer) {
            docContainer.classList.add('hidden');
            docContainer.style.setProperty('display', 'none', 'important');
        }
        if (!slideContainer) {
            slideContainer = document.createElement('div');
            slideContainer.id = 'container-slide-presentation';
            if (docContainer && docContainer.parentElement) docContainer.parentElement.appendChild(slideContainer);
        }
        slideContainer.classList.remove('hidden');
        slideContainer.style.setProperty('display', 'block', 'important');

        if (cachedData) {
            try {
                window.slideDeckData = JSON.parse(cachedData);
                window.currentSlideIndex = 0;
                window.renderSlideSafe();
                if (statusInd) statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã nạp Slide bài giảng từ AI (Đã lưu)</span>`;
                return;
            } catch(e) {}
        }
        window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
        if (statusInd) statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check text-[10px]"></i> Slide đã đồng bộ kiến thức từ Giáo án 5512</span>`;
        return;
    }

    if (docContainer) {
        docContainer.classList.remove('hidden');
        docContainer.style.setProperty('display', 'block', 'important');
    }
    if (slideContainer) {
        slideContainer.classList.add('hidden');
        slideContainer.style.setProperty('display', 'none', 'important');
    }

    if (cachedData) {
        if (docContainer) docContainer.innerHTML = cachedData;
        if (statusInd) statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã nạp nội dung từ AI (Đã kiểm duyệt)</span>`;
        return;
    }

    if (statusInd) statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check text-[10px]"></i> Bản gốc nội hàm có sẵn</span>`;
    if (realMode === '5512') {
        if (typeof window.renderGiaoAn5512HighEnd === 'function') {
            window.renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle);
        }
    } else if (realMode === '7991') {
        window.distributeMatrixFromTotals();
        window.renderMaTranDeKiemTra(subject, grade, book);
    }
};

// 9. ĐIỀU KHIỂN BÀN PHÍM CHUYỂN SLIDE
document.addEventListener('keydown', (e) => {
    if (window.getRealActiveMode() === 'slide') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            window.nextSlideCustom();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            window.prevSlideCustom();
        }
    }
});

// 10. MA TRẬN 7991 TỰ PHÂN BỔ 2 CHIỀU (BẢO TOÀN THANG 10Đ)
window.distributeMatrixFromTotals = function() {
    const lessons = window.getRealSelectedLessons();
    const numLessons = lessons.length;
    window.BIOMASTER_MATRIX.counts = {};

    lessons.forEach(les => {
        window.BIOMASTER_MATRIX.counts[les] = { 
            p1_b: 0, p1_h: 0, p1_vd: 0, 
            p2_b: 0, p2_h: 0, p2_vd: 0, 
            p3_b: 0, p3_h: 0, p3_vd: 0, 
            p4_b: 0, p4_h: 0, p4_vd: 0 
        };
    });

    const fields = ['p1_b', 'p1_h', 'p1_vd', 'p2_b', 'p2_h', 'p2_vd', 'p3_b', 'p3_h', 'p3_vd', 'p4_b', 'p4_h', 'p4_vd'];
    fields.forEach(f => {
        const total = parseInt(window.BIOMASTER_MATRIX.totals[f]) || 0;
        const base = Math.floor(total / numLessons);
        let remainder = total % numLessons;

        lessons.forEach((les, idx) => {
            window.BIOMASTER_MATRIX.counts[les][f] = base + (idx < remainder ? 1 : 0);
        });
    });
};

window.updateGlobalTotalField = function(field, value) {
    window.BIOMASTER_MATRIX.totals[field] = parseInt(value) || 0;
    window.distributeMatrixFromTotals();
    window.renderMaTranDeKiemTra(
        document.getElementById('sel-subject')?.value || "Sinh học",
        document.getElementById('sel-grade')?.value || "10",
        document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống"
    );
};

window.updatePartScoreField = function(part, value) {
    window.BIOMASTER_MATRIX.scores[part] = parseFloat(value) || 0;
    window.renderMaTranDeKiemTra(
        document.getElementById('sel-subject')?.value || "Sinh học",
        document.getElementById('sel-grade')?.value || "10",
        document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống"
    );
};

// 11. BẢNG MA TRẬN 4 PHẦN VỪA KHÍT 1 TRANG A4
window.renderMaTranDeKiemTra = function(subject, grade, book) {
    const docContainer = document.getElementById('container-a4-doc');
    if (!docContainer) return;

    window.distributeMatrixFromTotals();
    const lessons = window.getRealSelectedLessons();

    const t = window.BIOMASTER_MATRIX.totals;
    const countP1 = (t.p1_b || 0) + (t.p1_h || 0) + (t.p1_vd || 0);
    const countP2 = (t.p2_b || 0) + (t.p2_h || 0) + (t.p2_vd || 0);
    const countP3 = (t.p3_b || 0) + (t.p3_h || 0) + (t.p3_vd || 0);
    const countP4 = (t.p4_b || 0) + (t.p4_h || 0) + (t.p4_vd || 0);

    const s = window.BIOMASTER_MATRIX.scores;
    const scoreP1 = parseFloat(s.p1) || 0;
    const scoreP2 = parseFloat(s.p2) || 0;
    const scoreP3 = parseFloat(s.p3) || 0;
    const scoreP4 = parseFloat(s.p4) || 0;
    const totalScore = (scoreP1 + scoreP2 + scoreP3 + scoreP4).toFixed(1);

    const p1PerQ = countP1 > 0 ? (scoreP1 / countP1).toFixed(2) : 0;
    const p3PerQ = countP3 > 0 ? (scoreP3 / countP3).toFixed(2) : 0;
    const p4PerQ = countP4 > 0 ? (scoreP4 / countP4).toFixed(2) : 0;

    let p1Html = "", p1Idx = 1;
    lessons.forEach(les => {
        const c = window.BIOMASTER_MATRIX.counts[les] || {};
        const num = (c.p1_b || 0) + (c.p1_h || 0) + (c.p1_vd || 0);
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
        const c = window.BIOMASTER_MATRIX.counts[les] || {};
        const numY = (c.p2_b || 0) + (c.p2_h || 0) + (c.p2_vd || 0);
        const soCau = Math.ceil(numY / 4);
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
        const c = window.BIOMASTER_MATRIX.counts[les] || {};
        const num = (c.p3_b || 0) + (c.p3_h || 0) + (c.p3_vd || 0);
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
        const c = window.BIOMASTER_MATRIX.counts[les] || {};
        const num = (c.p4_b || 0) + (c.p4_h || 0) + (c.p4_vd || 0);
        for (let k = 1; k <= num; k++) {
            p4Html += `
                <p style="margin: 5px 0 2px 0;"><strong>Câu ${p4Idx} (Tự luận - ${p4PerQ} điểm):</strong> [${les}]</p>
                <p style="margin: 1px 0 1px 15px;">a) Phân tích cơ chế và bản chất quy luật sinh học được nêu trong bài học.</p>
                <p style="margin: 1px 0 5px 15px;">b) Hãy đề xuất 02 giải pháp kỹ thuật cụ thể ứng dụng vào sản xuất nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long.</p>
            `;
            p4Idx++;
        }
    });

    docContainer.innerHTML = `
        <div style="page-break-after: always; min-height: 252mm; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <table style="width: 100%; border: none; margin-bottom: 4px;">
                    <tr style="border: none;">
                        <td style="border: none; width: 45%; text-align: center; vertical-align: top; padding: 0;">
                            <p style="margin: 0; font-size: 10pt;">SỞ GD&ĐT VĨNH LONG</p>
                            <p style="margin: 0; font-weight: bold; font-size: 10pt;">TRƯỜNG THPT MANG THÍT</p>
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
                            const c = window.BIOMASTER_MATRIX.counts[les] || {};
                            const s1 = (c.p1_b || 0) + (c.p1_h || 0) + (c.p1_vd || 0);
                            const s2 = (c.p2_b || 0) + (c.p2_h || 0) + (c.p2_vd || 0);
                            const s3 = (c.p3_b || 0) + (c.p3_h || 0) + (c.p3_vd || 0);
                            const s4 = (c.p4_b || 0) + (c.p4_h || 0) + (c.p4_vd || 0);
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
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff;">${c.p3_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff;">${c.p3_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #f0f9ff;">${c.p3_vd || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2;">${c.p4_b || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2;">${c.p4_h || 0}</td>
                                    <td style="text-align: center; padding: 2px 0; background: #fef2f2;">${c.p4_vd || 0}</td>
                                    <td style="text-align: center; font-weight: bold; background: #f8fafc; font-size: 7.5pt; padding: 2px 1px;">
                                        ${s1}c\vert{}${s2}ý|${s3}c\vert{}${s4}tl
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                        
                        <tr style="background: #eff6ff; font-weight: bold; text-align: center; border-top: 2px solid #1e40af;">
                            <td colspan="2" style="color: #1e3a8a; text-align: right; padding: 3px 4px;">TỔNG SỐ CÂU / Ý (Khống chế):</td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p1_b}" onchange="updateGlobalTotalField('p1_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p1_h}" onchange="updateGlobalTotalField('p1_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p1_vd}" onchange="updateGlobalTotalField('p1_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p2_b}" onchange="updateGlobalTotalField('p2_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;" title="Số ý Biết"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p2_h}" onchange="updateGlobalTotalField('p2_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;" title="Số ý Hiểu"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p2_vd}" onchange="updateGlobalTotalField('p2_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;" title="Số ý Vận dụng"></td>

                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p3_b}" onchange="updateGlobalTotalField('p3_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;" title="TL ngắn Biết"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p3_h}" onchange="updateGlobalTotalField('p3_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;" title="TL ngắn Hiểu"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p3_vd}" onchange="updateGlobalTotalField('p3_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;" title="TL ngắn Vận dụng"></td>

                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p4_b}" onchange="updateGlobalTotalField('p4_b', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;" title="Tự luận Biết"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p4_h}" onchange="updateGlobalTotalField('p4_h', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;" title="Tự luận Hiểu"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${t.p4_vd}" onchange="updateGlobalTotalField('p4_vd', this.value)" style="width: 24px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;" title="Tự luận Vận dụng"></td>

                            <td style="color: #b91c1c; font-size: 8pt; padding: 2px 1px;">
                                ${countP1}c|${countP2}ý|${countP3}c|${countP4}tl
                            </td>
                        </tr>

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
                            const c = window.BIOMASTER_MATRIX.counts[les] || {};
                            const sum = (c.p1_b || 0) + (c.p1_h || 0) + (c.p1_vd || 0) + (c.p2_b || 0) + (c.p2_h || 0) + (c.p2_vd || 0) + (c.p3_b || 0) + (c.p3_h || 0) + (c.p3_vd || 0) + (c.p4_b || 0) + (c.p4_h || 0) + (c.p4_vd || 0);
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

// 12. GHI ĐÈ NÚT KÍCH HOẠT AI TÁCH BIỆT CẢ 3 PHÂN HỆ
window.executeActionAI = async function() {
    const realMode = window.getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";
    const statusInd = document.getElementById('content-source-indicator');

    if (realMode === 'slide') {
        window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
        if (typeof window.showAIReviewBar === 'function') window.showAIReviewBar();
        if (statusInd) {
            statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã bóc tách kiến thức chuẩn từ Giáo án sang Slide!</span>`;
        }
        alert("Đã đồng bộ toàn bộ kiến thức bài học từ Giáo án vào Slide 16:9 hoàn hảo!");
        return;
    }

    const savedKey = (localStorage.getItem('gemini_api_key') || '').trim();
    if (!savedKey) {
        if (typeof window.openAIKeyModal === 'function') window.openAIKeyModal();
        alert("Thầy vui lòng nhập và lưu Gemini API Key trước!");
        return;
    }

    const preferredModel = localStorage.getItem('gemini_preferred_model') || 'auto';
    const customGuide = document.getElementById('ai-custom-instructions')?.value.trim() || "";
    const docContainer = document.getElementById('container-a4-doc');

    let filePromptPart = "";
    if (window.uploadedFileContent && window.uploadedFileContent.trim() !== "") {
        filePromptPart = `\n- NGỮ LIỆU BỔ SUNG TỪ TÀI LIỆU TẢI LÊN: """${window.uploadedFileContent.slice(0, 8000)}"""`;
    }

    docContainer.innerHTML = `
        <div style="text-align: center; padding: 75px 20px; font-family: sans-serif;">
            <div style="font-size: 38px; color: #9333ea; margin-bottom: 16px;"><i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i></div>
            <h3 style="font-size: 15pt; font-weight: bold; color: #0f172a;" id="ai-loading-status">Đang kết nối Gemini...</h3>
            <p style="color: #64748b; font-size: 11pt; margin-top: 6px;">
                Đang xử lý: <strong>${realMode === '7991' ? 'Hồ sơ khảo thí & Đề kiểm tra 7991 (4 Phần)' : 'Kế hoạch bài dạy CV 5512 High-End'}</strong> - ${lessonTitle}
            </p>
        </div>
    `;
    if (statusInd) statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang biên soạn dữ liệu...</span>`;

    try {
        if (realMode === '7991') {
            const lessons = window.getRealSelectedLessons().join(', ');
            const t = window.BIOMASTER_MATRIX.totals;
            const s = window.BIOMASTER_MATRIX.scores;
            const countP2Y = (t.p2_b || 0) + (t.p2_h || 0) + (t.p2_vd || 0);

            const promptExam = `Bạn là chuyên gia khảo thí THPT hàng đầu Việt Nam môn ${subject} ${grade}. Hãy biên soạn HỒ SƠ KHẢO THÍ VÀ ĐỀ KIỂM TRA ĐỊNH KỲ bám sát Quyết định 7991/BGDĐT cho: ${lessons}. Bộ sách: ${book}.
CHỈ DẪN GIÁO VIÊN: """${customGuide}"""${filePromptPart}

YÊU CẦU ĐÚNG MA TRẬN VÀ THANG ĐIỂM KHỐNG CHẾ 10.0 ĐIỂM:
1. PHẦN I (Trắc nghiệm 4 lựa chọn - ${s.p1} điểm): ${t.p1_b} câu Biết, ${t.p1_h} câu Hiểu, ${t.p1_vd} câu Vận dụng (in đậm hoặc gạch chân đáp án đúng).
2. PHẦN II (Trắc nghiệm Đúng/Sai - ${s.p2} điểm): ${countP2Y} Ý LỆNH HỎI (${t.p2_b} ý Biết, ${t.p2_h} ý Hiểu, ${t.p2_vd} ý Vận dụng). Mỗi câu gồm bối cảnh nghiên cứu thực nghiệm và 4 ý a, b, c, d có [ĐÚNG] hoặc [SAI].
3. PHẦN III (Trắc nghiệm Trả lời ngắn - ${s.p3} điểm): Gồm ${t.p3_b} câu Biết, ${t.p3_h} câu Hiểu, ${t.p3_vd} câu Vận dụng. Mỗi câu điền số/từ ngắn kèm đáp án.
4. PHẦN IV (Tự luận - ${s.p4} điểm): Gồm ${t.p4_b} câu Biết, ${t.p4_h} câu Hiểu, ${t.p4_vd} câu Vận dụng (yêu cầu phân tích cơ chế và giải pháp thực tế nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long).

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

        // Chế độ Giáo án 5512
        const info = window.getDynamicNlsAiInfo ? window.getDynamicNlsAiInfo(lessonTitle, grade) : { nls: "NLS 1.1", nlsDesc: "Khai thác dữ liệu số", aiCode: `${grade}.A1.2` };
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

// 13. KHỞI TẠO TỰ ĐỘNG
setTimeout(() => {
    window.distributeMatrixFromTotals();
    const mode = window.getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức Với Cuộc Sống";
    const les = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";

    if (mode === 'slide') {
        window.buildPPTFromGiaoAn(subject, grade, book, les);
    } else if (mode === '7991') {
        window.renderMaTranDeKiemTra(subject, grade, book);
    }
}, 150);
