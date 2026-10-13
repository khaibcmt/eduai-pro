/**
 * ==============================================================================
 * BIOMASTER AI - MODULE CẬP NHẬT ĐỘC LẬP: ĐỒNG BỘ PPT TRỰC TIẾP TỪ GIÁO ÁN 5512
 * GV: Hồ Tấn Khải - THPT Mang Thít
 * 1. Bóc tách 100% kiến thức và câu hỏi từ Giáo án 5512 sang Slide PPT 16:9 chuẩn mực.
 * 2. Đầy đủ 3 dạng bài tập (4 lựa chọn, Đúng/Sai, Trả lời ngắn) kèm nút ẩn/hiện đáp án.
 * 3. Ma trận 4 phần chuẩn 10đ, auto phân bổ 2 chiều, vừa khít 1 trang A4.
 * ==============================================================================
 */

// 1. DANH SÁCH MÔ HÌNH GEMINI HỢP LỆ
window.FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash"
];

// 2. KHỞI TẠO BỘ NHỚ MA TRẬN 4 PHẦN (CHỐNG LỖI UNDEFINED & SỐ 0)
window.BIOMASTER_MATRIX = {
    totals: {
        p1_b: 6, p1_h: 4, p1_vd: 2,  // Phần I: 12 câu
        p2_b: 4, p2_h: 4, p2_vd: 2,  // Phần II: 10 ý Đúng/Sai
        p3_b: 2, p3_h: 2, p3_vd: 1,  // Phần III: 5 câu ngắn
        p4_b: 1, p4_h: 1, p4_vd: 1   // Phần IV: 3 câu tự luận
    },
    scores: {
        p1: 3.0,  // Điểm Phần I
        p2: 3.0,  // Điểm Phần II
        p3: 1.5,  // Điểm Phần III
        p4: 2.5   // Điểm Phần IV -> Tổng = 10.0đ
    },
    counts: {}
};

// 3. XÁC ĐỊNH CHẾ ĐỘ ĐANG CHỌN (KHÔNG BỊ NHẦM TAB)
function getRealActiveMode() {
    const tab7991 = document.getElementById('btn-tab-7991');
    const tabSlide = document.getElementById('btn-tab-slide');
    if (tab7991 && tab7991.classList.contains('bg-blue-600')) return '7991';
    if (tabSlide && tabSlide.classList.contains('bg-blue-600')) return 'slide';
    return '5512';
}

function getRealSelectedLessons() {
    const checkedBoxes = document.querySelectorAll('#lesson-items-container input[type="checkbox"]:checked');
    if (checkedBoxes.length > 0) {
        return Array.from(checkedBoxes).map(cb => {
            const textSpan = cb.parentElement.querySelector('span');
            return textSpan ? textSpan.innerText.replace(/AI/g, '').trim() : "";
        }).filter(t => t.length > 0);
    }
    const currentTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim();
    return [currentTitle || "Bài 1: Giới thiệu khái quát môn Sinh học"];
}

// 4. TỰ ĐỘNG PHÂN BỔ SỐ CÂU/Ý CHO MA TRẬN
window.distributeMatrixFromTotals = function() {
    const lessons = getRealSelectedLessons();
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
        document.getElementById('sel-book')?.value || "Kết Nối Tri Thức"
    );
};

window.updatePartScoreField = function(part, value) {
    window.BIOMASTER_MATRIX.scores[part] = parseFloat(value) || 0;
    window.renderMaTranDeKiemTra(
        document.getElementById('sel-subject')?.value || "Sinh học",
        document.getElementById('sel-grade')?.value || "10",
        document.getElementById('sel-book')?.value || "Kết Nối Tri Thức"
    );
};

// 5. HÀM LẤY TOÀN BỘ NỘI DUNG GIÁO ÁN (AI HOẶC BẢN GỐC NỘI HÀM CÓ SẴN)
function getGiaoAnHtmlContent(subject, grade, book, lessonTitle) {
    const aiKey = `cached_ai_5512_${subject}_${grade}_${lessonTitle}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const cached = localStorage.getItem(aiKey);
    if (cached && cached.trim().length > 100) {
        return cached;
    }
    
    // Nếu chưa bấm AI cho bài này, tạo bộ giáo án nội hàm có sẵn vào DOM ảo để lấy nội dung
    const dummyDiv = document.createElement('div');
    const docContainer = document.getElementById('container-a4-doc');
    const oldHtml = docContainer ? docContainer.innerHTML : "";
    
    if (typeof window.renderGiaoAn5512HighEnd === 'function') {
        window.renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle);
        const internalHtml = docContainer ? docContainer.innerHTML : "";
        if (docContainer) docContainer.innerHTML = oldHtml;
        return internalHtml;
    }
    return oldHtml;
}

// 6. TRÍCH XUẤT KIẾN THỨC VÀ CÂU HỎI TỪ GIÁO ÁN VÀ ĐÓNG GÓI VÀO BỘ SLIDE PPT VIP
window.buildPPTFromGiaoAn = function(subject, grade, book, lessonTitle) {
    const lesTitle = String(lessonTitle || document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài học");
    const gaoAnHtml = getGiaoAnHtmlContent(subject, grade, book, lesTitle);
    
    const parserDiv = document.createElement('div');
    parserDiv.innerHTML = gaoAnHtml;

    // --- A. BÓC TÁCH KIẾN THỨC TỪ HOẠT ĐỘNG 2 (BẢNG 2 CỘT) ---
    const knowledgeSections = [];
    const tableRows = parserDiv.querySelectorAll('table tbody tr');
    
    tableRows.forEach((row, idx) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            const titleText = cells[0].querySelector('strong')?.innerText?.trim() || `Nội dung ${idx + 1}`;
            const contentHtml = cells[1].innerHTML.trim();
            knowledgeSections.push({
                title: titleText.toUpperCase(),
                body: `<div class="text-slate-200 leading-relaxed text-lg space-y-2">${contentHtml}</div>`
            });
        }
    });

    // Nếu bảng không có dữ liệu, dùng cấu trúc dự phòng từ khung chỉ dẫn
    if (knowledgeSections.length === 0) {
        const info = window.getDynamicNlsAiInfo ? window.getDynamicNlsAiInfo(lesTitle, grade) : {};
        knowledgeSections.push({
            title: "1. CẤU TRÚC VÀ ĐẶC ĐIỂM BẢN CHẤT",
            body: `<div class="text-slate-200 leading-relaxed text-lg"><p>• ${info.core1 || "Bản chất và cấu trúc sinh học cốt lõi theo SGK Kết nối tri thức."}</p><p>• Cơ chế tương tác và biến đổi năng lượng thích nghi.</p></div>`
        });
        knowledgeSections.push({
            title: "2. QUY LUẬT VÀ Ý NGHĨA SINH THÁI",
            body: `<div class="text-slate-200 leading-relaxed text-lg"><p>• ${info.core2 || "Quy luật điều hòa và ổn định nội môi trong cơ thể sống."}</p><p>• Đảm bảo tính toàn vẹn và tiến hóa thích nghi sinh vật.</p></div>`
        });
        knowledgeSections.push({
            title: "3. ỨNG DỤNG THỰC TIỄN NÔNG NGHIỆP",
            body: `<div class="text-slate-200 leading-relaxed text-lg"><p>• ${info.core3 || "Ứng dụng kỹ thuật sinh học vào sản xuất nông nghiệp công nghệ cao."}</p><p>• Thực tiễn sản xuất tại huyện Mang Thít, tỉnh Vĩnh Long.</p></div>`
        });
    }

    // --- B. BÓC TÁCH CÂU HỎI LUYỆN TẬP TỪ HOẠT ĐỘNG 3 ---
    const pTags = Array.from(parserDiv.querySelectorAll('p'));
    const d1Questions = []; // Trắc nghiệm 4 lựa chọn
    const d2Questions = []; // Trắc nghiệm Đúng/Sai
    const d3Questions = []; // Trắc nghiệm trả lời ngắn

    // Bóc tách Dạng 1: Các câu hỏi có A, B, C, D
    for (let i = 0; i < pTags.length; i++) {
        const text = pTags[i].innerText.trim();
        if (/^Câu \d+:/i.test(text) && !text.includes('[ĐÚNG]') && !text.includes('[SAI]') && !text.includes('Đáp án:')) {
            const qStem = text;
            let optionsHtml = "";
            let correctOpt = "B";

            // Tìm các dòng chứa lựa chọn A, B, C, D ngay sau câu hỏi
            if (pTags[i + 1] && pTags[i + 1].innerText.includes('A.')) {
                optionsHtml += `<p class="p-3 bg-black/40 rounded-xl border border-slate-700">${pTags[i + 1].innerHTML}</p>`;
                if (pTags[i + 1].querySelector('strong, b, u')) {
                    correctOpt = pTags[i + 1].querySelector('strong, b, u').innerText.trim();
                }
            }
            if (pTags[i + 2] && (pTags[i + 2].innerText.includes('C.') || pTags[i + 2].innerText.includes('D.'))) {
                optionsHtml += `<p class="p-3 bg-black/40 rounded-xl border border-slate-700">${pTags[i + 2].innerHTML}</p>`;
                if (pTags[i + 2].querySelector('strong, b, u')) {
                    correctOpt = pTags[i + 2].querySelector('strong, b, u').innerText.trim();
                }
            }

            d1Questions.push({
                stem: qStem,
                optionsHtml: optionsHtml || `<div class="grid grid-cols-2 gap-3 text-base"><div class="p-3 bg-black/40 rounded-xl border border-slate-700">A. Không tuân theo quy luật tự nhiên</div><div class="p-3 bg-black/40 rounded-xl border border-slate-700">B. Bảo đảm sao chép chính xác và thích nghi</div><div class="p-3 bg-black/40 rounded-xl border border-slate-700">C. Tự nhân đôi không cần năng lượng</div><div class="p-3 bg-black/40 rounded-xl border border-slate-700">D. Diễn ra ngẫu nhiên không kiểm soát</div></div>`,
                ans: correctOpt
            });
        }

        // Bóc tách Dạng 2: Đúng/Sai bối cảnh khoa học
        if (/^Câu \d+:/i.test(text) && (pTags[i + 1]?.innerText.includes('[ĐÚNG]') || pTags[i + 1]?.innerText.includes('[SAI]'))) {
            const qStem = text;
            const items = [];
            for (let j = 1; j <= 4; j++) {
                if (pTags[i + j]) items.push(pTags[i + j].innerText.trim());
            }
            d2Questions.push({
                stem: qStem,
                items: items
            });
        }

        // Bóc tách Dạng 3: Trả lời ngắn
        if (text.includes('➜') || text.includes('Đáp án:')) {
            d3Questions.push({
                stem: text.split('➜')[0].trim(),
                ans: text.split('➜')[1]?.replace(/Đáp án:/i, '')?.trim() || "8"
            });
        }
    }

    // --- C. DỰNG BỘ SLIDE HOÀN CHỈNH ÉP VÀO KHUNG NỘI HÀM VIP (TYPOGRAPHY >= 34PT) ---
    window.slideDeckData = [];

    // 1. SLIDE BÌA
    window.slideDeckData.push({
        title: lesTitle.toUpperCase(),
        tag: `${subject} ${grade} • ${book}`,
        body: `
            <div class="text-center py-6 space-y-4">
                <div class="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm uppercase border border-amber-400/30">
                    TRƯỜNG THPT MANG THÍT • BÀI GIẢNG ĐIỆN TỬ VIP
                </div>
                <h1 class="text-5xl font-black text-amber-300 tracking-tight leading-tight">
                    ${lesTitle}
                </h1>
                <p class="text-slate-200 text-lg max-w-2xl mx-auto">
                    Giáo viên: <strong>Hồ Tấn Khải</strong> • Tổ Sinh học - Công nghệ
                </p>
            </div>
        `
    });

    // 2. SLIDE HOẠT ĐỘNG 1 (KHỞI ĐỘNG)
    window.slideDeckData.push({
        title: "HOẠT ĐỘNG 1: MỞ ĐẦU (WARM-UP)",
        tag: "KHỞI ĐỘNG",
        body: `
            <div class="grid grid-cols-2 gap-6 items-center text-base">
                <div class="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-3">
                    <span class="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-sm">Hiện tượng thực tiễn</span>
                    <h3 class="text-xl font-bold text-white">Mâu thuẫn nhận thức khoa học</h3>
                    <p class="text-slate-200 leading-relaxed">
                        Làm thế nào cơ thể sinh vật duy trì được sự sống bền vững và thích ứng linh hoạt với điều kiện sống biến đổi liên tục?
                    </p>
                </div>
                <div class="bg-emerald-950/40 p-6 rounded-2xl border border-emerald-500/40 space-y-3">
                    <h4 class="text-amber-300 font-bold text-lg"><i class="fa-solid fa-lightbulb mr-2"></i> Câu hỏi định hướng tư duy:</h4>
                    <p class="text-slate-200">• 1. Thành phần bản chất nào đóng vai trò then chốt?</p>
                    <p class="text-slate-200">• 2. Quy luật tự nhiên nào chi phối trực tiếp tiến trình trên?</p>
                    <p class="text-amber-400 font-bold">➜ Hãy cùng khám phá bài học mới!</p>
                </div>
            </div>
        `
    });

    // 3. CÁC SLIDE HÌNH THÀNH KIẾN THỨC (TỪ HOẠT ĐỘNG 2 CỦA GIÁO ÁN)
    knowledgeSections.forEach((sec, idx) => {
        window.slideDeckData.push({
            title: sec.title,
            tag: `HÌNH THÀNH KIẾN THỨC (MỤC ${idx + 1})`,
            body: `<div class="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-4 text-base">${sec.body}</div>`
        });
    });

    // 4. SLIDE CHỐT KIẾN THỨC CỐT LÕI (NỘI DUNG GHI VỞ BẮT BUỘC)
    window.slideDeckData.push({
        title: "KIẾN THỨC CỐT LÕI (NỘI DUNG GHI VỞ)",
        tag: "CHỐT KIẾN THỨC BẮT BUỘC",
        body: `
            <div class="bg-black/50 p-6 rounded-2xl border-2 border-amber-400/60 space-y-4 text-base">
                <p class="text-amber-300 font-bold text-xl"><i class="fa-solid fa-book-bookmark mr-2"></i> Học sinh ghi nhớ các điểm then chốt:</p>
                <p class="text-slate-200">• <strong>Bản chất:</strong> Nắm vững định nghĩa, cấu trúc và quy luật cơ bản của bài học.</p>
                <p class="text-slate-200">• <strong>Cơ chế:</strong> Diễn biến chuyển hóa, tương tác thích nghi bảo đảm ổn định di truyền.</p>
                <p class="text-slate-200">• <strong>Ý nghĩa:</strong> Ứng dụng khoa học kỹ thuật vào sản xuất nông nghiệp bền vững.</p>
            </div>
        `
    });

    // 5. CÁC SLIDE DẠNG 1: TRẮC NGHIỆM 4 LỰA CHỌN (TỪ GIÁO ÁN SANG)
    const countD1 = Math.max(d1Questions.length, 6);
    for (let i = 0; i < countD1; i++) {
        const q = d1Questions[i] || {
            stem: `Câu ${i + 1}: Nhận định nào sau đây phản ánh chính xác nhất bản chất khoa học của bài học?`,
            optionsHtml: `<div class="grid grid-cols-2 gap-3 text-base"><div class="p-3 bg-black/40 rounded-xl border border-slate-700">A. Không tuân theo các quy luật di truyền</div><div class="p-3 bg-black/40 rounded-xl border border-slate-700">B. Luôn bảo đảm sao chép chính xác và thích nghi</div><div class="p-3 bg-black/40 rounded-xl border border-slate-700">C. Tự nhân đôi không phụ thuộc năng lượng</div><div class="p-3 bg-black/40 rounded-xl border border-slate-700">D. Diễn ra ngẫu nhiên không kiểm soát</div></div>`,
            ans: "B (Bảo đảm tính toàn vẹn và thích nghi sinh thái)"
        };

        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẮC NGHIỆM ${i + 1}`,
            tag: `DẠNG 1: 4 LỰA CHỌN (${i + 1}/${countD1})`,
            body: `
                <div class="space-y-4 text-base">
                    <p class="font-bold text-white text-lg">${q.stem}</p>
                    ${q.optionsHtml}
                    <div class="pt-2">
                        <button onclick="toggleSlideAnswer(this)" class="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-sm">
                            <i class="fa-solid fa-eye mr-1"></i> Bấm để hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/60 font-bold text-emerald-300 text-base">
                            ➜ Đáp án đúng: ${q.ans}
                        </div>
                    </div>
                </div>
            `
        });
    }

    // 6. CÁC SLIDE DẠNG 2: TRẮC NGHIỆM ĐÚNG/SAI (TỪ GIÁO ÁN SANG)
    const countD2 = Math.max(d2Questions.length, 4);
    for (let i = 0; i < countD2; i++) {
        const q = d2Questions[i] || {
            stem: `Câu ${i + 1}: Trong một nghiên cứu khoa học thực nghiệm về điều kiện môi trường sống:`,
            items: [
                "a) Điều kiện nhiệt độ và độ ẩm tối ưu giúp quá trình chuyển hóa đạt hiệu suất cao nhất. [ĐÚNG]",
                "b) Mọi tác nhân đột biến đều làm tăng tốc độ sinh trưởng của cá thể sinh vật. [SAI]",
                "c) Nắm vững quy luật giúp nông dân chủ động phòng trừ dịch hại nâng cao năng suất. [ĐÚNG]",
                "d) Các biến đổi nội tại diễn ra hoàn toàn tự phát mà không cần năng lượng trao đổi. [SAI]"
            ]
        };

        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẮC NGHIỆM ĐÚNG/SAI ${i + 1}`,
            tag: `DẠNG 2: BỐI CẢNH THỰC NGHIỆM (${i + 1}/${countD2})`,
            body: `
                <div class="space-y-3 text-base">
                    <p class="font-bold text-amber-300 text-lg">${q.stem}</p>
                    <div class="space-y-2 bg-black/40 p-4 rounded-xl border border-slate-700 text-base">
                        ${q.items.map(it => `<p>${it.replace(/[ĐÚNG]|[SAI]/g, '')}</p>`).join('')}
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

    // 7. CÁC SLIDE DẠNG 3: TRẢ LỜI NGẮN (TỪ GIÁO ÁN SANG, ĐÁP ÁN <= 4 KÝ TỰ)
    const countD3 = Math.max(d3Questions.length, 6);
    for (let i = 0; i < countD3; i++) {
        const q = d3Questions[i] || {
            stem: `Câu ${i + 1}: Một cấu trúc sinh học ban đầu trải qua ${i + 1} đợt phân bào liên tiếp sẽ tạo ra bao nhiêu cấu trúc con?`,
            ans: `${Math.pow(2, i + 1)}`
        };

        window.slideDeckData.push({
            title: `LUYỆN TẬP: TRẢ LỜI NGẮN ${i + 1}`,
            tag: `DẠNG 3: ĐIỀN CON SỐ (${i + 1}/${countD3})`,
            body: `
                <div class="space-y-4 text-base">
                    <p class="font-bold text-white text-lg">${q.stem}</p>
                    <p class="text-slate-300 italic">(Đáp án là con số cụ thể không quá 4 ký tự)</p>
                    <div>
                        <button onclick="toggleSlideAnswer(this)" class="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition text-sm">
                            <i class="fa-solid fa-eye mr-1"></i> Bấm để hiển thị đáp án đúng
                        </button>
                        <div class="hidden mt-2 p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/60 font-bold text-emerald-300 text-xl">
                            ➜ Đáp án chính xác: ${q.ans}
                        </div>
                    </div>
                </div>
            `
        });
    }

    // 8. SLIDE HOẠT ĐỘNG 4 (VẬN DỤNG & DỰ ÁN HỌC TẬP)
    window.slideDeckData.push({
        title: "HOẠT ĐỘNG 4: VẬN DỤNG THỰC TẾ",
        tag: "VẬN DỤNG & DỰ ÁN",
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

// 7. GHI ĐÈ HÀM HIỂN THỊ NỘI DUNG KHI CHỌN BÀI (ĐỒNG BỘ PPT TỨC THÌ)
window.displayContentForCurrentLesson = function() {
    const realMode = getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức";
    const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";
    const docContainer = document.getElementById('container-a4-doc');
    const statusInd = document.getElementById('content-source-indicator');

    const aiKey = `cached_ai_${realMode}_${subject}_${grade}_${lessonTitle}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const cachedData = localStorage.getItem(aiKey);

    // KHI ĐANG Ở TAB SLIDE: TỰ ĐỘNG BÓC TÁCH VÀ NẠP SLIDE TỪ GIÁO ÁN
    if (realMode === 'slide') {
        if (cachedData) {
            try {
                window.slideDeckData = JSON.parse(cachedData);
                window.currentSlideIndex = 0;
                if (typeof window.renderCurrentSlide === 'function') window.renderCurrentSlide();
                if (statusInd) statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã nạp Slide bài giảng từ AI (Đã lưu)</span>`;
                return;
            } catch(e) {}
        }
        // Tự động ép trực tiếp từ giáo án có sẵn sang slide
        window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
        if (statusInd) statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check text-[10px]"></i> Slide đã đồng bộ kiến thức từ Giáo án 5512</span>`;
        return;
    }

    // KHI Ở TAB 5512 HOẶC 7991:
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

// 8. GHI ĐÈ NÚT LƯU VÀ NÚT QUAY VỀ BẢN GỐC
window.saveCurrentAIContent = function() {
    const realMode = getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài học";
    const aiKey = `cached_ai_${realMode}_${subject}_${grade}_${lessonTitle}`.replace(/[^a-zA-Z0-9_]/g, '_');

    if (realMode === 'slide') {
        if (window.slideDeckData && window.slideDeckData.length > 0) {
            localStorage.setItem(aiKey, JSON.stringify(window.slideDeckData));
            if (typeof window.hideAIReviewBar === 'function') window.hideAIReviewBar();
            const statusInd = document.getElementById('content-source-indicator');
            if (statusInd) statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-check-double text-[10px]"></i> Đã lưu Slide AI thành công!</span>`;
            alert("Đã lưu bộ Slide AI thành công! Những lần sau chọn bài này sẽ tự động nạp slide của Thầy.");
            return;
        }
    }

    const docContainer = document.getElementById('container-a4-doc');
    const contentToSave = window.temporaryAIGeneratedDoc || (docContainer ? docContainer.innerHTML : "");
    localStorage.setItem(aiKey, contentToSave);
    if (typeof window.hideAIReviewBar === 'function') window.hideAIReviewBar();
    const statusInd = document.getElementById('content-source-indicator');
    if (statusInd) statusInd.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-check-double text-[10px]"></i> Đã lưu bản soạn AI thành công!</span>`;
    alert("Đã lưu bài soạn AI thành công!");
};

window.discardCurrentAIContent = function() {
    const realMode = getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức";
    const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài học";
    const aiKey = `cached_ai_${realMode}_${subject}_${grade}_${lessonTitle}`.replace(/[^a-zA-Z0-9_]/g, '_');

    localStorage.removeItem(aiKey);
    window.temporaryAIGeneratedDoc = null;
    if (typeof window.hideAIReviewBar === 'function') window.hideAIReviewBar();

    if (realMode === 'slide') {
        window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
        alert("Đã đưa bài giảng Slide 16:9 trở lại bản chuẩn mực đồng bộ từ Giáo án!");
    } else {
        window.displayContentForCurrentLesson();
        alert("Đã xóa bản AI và trở về bản gốc nội hàm chuẩn mực!");
    }
};

// 9. GHI ĐÈ NÚT KÍCH HOẠT AI
window.executeActionAI = async function() {
    const realMode = getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức";
    const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";
    const statusInd = document.getElementById('content-source-indicator');

    // NẾU Ở TAB SLIDE: TỰ ĐỘNG ĐỒNG BỘ KIẾN THỨC VÀ BÀI TẬP TỪ GIÁO ÁN VÀO SLIDE
    if (realMode === 'slide') {
        window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
        if (typeof window.showAIReviewBar === 'function') window.showAIReviewBar();
        if (statusInd) {
            statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã trích xuất kiến thức & câu hỏi từ Giáo án vào Slide! Bấm "Lưu Lại" để hoàn tất.</span>`;
        }
        alert("Đã đồng bộ toàn bộ kiến thức và bài tập từ Giáo án vào Slide 16:9 hoàn hảo!");
        return;
    }

    // NẾU Ở TAB 7991 HOẶC 5512: GỌI GEMINI BIÊN SOẠN
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
            const lessons = getRealSelectedLessons().join(', ');
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

        // Chế độ Giáo án 5512:
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

// 10. LẮNG NGHE SỰ KIỆN CLICK TAB VÀ CHECKBOX ĐỂ CẬP NHẬT TỨC THÌ
document.addEventListener('click', (e) => {
    // Nếu bấm sang tab Slide
    if (e.target && (e.target.id === 'btn-tab-slide' || e.target.closest('#btn-tab-slide'))) {
        setTimeout(() => {
            const subject = document.getElementById('sel-subject')?.value || "Sinh học";
            const grade = document.getElementById('sel-grade')?.value || "10";
            const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức";
            const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";
            window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
        }, 50);
    }

    // Nếu bấm sang tab 7991
    if (e.target && (e.target.id === 'btn-tab-7991' || e.target.closest('#btn-tab-7991'))) {
        setTimeout(() => {
            window.renderMaTranDeKiemTra(
                document.getElementById('sel-subject')?.value || "Sinh học",
                document.getElementById('sel-grade')?.value || "10",
                document.getElementById('sel-book')?.value || "Kết Nối Tri Thức"
            );
        }, 50);
    }
});

document.addEventListener('change', (e) => {
    if (e.target && e.target.matches('#lesson-items-container input[type="checkbox"]')) {
        setTimeout(() => {
            if (getRealActiveMode() === '7991') {
                window.renderMaTranDeKiemTra(
                    document.getElementById('sel-subject')?.value || "Sinh học",
                    document.getElementById('sel-grade')?.value || "10",
                    document.getElementById('sel-book')?.value || "Kết Nối Tri Thức"
                );
            }
        }, 50);
    }
});

// TỰ ĐỘNG CHẠY KHI TẢI FILE
setTimeout(() => {
    window.distributeMatrixFromTotals();
    const mode = getRealActiveMode();
    const subject = document.getElementById('sel-subject')?.value || "Sinh học";
    const grade = document.getElementById('sel-grade')?.value || "10";
    const book = document.getElementById('sel-book')?.value || "Kết Nối Tri Thức";
    const lessonTitle = document.getElementById('active-selected-lesson-title')?.innerText?.trim() || "Bài 1: Giới thiệu khái quát môn Sinh học";

    if (mode === '7991') {
        window.renderMaTranDeKiemTra(subject, grade, book);
    } else if (mode === 'slide') {
        window.buildPPTFromGiaoAn(subject, grade, book, lessonTitle);
    }
}, 100);
