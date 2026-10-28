# Local source publication

## Repository status

Tea commerce application with React frontend and Node.js backend.

This repository contains a filtered local source snapshot. Application builds and end-to-end behavior have not been verified during publication.

Credential files, detected credential values, dependencies, build outputs and large backup archives were excluded. Configure your own services and secrets before running.

Upstream source: https://github.com/thaijunny/tea. Original authorship and existing license terms remain applicable. This is a source import, not a GitHub fork.

---

# Medi-Tea 🍵 - Health Protection Tea Platform & Interactive Experience

Chào mừng bạn đến với **Medi-Tea**, nền tảng thương mại điện tử chuyên biệt cung cấp các dòng sản phẩm trà bảo vệ sức khỏe cao cấp. Dự án không chỉ là một cửa hàng trực tuyến thông thường mà còn mang đến trải nghiệm người dùng tương tác cao thông qua **Không gian 3D tương tác**, **Trạm phối trà (Mini-game Mix Trà)** và **Trợ lý trà ảo (AI Chatbot)** tích hợp trực tiếp mô hình Gemini AI.

---

## 🚀 Công Nghệ Sử Dụng (Technology Stack)

Hệ thống được thiết kế theo kiến trúc **MERN Stack** (MongoDB, Express, React, Node.js) kết hợp với các thư viện hỗ trợ đồ họa 3D và trí tuệ nhân tạo hiện đại.

| Thành phần | Công nghệ / Thư viện | Mô tả |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, Vite, React Router DOM 7 | Xây dựng Single Page Application (SPA) tốc độ cao, tối ưu hóa bundle bằng Rolldown-Vite. |
| **UI & Styling** | Tailwind CSS, Ant Design (v6), Lucide Icons | Thiết kế giao diện hiện đại, responsive, kết hợp các component chất lượng cao của Antd. |
| **Đồ họa 3D** | Three.js, React Three Fiber, React Three Drei | Hiển thị mô hình 3D tương tác xoay 360 độ trực quan trên trình duyệt. |
| **HTTP Client** | Axios | Quản lý request API bất đồng bộ với cơ chế Credentials/Cookies. |
| **Xác thực** | `@react-oauth/google` | Hỗ trợ đăng nhập nhanh bằng tài khoản Google. |
| **Backend Core** | Node.js, Express (v5) | Xây dựng RESTful API chuẩn hóa, xử lý bất đồng bộ và kiểm soát lỗi tập trung. |
| **Database** | MongoDB, Mongoose (v9) | Quản lý cơ sở dữ liệu phi quan hệ, định nghĩa Schemas chặt chẽ cho người dùng, sản phẩm, đơn hàng, v.v. |
| **Bảo mật & Session** | Bcrypt, JSON Web Token (JWT), Cookie-parser | Mã hóa mật khẩu người dùng, quản lý phiên đăng nhập qua Token gửi kèm HTTP-only Cookie. |
| **Tích hợp Mailer** | Nodemailer | Gửi OTP xác thực tài khoản và đặt lại mật khẩu thông qua Google OAuth2. |
| **Upload Hình Ảnh** | Multer, Cloudinary SDK | Xử lý upload ảnh sản phẩm, danh mục lên Cloudinary và lấy Public ID tự động. |
| **Thanh toán** | VNPay SDK | Tích hợp cổng thanh toán trực tuyến VNPay Sandbox. |
| **Trí tuệ nhân tạo** | Google Gemini API (`gemini-2.5-flash`) | Xử lý hội thoại tự động thông qua API của Google kết hợp System Instructions định hình nhân vật. |

---

## 🌟 Các Chức Năng Chính (Key Features)

### 1. Khách Hàng (Client Interface)
*   **Mua Sắm Trực Tuyến (E-Commerce):**
    *   Duyệt và tìm kiếm sản phẩm trà theo danh mục, giá cả và khuyến mãi.
    *   Giỏ hàng động: Thêm/sửa số lượng, lưu trữ phiên giỏ hàng trong cơ sở dữ liệu.
    *   Áp dụng mã giảm giá (Coupon/Voucher) trực tiếp khi thanh toán.
*   **Thanh Toán Linh Hoạt (Checkout & Payments):**
    *   Hỗ trợ thanh toán khi nhận hàng (COD).
    *   Tích hợp thanh toán online qua **VNPay Gateway (Sandbox)**, tự động điều hướng và callback xác nhận đơn hàng sau khi hoàn tất thanh toán.
*   **Trạm Mix Trà (Interactive Tea Mixer Game):**
    *   Cho phép người dùng tự tay phối trộn công thức trà cá nhân từ **1 loại trà nền** (Trà xanh, Ô long, Trà đen, Trà trắng) và **tối đa 3 loại thảo mộc/hoa/trái cây** (Bạc hà, Sả, Hoa nhài, Hoa cúc, Hoa hồng, Gừng, Quế, Chanh, Đào, Mật ong).
    *   Tính toán thời gian thực: chỉ số hương vị (Đắng, Ngọt, Thanh, Mát, Mộc), caffeine tổng, và các tác dụng phụ/cảnh báo sức khỏe (Ví dụ: Gừng xung đột với Hoa hồng, Quế kỵ Bạc hà, hoặc lượng Caffeine quá cao).
    *   Chấm điểm độ hài hòa (Harmony Score) và xếp hạng công thức (S, A, C).
    *   Tặng Voucher giảm giá nếu đạt xếp hạng tốt và cho phép thêm thẳng công thức vừa chế vào giỏ hàng để mua.
*   **Trợ Lý Trà Ảo (Gemini AI Chatbot):**
    *   Bot hỗ trợ khách hàng được tích hợp trực tiếp trên giao diện bằng Gemini API (`gemini-2.5-flash`).
    *   Được định hình nhân vật thông qua **System Prompt**: Thân thiện, xưng hô "Medi-Tea", trả lời các câu hỏi về trà và khéo léo dẫn dắt các câu hỏi ngoài luồng quay về sản phẩm của hãng.
*   **Không Gian Tương Tác 3D (3D Space):**
    *   Xem sản phẩm xoay 360 độ cực kỳ sống động sử dụng Three.js để tăng tính tương tác và thẩm mỹ cao cấp.
*   **Xác thực người dùng:** Đăng ký, Đăng nhập thường/Google, Quên mật khẩu & xác nhận bằng mã OTP gửi qua email.
*   **Khác:** Hệ thống viết Blog, FAQs, liên hệ, đánh giá (Review/Feedback) và gửi khiếu nại (Complaint).

### 2. Quản Trị Viên (Admin Panel)
*   **Dashboard:** Thống kê tổng số lượng người dùng, doanh thu, đơn hàng.
*   **Quản lý Danh mục (Category):** CRUD các danh mục sản phẩm kèm hình ảnh lưu trên Cloudinary.
*   **Quản lý Sản phẩm (Product):** CRUD sản phẩm trà (hình ảnh, tên, giá, phần trăm giảm giá, số lượng tồn kho, mô tả, trạng thái ẩn/hiện).
*   **Quản lý Người dùng (User):** CRUD thông tin thành viên, phân quyền Admin.
*   **Quản lý Mã giảm giá (Coupon):** Thiết lập voucher giảm giá, số lượng sử dụng, điều kiện giá tối thiểu, ngày bắt đầu và hết hạn.
*   **Quản lý Đơn hàng (Order):** Theo dõi danh sách đơn hàng từ COD/VNPay và cập nhật trạng thái đơn hàng (`pending`, `confirmed`, `delivered`, `completed`, `cancelled`).

---

## 📁 Cấu Trúc Thư Mục (Project Structure)

Dự án được phân chia rõ ràng thành 2 phần chính: `frontend` và `server`.

```text
Medi-Tea/
├── frontend/                  # Mã nguồn ứng dụng Client & Admin (React + Vite)
│   ├── public/                # Chứa các file tĩnh (ảnh, các file mô hình 3D .glb)
│   │   ├── 3D/                # File GLB của các mô hình 3D
│   │   └── images/            # Ảnh tĩnh, logo
│   ├── src/
│   │   ├── assets/            # CSS và tài nguyên đồ họa cục bộ
│   │   ├── components/        # Các React Components
│   │   │   ├── admin/         # Giao diện & bảng CRUD Admin
│   │   │   ├── chatbot/       # Chatbot tích hợp Gemini API
│   │   │   ├── game/          # Board game & Logic của Trạm Mix Trà
│   │   │   └── homepage/      # Các component hiển thị trang chủ
│   │   ├── config/            # Cấu hình Axios & các file call API request
│   │   ├── data/              # Mock dữ liệu & cấu hình 3D, nguyên liệu game
│   │   ├── pages/             # Các trang (Client, Cart, Auth)
│   │   ├── routes/            # Quản lý định tuyến và route Admin bảo vệ
│   │   ├── main.jsx           # Entry point của ứng dụng Frontend (React Router setup)
│   │   └── App.jsx            # Layout cha chứa Header, Footer, Chatbot, Game Float
│   └── vite.config.js         # Cấu hình Vite & plugin React
│
├── server/                    # Mã nguồn Backend API (Express + MongoDB)
│   ├── src/
│   │   ├── auth/              # Logic tạo & kiểm tra JWT token, xác thực Google
│   │   ├── config/            # Kết nối database Mongoose & Cloudinary
│   │   ├── controllers/       # Controller xử lý logic API (Product, Cart, Payment, User...)
│   │   ├── core/              # Quản lý phản hồi (Success/Error Responses) chuẩn REST
│   │   ├── middleware/        # Middleware kiểm tra quyền admin, xác thực đăng nhập, upload ảnh
│   │   ├── models/            # Các Mongoose Schemas (User, Product, Cart, Payment, Coupon...)
│   │   ├── routes/            # Định tuyến các endpoint API
│   │   ├── utils/             # Các hàm bổ trợ (gửi mail OTP, parse Public ID Cloudinary)
│   │   └── server.js          # Khởi chạy Express Server, thiết lập CORS và middleware
│   └── package.json           # Cấu hình backend scripts & dependencies
```

---

## 🛠️ Hướng Dẫn Khởi Chạy Dự Án (Getting Started)

### Yêu Cầu Hệ Thống (Prerequisites)
- **Node.js** phiên bản 20.x hoặc mới hơn.
- Cài đặt cơ sở dữ liệu **MongoDB** (Local hoặc MongoDB Atlas).
- Tài khoản **Cloudinary** (để upload ảnh sản phẩm).
- **Google Developer Console Credentials** (nếu muốn chạy tính năng Google Auth & gửi Mail OTP).
- Cài đặt thư viện dependencies ở cả thư mục `frontend` và `server` bằng lệnh:
  ```bash
  # Tại thư mục frontend/
  npm install

  # Tại thư mục server/
  npm install
  ```

---

### 1. Cấu Hình Biến Môi Trường (Environment Variables)

#### 🔸 Backend (`server/.env`)
Hãy tạo file `.env` bên trong thư mục `server/` và điền đầy đủ các thông tin sau:

```env
# Server Port & URL
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medi-tea?retryWrites=true&w=majority

# JWT Security
JWT_SECRET=your_jwt_super_secret_key

# Google OAuth2 Credentials (Đăng nhập Google & gửi OTP email)
GOOLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CLIENT_ID=your_google_oauth2_client_id
CLIENT_SECRET=your_google_oauth2_client_secret
REDIRECT_URI=https://developers.google.com/oauthplayground
REFRESH_TOKEN=your_google_oauth2_refresh_token
EMAIL_USER=your_gmail_address@gmail.com

# Cloudinary Credentials (Để upload ảnh)
CLOUD_DINARY_NAME=your_cloudinary_cloud_name
CLOUD_DINARY_KEY=your_cloudinary_api_key
CLOUD_DINARY_SECRET=your_cloudinary_api_secret
```

#### 🔸 Frontend (`frontend/.env`)
Tạo file `.env` bên trong thư mục `frontend/` với cấu hình sau:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:3000

# Google Login API Client ID
GOOLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Google Gemini API Key
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

---

### 2. Khởi Chạy Dự Án (Running the Project)

#### Bước 1: Chạy Server (Backend API)
Mở một terminal mới tại thư mục `server/` và chạy lệnh:
```bash
# Chạy ở chế độ Development (hỗ trợ hot-reload bằng Nodemon)
npm run dev

# Hoặc khởi chạy thông thường
npm start
```
Server sẽ mặc định chạy tại địa chỉ: `http://localhost:3000`.

#### Bước 2: Chạy Client (Frontend)
Mở một terminal khác tại thư mục `frontend/` và chạy lệnh:
```bash
# Khởi động Vite Dev Server
npm run dev
```
Ứng dụng client sẽ chạy tại địa chỉ: `http://localhost:5173`. Mở trình duyệt và truy cập để trải nghiệm trang web.

---

## 🌐 Lưu Ý Khi Triển Khai Thực Tế (Go-Live / Production Deploy)

Khi đưa dự án lên chạy thực tế (Production / Go-live), vui lòng lưu ý một số điểm cấu hình quan trọng dưới đây:

### 1. Cập nhật các liên kết (URLs)
*   **Backend (`server/.env`):** Thay đổi `CLIENT_URL` thành địa chỉ tên miền Frontend thật của bạn (ví dụ: `https://medi-tea.vercel.app`).
*   **Frontend (`frontend/.env`):** Thay đổi `VITE_API_URL` thành địa chỉ API Backend thật (ví dụ: `https://api.medi-tea.com`).

### 2. Bảo mật Cookie & Môi trường
*   Thiết lập `NODE_ENV=production` trong file `.env` của Server.
*   Khi `NODE_ENV` là `production`, cookie lưu token đăng nhập sẽ tự động kích hoạt thuộc tính bảo mật `secure: true` (chỉ gửi qua HTTPS) và `sameSite: "none"`. Đảm bảo Backend của bạn đã được cấu hình chứng chỉ SSL/HTTPS.

### 3. Đăng nhập Google (Google OAuth)
*   Đảm bảo bạn đã thêm tên miền production của Frontend vào mục **Authorized JavaScript Origins** trong Google Developer Console để Google cho phép thực hiện popup đăng nhập từ tên miền này.

### 4. Cấu hình Cổng thanh toán VNPay
*   Trong file `server/src/controllers/payment.controller.js` (dòng khởi tạo VNPay):
    *   Chuyển `testMode` từ `true` sang `false`.
    *   Thay đổi `vnpayHost` thành đường dẫn chính thức: `https://pay.vnpayment.vn`.
    *   Đưa `tmnCode` và `secureSecret` vào biến môi trường `.env` thay vì hardcode thông tin sandbox để đảm bảo an toàn bảo mật.

### 5. Build mã nguồn Frontend
*   Trước khi deploy giao diện, hãy build tối ưu hóa source code bằng lệnh:
    ```bash
    npm run build
    ```
    Sau đó deploy thư mục `dist/` được sinh ra lên các dịch vụ hosting như Vercel, Netlify hoặc máy chủ riêng (Nginx/Apache).

---

## 🔒 Bản Quyền & Giấy Phép
Dự án được phát triển dưới giấy phép **ISC**. Mọi quyền được bảo lưu. 🍵

