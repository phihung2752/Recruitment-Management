# 🐳 HR Management System - Docker Setup

Hệ thống quản lý nhân sự HR Management System với Docker, có thể chạy trên bất kỳ máy nào có Docker.

## 🚀 Quick Start

### Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
# Chạy script tự động
./scripts/docker-start.sh
```

### Cách 2: Chạy thủ công

```bash
# 1. Dừng các container hiện tại
docker-compose down

# 2. Build và chạy services
docker-compose up --build -d

# 3. Đợi MySQL khởi động (30 giây)
sleep 30

# 4. Setup database
docker-compose exec hr_app node scripts/docker-setup-db.js
```

## 📋 Thông tin truy cập

- **🌐 Ứng dụng:** http://localhost:3001
- **🗄️ Database Admin:** http://localhost:8080
- **👤 Đăng nhập:** admin / admin123

## 🏗️ Kiến trúc Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HR App        │    │   MySQL 8.0     │    │   Adminer       │
│   (Next.js)     │◄──►│   (Database)    │◄──►│   (DB Admin)    │
│   Port: 3001    │    │   Port: 3306    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Quản lý Docker

### Xem logs
```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f hr_app
docker-compose logs -f mysql
```

### Dừng services
```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (XÓA DỮ LIỆU)
docker-compose down -v
```

### Khởi động lại
```bash
# Khởi động lại tất cả
docker-compose restart

# Khởi động lại service cụ thể
docker-compose restart hr_app
```

### Rebuild
```bash
# Rebuild và chạy lại
docker-compose up --build -d
```

## 🗄️ Database Management

### Truy cập MySQL trực tiếp
```bash
# Vào container MySQL
docker-compose exec mysql mysql -u hr_admin -p hr_management_system

# Hoặc từ máy host
mysql -h localhost -P 3306 -u hr_admin -p hr_management_system
```

### Backup Database
```bash
# Backup
docker-compose exec mysql mysqldump -u hr_admin -p hr_management_system > backup.sql

# Restore
docker-compose exec -T mysql mysql -u hr_admin -p hr_management_system < backup.sql
```

## 🔐 Environment Variables

Tạo file `.env` để tùy chỉnh:

```env
# Database
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_NAME=hr_management_system
DATABASE_USER=hr_admin
DATABASE_PASSWORD=HRAdmin123!

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Next.js
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
```

## 📊 Monitoring

### Kiểm tra trạng thái services
```bash
docker-compose ps
```

### Kiểm tra tài nguyên sử dụng
```bash
docker stats
```

### Kiểm tra logs lỗi
```bash
docker-compose logs --tail=100 | grep ERROR
```

## 🚨 Troubleshooting

### Lỗi "Port already in use"
```bash
# Kiểm tra port đang sử dụng
lsof -i :3001
lsof -i :3306
lsof -i :8080

# Dừng process đang sử dụng port
sudo kill -9 <PID>
```

### Lỗi "Database connection failed"
```bash
# Kiểm tra MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Lỗi "Container not found"
```bash
# Rebuild toàn bộ
docker-compose down
docker-compose up --build -d
```

### Xóa tất cả và bắt đầu lại
```bash
# Dừng và xóa tất cả
docker-compose down -v
docker system prune -a

# Chạy lại
./scripts/docker-start.sh
```

## 📁 Cấu trúc thư mục

```
hr-management-system/
├── docker-compose.yml          # Docker Compose config
├── Dockerfile                  # Docker image config
├── .dockerignore              # Docker ignore file
├── scripts/
│   ├── docker-start.sh        # Script khởi động
│   └── docker-setup-db.js     # Script setup database
├── database/
│   ├── database-schema-mysql.sql
│   ├── add-candidates-only.sql
│   ├── add-job-postings.sql
│   └── complete-job-postings.sql
└── ...
```

## 🎯 Features

- ✅ **Next.js 14** với TypeScript
- ✅ **MySQL 8.0** database
- ✅ **JWT Authentication**
- ✅ **Role-based Access Control**
- ✅ **Responsive Design**
- ✅ **Real-time Updates**
- ✅ **Admin Panel**
- ✅ **Database Management UI**

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:

1. Docker đang chạy
2. Ports 3001, 3306, 8080 không bị chiếm
3. Logs của services: `docker-compose logs -f`
4. Database connection: `docker-compose exec mysql mysql -u hr_admin -p`

---

**🎉 Chúc mừng! HR Management System đã sẵn sàng chạy trên Docker!**




