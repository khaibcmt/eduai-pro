// ====================================================================================
// FILE CẬP NHẬT TRUNG TÂM (update.js) - BIOMASTER AI | THPT MANG THÍT
// Đồng bộ chuẩn 100% Phụ lục 1 (Môn Sinh học & Công nghệ - Khối 10, 11, 12)
// ====================================================================================

console.log("🚀 Đang khởi chạy bản đồng bộ RAG Google Drive chuẩn THPT Mang Thít...");

window.DRIVE_FOLDER_ID = "1YdagllVLNemL45ARCtxW_ES9E9izE2C0";

window.ACTIVE_GEMINI_MODELS = [
    { id: 'gemini-3.5-flash-lite', name: '3.5 Flash-Lite (Câu trả lời nhanh nhất)' },
    { id: 'gemini-3.8-flash', name: '3.8 Flash (Trợ giúp toàn diện)', default: true },
    { id: 'gemini-3.1-pro-preview', name: '3.1 Pro (Suy luận nâng cao)' }
];

// Đồng bộ danh sách Model lên Header
(function syncHeaderModels() {
    const sel = document.getElementById('sel-gemini-model');
    if (!sel) return;
    const saved = localStorage.getItem('selected_gemini_model');
    sel.innerHTML = window.ACTIVE_GEMINI_MODELS.map(m => {
        const isSelected = saved ? (saved === m.id) : !!m.default;
        return `<option value="${m.id}" class="bg-slate-900 text-white" ${isSelected ? 'selected' : ''}>${m.name}</option>`;
    }).join('');
})();

// 1. ĐỒNG BỘ CHUẨN DANH MỤC BÀI HỌC SGK CHO CẢ 2 MÔN & CẢ 3 KHỐI LỚP (10, 11, 12)
if (typeof sgkCurriculumDatabase !== 'undefined') {
    sgkCurriculumDatabase["Sinh học"] = {
        "10": [
            "Bài 1: Giới thiệu khái quát môn Sinh học",
            "Bài 2: Phương pháp nghiên cứu và học tập môn Sinh học",
            "Bài 3: Các cấp độ tổ chức của thế giới sống",
            "Bài 4: Các nguyên tố hóa học và nước",
            "Bài 5: Các phân tử sinh học",
            "Bài 6: Thực hành: Nhận biết một số phân tử sinh học",
            "Bài 7: Tế bào nhân sơ",
            "Bài 8: Tế bào nhân thực",
            "Bài 9: Thực hành: Quan sát tế bào",
            "Bài 10: Trao đổi chất qua màng sinh chất",
            "Bài 11: Thực hành: Thí nghiệm co và phản co nguyên sinh",
            "Bài 12: Truyền tin tế bào",
            "Bài 13: Khái quát về chuyển hóa vật chất và năng lượng",
            "Bài 14: Phân giải và tổng hợp các chất trong tế bào",
            "Bài 15: Thực hành: Một số thí nghiệm về enzyme",
            "Bài 16: Chu kì tế bào và nguyên phân",
            "Bài 17: Giảm phân",
            "Bài 18: Thực hành: Làm và quan sát tiêu bản các kì phân bào",
            "Bài 19: Công nghệ tế bào",
            "Bài 20: Sự đa dạng và phương thức dinh dưỡng của vi sinh vật",
            "Bài 21: Sinh trưởng và sinh sản của vi sinh vật",
            "Bài 22: Vai trò và ứng dụng của vi sinh vật",
            "Bài 23: Thực hành: Một số phương pháp nghiên cứu vi sinh và sản phẩm lên men",
            "Bài 24: Khái quát về virus",
            "Bài 25: Một số bệnh do virus và các biến thể",
            "Bài 26: Thực hành điều tra bệnh do virus"
        ],
        "11": [
            "Bài 1: Khái quát về trao đổi chất và chuyển hóa năng lượng",
            "Bài 2: Trao đổi nước và khoáng ở thực vật",
            "Bài 3: Thực hành thí nghiệm trao đổi nước và khoáng",
            "Bài 4: Quang hợp ở thực vật",
            "Bài 5: Thực hành quang hợp ở thực vật",
            "Bài 6: Hô hấp ở thực vật",
            "Bài 7: Thực hành hô hấp ở thực vật",
            "Bài 8: Dinh dưỡng và tiêu hóa ở động vật",
            "Bài 9: Hô hấp ở động vật",
            "Bài 10: Tuần hoàn ở động vật",
            "Bài 11: Thực hành thí nghiệm về tuần hoàn",
            "Bài 12: Miễn dịch ở người và động vật",
            "Bài 13: Bài tiết và cân bằng nội môi",
            "Bài 14: Khái quát về cảm ứng ở sinh vật",
            "Bài 15: Cảm ứng ở thực vật",
            "Bài 16: Thực hành cảm ứng ở thực vật",
            "Bài 17: Cảm ứng ở động vật",
            "Bài 18: Tập tính ở động vật",
            "Bài 19: Sinh trưởng và phát triển ở sinh vật",
            "Bài 20: Sinh trưởng và phát triển ở thực vật",
            "Bài 21: Thực hành bấm ngọn, tỉa cành",
            "Bài 22: Sinh trưởng và phát triển ở động vật",
            "Bài 23: Thực hành quan sát biến thái",
            "Bài 24: Khái quát về sinh sản ở sinh vật",
            "Bài 25: Sinh sản ở thực vật",
            "Bài 26: Thực hành nhân giống vô tính",
            "Bài 27: Sinh sản ở động vật",
            "Bài 28: Ngành nghề liên quan đến sinh học cơ thể"
        ],
        "12": [
            "Bài 1: Gene và cơ chế truyền đạt thông tin di truyền",
            "Bài 2: Thực hành tách chiết DNA",
            "Bài 3: Điều hòa biểu hiện gene",
            "Bài 4: Đột biến gene",
            "Bài 5: Nhiễm sắc thể và đột biến nhiễm sắc thể",
            "Bài 6: Thực hành quan sát đột biến nhiễm sắc thể",
            "Bài 7: Di truyền học Mendel",
            "Bài 8: Quy luật di truyền của Morgan",
            "Bài 9: Di truyền gene ngoài nhân",
            "Bài 10: Kiểu gene, môi trường và kiểu hình",
            "Bài 11: Di truyền quần thể",
            "Bài 12: Di truyền học người",
            "Bài 13: Ứng dụng di truyền học",
            "Bài 14: Thực hành tìm hiểu thành tựu di truyền học",
            "Bài 15: Bằng chứng tiến hóa",
            "Bài 16: Học thuyết Darwin",
            "Bài 17: Thuyết tiến hóa tổng hợp hiện đại",
            "Bài 18: Phát sinh và phát triển sự sống",
            "Bài 19: Môi trường và nhân tố sinh thái",
            "Bài 20: Sinh thái học quần thể",
            "Bài 21: Quần xã sinh vật",
            "Bài 22: Hệ sinh thái",
            "Bài 23: Chu trình sinh địa hóa",
            "Bài 24: Sinh thái học phục hồi và bảo tồn",
            "Bài 25: Thực hành tìm hiểu môi trường địa phương"
        ]
    };

    sgkCurriculumDatabase["Công nghệ Nông nghiệp"] = {
        "10": [
            "Bài 1: Giới thiệu về trồng trọt",
            "Bài 2: Cây trồng và các yếu tố chính trong trồng trọt",
            "Bài 3: Giới thiệu về đất trồng",
            "Bài 4: Sử dụng, cải tạo và bảo vệ đất trồng",
            "Bài 5: Giá thể trồng cây",
            "Bài 6: Thực hành: Xác định độ chua và độ mặn của đất",
            "Bài 7: Giới thiệu về phân bón",
            "Bài 8: Sử dụng và bảo quản phân bón",
            "Bài 9: Ứng dụng công nghệ vi sinh trong sản xuất phân bón",
            "Bài 10: Thực hành: Nhận biết một số loại phân bón hóa học",
            "Bài 11: Khái niệm và vai trò của giống cây trồng",
            "Bài 12: Một số phương pháp chọn, tạo giống cây trồng",
            "Bài 13: Nhân giống cây trồng",
            "Bài 14: Thực hành: Nhân giống cây ăn quả bằng phương pháp ghép",
            "Bài 15: Khái niệm về sâu, bệnh hại cây trồng",
            "Bài 16: Một số sâu hại cây trồng thường gặp",
            "Bài 17: Một số bệnh hại cây trồng thường gặp và biện pháp phòng trừ",
            "Bài 18: Ứng dụng công nghệ vi sinh phòng trừ sâu bệnh",
            "Bài 19: Quy trình trồng trọt và cơ giới hóa",
            "Bài 20: Công nghệ cao trong thu hoạch và bảo quản",
            "Bài 21: Chế biến sản phẩm trồng trọt",
            "Bài 22: Thực hành: Chế biến xiro từ quả",
            "Bài 23: Bảo vệ môi trường trong trồng trọt",
            "Bài 24: Một số công nghệ cao trong trồng trọt",
            "Bài 25: Trồng cây không dùng đất"
        ],
        "11": [
            "Bài 1: Vai trò và triển vọng của chăn nuôi",
            "Bài 2: Vật nuôi và phương thức chăn nuôi",
            "Bài 3: Khái niệm, vai trò của giống trong chăn nuôi",
            "Bài 4: Chọn giống vật nuôi",
            "Bài 5: Nhân giống vật nuôi",
            "Bài 6: Ứng dụng công nghệ sinh học trong giống vật nuôi",
            "Bài 7: Thức ăn và nhu cầu dinh dưỡng của vật nuôi",
            "Bài 8: Sản xuất và chế biến thức ăn chăn nuôi",
            "Bài 9: Bảo quản thức ăn chăn nuôi",
            "Bài 10: Thực hành: Chế biến, bảo quản thức ăn",
            "Bài 11: Vai trò của phòng, trị bệnh trong chăn nuôi",
            "Bài 12: Một số bệnh phổ biến ở lợn",
            "Bài 13: Một số bệnh phổ biến ở gia cầm",
            "Bài 14: Một số bệnh phổ biến ở trâu, bò",
            "Bài 15: Ứng dụng CNSH trong phòng, trị bệnh vật nuôi",
            "Bài 16: Chuồng nuôi và vệ sinh trong chăn nuôi",
            "Bài 17: Nuôi dưỡng và chăm sóc vật nuôi",
            "Bài 18: Chăn nuôi theo tiêu chuẩn VietGAP",
            "Bài 19: Chăn nuôi công nghệ cao",
            "Bài 20: Bảo quản và chế biến sản phẩm chăn nuôi",
            "Bài 21: Bảo vệ môi trường trong chăn nuôi",
            "Bài 22: Xử lý chất thải chăn nuôi"
        ],
        "12": [
            "Bài 1: Vai trò và triển vọng của lâm nghiệp",
            "Bài 2: Các loại rừng ở Việt Nam",
            "Bài 3: Sinh trưởng và phát triển của cây rừng",
            "Bài 4: Trồng rừng",
            "Bài 5: Chăm sóc và bảo vệ rừng",
            "Bài 6: Khai thác tài nguyên rừng",
            "Bài 7: Bảo vệ và phát triển rừng bền vững",
            "Bài 8: Vai trò và triển vọng của thủy sản",
            "Bài 9: Các nhóm thủy sản phổ biến",
            "Bài 10: Môi trường nuôi thủy sản",
            "Bài 11: Quản lý môi trường nuôi thủy sản",
            "Bài 12: Thức ăn và dinh dưỡng thủy sản",
            "Bài 13: Sinh sản của thủy sản",
            "Bài 14: Ươm nuôi con giống thủy sản",
            "Bài 15: Nuôi thương phẩm thủy sản",
            "Bài 16: Bệnh ở thủy sản và biện pháp phòng trị",
            "Bài 17: Thu hoạch và bảo quản sản phẩm thủy sản",
            "Bài 18: Khai thác và bảo vệ nguồn lợi thủy sản"
        ]
    };
}

// 2. KHO DỮ LIỆU ĐẶC TẢ PHỤ LỤC 1, 2, 3, 4 (THPT MANG THÍT)
window.MANG_THIT_CURRICULUM_DB = {
    "Sinh học_10": {
        "Bài 5": {
            periods: "04 tiết (Tuần 5-6)",
            yccd: [
                "Nêu được khái niệm phân tử sinh học; Trình bày thành phần cấu tạo và vai trò của carbohydrate, lipid, protein, nucleic acid.",
                "Phân tích được mối quan hệ giữa cấu tạo và vai trò của các phân tử sinh học.",
                "[Hoạt động Phụ lục 2]: Chế tạo mô hình DNA 3D từ rác thải nhựa."
            ],
            nls: "1.3.NC1b (CV 3456): Triển khai tổ chức và sắp xếp dữ liệu, thông tin số (Google Workspace/Padlet).",
            aiCode: "10.C3 (QĐ 2422): Công nghệ AI & Kỹ thuật Prompt",
            aiDesc: "Sử dụng công cụ AI (trợ lý ảo, mô hình giả lập) trực quan hóa cấu trúc không gian 3D đại phân tử (Protein, DNA)."
        },
        "Bài 6": {
            periods: "02 tiết",
            yccd: ["Thực hành nhận biết thành phần hóa học tế bào (đường khử, tinh bột, protein, lipid) bằng thuốc thử đặc trưng."],
            equipment: "Ống nghiệm (36), Đèn cồn (6), Kẹp gỗ (6), Pipette nhựa (6), Đĩa petri (12), Cối chày sứ (6), Thìa cà phê (6), Giấy lọc (18), Cốc thủy tinh (18), Giá ống nghiệm (6). Hóa chất: Benedict, Lugol, CuSO4 1%, NaOH 10%, Ethanol 90%, nước cất. Mẫu vật: Trứng gà, lạc, chuối chín, khoai tây, dầu thực vật."
        },
        "Bài 8": {
            periods: "04 tiết (Tuần 9-11)",
            yccd: [
                "Mô tả cấu tạo và chức năng các thành phần tế bào nhân thực (nhân, tế bào chất, nội màng, ribosome, ti thể, lục lạp, màng sinh chất...).",
                "So sánh cấu tạo tế bào nhân sơ và nhân thực, giữa thực vật và động vật."
            ],
            nls: "6.1.NC1a (CV 3456): Phân tích cách AI hoạt động và nhận diện giới hạn của AI (ảnh AI tạo ra có thể đẹp nhưng chưa hoàn toàn chính xác tuyệt đối về sinh học).",
            aiCode: "10.D1 (QĐ 2422): Xác định mục tiêu và thành phần hệ thống AI",
            aiDesc: "Đặt prompt chính xác cho ChatGPT/Gemini/Copilot so sánh các bào quan; sử dụng phần mềm mô phỏng 3D quan sát ti thể, lục lạp."
        },
        "Bài 9": {
            periods: "02 tiết",
            yccd: ["Làm tiêu bản hiển vi tạm thời và quan sát tế bào dưới kính hiển vi quang học."],
            equipment: "Kính hiển vi (6), Lam kính (36), Lamen (36), Kim mũi mác (6), Kim mũi nhọn (6), Đèn cồn (6), Tăm bông, Pipet (6), Giấy thấm. Hóa chất: Xanh methylene, fuchsin, nước cất. Mẫu vật: Lá thài lài tía, hành tím, mồng tơi."
        },
        "Bài 11": {
            periods: "01 tiết",
            yccd: ["Thực hành thí nghiệm co và phản co nguyên sinh ở tế bào thực vật."],
            equipment: "Kính hiển vi (6), Lam kính (24), Lamen (1 hộp), Kim mũi mác (6), Kim mũi nhọn (6), Ống hút (6), Giấy thấm, Dao nhỏ. Hóa chất: Xanh methylen, NaCl 0,65% và 2%, nước sôi. Mẫu vật: Khoai tây, giá đỗ, hành tím hoặc thài lài tía."
        },
        "Bài 16": {
            periods: "03 tiết (Tuần 19-20)",
            yccd: [
                "Trình bày các giai đoạn chu kì tế bào và diễn biến các kì của nguyên phân; Ý nghĩa nguyên phân.",
                "Giải thích sự phân chia tế bào bất thường dẫn đến ung thư và cách phòng tránh."
            ],
            nls: "5.2.NC1b (CV 3456): Áp dụng công cụ mô phỏng trực tuyến tái hiện chu kì tế bào và sự vận động của NST.",
            aiCode: "10.A2 (QĐ 2422): Rủi ro đối với con người và dự án AI",
            aiDesc: "Sử dụng Prompt cho AI hỗ trợ tính toán số lượng NST, chromatid, tâm động qua các kì nguyên phân; tìm kiếm nghiên cứu cơ chế thuốc điều trị ung thư."
        },
        "Bài 18": {
            periods: "01 tiết",
            yccd: ["Thực hành làm tiêu bản và quan sát các kì nguyên phân trên rễ hành và giảm phân trên châu chấu."],
            equipment: "Kính hiển vi (6), Lam kính (36), Lamen (1 hộp), Đĩa đồng hồ (6), Giấy thấm, Kéo, Kim mũi mác, Cốc thủy tinh, Ống hút. Hóa chất: Carmine acetic 2% hoặc orcein acetic 2%, HCl 1,5N, CH3COOH 5%, nước cất. Mẫu vật: Rễ hành, châu chấu, hoa hẹ/hoa hành."
        },
        "Bài 22": {
            periods: "04 tiết (Tuần 28-29)",
            yccd: ["Trình bày vai trò và cơ sở khoa học ứng dụng vi sinh vật trong thực tiễn (thực phẩm, kháng sinh, xử lí môi trường)."],
            nls: "2.1.NC1b (CV 3456): Lựa chọn kênh truyền thông thông minh (Google Drive, Padlet, Canva Team) cộng tác làm sản phẩm số.",
            aiCode: "10.D1 (QĐ 2422): Xác định mục tiêu hệ thống AI",
            aiDesc: "Đặt câu lệnh tra cứu công thức lên men, xử lý lỗi sữa chua tách nước; dùng video AI mô phỏng nhà máy sản xuất kháng sinh."
        },
        "Bài 23": {
            periods: "02 tiết",
            yccd: ["Thực hành phương pháp nghiên cứu vi sinh và làm sản phẩm lên men (sữa chua, dưa chua, bánh)."],
            equipment: "Nồi nấu, Lọ sữa chua, Thìa, Dao, Thùng xốp ủ ấm, Vại/bình thủy tinh, Nhiệt kế, Giấy quỳ đo pH. Nguyên liệu: Muối, đường, nước, sữa, bột mì, rau củ quả."
        }
    },
    "Công nghệ Nông nghiệp_10": {
        "Bài 6": {
            periods: "02 tiết (Tuần 7)",
            yccd: ["Thực hành xác định độ chua (pH) và độ mặn của đất đúng kĩ thuật an toàn."],
            equipment: "Máy đo pH (2), Cân kĩ thuật (4), Bình tam giác 100ml (10), Ống đong (4), Phễu thủy tinh (4), Bình định mức 1L (4). Hóa chất: Dung dịch KCl 1N, nước cất, mẫu đất, đồng hồ.",
            aiCode: "10.C2.3 (QĐ 2422): Ứng dụng AI trong học tập",
            aiDesc: "Nêu ví dụ sử dụng AI tra cứu bảng thang đo pH đất và gợi ý cây trồng phù hợp."
        },
        "Bài 8": {
            periods: "02 tiết (Tuần 10)",
            yccd: ["Nêu cơ sở khoa học và biện pháp sử dụng, bảo quản phân bón hóa học, hữu cơ, vi sinh."],
            nls: "1.1.NC1b (CV 3456): Xác định nhu cầu thông tin; tìm kiếm dữ liệu bón phân 4 đúng trên môi trường số."
        },
        "Bài 10": {
            periods: "02 tiết",
            yccd: ["Thực hành nhận biết một số loại phân bón hóa học thông thường."],
            equipment: "Ống nghiệm (24), Thìa inox nhỏ (4), Đèn cồn (4). Hóa chất: BaCl2, AgNO3, nước cất. Mẫu vật: Phân đạm, lân, kali."
        },
        "Bài 14": {
            periods: "02 tiết",
            yccd: ["Thực hành nhân giống cây ăn quả bằng phương pháp ghép đúng quy trình kĩ thuật."],
            equipment: "Dao ghép (45), Kéo cắt cành (4), Dây buộc nilon tự hủy (1 cuộn). Mẫu vật: Cành ghép, gốc ghép."
        },
        "Bài 17": {
            periods: "02 tiết (Tuần 26)",
            yccd: ["Nhận biết một số bệnh hại cây trồng thường gặp và đề xuất biện pháp phòng trừ."],
            aiCode: "10.C3.MR1 (QĐ 2422): Công nghệ AI trong nông nghiệp",
            aiDesc: "Trình bày ví dụ mô tả công nghệ thị giác máy tính và ứng dụng AI chẩn đoán bệnh qua hình ảnh lá cây."
        },
        "Bài 22": {
            periods: "02 tiết",
            yccd: ["Thực hành chế biến xiro từ trái cây đảm bảo an toàn vệ sinh thực phẩm."],
            equipment: "Lọ thủy tinh sạch có nắp (45). Nguyên liệu: Đường trắng 1 - 1,5kg, quả tươi (mơ, mận, nho, dâu, dứa...)."
        },
        "Bài 24": {
            periods: "03 tiết (Tuần 30)",
            yccd: ["Trình bày ứng dụng của công nghệ cao, IoT, cảm biến tự động hóa trong trồng trọt."],
            nls: "2.2.NC1a (CV 3456): Chia sẻ dữ liệu và trích dẫn nguồn số về các mô hình nông nghiệp công nghệ cao."
        },
        "Bài 25": {
            periods: "03 tiết",
            yccd: ["Trình bày khái niệm và quy trình kĩ thuật trồng cây không dùng đất (thủy canh, khí canh)."],
            equipment: "Thùng đựng dung dịch thủy canh, rọ trồng cây, giá thể (45), Máy đo pH (4), Cốc đong (4), Ống hút (6). Hóa chất: H2SO4 0,2%, NaOH 0,2%, dung dịch dinh dưỡng Knop, hạt giống rau."
        }
    },
    "Công nghệ Nông nghiệp_11": {
        "Bài 1": {
            periods: "02 tiết (Tuần 1)",
            yccd: ["Trình bày vai trò và triển vọng chăn nuôi trong bối cảnh CMCN 4.0; định hướng chăn nuôi bền vững."],
            equipment: "Laptop, Tivi, tranh ảnh/video tư liệu thành tựu chăn nuôi công nghệ cao.",
            aiCode: "11.C2.1 & 11.C3.1 (QĐ 2422): Kỹ thuật đặt Prompt tra cứu học liệu",
            aiDesc: "Xác định cách đặt prompt phù hợp (nêu bối cảnh, yêu cầu tóm tắt ngắn gọn) để AI cung cấp thông tin chính xác về thành tựu chăn nuôi."
        },
        "Bài 2": {
            periods: "02 tiết (Tuần 2)",
            yccd: ["Phân biệt các giống vật nuôi phổ biến và phương thức chăn nuôi chủ yếu."],
            equipment: "Laptop, Tivi, phiếu học tập số.",
            nls: "NLS 1.1 & NLS 1.2 (CV 3456): Sử dụng từ khóa tìm kiếm thông tin giống vật nuôi trên môi trường số; đánh giá lựa chọn thông tin từ cổng thông tin chính thống."
        },
        "Bài 7": {
            periods: "03 tiết (Tuần 9)",
            yccd: ["Trình bày thành phần dinh dưỡng thức ăn chăn nuôi và nhu cầu dinh dưỡng của vật nuôi."],
            equipment: "Laptop, Tivi, bảng thành phần dinh dưỡng thức ăn.",
            aiCode: "11.A1.2 & 11.B2.1 (QĐ 2422): Tư duy lấy con người làm trung tâm & Đạo đức AI",
            aiDesc: "Dùng AI gợi ý bảng dinh dưỡng và khẩu phần ăn; học sinh so sánh đối chiếu với SGK và tiêu chuẩn ngành để phòng tránh rủi ro lệch thông tin."
        },
        "Bài 8": {
            periods: "03 tiết (Tuần 11)",
            yccd: ["Trình bày phương pháp sản xuất và chế biến thức ăn chăn nuôi (vật lí, hóa học, ủ chua vi sinh)."],
            equipment: "Tranh 'Chế biến thức ăn bằng phương pháp ủ chua', Laptop, Tivi.",
            nls: "NLS 2.4 & NLS 3.1 (CV 3456): Hợp tác nhóm trên môi trường số; sử dụng Canva/PowerPoint tạo sơ đồ tư duy quy trình sản xuất."
        },
        "Bài 10": {
            periods: "02 tiết",
            yccd: ["Thực hành chế biến và bảo quản thức ăn cho vật nuôi (ủ chua thức ăn xanh hoặc lên men thức ăn tinh)."],
            equipment: "Xô nhựa có nắp, màng nilon, chày sứ, cối sứ, cân. Nguyên liệu: Bột ngô, bột khoai/sắn, men rượu, nước sạch."
        },
        "Bài 18": {
            periods: "02 tiết (Tuần 27)",
            yccd: ["Trình bày khái niệm, lợi ích và yêu cầu cơ bản của quy trình chăn nuôi theo tiêu chuẩn VietGAP."],
            equipment: "Laptop, Tivi, mẫu biểu quy trình VietGAP số hóa.",
            nls: "NLS 1.3 & NLS 4.2 (CV 3456): Tổ chức, lưu trữ dữ liệu nhật ký đàn vật nuôi dưới dạng tệp điện tử (Excel/Google Forms)."
        },
        "Bài 19": {
            periods: "02 tiết (Tuần 28)",
            yccd: ["Trình bày ứng dụng công nghệ cao trong chăn nuôi (chuồng kín, cảm biến, robot cho ăn, vắt sữa tự động)."],
            equipment: "Laptop, Tivi, video hệ thống cho ăn, vắt sữa tự động.",
            nls: "NLS 5.2 & NLS 5.3 (CV 3456): Xác định nhu cầu tự động hóa và giải pháp cảm biến giám sát trong trang trại."
        },
        "Bài 21": {
            periods: "02 tiết",
            yccd: ["Phân tích sự cần thiết phải bảo vệ môi trường và các nguồn ô nhiễm chính trong chăn nuôi."],
            equipment: "Laptop, Tivi, tư liệu về ô nhiễm và giải pháp năng lượng sinh học.",
            aiCode: "11.A2.1 & 11.A2.2 (QĐ 2422): Biến đổi khí hậu & Phát triển bền vững",
            aiDesc: "Lồng ghép bảo vệ môi trường, tiết kiệm năng lượng và sử dụng AI phân tích giải pháp giảm phát thải."
        },
        "Bài 22": {
            periods: "02 tiết",
            yccd: ["Trình bày các biện pháp xử lí chất thải chăn nuôi phổ biến (biogas, compost, đệm lót sinh học)."],
            equipment: "Tranh 'Mô hình xử lý chất thải bằng công nghệ biogas', Laptop, Tivi."
        }
    }
};

window.getMangThitLessonAppendix = function(subject, grade, lessonTitle) {
    const dbKey = `${subject}_${grade}`;
    const subjectDb = window.MANG_THIT_CURRICULUM_DB[dbKey] || {};
    const matchPrefix = (lessonTitle.match(/^Bài\s+\d+/i) || [lessonTitle])[0];

    const foundData = subjectDb[matchPrefix] || null;
    const baseInfo = typeof getDynamicNlsAiInfo === 'function' ? getDynamicNlsAiInfo(lessonTitle, grade) : {
        nls: "NLS 2.1",
        nlsDesc: "Khai thác học liệu số và mô hình trực quan phục vụ bài học",
        aiCode: `${grade}.A1.2`,
        aiDesc: "Sử dụng AI tra cứu thông tin khoa học và kiểm chứng chéo với SGK Kết nối tri thức",
        core1: "Khái niệm, cấu trúc và bản chất khoa học cốt lõi của bài học",
        core2: "Cơ chế vận hành, quy luật sinh học/công nghệ và các yếu tố ảnh hưởng",
        core3: "Ứng dụng thực tiễn trong sản xuất nông nghiệp, y sinh và bảo vệ môi trường",
        factCheck: "AI đưa ra nhận định chưa đầy đủ về điều kiện tối ưu; học sinh đối chiếu SGK Kết nối tri thức để phản biện."
    };

    return {
        periods: (foundData && foundData.periods) ? foundData.periods : "02 tiết",
        yccdList: (foundData && foundData.yccd) ? foundData.yccd : [
            `Trình bày khái niệm, cấu trúc bản chất và cơ chế cốt lõi của ${lessonTitle} theo đúng Yêu cầu cần đạt CT GDPT 2018.`,
            `Phân tích mối quan hệ cấu trúc - chức năng, giải thích các hiện tượng thực tiễn liên quan đến ${lessonTitle}.`,
            `Vận dụng kiến thức bài học vào thực tiễn sản xuất nông nghiệp, chăm sóc sức khỏe và bảo vệ môi trường tại địa phương.`
        ],
        equipment: (foundData && foundData.equipment) ? foundData.equipment : "Máy tính, máy chiếu/Tivi, tranh ảnh/video học liệu số, Phiếu học tập, mẫu vật và thiết bị theo danh mục tối thiểu của Bộ GD&ĐT.",
        nlsFull: (foundData && foundData.nls) ? foundData.nls : `${baseInfo.nls} (CV 3456/BGDĐT-GDPT): ${baseInfo.nlsDesc}`,
        aiCodeFull: (foundData && foundData.aiCode) ? foundData.aiCode : `${baseInfo.aiCode} (QĐ 2422/QĐ-BGDĐT)`,
        aiDescFull: (foundData && foundData.aiDesc) ? foundData.aiDesc : baseInfo.aiDesc,
        core1: baseInfo.core1,
        core2: baseInfo.core2,
        core3: baseInfo.core3,
        factCheck: baseInfo.factCheck
    };
};

window.fetchDriveRagContext = async function(subject, grade, lessonTitle) {
    const scriptUrl = localStorage.getItem('google_drive_script_url') || DEFAULT_DRIVE_APP_URL;
    if (!scriptUrl) return "";

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        const queryUrl = `${scriptUrl}?action=getLessonContext&folderId=${window.DRIVE_FOLDER_ID}&subject=${encodeURIComponent(subject)}&grade=${encodeURIComponent(grade)}&lesson=${encodeURIComponent(lessonTitle)}`;
        
        const res = await fetch(queryUrl, { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return "";
        const data = await res.json();
        return (data && data.contextText) ? data.contextText : "";
    } catch (e) {
        return "";
    }
};

window.renderGiaoAn5512HighEnd = function(subject, grade, book, lessonTitle, customAct234Html = null) {
    const docContainer = document.getElementById('container-a4-doc');
    const apx = window.getMangThitLessonAppendix(subject, grade, lessonTitle);

    const defaultAct234Html = `
        <p style="font-weight: bold; color: #1e40af; margin: 8px 0 2px 0;">HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</p>
        <div style="background: #eef2ff; border-left: 4px solid #3b82f6; padding: 6px 10px; margin: 4px 0; font-size: 11pt;">
            👉 <strong>[Tích hợp Năng lực số - Phụ lục 4]:</strong> ${apx.nlsFull}<br>
            👉 <strong>[Tích hợp Giáo dục AI - Phụ lục 3 (${apx.aiCodeFull})]:</strong> ${apx.aiDescFull}<br>
            <span style="color: #b91c1c; font-style: italic;">• Tình huống kiểm chứng AI: "${apx.factCheck}"</span>
        </div>

        <table>
            <thead>
                <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                    <th style="width: 50%;">HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH</th>
                    <th style="width: 50%;">DỰ KIẾN SẢN PHẨM (NỘI DUNG GHI VỞ BÁM SÁT YCCĐ)</th>
                </tr>
            </thead>
            <tbody>
                ${apx.yccdList.map((yc, idx) => `
                <tr>
                    <td style="vertical-align: top;">
                        <strong>Nội dung ${idx + 1}: Tìm hiểu & thực hiện Yêu cầu cần đạt số ${idx + 1}</strong><br>
                        - Bước 1: Chuyển giao nhiệm vụ: GV giao nhiệm vụ thông qua Phiếu học tập, yêu cầu HS nghiên cứu SGK Kết nối tri thức để giải quyết mục tiêu: <em>"${yc}"</em>.<br>
                        - Bước 2: Thực hiện nhiệm vụ: HS làm việc nhóm/cặp đôi, khai thác thiết bị và học liệu số.<br>
                        - Bước 3: Báo cáo, thảo luận: Đại diện nhóm trình bày kết quả; nhóm khác nhận xét, phản biện.<br>
                        - Bước 4: Kết luận, nhận định: GV chuẩn hóa kiến thức theo đúng YCCĐ.
                    </td>
                    <td style="vertical-align: top;">
                        <strong>${idx + 1}. Kiến thức trọng tâm mục ${idx + 1}:</strong><br>
                        - Đáp ứng YCCĐ: ${yc}<br>
                        - Nội dung khoa học chuẩn xác theo SGK Kết nối tri thức với cuộc sống.
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <p style="font-weight: bold; color: #1e40af; margin: 12px 0 2px 0;">HOẠT ĐỘNG 3: LUYỆN TẬP</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 1: Chuyển giao nhiệm vụ: GV giao hệ thống câu hỏi đánh giá năng lực bám sát YCCĐ của ${lessonTitle}.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 2: Thực hiện nhiệm vụ: HS làm việc cá nhân hoàn thành các câu hỏi.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 3: Báo cáo, thảo luận: HS công bố đáp án và giải thích.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 4: Kết luận, nhận định: GV chốt đáp án chuẩn.</p>
        <p style="margin: 4px 0 2px 15px; font-weight: bold;">* DỰ KIẾN SẢN PHẨM:</p>
        <p style="margin: 2px 0 2px 25px;">- Hệ thống câu hỏi trắc nghiệm 3 phần kèm đáp án chi tiết (Bấm <strong>"Soạn Giáo Án Bằng AI"</strong> để sinh đề chuyên sâu).</p>

        <p style="font-weight: bold; color: #1e40af; margin: 12px 0 2px 0;">HOẠT ĐỘNG 4: VẬN DỤNG</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 1: Chuyển giao nhiệm vụ: GV giao nhiệm vụ vận dụng thực tiễn gắn với Phụ lục 2 (Hoạt động trải nghiệm).</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 2: Thực hiện nhiệm vụ: HS thực hiện sản phẩm tại nhà hoặc phòng thực hành.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 3: Báo cáo, thảo luận: Chia sẻ sản phẩm lên không gian số của lớp.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 4: Kết luận, nhận định: GV nhận xét và đánh giá.</p>
    `;

    const act234Content = customAct234Html || defaultAct234Html;

    docContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px;">
            <h2 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase;">KẾ HOẠCH BÀI DẠY</h2>
            <h3 style="margin: 4px 0 0 0; font-size: 13pt; font-weight: bold; color: #1e3a8a;">${lessonTitle.toUpperCase()}</h3>
            <p style="margin: 3px 0 0 0; font-style: italic; font-size: 11pt;">Môn học: <strong>${subject} - Lớp ${grade}</strong> • Bộ sách: <strong>${book} với cuộc sống</strong> • Thời lượng: <strong>${apx.periods}</strong></p>
        </div>

        <p style="font-weight: bold; margin: 10px 0 4px 0;">I. MỤC TIÊU (Bám sát Phụ lục 1, 2, 3, 4 - Kế hoạch dạy học của Tổ chuyên môn)</p>
        <p style="margin: 2px 0 2px 10px;"><strong>1. Về kiến thức (Yêu cầu cần đạt theo Phụ lục 1):</strong></p>
        ${apx.yccdList.map(y => `<p style="margin: 2px 0 2px 20px;">- ${y}</p>`).join('')}

        <p style="margin: 4px 0 2px 10px;"><strong>2. Về năng lực:</strong></p>
        <p style="margin: 2px 0 2px 20px;">- 2.1. Năng lực chung: Tự chủ & tự học; Giao tiếp & hợp tác; Giải quyết vấn đề & sáng tạo.</p>
        <p style="margin: 2px 0 2px 20px;">- 2.2. Năng lực đặc thù: Nhận thức khoa học; Tìm hiểu tự nhiên/công nghệ; Vận dụng kiến thức vào thực tiễn.</p>
        <p style="margin: 2px 0 2px 20px; color: #0369a1;">- 2.3. Tích hợp Năng lực số (Phụ lục 4): <strong>${apx.nlsFull}</strong></p>
        <p style="margin: 2px 0 2px 20px; color: #4338ca;">- 2.4. Tích hợp Năng lực AI (Phụ lục 3): <strong>[${apx.aiCodeFull}]</strong> - ${apx.aiDescFull}</p>

        <p style="margin: 4px 0 2px 10px;"><strong>3. Về phẩm chất:</strong> Chăm chỉ, Trung thực, Trách nhiệm trong học tập, thực hành thí nghiệm và bảo vệ môi trường.</p>

        <p style="font-weight: bold; margin: 12px 0 4px 0;">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU (Theo Phụ lục 1 - Trường THPT Mang Thít)</p>
        <p style="margin: 2px 0 2px 15px;">- <strong>Thiết bị, hóa chất & mẫu vật:</strong> ${apx.equipment}</p>
        <p style="margin: 2px 0 2px 15px;">- <strong>Học liệu số:</strong> SGK ${book}, bài giảng điện tử 22 Slide tương tác, đề kiểm tra 7991.</p>

        <p style="font-weight: bold; margin: 12px 0 4px 0;">III. TIẾN TRÌNH DẠY HỌC</p>

        <p style="font-weight: bold; color: #1e40af; margin: 6px 0 2px 0;">HOẠT ĐỘNG 1: MỞ ĐẦU (KHỞI ĐỘNG)</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 1: Chuyển giao nhiệm vụ: Giáo viên trình chiếu tình huống thực tiễn gắn với ${lessonTitle}.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 2: Thực hiện nhiệm vụ: Học sinh quan sát, suy nghĩ trả lời trong 2 phút.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 3: Báo cáo, thảo luận: Học sinh phát biểu ý kiến.</p>
        <p style="margin: 2px 0 2px 15px;">- Bước 4: Kết luận, nhận định: Giáo viên dẫn dắt vào bài mới.</p>
        <p style="margin: 4px 0 2px 15px; font-weight: bold;">* DỰ KIẾN SẢN PHẨM:</p>
        <p style="margin: 2px 0 8px 25px;">- Học sinh xác định được vấn đề cần khám phá trong bài.</p>

        <div id="wrapper-act234-zone">
            ${act234Content}
        </div>

        <p style="font-weight: bold; margin: 16px 0 4px 0;">IV. HỒ SƠ DẠY HỌC & RUBRIC ĐÁNH GIÁ</p>
        <table>
            <thead>
                <tr style="background: #E6EEF8; text-align: center; font-weight: bold;">
                    <th style="width: 22%;">Tiêu chí</th>
                    <th style="width: 26%;">Mức 1 (Cần cố gắng)</th>
                    <th style="width: 26%;">Mức 2 (Đạt)</th>
                    <th style="width: 26%;">Mức 3 (Tốt)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>1. YCCĐ (Phụ lục 1)</strong></td>
                    <td>Trình bày dưới 50% yêu cầu.</td>
                    <td>Trình bày đúng các yêu cầu cơ bản trong SGK.</td>
                    <td>Phân tích sâu sắc và vận dụng tốt vào thực tiễn.</td>
                </tr>
                <tr>
                    <td><strong>2. Năng lực số (Phụ lục 4)</strong></td>
                    <td>Chưa chủ động khai thác học liệu số.</td>
                    <td>Thực hiện thao tác tra cứu và hợp tác cơ bản.</td>
                    <td>Làm chủ công cụ số để hoàn thiện sản phẩm nhóm.</td>
                </tr>
                <tr>
                    <td><strong>3. Năng lực AI (Phụ lục 3)</strong></td>
                    <td>Sao chép thụ động câu trả lời từ AI.</td>
                    <td>Biết đặt lệnh Prompt cơ bản để hỏi AI.</td>
                    <td>Đặt Prompt chuẩn xác (${apx.aiCodeFull}), biết phản biện và kiểm chứng chéo SGK.</td>
                </tr>
            </tbody>
        </table>
    `;
};

window.executeActionAI = async function() {
    const savedKey = (localStorage.getItem('gemini_api_key') || '').trim();
    if (!savedKey) {
        openAIKeyModal();
        alert("Thầy vui lòng nhập và lưu Gemini API Key trước khi bắt đầu tạo nội dung bằng AI!");
        return;
    }

    const selectedModel = document.getElementById('sel-gemini-model') ? document.getElementById('sel-gemini-model').value : 'gemini-3.8-flash';
    const subject = document.getElementById('sel-subject').value;
    const grade = document.getElementById('sel-grade').value;
    const book = document.getElementById('sel-book').value;
    const lessonTitle = currentSelectedLesson;
    const customGuide = document.getElementById('ai-custom-instructions') ? document.getElementById('ai-custom-instructions').value.trim() : "";
    const docContainer = document.getElementById('container-a4-doc');
    const statusInd = document.getElementById('content-source-indicator');

    const modelLabel = selectedModel.includes('3.5') ? 'Gemini 3.5 Flash-Lite' : (selectedModel.includes('3.1') ? 'Gemini 3.1 Pro' : 'Gemini 3.8 Flash');

    const apx = window.getMangThitLessonAppendix(subject, grade, lessonTitle);
    const driveLiveText = await window.fetchDriveRagContext(subject, grade, lessonTitle);

    const ragAppendixBlock = `
=== DỮ LIỆU BẮT BUỘC TỪ HỒ SƠ CHUYÊN MÔN & PHỤ LỤC GOOGLE DRIVE (THPT MANG THÍT) ===
- Môn học: ${subject} - Khối ${grade} (Sách: Kết nối tri thức với cuộc sống)
- Bài học: ${lessonTitle} (Thời lượng: ${apx.periods})
- YÊU CẦU CẦN ĐẠT (PHỤ LỤC 1):
${apx.yccdList.map((y, idx) => `  + YCCĐ ${idx + 1}:${y}`).join('\n')}
- THIẾT BỊ DẠY HỌC & THỰC HÀNH (PHỤ LỤC 1): ${apx.equipment}
- NĂNG LỰC SỐ (PHỤ LỤC 4): ${apx.nlsFull}
- GIÁO DỤC AI (PHỤ LỤC 3): [${apx.aiCodeFull}] ${apx.aiDescFull}
${driveLiveText ? `- NGỮ LIỆU BỔ SUNG TỪ DRIVE: """${driveLiveText.slice(0, 5000)}"""` : ''}
${uploadedFileContent ? `- FILE GIÁO VIÊN TẢI LÊN: """${uploadedFileContent.slice(0, 6000)}"""` : ''}
====================================================================================`;

    if (currentActiveMode === 'slide') {
        const slideCore = document.getElementById('slide-core-content');
        slideCore.innerHTML = `
            <div class="text-center py-12 space-y-4">
                <div class="text-5xl text-amber-300"><i class="fa-solid fa-wand-magic-sparkles fa-spin"></i></div>
                <h3 class="text-2xl font-bold text-white">${modelLabel} đang thiết kế 22 Slide bám sát Phụ lục Drive...</h3>
                <p class="text-cyan-300 text-sm">Bài học: <strong>${lessonTitle}</strong></p>
            </div>
        `;
        statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> Đang tạo 22 Slide chuẩn YCCĐ...</span>`;

        try {
            const slidePrompt = `Bạn là chuyên gia thiết kế bài giảng điện tử THPT. Hãy biên soạn bộ 22 Slide bài giảng cho bài "${lessonTitle}" bám sát TUYỆT ĐỐI vào Yêu cầu cần đạt và Phụ lục Google Drive dưới đây:
${ragAppendixBlock}

Trả về DUY NHẤT đối tượng JSON hợp lệ theo cấu trúc:
{
  "objectives": ["Mục tiêu YCCĐ Phụ lục 1", "Mục tiêu thiết bị: ${apx.equipment}", "Mục tiêu NLS & AI"],
  "warmup": {
    "situation": "Tình huống khởi động thực tiễn gắn với ${lessonTitle}",
    "questions": ["Câu hỏi gợi mở 1?", "Câu hỏi mâu thuẫn 2?"]
  },
  "knowledgeSections": [
    {"title": "Mục I: Trọng tâm 1", "col1Title": "Kiến thức cốt lõi", "col1Points": ["Ý 1", "Ý 2"], "col2Title": "Phân tích", "col2Points": ["Ý 3", "Ý 4"]},
    {"title": "Mục II: Trọng tâm 2", "col1Title": "Cấu trúc", "col1Points": ["Ý 1", "Ý 2"], "col2Title": "Vai trò", "col2Points": ["Ý 3", "Ý 4"]},
    {"title": "Mục III: Trọng tâm 3", "col1Title": "Diễn biến", "col1Points": ["Ý 1", "Ý 2"], "col2Title": "Kết quả", "col2Points": ["Ý 3", "Ý 4"]},
    {"title": "Mục IV: Mở rộng", "col1Title": "Thí nghiệm", "col1Points": ["Ý 1", "Ý 2"], "col2Title": "Tích hợp", "col2Points": ["Ý 3", "Ý 4"]}
  ],
  "practicalApp": {
    "agri": ["Ứng dụng nông nghiệp 1", "Ứng dụng 2"],
    "life": ["Ứng dụng đời sống 1", "Ứng dụng 2"]
  },
  "coreSummary": ["Tổng kết 1", "Tổng kết 2", "Tổng kết 3"],
  "mcq": [
    {"q": "Câu hỏi 1?", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "ans": "Đáp án + giải thích"},
    {"q": "Câu hỏi 2?", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "ans": "..."},
    {"q": "Câu hỏi 3?", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "ans": "..."},
    {"q": "Câu hỏi 4?", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "ans": "..."},
    {"q": "Câu hỏi 5?", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "ans": "..."},
    {"q": "Câu hỏi 6?", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "ans": "..."}
  ],
  "tf": [
    {"stem": "Câu 1 bám sát YCCĐ:", "items": ["a) ...", "b) ...", "c) ...", "d) ..."], "ans": "a) ĐÚNG | b) SAI | c) ĐÚNG | d) SAI"},
    {"stem": "Câu 2:", "items": ["a) ...", "b) ...", "c) ...", "d) ..."], "ans": "..."},
    {"stem": "Câu 3:", "items": ["a) ...", "b) ...", "c) ...", "d) ..."], "ans": "..."}
  ],
  "shortAns": [
    {"q": "Câu trả lời ngắn 1?", "ans": "Đáp án"},
    {"q": "Câu trả lời ngắn 2?", "ans": "Đáp án"}
  ],
  "homework": {
    "tasks": ["Nhiệm vụ vận dụng Phụ lục 2", "Bài tập SGK"],
    "nextPrep": ["Chuẩn bị bài sau", "Tra cứu học liệu số"]
  }
}
Ghi chú bổ sung: ${customGuide}`;

            let rawJson = await callGeminiDirect(savedKey, selectedModel, slidePrompt, true);
            rawJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
            const firstBrace = rawJson.indexOf('{');
            const lastBrace = rawJson.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                rawJson = rawJson.substring(firstBrace, lastBrace + 1);
            }
            const aiSlideObj = JSON.parse(rawJson);

            renderPowerPointSlideDeck(subject, grade, book, lessonTitle, aiSlideObj);
            temporaryAISlideDeck = [...slideDeckData];
            showAIReviewBar(`AI (${modelLabel}) đã thiết kế 22 Slide bám sát YCCĐ Phụ lục Drive. Thầy kiểm tra và bấm Lưu Lại:`);
            statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã tạo 22 Slide chuẩn YCCĐ Drive!</span>`;
        } catch (err) {
            console.error("Lỗi tạo Slide AI:", err);
            renderPowerPointSlideDeck(subject, grade, book, lessonTitle);
            alert("AI gặp sự cố (" + err.message + "). Hệ thống đã nạp bộ 22 Slide tiêu chuẩn.");
        }
        return;
    }

    if (currentActiveMode === '7991') {
        distributeMatrixFromTotals();
        const lessons = selectedLessonsForExam.length > 0 ? selectedLessonsForExam : [currentSelectedLesson];
        const countP1 = (parseInt(matrixGlobalTotals.p1_b)||0) + (parseInt(matrixGlobalTotals.p1_h)||0) + (parseInt(matrixGlobalTotals.p1_vd)||0);
        const countP2 = (parseInt(matrixGlobalTotals.p2_b)||0) + (parseInt(matrixGlobalTotals.p2_h)||0) + (parseInt(matrixGlobalTotals.p2_vd)||0);
        const countP3 = (parseInt(matrixGlobalTotals.p3_b)||0) + (parseInt(matrixGlobalTotals.p3_h)||0) + (parseInt(matrixGlobalTotals.p3_vd)||0);
        const countP4 = (parseInt(matrixGlobalTotals.p4_b)||0) + (parseInt(matrixGlobalTotals.p4_h)||0) + (parseInt(matrixGlobalTotals.p4_vd)||0);

        const multiLessonYccdSpecs = lessons.map((les, i) => {
            const lesApx = window.getMangThitLessonAppendix(subject, grade, les);
            const c = examMatrixCustomCounts[les] || {};
            return `${i + 1}. ${les}:
   - Số câu: Phần I (${c.p1_b||0}B, ${c.p1_h||0}H, ${c.p1_vd||0}VD); Phần II (${c.p2_b||0}B, ${c.p2_h||0}H, ${c.p2_vd||0}VD); Phần III (${c.p3_b||0}B, ${c.p3_h||0}H, ${c.p3_vd||0}VD); Phần IV (${c.p4_b||0}B, ${c.p4_h||0}H, ${c.p4_vd||0}VD).
   - YCCĐ Phụ lục 1: ${lesApx.yccdList.join(' | ')}`;
        }).join('\n');

        docContainer.innerHTML = `
            <div style="text-align: center; padding: 75px 20px; font-family: sans-serif;">
                <div style="font-size: 38px; color: #9333ea; margin-bottom: 16px;"><i class="fa-solid fa-file-circle-check fa-bounce"></i></div>
                <h3 style="font-size: 15pt; font-weight: bold; color: #0f172a;">${modelLabel} đang biên soạn Đề thi 7991 chuẩn YCCĐ Phụ lục 1...</h3>
            </div>
        `;
        statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> Đang ra đề thi 7991...</span>`;

        try {
            const examPrompt = `Bạn là chuyên gia khảo thí THPT. Hãy biên soạn ĐỀ KIỂM TRA ĐỊNH KỲ VÀ HƯỚNG DẪN CHẤM theo QĐ 7991 cho môn ${subject} ${grade} (Sách Kết nối tri thức).

ĐẶC TẢ YCCĐ TỪ PHỤ LỤC 1 DRIVE:
${multiLessonYccdSpecs}

YÊU CẦU:
- Bắt đầu từ "III. ĐỀ KIỂM TRA CHÍNH THỨC" và "IV. ĐÁP ÁN & HƯỚNG DẪN CHẤM".
- Phần I (${countP1} câu trắc nghiệm nhiều lựa chọn, gạch chân <u><strong>B.</strong></u>).
- Phần II (${countP2} câu đúng/sai, có bối cảnh, ghi rõ [ĐÚNG]/[SAI]).
- Phần III (${countP3} câu trả lời ngắn, có đáp án).
- Phần IV (${countP4} câu tự luận vận dụng thực tiễn).
- Mục IV: Hướng dẫn chấm chi tiết.
Định dạng HTML thuần, không markdown.`;

            let examHtmlOut = await callGeminiDirect(savedKey, selectedModel, examPrompt, false);
            examHtmlOut = examHtmlOut.replace(/```html/gi, '').replace(/```/g, '').trim();

            renderMaTranDeKiemTra(subject, grade, book, examHtmlOut);
            temporaryAIGeneratedDoc = docContainer.innerHTML;
            showAIReviewBar(`AI (${modelLabel}) đã biên soạn Đề thi 7991 khớp Phụ lục 1. Thầy kiểm tra và bấm Lưu Lại:`);
            statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã tạo Đề thi 7991 chuẩn YCCĐ Drive!</span>`;
        } catch (err) {
            console.error("Lỗi tạo Đề thi AI:", err);
            renderMaTranDeKiemTra(subject, grade, book);
            alert("AI gặp sự cố: " + err.message);
        }
        return;
    }

    docContainer.innerHTML = `
        <div style="text-align: center; padding: 75px 20px; font-family: sans-serif;">
            <div style="font-size: 38px; color: #9333ea; margin-bottom: 16px;"><i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i></div>
            <h3 style="font-size: 15pt; font-weight: bold; color: #0f172a;">${modelLabel} đang soạn KHBD 5512 bám sát Phụ lục Drive...</h3>
        </div>
    `;
    statusInd.innerHTML = `<span class="text-amber-400 font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> Đang soạn Giáo án 5512...</span>`;

    try {
        const promptText = `Bạn là chuyên gia sư phạm THPT tại THPT Mang Thít. Hãy biên soạn HOẠT ĐỘNG 2, 3, 4 cho KHBD (CV 5512) bài "${lessonTitle}" bám sát 100% Phụ lục Drive:
${ragAppendixBlock}

QUY TẮC:
- KHÔNG sinh lại Quốc hiệu, Tiêu đề, Mục I, Mục II và Hoạt động 1. Bắt đầu ngay từ "HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI".
- HOẠT ĐỘNG 2 dạng BẢNG 2 CỘT với đầy đủ YCCĐ trong Phụ lục 1, tích hợp ${apx.nlsFull} và [${apx.aiCodeFull}].
- HOẠT ĐỘNG 3 và 4 đầy đủ 4 bước và sản phẩm.
Định dạng HTML thuần, font Times New Roman 13pt, không markdown.`;

        let textOut = await callGeminiDirect(savedKey, selectedModel, promptText, false);
        textOut = textOut.replace(/```html/gi, '').replace(/```/g, '').trim();
        const fixedAiHtml = sanitizeAndFixAIActivities(textOut);

        renderGiaoAn5512HighEnd(subject, grade, book, lessonTitle, fixedAiHtml);

        temporaryAIGeneratedDoc = docContainer.innerHTML;
        showAIReviewBar(`AI (${modelLabel}) đã soạn xong KHBD 5512 bám sát Phụ lục Drive. Thầy kiểm tra và bấm Lưu Lại:`);
        statusInd.innerHTML = `<span class="text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> Đã soạn KHBD 5512 chuẩn Phụ lục Drive!</span>`;
    } catch (error) {
        console.error("Chi tiết lỗi AI:", error);
        displayContentForCurrentLesson();
        alert(`AI gặp sự cố: ${error.message}`);
    }
};

if (typeof onFilterChange === 'function') {
    onFilterChange();
}
console.log("✅ Đã đồng bộ hoàn tất toàn bộ danh mục bài học 2 môn (Sinh học & Công nghệ) cả 3 khối (10, 11, 12) theo Phụ lục THPT Mang Thít!");
