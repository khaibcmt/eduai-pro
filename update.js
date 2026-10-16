// ============================================================================
// FILE CẬP NHẬT TÊN BÀI DẠY THEO ĐÚNG PPCT 2026-2027 - TRƯỜNG THPT MANG THÍT
// Tác giả: Hồ Tấn Khải - Đã đồng bộ đầy đủ Sinh học & Công nghệ (10, 11, 12)
// ============================================================================

console.log("⚙️ Đã nạp thành công dữ liệu PPCT năm học 2026-2027 cho Trường THPT Mang Thít!");

window.addEventListener('DOMContentLoaded', () => {
    // Tự động bổ sung hoặc cập nhật danh mục chuẩn từ PPCT chính thức vào cơ sở dữ liệu của BioMaster AI
    if (typeof sgkCurriculumDatabase !== 'undefined') {
        
        // 1. CÔNG NGHỆ NÔNG NGHIỆP 10 (Trồng trọt)
        sgkCurriculumDatabase["Công nghệ Nông nghiệp"]["10"] = [
            "Bài 1. Giới thiệu về trồng trọt",
            "Bài 2. Cây trồng và các yếu tố chính trong trồng trọt",
            "Bài 3. Giới thiệu về đất trồng",
            "Bài 4. Sử dụng, cải tạo và bảo vệ đất trồng",
            "Bài 5. Giá thể trồng cây",
            "Bài 6. Thực hành: Xác định độ chua và độ mặn của đất",
            "Bài 7. Giới thiệu về phân bón",
            "Bài 8. Sử dụng và bảo quản phân bón",
            "Bài 9. Ứng dụng công nghệ vi sinh trong sản xuất phân bón",
            "Bài 10. Thực hành nhận biết một số loại phân bón hóa học",
            "Bài 11. Khái niệm và vai trò của giống cây trồng",
            "Bài 12. Một số phương pháp chọn tạo giống cây trồng",
            "Bài 13. Nhân giống cây trồng",
            "Bài 14. Thực hành: nhân giống cây ăn quả bằng phương pháp ghép",
            "Bài 15. Sâu, bệnh hại cây trồng và ý nghĩa của việc phòng trừ",
            "Bài 16. Một số sâu hại cây trồng thường gặp và biện pháp phòng trừ",
            "Bài 17. Một số bệnh hại cây trồng thường gặp và biện pháp phòng trừ",
            "Bài 18. Ứng dụng công nghệ vi sinh trong phòng trừ sâu, bệnh hại cây trồng",
            "Bài 19. Quy trình trồng trọt và cơ giới hóa trong trồng trọt",
            "Bài 20. Công nghệ cao trong thu hoạch và bảo quản sản phẩm trồng trọt",
            "Bài 21. Chế biến sản phẩm trồng trọt",
            "Bài 22. Dự án trồng hoa trong chậu",
            "Bài 23. Giới thiệu về trồng trọt công nghệ cao",
            "Bài 24. Một số công nghệ cao trong trồng trọt",
            "Bài 25. Công nghệ trồng cây không dùng đất",
            "Bài 26. Sự cần thiết phải bảo vệ môi trường trong trồng trọt",
            "Bài 27. Ứng dụng công nghệ vi sinh trong bảo vệ môi trường và xử lí chất thải trồng trọt",
            "Bài 28. Thực hành: Sử dụng rơm, rạ để trồng nấm rơm"
        ];

        // 2. CÔNG NGHỆ NÔNG NGHIỆP 11 (Chăn nuôi)
        sgkCurriculumDatabase["Công nghệ Nông nghiệp"]["11"] = [
            "Bài 1: Vai trò và triển vọng của chăn nuôi",
            "Bài 2: Vật nuôi và phương thức chăn nuôi",
            "Bài 3: Khái niệm, vai trò của giống trong chăn nuôi",
            "Bài 4: Chọn giống vật nuôi",
            "Bài 5: Nhân giống vật nuôi",
            "Bài 6: Ứng dụng công nghệ sinh học trong chọn và nhân giống vật nuôi",
            "Bài 7: Thức ăn và nhu cầu dinh dưỡng của vật nuôi",
            "Bài 8: Sản xuất và chế biến thức ăn chăn nuôi",
            "Bài 9: Bảo quản thức ăn chăn nuôi",
            "Bài 10: Thực hành: Chế biến, bảo quản thức ăn cho vật nuôi",
            "Bài 11: Vai trò của phòng, trị bệnh trong chăn nuôi",
            "Bài 12: Một số bệnh phổ biến ở lợn và biện pháp phòng, trị",
            "Bài 13: Một số bệnh phổ biến ở gia cầm và biện pháp phòng, trị",
            "Bài 14: Một số bệnh phổ biến ở trâu, bò và biện pháp phòng, trị",
            "Bài 15: Ứng dụng công nghệ sinh học trong phòng, trị bệnh vật nuôi",
            "Bài 16: Chuồng nuôi và biện pháp vệ sinh trong chăn nuôi",
            "Bài 17: Nuôi dưỡng và chăm sóc vật nuôi",
            "Bài 18: Chăn nuôi theo tiêu chuẩn VietGAP",
            "Bài 19: Chăn nuôi công nghệ cao",
            "Bài 20: Bảo quản và chế biến sản phẩm chăn nuôi",
            "Bài 21: Sự cần thiết bảo vệ môi trường trong chăn nuôi",
            "Bài 22: Xử lý chất thải chăn nuôi"
        ];

        // 3. CÔNG NGHỆ NÔNG NGHIỆP 12 (Lâm nghiệp - Thủy sản)
        sgkCurriculumDatabase["Công nghệ Nông nghiệp"]["12"] = [
            "Bài 1. Vai trò và triển vọng của lâm nghiệp",
            "Bài 2. Các hoạt động lâm nghiệp cơ bản và nguyên nhân chủ yếu làm suy thoái tài nguyên rừng",
            "Bài 3. Vai trò, nhiệm vụ của trồng và chăm sóc rừng",
            "Bài 4. Quy luật sinh trưởng và phát triển của cây rừng",
            "Bài 5. Kĩ thuật trồng và chăm sóc rừng",
            "Bài 6. Ý nghĩa, nhiệm vụ, thực trạng của việc bảo vệ và khai thác rừng",
            "Bài 7. Biện pháp bảo vệ và khai thác tài nguyên rừng",
            "Bài 8. Vai trò và triển vọng của thuỷ sản",
            "Bài 9. Các nhóm thuỷ sản và một số phương thức nuôi phổ biến",
            "Bài 10. Giới thiệu về môi trường nuôi thuỷ sản",
            "Bài 11. Quản lí môi trường nuôi thuỷ sản",
            "Bài 12. Biện pháp xử lí môi trường nuôi thuỷ sản",
            "Bài 13. Vai trò của giống thuỷ sản",
            "Bài 14. Sinh sản của cá và tôm",
            "Bài 15. Ứng dụng công nghệ sinh học trong chọn và nhân giống thuỷ sản",
            "Bài 16. Thức ăn thuỷ sản",
            "Bài 17. Phương pháp bảo quản và chế biến thức ăn thuỷ sản",
            "Bài 18. Ứng dụng công nghệ sinh học trong bảo quản, chế biến thức ăn thuỷ sản",
            "Bài 19. Công nghệ nuôi một số loài thuỷ sản phổ biến ở Việt Nam",
            "Bài 20. Nuôi thuỷ sản theo tiêu chuẩn VietGAP",
            "Bài 21. Một số ứng dụng công nghệ cao trong nuôi thuỷ sản",
            "Bài 22. Bảo quản và chế biến sản phẩm thuỷ sản",
            "Bài 23. Vai trò của phòng, trị bệnh thuỷ sản",
            "Bài 24. Một số bệnh thuỷ sản phổ biến và biện pháp phòng, trị",
            "Bài 25. Ứng dụng công nghệ sinh học trong phòng, trị bệnh thuỷ sản",
            "Bài 26. Bảo vệ nguồn lợi thuỷ sản",
            "Bài 27. Khai thác nguồn lợi thuỷ sản"
        ];

        // Cập nhật lại giao diện chọn bài học ngay lập tức
        if (typeof renderLessonListUI === 'function') {
            renderLessonListUI();
        }
    }
});
