✨ Tính năng chính
📥 Trích xuất & phân tích CV
Sinh viên tải CV (PDF/Ảnh) lên hệ thống.
OCR + NLP tự động trích xuất: Họ tên, email, vị trí mong muốn, kỹ năng.
🤖 Ghép kỹ năng & yêu cầu vị trí
So khớp kỹ năng sinh viên với yêu cầu tuyển dụng của doanh nghiệp.
Tính toán độ phù hợp (0–100%).
Đề xuất công ty thực tập phù hợp nhất.
📊 Quản lý & Báo cáo
Danh sách gợi ý doanh nghiệp kèm độ phù hợp.
Bảng thống kê: số lượng sinh viên – doanh nghiệp đã ghép thành công.
Xuất kết quả ghép ra CSV/Excel.
🛠 Công nghệ sử dụng
Ngôn ngữ: Python 3.10+
Backend: FastAPI (Uvicorn)
Machine Learning / NLP: scikit-learn, spaCy
Xử lý OCR: Tesseract.js
Xử lý dữ liệu: Pandas, NumPy
Frontend: Jinja2, HTML5, CSS3, Bootstrap
Dữ liệu: SQLite/CSV
📁 Cấu trúc dự án
STUDENT_JOB_AI/
├── data/
│   └── students.csv             # Hồ sơ sinh viên
│   └── companies.csv            # Yêu cầu doanh nghiệp
├── static/
│   └── header.png               # Logo / banner
├── templates/
│   ├── upload.html              # Upload CV
│   ├── dashboard.html           # Dashboard ghép
│   └── result.html              # Kết quả ghép
├── app.py                       # Ứng dụng chính FastAPI
├── extract_cv.py                 # Trích xuất thông tin từ CV
├── match_jobs.py                 # Thuật toán ghép kỹ năng
├── train_model.py                # Huấn luyện mô hình
├── student_profiles.json         # Hồ sơ đã xử lý
└── venv/                         # Môi trường ảo
🚀 Hướng dẫn cài đặt & sử dụng
Tải toàn bộ mã nguồn (các file index.html, script.js, companies.js) , congty1.html), congty2.html, congty3.html, về máy.
Đặt chúng trong cùng một thư mục (ví dụ: Student_Company_Matching).
Đảm bảo máy có kết nối Internet để tải thư viện Tesseract.js từ CDN.
Mở file index.html trực tiếp bằng trình duyệt (Chrome, Edge, Firefox...).
Sử dụng giao diện:
📄 Upload CV để hệ thống OCR trích xuất thông tin.
✏️ Kiểm tra/chỉnh sửa thông tin (tên, email, kỹ năng...).
💾 Lưu hồ sơ và nhấn “Hiển thị công ty phù hợp” để xem danh sách.
🖼 Hình ảnh ứng dụng
🔐 Giao diện Upload CV:

<img width="783" height="377" alt="image" src="https://github.com/user-attachments/assets/c0399809-a5b6-4460-b784-b0ce87648a68" />
🏠 Giao diện Dashboard ghép:

<img width="1092" height="772" alt="image" src="https://github.com/user-attachments/assets/b914c95b-7502-46da-8c01-53bd5383c51b" />


🔎 Kết quả ghép với doanh nghiệp:

<img width="1092" height="772" alt="image" src="https://github.com/user-attachments/assets/485d2594-f55b-4f63-bbf0-14b8498dc139" />



© Bản quyền
© 2025 Nhóm 5-CNTT_17-04, Khoa Công nghệ Thông tin, Đại học Đại Nam.

Được thực hiện bởi
Nhóm 5-CNTT_17-04 – Đại học Đại Nam
