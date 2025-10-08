# Hướng dẫn Hệ thống Tam giác Phỏng vấn Thông minh

## 🎯 Tổng quan

Hệ thống tam giác phỏng vấn được thiết kế để hiển thị tiến trình phỏng vấn một cách trực quan và dễ hiểu, với khả năng tự động điều chỉnh layout dựa trên số lượng vòng phỏng vấn.

## 🔺 Các loại Layout

### 1. Tam giác cơ bản (≤4 vòng)

Khi có 4 vòng phỏng vấn hoặc ít hơn, hệ thống sử dụng layout tam giác cơ bản:

```
    Vòng 1 (Đỉnh)
   /           \
Vòng 2        Vòng 3
(Trái)        (Phải)
   \           /
    Vòng 4 (Đáy)
```

**Vị trí:**
- Vòng 1: Đỉnh tam giác
- Vòng 2: Góc trái
- Vòng 3: Góc phải  
- Vòng 4: Giữa đáy

### 2. Tam giác phân tầng - Kim tự tháp (>4 vòng)

Khi có nhiều hơn 4 vòng, hệ thống tự động chuyển sang layout kim tự tháp nhiều tầng:

```
        Vòng 1 (Đỉnh)
       /           \
    Vòng 2        Vòng 3
   /     \       /     \
Vòng 4  Vòng 5  Vòng 6  Vòng 7
(Đáy)   (Đáy)   (Đáy)   (Đáy)
```

**Đặc điểm:**
- Tầng trên cùng: 1 vòng (đỉnh)
- Tầng giữa: 2 vòng
- Tầng đáy: 3+ vòng (tùy theo số lượng)
- Càng xuống dưới càng nhiều vòng

## 🎨 Giao diện và Trạng thái

### Avatar Interviewer
- Mỗi vòng hiển thị avatar của người phỏng vấn
- Fallback hiển thị icon User nếu không có ảnh
- Avatar có viền gradient màu xanh-tím

### Trạng thái vòng phỏng vấn
- **Đang chờ ⏳**: Vòng hiện tại đang diễn ra (màu xanh)
- **Đạt ✅**: Vòng đã hoàn thành thành công (màu xanh lá)
- **Không đạt ❌**: Vòng bị loại (màu đỏ)
- **Chờ xử lý**: Vòng chưa bắt đầu (màu xám)

### Hiệu ứng Visual
- Vòng hiện tại có viền xanh và scale 105%
- Hover effect với shadow
- Transition mượt mà giữa các trạng thái
- Mũi tên chỉ hướng luồng phỏng vấn

## ⚙️ Cấu hình Admin

### Quản lý vòng phỏng vấn
Admin có thể:
- **Thêm vòng mới**: Tên, người phỏng vấn, thời gian, mô tả
- **Sửa vòng hiện có**: Cập nhật thông tin chi tiết
- **Xóa vòng**: Loại bỏ vòng không cần thiết
- **Sắp xếp thứ tự**: Di chuyển vòng lên/xuống
- **Đánh dấu bắt buộc**: Vòng bắt buộc hay tùy chọn

### Thống kê
- Tổng số vòng phỏng vấn
- Số vòng bắt buộc
- Tổng thời gian (phút/giờ)
- Phân tích chi tiết

## 🔄 Luồng hoạt động

### 1. Khởi tạo
- Hệ thống tự động phân tích số lượng vòng
- Chọn layout phù hợp (cơ bản hoặc kim tự tháp)
- Sắp xếp vòng theo thứ tự logic

### 2. Hiển thị
- Render tam giác với vị trí chính xác
- Hiển thị avatar và thông tin interviewer
- Áp dụng màu sắc và trạng thái phù hợp

### 3. Tương tác
- Admin có thể Pass/Fail vòng hiện tại
- Cập nhật trạng thái real-time
- Thông báo kết quả cho người dùng

## 🎯 Tính năng nổi bật

### Tự động co giãn
- **≤4 vòng**: Tam giác cơ bản gọn gàng
- **>4 vòng**: Kim tự tháp phân tầng rõ ràng
- **Responsive**: Tự động điều chỉnh trên mobile

### Trực quan cao
- Luồng phỏng vấn rõ ràng từ đáy lên đỉnh
- Mũi tên chỉ hướng tiến trình
- Màu sắc phân biệt trạng thái dễ dàng

### Quản lý linh hoạt
- Cấu hình vòng phỏng vấn linh hoạt
- Thêm/sửa/xóa vòng dễ dàng
- Sắp xếp thứ tự trực quan

## 📱 Responsive Design

### Desktop
- Tam giác đầy đủ với tất cả chi tiết
- Hover effects và animations
- Grid layout tối ưu

### Mobile
- Thu gọn layout phù hợp màn hình nhỏ
- Touch-friendly interactions
- Vẫn giữ được tính trực quan

## 🔧 Technical Implementation

### Components
- `InterviewTriangle`: Component chính hiển thị tam giác
- `InterviewConfig`: Component cấu hình cho admin
- `InterviewProgress`: Wrapper component tích hợp

### Algorithms
- `getBasicTriangleLayout()`: Layout tam giác cơ bản
- `getPyramidLayout()`: Layout kim tự tháp phân tầng
- `getTriangleLayout()`: Auto-select layout phù hợp

### Styling
- CSS Grid cho layout chính xác
- Tailwind CSS cho styling responsive
- Framer Motion cho animations (có thể thêm)

## 🚀 Sử dụng

### Cho Admin
1. Vào tab "Cấu hình" để thiết lập vòng phỏng vấn
2. Thêm/sửa/xóa vòng theo nhu cầu
3. Lưu cấu hình để áp dụng

### Cho HR
1. Chọn ứng viên từ danh sách bên trái
2. Xem tiến trình phỏng vấn với tam giác trực quan
3. Sử dụng nút Pass/Fail để cập nhật trạng thái

### Cho Manager
1. Theo dõi tiến trình tổng thể
2. Xem thống kê chi tiết
3. Đánh giá hiệu quả quy trình tuyển dụng

## 🎉 Kết luận

Hệ thống tam giác phỏng vấn thông minh mang lại:
- **Trực quan cao**: Dễ hiểu và theo dõi
- **Linh hoạt**: Tự động điều chỉnh theo số lượng vòng
- **Quản lý dễ dàng**: Cấu hình và điều khiển đơn giản
- **Responsive**: Hoạt động tốt trên mọi thiết bị

Đây là giải pháp hoàn chỉnh cho việc quản lý và hiển thị tiến trình phỏng vấn trong hệ thống HR Management.





