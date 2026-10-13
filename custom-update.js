/**
 * ==============================================================================
 * BIOMASTER AI - MODULE CẬP NHẬT TÍNH NĂNG ĐỘC LẬP
 * GV: Hồ Tấn Khải - THPT Mang Thít
 * Cập nhật: 
 * 1. Slide PPT tạo bằng AI bám sát chỉ dẫn sư phạm
 * 2. Hỗ trợ nút Lưu lại hoặc Trở về bản gốc nội hàm cho cả Slide PPT & Đề thi
 * 3. Ma trận 7991 khống chế số câu & điểm số vừa khít 1 trang A4
 * ==============================================================================
 */

// 1. DANH SÁCH MÔ HÌNH GOOGLE GEMINI HỢP LỆ
window.FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash"
];

// 2. MA TRẬN 7991: ĐỦ 4 PHẦN & KHỐNG CHẾ SỐ CÂU/ĐIỂM SỐ
window.matrixGlobalTotals = {
    p1_b: 6, p1_h: 4, p1_vd: 2,  // Phần I: 12 câu
    p2_b: 4, p2_h: 4, p2_vd: 2,  // Phần II: 10 ý Đúng/Sai
    p3_b: 2, p3_h: 2, p3_vd: 1,  // Phần III: 5 câu ngắn
    p4_b: 1, p4_h: 1, p4_vd: 1   // Phần IV: 3 câu tự luận
};

window.matrixPartScores = {
    p1: 3.0,  // Điểm Phần I
    p2: 3.0,  // Điểm Phần II
    p3: 1.5,  // Điểm Phần III
    p4: 2.5   // Điểm Phần IV (Tự luận)
};

// 3. TỰ ĐỘNG PHÂN BỔ SỐ CÂU/Ý VỀ TỪNG BÀI ĐƯỢC CHỌN
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

// 4. ĐỒNG BỘ HIỂN THỊ NỘI DUNG (KIỂM TRA CẢ BẢN LƯU CỦA SLIDE PPT)
window.displayContentForCurrentLesson = function() {
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const book = document.getElementById('sel-book').value;
    const lessonTitle = currentSelectedLesson;
    const docContainer = document.getElementById('container-a4-doc');
    const statusInd = document.getElementById('content-source-indicator');

    const aiKey = getAICacheKey(currentActiveMode, subject, grade, lessonTitle);
    const cachedData = localStorage.getItem(aiKey);

    // NẾU ĐANG Ở TAB SLIDE:
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

    // NẾU Ở TAB 5512 HOẶC 7991:
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

// 5. NÂNG CẤP NÚT LƯU BÀI (HỖ TRỢ CẢ SLIDE PPT VÀ VĂN BẢN)
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

// 6. NÂNG CẤP NÚT TRỞ VỀ BẢN GỐC NỘI HÀM (HỖ TRỢ CẢ SLIDE VÀ VĂN BẢN)
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

// 7. GHI ĐÈ HÀM GỌI AI CHO CẢ 3 CHẾ ĐỘ (SLIDE PPT BÁM SÁT CHỈ DẪN)
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
        filePromptPart = `\n- NGỮ LIỆU BỔ SUNG TỪ FILE: """${uploadedFileContent.slice(0, 8000)}"""`;
    }

    // ==================== A. TẠO SLIDE POWERPOINT BẰNG AI ====================
    if (currentActiveMode === 'slide') {
        statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang thiết kế Slide bám sát chỉ dẫn...</span>`;
        
        const promptSlide = `Bạn là chuyên gia thiết kế bài giảng điện tử PowerPoint môn ${subject} ${grade} (${book}). Hãy biên soạn bộ slide bài giảng 16:9 cho bài: "${lessonTitle}".
CHỈ DẪN SƯ PHẠM ĐẶC BIỆT CỦA GIÁO VIÊN: """${customGuide || "Ưu tiên làm nổi bật kiến thức trọng tâm SGK, các quy luật sinh học và bài tập liên hệ thực tiễn huyện Mang Thít, tỉnh Vĩnh Long."}"""${filePromptPart}

YÊU CẦU ĐỊNH DẠNG:
Trả về DUY NHẤT một mảng JSON thuần túy (không bọc giải thích ngoài, không thêm ký tự lạ):
[
  {
    "tag": "HOẠT ĐỘNG 1: KHỞI ĐỘNG",
    "title": "TÌNH HUỐNG MỞ ĐẦU",
    "body": "<div class='space-y-3 text-base'><p>Nội dung câu hỏi hoặc tình huống khơi gợi mâu thuẫn nhận thức...</p></div>"
  }
]

CẤU TRÚC BỘ SLIDE (TỪ 8 ĐẾN 12 SLIDE BẮT BUỘC):
- Slide 1: Trang bìa giới thiệu bài học ${lessonTitle}.
- Slide 2: Tình huống thực tiễn mở đầu (Khởi động).
- Slide 3 đến 5: Hình thành kiến thức mới (chia nhỏ từng luận điểm SGK, bám sát chỉ dẫn của giáo viên).
- Slide 6: Kiến thức cốt lõi chốt lại để học sinh ghi vở.
- Slide 7 đến 9: Hệ thống câu hỏi trắc nghiệm tương tác (có nút bấm hiển thị đáp án).
- Slide 10: Vận dụng thực tiễn gắn với đời sống/nông nghiệp tại huyện Mang Thít, tỉnh Vĩnh Long.`;

        try {
            const aiResult = await fetchGeminiWithCascade(promptSlide, savedKey, preferredModel);
            let raw = aiResult.text.replace(/```json/gi, '').replace(/```/gi, '').trim();
            const newSlides = JSON.parse(raw);

            if (Array.isArray(newSlides) && newSlides.length > 0) {
                slideDeckData = newSlides;
                currentSlideIndex = 0;
                renderCurrentSlide();
                
                // HIỂN THỊ THANH DUYỆT BÀI VÀ THÔNG BÁO CHO THẦY
                showAIReviewBar();
                statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> AI đã tạo xong ${newSlides.length} slide! Thầy bấm "Lưu Lại" để hoàn tất.</span>`;
            } else {
                throw new Error("Dữ liệu JSON slide trả về không đúng cấu trúc mảng.");
            }
        } catch (e) {
            console.error("Lỗi tạo slide AI:", e);
            alert("Lỗi tạo slide AI: " + e.message + ". Hệ thống chuyển về slide mặc định.");
            renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
        }
        return;
    }

    // ==================== B & C. SOẠN GIÁO ÁN 5512 & ĐỀ THI 7991 ====================
    docContainer.innerHTML = `
        <div style="text-align: center; padding: 75px 20px; font-family: sans-serif;">
            <div style="font-size: 38px; color: #9333ea; margin-bottom: 16px;"><i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i></div>
            <h3 style="font-size: 15pt; font-weight: bold; color: #0f172a;" id="ai-loading-status">Đang kết nối Gemini...</h3>
            <p style="color: #64748b; font-size: 11pt; margin-top: 6px;">
                Đang xử lý: <strong>${currentActiveMode === '5512' ? 'KHBD 5512' : 'Đề kiểm tra 7991'}</strong> - ${lessonTitle}
            </p>
        </div>
    `;
    statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> AI đang biên soạn dữ liệu...</span>`;

    try {
        if (currentActiveMode === '7991') {
            const lessons = (selectedLessonsForExam && selectedLessonsForExam.length > 0) ? selectedLessonsForExam.join(', ') : lessonTitle;
            const promptExam = `Bạn là chuyên gia khảo thí THPT môn ${subject} ${grade}. Hãy biên soạn ĐỀ KIỂM TRA ĐỊNH KỲ bám sát Quyết định 7991/BGDĐT cho: ${lessons}. Bộ sách: ${book}.
CHỈ DẪN GIÁO VIÊN: """${customGuide}"""${filePromptPart}
Ma trận và thang điểm bắt buộc:
1. PHẦN I (Trắc nghiệm 4 lựa chọn - ${matrixPartScores.p1}đ): ${matrixGlobalTotals.p1_b} câu Biết, ${matrixGlobalTotals.p1_h} câu Hiểu, ${matrixGlobalTotals.p1_vd} câu Vận dụng (in đậm hoặc gạch chân đáp án đúng).
2. PHẦN II (Trắc nghiệm Đúng/Sai - ${matrixPartScores.p2}đ): ${(parseInt(matrixGlobalTotals.p2_b)||0) + (parseInt(matrixGlobalTotals.p2_h)||0) + (parseInt(matrixGlobalTotals.p2_vd)||0)} Ý LỆNH HỎI (${matrixGlobalTotals.p2_b} ý Biết, ${matrixGlobalTotals.p2_h} ý Hiểu, ${matrixGlobalTotals.p2_vd} ý Vận dụng). Mỗi câu gồm bối cảnh thực nghiệm và 4 ý a, b, c, d có [ĐÚNG] hoặc [SAI].
3. PHẦN III (Trắc nghiệm Trả lời ngắn - ${matrixPartScores.p3}đ): ${matrixGlobalTotals.p3_b} câu Biết, ${matrixGlobalTotals.p3_h} câu Hiểu, ${matrixGlobalTotals.p3_vd} câu Vận dụng. Mỗi câu điền số/từ ngắn kèm đáp án.
4. PHẦN IV (Tự luận - ${matrixPartScores.p4}đ): ${matrixGlobalTotals.p4_b} câu Biết, ${matrixGlobalTotals.p4_h} câu Hiểu, ${matrixGlobalTotals.p4_vd} câu Vận dụng (liên hệ thực tế nông nghiệp huyện Mang Thít, tỉnh Vĩnh Long).
KÈM BẢNG ĐÁP ÁN VÀ THANG ĐIỂM BAREM CHI TIẾT ĐỦ 10.0 ĐIỂM Ở CUỐI ĐỀ.
Định dạng HTML thuần túy không bọc markdown. Font Times New Roman 13pt.`;

            const aiResult = await fetchGeminiWithCascade(promptExam, savedKey, preferredModel);
            let out = aiResult.text.replace(/^```html/i, '').replace(/```$/i, '').trim();
            docContainer.innerHTML = out;
            temporaryAIGeneratedDoc = out;
            showAIReviewBar();
            statusInd.innerHTML = `<span class="text-purple-400 font-bold"><i class="fa-solid fa-sparkles"></i> Đã tạo xong Đề thi 7991 qua [${aiResult.modelUsed}]!</span>`;
            return;
        }

        // Chế độ 5512:
        const info = getDynamicNlsAiInfo(lessonTitle, grade);
        const prompt5512 = `Bạn là chuyên gia sư phạm THPT. Hãy biên soạn nội dung kiến thức chuyên môn bám sát SGK ${book} của bài: "${lessonTitle}", môn ${subject} ${grade}.
CHỈ DẪN GIÁO VIÊN: """${customGuide}"""${filePromptPart}
Cấu trúc:
1. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (Bảng 2 cột viền đen: Hoạt động GV-HS và Dự kiến sản phẩm ghi vở).
2. HOẠT ĐỘNG 3: LUYỆN TẬP (Trắc nghiệm 4 lựa chọn, Đúng/Sai, Trả lời ngắn).
3. HOẠT ĐỘNG 4: VẬN DỤNG (Tình huống gắn với huyện Mang Thít Vĩnh Long).
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

// 8. GHI ĐÈ GIAO DIỆN MA TRẬN 7991 VỪA KHÍT 1 TRANG A4
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
        <div style="page-break-after: always; min-height: 250mm; display: flex; flex-direction: column; justify-content: space-between;">
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

                <div style="text-align: center; margin: 6px 0 8px 0;">
                    <h2 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ</h2>
                    <p style="margin: 1px 0 0 0; font-style: italic; font-size: 10pt;">Môn học: ${subject} ${grade} • Thời gian: 45 phút • Bộ sách: ${book}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 8pt; margin: 4px 0;">
                    <thead>
                        <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                            <th rowspan="2" style="width: 22px; padding: 3px 1px;">TT</th>
                            <th rowspan="2" style="width: 145px; padding: 3px 4px; text-align: left;">Chủ đề / Bài học</th>
                            <th colspan="3" style="padding: 3px 1px;">Phần I (Nhiều LC)</th>
                            <th colspan="3" style="padding: 3px 1px; color: #15803d; background: #e8f5e9;">Phần II (Đúng/Sai - Ý)</th>
                            <th colspan="3" style="padding: 3px 1px; color: #0284c7; background: #e1f5fe;">Phần III (Ngắn)</th>
                            <th colspan="3" style="padding: 3px 1px; color: #b91c1c; background: #ffebee;">Phần IV (Tự luận)</th>
                            <th rowspan="2" style="width: 55px; padding: 3px 1px;">Tổng câu/ý</th>
                        </tr>
                        <tr style="background: #F0F4F8; text-align: center; font-size: 7.5pt;">
                            <th style="width: 24px; padding: 2px 0;">Biết</th><th style="width: 24px; padding: 2px 0;">Hiểu</th><th style="width: 24px; padding: 2px 0;">VD</th>
                            <th style="width: 24px; padding: 2px 0; color: #15803d; background: #e8f5e9;">Biết</th><th style="width: 24px; padding: 2px 0; color: #15803d; background: #e8f5e9;">Hiểu</th><th style="width: 24px; padding: 2px 0; color: #15803d; background: #e8f5e9;">VD</th>
                            <th style="width: 24px; padding: 2px 0; color: #0284c7; background: #e1f5fe;">Biết</th><th style="width: 24px; padding: 2px 0; color: #0284c7; background: #e1f5fe;">Hiểu</th><th style="width: 24px; padding: 2px 0; color: #0284c7; background: #e1f5fe;">VD</th>
                            <th style="width: 24px; padding: 2px 0; color: #b91c1c; background: #ffebee;">Biết</th><th style="width: 24px; padding: 2px 0; color: #b91c1c; background: #ffebee;">Hiểu</th><th style="width: 24px; padding: 2px 0; color: #b91c1c; background: #ffebee;">VD</th>
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
                                    <td style="padding: 2px 4px; line-height: 1.1;"><strong>${les}</strong></td>
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
                                        ${s1}c \vert{}${s2}ý | ${s3}c \vert{}${s4}tl
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                        
                        <tr style="background: #eff6ff; font-weight: bold; text-align: center; border-top: 2px solid #1e40af;">
                            <td colspan="2" style="color: #1e3a8a; text-align: right; padding: 3px 6px;">TỔNG SỐ CÂU / Ý (Khống chế):</td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_b}" onchange="updateGlobalTotalField('p1_b', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_h}" onchange="updateGlobalTotalField('p1_h', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p1_vd}" onchange="updateGlobalTotalField('p1_vd', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #2563eb; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fff;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_b}" onchange="updateGlobalTotalField('p2_b', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_h}" onchange="updateGlobalTotalField('p2_h', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p2_vd}" onchange="updateGlobalTotalField('p2_vd', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #dcfce7;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_b}" onchange="updateGlobalTotalField('p3_b', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_h}" onchange="updateGlobalTotalField('p3_h', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p3_vd}" onchange="updateGlobalTotalField('p3_vd', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #e0f2fe;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_b}" onchange="updateGlobalTotalField('p4_b', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_h}" onchange="updateGlobalTotalField('p4_h', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;"></td>
                            <td style="padding: 1px;"><input type="number" min="0" value="${matrixGlobalTotals.p4_vd}" onchange="updateGlobalTotalField('p4_vd', this.value)" style="width: 26px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8pt; border-radius: 3px; font-weight: bold; background: #fee2e2;"></td>
                            <td style="color: #b91c1c; font-size: 8pt; padding: 2px 1px;">${countP1}c|${countP2}ý|${countP3}c|${countP4}tl</td>
                        </tr>

                        <tr style="background: #fefce8; font-weight: bold; text-align: center; border-top: 1px solid #ca8a04;">
                            <td colspan="2" style="color: #854d0e; text-align: right; padding: 3px 6px;">ĐIỂM SỐ TỪNG PHẦN (Khống chế):</td>
                            <td colspan="3" style="padding: 2px;">
                                <input type="number" step="0.25" min="0" value="${scoreP1}" onchange="updatePartScoreField('p1', this.value)" style="width: 44px; height: 18px; text-align: center; border: 1px solid #ca8a04; font-size: 8.5pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #64748b; display: block;">(${p1PerQ}đ/câu)</span>
                            </td>
                            <td colspan="3" style="padding: 2px; background: #f0fdf4;">
                                <input type="number" step="0.25" min="0" value="${scoreP2}" onchange="updatePartScoreField('p2', this.value)" style="width: 44px; height: 18px; text-align: center; border: 1px solid #16a34a; font-size: 8.5pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #15803d; display: block;">(Lũy tiến ý)</span>
                            </td>
                            <td colspan="3" style="padding: 2px; background: #f0f9ff;">
                                <input type="number" step="0.25" min="0" value="${scoreP3}" onchange="updatePartScoreField('p3', this.value)" style="width: 44px; height: 18px; text-align: center; border: 1px solid #0284c7; font-size: 8.5pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #0369a1; display: block;">(${p3PerQ}đ/câu)</span>
                            </td>
                            <td colspan="3" style="padding: 2px; background: #fef2f2;">
                                <input type="number" step="0.25" min="0" value="${scoreP4}" onchange="updatePartScoreField('p4', this.value)" style="width: 44px; height: 18px; text-align: center; border: 1px solid #dc2626; font-size: 8.5pt; font-weight: bold; background: #fff;"> đ
                                <span style="font-size: 7pt; color: #b91c1c; display: block;">(${p4PerQ}đ/câu)</span>
                            </td>
                            <td style="color: #b91c1c; font-size: 9pt; background: #fee2e2;">
                                <strong>${totalScore} Điểm</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style="font-weight: bold; font-size: 9pt; margin: 6px 0 2px 0;">BẢN ĐẶC TẢ YÊU CẦU CẦN ĐẠT CỦA CÁC CHỦ ĐỀ:</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 6px;">
                    <thead>
                        <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                            <th style="width: 25px; padding: 2px;">TT</th>
                            <th style="width: 150px; padding: 2px;">Chủ đề</th>
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
                                    <td style="padding: 2px; font-size: 7.5pt; line-height: 1.15;">
                                        - <em>Biết:</em> Nhận biết cấu trúc, đối tượng và khái niệm cốt lõi.<br>
                                        - <em>Hiểu:</em> Phân tích cơ chế, so sánh biến đổi và giải thích thực nghiệm.<br>
                                        - <em>Vận dụng:</em> Giải quyết tình huống thực tiễn sinh học và nông nghiệp địa phương.
                                    </td>
                                    <td style="text-align: center; font-weight: bold; padding: 2px;">${sum} mục</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div style="border-top: 1px dashed #cbd5e1; padding-top: 4px; font-size: 8pt; color: #475569;">
                <table style="width: 100%; border: none;">
                    <tr style="border: none;">
                        <td style="border: none; width: 60%; vertical-align: top; padding: 0;">
                            * <strong>Hướng dẫn Thầy:</strong> Chỉnh trực tiếp ô số câu/ý và điểm số ở 2 dòng màu vàng/xanh chân bảng. Đề thi ở trang sau sẽ tự động cập nhật số câu tương ứng.
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
        </div>
    `;
};

// 9. TỰ ĐỘNG CẬP NHẬT GIAO DIỆN NGAY KHI LOAD FILE
if (typeof distributeMatrixFromTotals === 'function') {
    distributeMatrixFromTotals();
    if (typeof displayContentForCurrentLesson === 'function') {
        displayContentForCurrentLesson();
    }
}
