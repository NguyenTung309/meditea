# Hướng Dẫn Triển Khai (Deployment) Website Medi-Tea Lên VPS

Tài liệu này hướng dẫn chi tiết từng bước (step-by-step) để đưa dự án Medi-Tea từ môi trường local lên máy chủ VPS (Ubuntu), cấu hình tên miền `meditea.vn`, kết nối Cloudflare R2 và thiết lập hệ thống tự động deploy (CI/CD) qua GitHub Actions.

---

## Phần 1: Cấu hình tên miền ảnh (Cloudflare R2 Custom Domain)

Thay vì dùng link `.r2.dev` mặc định, chúng ta sẽ trỏ tên miền phụ (ví dụ: `cdn.meditea.vn`) về Bucket R2 để chuyên phục vụ ảnh.

1. **Điều kiện:** Tên miền `meditea.vn` của bạn phải đang trỏ NameServer về Cloudflare.
2. Đăng nhập Cloudflare, vào mục **R2** -> Chọn Bucket **`teatea`** -> tab **Settings**.
3. Cuộn xuống phần **Custom Domains** -> Bấm **Connect Domain**.
4. Nhập tên miền phụ bạn muốn dùng, ví dụ: `cdn.meditea.vn` (hoặc `images.meditea.vn`) -> Bấm **Continue**.
5. Cloudflare sẽ tự động cập nhật bản ghi DNS (CNAME). Đợi vài giây cho trạng thái chuyển sang màu xanh (Active).
6. **Cập nhật Database Local (Tùy chọn):** Nếu bạn muốn đổi link cũ trong DB sang link mới, hãy chạy script MongoDB (ví dụ: updateMany) để replace chuỗi `https://pub-adeae...r2.dev` thành `https://cdn.meditea.vn`.

---

## Phần 2: Chuẩn bị môi trường trên máy chủ VPS (Ubuntu)

Sử dụng SSH để đăng nhập vào VPS của bạn (VD: `ssh root@IP_CUA_VPS`).

### 1. Cài đặt Node.js & PM2
```bash
# Cài đặt Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2 để quản lý process backend chạy ngầm
sudo npm install -g pm2
```

### 2. Cài đặt MongoDB (Nếu dùng DB local trên VPS)
```bash
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Cài đặt Git, Nano, Nginx & Certbot (SSL)
```bash
sudo apt-get install -y git nano nginx certbot python3-certbot-nginx
```

---

## Phần 3: Triển khai ứng dụng (Lần đầu tiên bằng tay)

Tạo thư mục chứa code và clone mã nguồn từ GitHub:
```bash
mkdir -p /var/www/meditea
cd /var/www/meditea

# Thay thế link repo github của bạn
git clone https://github.com/your-username/medi-tea-repo.git .
```

### 1. Backend
```bash
cd /var/www/meditea/server
npm install

# Tạo file .env bằng trình soạn thảo nano
nano .env
# Màn hình đen hiện ra, bạn hãy PASTE toàn bộ nội dung của file prod.env (đã tạo ở máy cá nhân) vào đây.
# Nhấn Ctrl+X -> Y -> Enter để lưu lại.

# Khởi chạy Backend bằng PM2
pm2 start src/server.js --name "meditea-backend"
pm2 save
pm2 startup
```

### 2. Frontend
```bash
cd /var/www/meditea/frontend
npm install

# Tạo file .env cho frontend bằng trình soạn thảo nano
nano .env
# Màn hình đen hiện ra, bạn hãy PASTE toàn bộ nội dung của file prod.env (đã tạo ở máy cá nhân thư mục frontend) vào đây.
# Nhấn Ctrl+X -> Y -> Enter để lưu lại.

# Build frontend ra HTML/CSS/JS tĩnh
npm run build
# Sau khi build, code sẽ nằm trong thư mục /var/www/meditea/frontend/dist
```

---

## Phần 4: Cấu hình Nginx & Tên miền

Cấu hình Nginx để phục vụ file tĩnh (Frontend) và làm Proxy cho Backend (Node.js).

```bash
sudo nano /etc/nginx/sites-available/meditea
```
Dán đoạn cấu hình sau vào:
```nginx
server {
    listen 80;
    server_name meditea.vn www.meditea.vn;

    # Cấu hình Frontend (React Vite)
    location / {
        root /var/www/meditea/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Cấu hình Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Nếu có upload file lớn, cấu hình max size
        client_max_body_size 50M; 
    }
}
```

Kích hoạt Nginx và cài SSL:
```bash
sudo ln -s /etc/nginx/sites-available/meditea /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Xin chứng chỉ SSL Let's Encrypt tự động
sudo certbot --nginx -d meditea.vn -d www.meditea.vn
```

---

## Phần 5: Thiết lập CI/CD tự động qua GitHub Actions

Để mỗi khi bạn gõ `git push`, code sẽ tự động cập nhật lên VPS mà không cần vào server gõ lệnh.

### 1. Chuẩn bị biến bí mật trên GitHub
Vào Repository trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**. Thêm 3 biến sau:
- `VPS_HOST`: IP của VPS (vd: 123.45.67.89)
- `VPS_USER`: Tên đăng nhập VPS (vd: root hoặc ubuntu)
- `VPS_SSH_KEY`: Private Key SSH của máy chủ (Lấy trên VPS bằng cách `cat ~/.ssh/id_rsa`, nếu chưa có thì gõ `ssh-keygen` để tạo).

Lưu ý: Nhớ copy Public Key (`~/.ssh/id_rsa.pub`) đưa vào file `~/.ssh/authorized_keys` trên VPS để GitHub Actions có quyền login.

### 2. Tạo file Workflow trong dự án
Trong thư mục gốc của project (Medi-Tea), tạo file: `.github/workflows/deploy.yml`

```yaml
name: Deploy Medi-Tea to VPS

on:
  push:
    branches:
      - main # Hoặc nhánh master tùy dự án của bạn

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/meditea
            
            # Kéo code mới nhất từ Github
            git pull origin main
            
            # Cập nhật và Build Backend
            cd server
            npm install
            pm2 restart meditea-backend
            
            # Cập nhật và Build Frontend
            cd ../frontend
            npm install
            npm run build
            
            echo "Deployment Successful!"
```

Sau khi tạo xong file này, mỗi lần bạn **Commit & Push** code lên nhánh `main`, Github Actions sẽ tự động SSH vào VPS của bạn, kéo code mới, cài thư viện, build lại Frontend và khởi động lại Backend tự động 100%!
