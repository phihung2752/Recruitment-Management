# HR Recruitment System - Luồng Hệ Thống Tối Ưu V2

## 1. ROLES & PERMISSIONS - Phiên Bản Thực Tế

### **Cấp Điều Hành**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|
| **CEO** | C-Suite | • Quyết định cuối cùng<br>• Phê duyệt ngân sách<br>• Chiến lược tuyển dụng | • Xem tất cả dữ liệu<br>• Phê duyệt cấp C-level<br>• Truy cập ngân sách | • Không sửa hệ thống<br>• Không xóa audit logs | HĐQT |
| **CHRO** | C-Suite | • Chiến lược HR<br>• Quyết định tuyển dụng<br>• Giám sát tuân thủ | • Truy cập toàn bộ HR<br>• Phê duyệt tất cả<br>• Quản lý team HR | • Không sửa hệ thống<br>• Không truy cập technical | CEO |

### **Cấp Quản Lý Cao**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|
| **HR Director** | Senior Mgmt | • Chiến lược tuyển dụng<br>• Quyết định cuối cùng<br>• Quản lý team | • Phê duyệt tất cả<br>• Truy cập dữ liệu<br>• Ghi đè quyết định | • Không sửa hệ thống<br>• Không truy cập technical | CHRO |
| **Department Head** | Senior Mgmt | • Nhu cầu tuyển dụng<br>• Yêu cầu kỹ thuật<br>• Phê duyệt ngân sách | • Phê duyệt phòng ban<br>• Đặt tiêu chí kỹ thuật<br>• Truy cập dữ liệu phòng ban | • Không truy cập phòng ban khác<br>• Không sửa quy trình HR | CEO |

### **Cấp Quản Lý**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|
| **HR Manager** | Management | • Quản lý chiến dịch<br>• Phối hợp team<br>• Giám sát quy trình | • Quản lý recruiter<br>• Phê duyệt lịch<br>• Truy cập dữ liệu ứng viên | • Không truy cập lương<br>• Không ghi đè director | HR Director |
| **Talent Acquisition Manager** | Management | • Chiến lược sourcing<br>• Quản lý recruiter<br>• Phân tích thị trường | • Quản lý team sourcing<br>• Truy cập database<br>• Tạo báo cáo | • Không quyết định cuối<br>• Không truy cập lương | HR Director |

### **Cấp Thực Thi**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|
| **Senior Recruiter** | Senior | • Vị trí phức tạp<br>• Hướng dẫn junior<br>• Đảm bảo chất lượng | • Toàn bộ quy trình<br>• Lên lịch tất cả<br>• Đưa ra khuyến nghị | • Không phê duyệt cuối<br>• Không truy cập lương | HR Manager |
| **Recruiter** | Operational | • Tìm kiếm ứng viên<br>• Sàng lọc ban đầu<br>• Phối hợp phỏng vấn | • Tìm kiếm ứng viên<br>• Lên lịch phỏng vấn ban đầu<br>• Cập nhật trạng thái | • Không lên lịch cuối<br>• Không quyết định tuyển | Senior Recruiter |
| **Technical Lead** | Senior | • Đánh giá kỹ thuật<br>• Hướng dẫn team<br>• Tiêu chuẩn kỹ thuật | • Phỏng vấn kỹ thuật<br>• Đánh giá kỹ năng<br>• Khuyến nghị phù hợp | • Không truy cập HR<br>• Không quyết định cuối | Department Head |
| **Recruitment Coordinator** | Administrative | • Lên lịch<br>• Hậu cần<br>• Giao tiếp | • Lên lịch phỏng vấn<br>• Gửi thông báo<br>• Quản lý lịch | • Không quyết định<br>• Không truy cập dữ liệu nhạy cảm | HR Manager |

### **Vai Trò Chuyên Biệt**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|
| **Compliance Officer** | Specialized | • Tuân thủ pháp luật<br>• Kiểm toán quy trình<br>• Quản lý rủi ro | • Xem xét tất cả quy trình<br>• Kiểm toán dữ liệu<br>• Đảm bảo tuân thủ | • Không quyết định tuyển<br>• Chỉ đọc dữ liệu | CHRO |
| **Background Check Specialist** | Specialized | • Quy trình xác minh<br>• Xác thực tài liệu<br>• Kiểm tra tham chiếu | • Truy cập dữ liệu xác minh<br>• Thực hiện kiểm tra<br>• Cập nhật trạng thái | • Không truy cập lương<br>• Không quyết định tuyển | HR Manager |
| **Onboarding Specialist** | Operational | • Tích hợp nhân viên mới<br>• Phối hợp phòng ban<br>• Theo dõi tiến độ | • Quản lý quy trình onboarding<br>• Phối hợp phòng ban<br>• Theo dõi tiến độ | • Không truy cập dữ liệu tuyển<br>• Không sửa quyết định tuyển | HR Manager |

## 2. LUỒNG TUYỂN DỤNG TỐI ƯU

### **Giai Đoạn 1: Ứng Tuyển & Xử Lý Ban Đầu**

```
┌─────────────────────────────────────────────────────────────────┐
│                    NHẬN CV & PHÂN TÍCH                         │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Hệ thống + Recruitment Coordinator     │
│ Điều kiện: CV đúng định dạng, đầy đủ thông tin bắt buộc       │
│ Thời gian: 2 giờ                                                │
│ Hành động: Tự động phân tích CV, tạo hồ sơ ứng viên, gán ID   │
│ Thông báo: Email cho Recruiter, SMS cho Ứng viên              │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SÀNG LỌC CV BAN ĐẦU                         │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Recruiter                              │
│ Điều kiện: CV đáp ứng yêu cầu cơ bản, không có vấn đề         │
│ Thời gian: 24 giờ                                               │
│ Điểm số: Thang 1-10 (tối thiểu 6 điểm)                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ (≥6 điểm)   │    │ (<6 điểm)   │                             │
│ │ Chuyển HR   │    │ Tự động từ  │                             │
│ │ Screening   │    │ chối + Email│                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SÀNG LỌC HR                                 │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: HR Manager / Senior Recruiter          │
│ Điều kiện: CV đã qua sàng lọc ban đầu, kiểm tra phù hợp văn hóa│
│ Thời gian: 48 giờ                                               │
│ Điểm số: Thang 1-10 (tối thiểu 7 điểm)                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ (≥7 điểm)   │    │ (<7 điểm)   │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Phone Screen│    │ Email       │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 PHỎNG VẤN ĐIỆN THOẠI/VIDEO                     │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Recruiter                              │
│ Điều kiện: Đã qua sàng lọc HR, ứng viên có sẵn                │
│ Thời gian: 72 giờ                                               │
│ Thời lượng: 30-45 phút                                          │
│ Điểm số: Thang 1-10 (tối thiểu 6 điểm)                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ (≥6 điểm)   │    │ (<6 điểm)   │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Kỹ thuật    │    │ Email       │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### **Giai Đoạn 2: Đánh Giá Kỹ Thuật**

```
┌─────────────────────────────────────────────────────────────────┐
│                    KIỂM TRA KỸ THUẬT                           │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Technical Lead                         │
│ Điều kiện: Đã qua phỏng vấn điện thoại, đáp ứng yêu cầu kỹ thuật│
│ Thời gian: 5 ngày làm việc                                      │
│ Thời lượng: 60-90 phút                                          │
│ Điểm số: Thang 1-10 (tối thiểu 7 điểm)                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ (≥7 điểm)   │    │ (<7 điểm)   │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Phỏng vấn   │    │ Phản hồi    │                             │
│ │ Kỹ thuật    │    │ chi tiết    │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 PHỎNG VẤN KỸ THUẬT                             │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Senior Developer / Technical Lead      │
│ Điều kiện: Đã qua kiểm tra kỹ thuật                            │
│ Thời gian: 7 ngày làm việc                                      │
│ Thời lượng: 60-90 phút                                          │
│ Điểm số: Thang 1-10 (tối thiểu 7 điểm)                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ (≥7 điểm)   │    │ (<7 điểm)   │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Manager     │    │ Phản hồi    │                             │
│ │ Interview   │    │ chi tiết    │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 PHỎNG VẤN MANAGER                              │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Team Manager / Department Head         │
│ Điều kiện: Đã qua phỏng vấn kỹ thuật                           │
│ Thời gian: 7 ngày làm việc                                      │
│ Thời lượng: 45-60 phút                                          │
│ Điểm số: Thang 1-10 (tối thiểu 7 điểm)                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ (≥7 điểm)   │    │ (<7 điểm)   │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Phỏng vấn   │    │ Phản hồi    │                             │
│ │ Cuối        │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 PHỎNG VẤN CUỐI CÙNG                           │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: HR Director / Department Head          │
│ Điều kiện: Đã qua phỏng vấn manager                            │
│ Thời gian: 7 ngày làm việc                                      │
│ Thời lượng: 30-45 phút                                          │
│ Điểm số: Thang 1-10 (tối thiểu 7 điểm)                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ (≥7 điểm)   │    │ (<7 điểm)   │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Kiểm tra    │    │ Phản hồi    │                             │
│ │ Lý lịch     │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### **Giai Đoạn 3: Xác Minh & Quyết Định**

```
┌─────────────────────────────────────────────────────────────────┐
│                    KIỂM TRA LÝ LỊCH                            │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Background Check Specialist            │
│ Điều kiện: Đã qua phỏng vấn cuối cùng                          │
│ Thời gian: 10 ngày làm việc                                     │
│ Thời lượng: 5-10 ngày làm việc                                 │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Kiểm tra    │    │ Email       │                             │
│ │ Tham chiếu  │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    KIỂM TRA THAM CHIẾU                         │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: HR Manager                             │
│ Điều kiện: Đã qua kiểm tra lý lịch                             │
│ Thời gian: 5 ngày làm việc                                      │
│ Thời lượng: 2-3 ngày làm việc                                  │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    ĐẠT      │    │   KHÔNG ĐẠT │                             │
│ │ Chuyển      │    │ Từ chối +   │                             │
│ │ Chuẩn bị    │    │ Email       │                             │
│ │ Offer       │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHUẨN BỊ OFFER                              │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: HR Manager + HR Director               │
│ Điều kiện: Đã qua kiểm tra tham chiếu                          │
│ Thời gian: 3 ngày làm việc                                      │
│ Thời lượng: 1-2 ngày làm việc                                  │
│ Hành động: Chuẩn bị thư mời, đàm phán lương, phúc lợi         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHÊ DUYỆT OFFER                             │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: HR Director + Department Head          │
│ Điều kiện: Offer đã chuẩn bị trong ngân sách                   │
│ Thời gian: 2 ngày làm việc                                      │
│ Thời lượng: 1 ngày làm việc                                    │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │  PHÊ DUYỆT  │    │   TỪ CHỐI   │                             │
│ │ Chuyển      │    │ Sửa đổi     │                             │
│ │ Gửi Offer   │    │ Offer       │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GỬI OFFER                                 │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: HR Manager                             │
│ Điều kiện: Offer đã được phê duyệt                             │
│ Thời gian: 1 ngày làm việc                                      │
│ Thời lượng: 1 ngày làm việc                                    │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │   CHẤP NHẬN │    │   TỪ CHỐI   │                             │
│ │ Chuyển      │    │ Kết thúc    │                             │
│ │ Onboarding  │    │ + Phản hồi  │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ONBOARDING                                │
├─────────────────────────────────────────────────────────────────┤
│ Người chịu trách nhiệm: Onboarding Specialist + HR Team        │
│ Điều kiện: Offer đã được chấp nhận                             │
│ Thời gian: 2 tuần                                               │
│ Thời lượng: 1-2 tuần                                            │
│ Hành động: Chuẩn bị nơi làm việc, tài khoản, gói chào mừng    │
└─────────────────────────────────────────────────────────────────┘
```

## 3. QUY TẮC & ĐIỀU KIỆN

### **Quy Tắc Lên Lịch Phỏng Vấn**

| Điều Kiện | Quy Tắc | Người Chịu Trách Nhiệm | Thời Gian | Thông Báo |
|-----------|---------|------------------------|-----------|-----------|
| **Cùng Ngày Liên Tiếp** | Không cần email, chỉ thông báo hệ thống | Hệ thống | Ngay lập tức | Thông báo nội bộ |
| **Khác Ngày** | Gửi email 48-72 giờ trước | Recruitment Coordinator | 48-72h | Email + SMS |
| **Dời Lịch** | Cho phép tối đa 2 lần dời lịch | Recruiter | 24h | Email xác nhận |
| **Không Tham Gia (Lần 1)** | Tự động dời lịch | Recruiter | 24h | Email nhắc nhở |
| **Không Tham Gia (Lần 2)** | Tự động từ chối ứng viên | Hệ thống | Ngay lập tức | Email từ chối |
| **Phỏng Vấn Khẩn Cấp** | Cùng ngày được phép với phê duyệt | HR Manager | 4h | Thông báo ngay lập tức |

### **Quy Tắc Ra Quyết Định**

| Loại Quyết Định | Thẩm Quyền | Cần Phê Duyệt | Đường Dẫn Escalation | Thời Gian |
|------------------|------------|---------------|---------------------|-----------|
| **Đạt/Không Đạt Kỹ Thuật** | Technical Lead | Không | Tech Manager | 24h |
| **Phù Hợp Văn Hóa** | HR Manager | Không | HR Director | 24h |
| **Tuyển Dụng Cuối Cùng** | HR Director | Department Head | CEO | 48h |
| **Đàm Phán Lương** | HR Director | Department Head | CEO | 48h |
| **Từ Chối (Sớm)** | Recruiter | Không | HR Manager | 24h |
| **Từ Chối (Sau Kỹ Thuật)** | Technical Lead | HR Manager | HR Director | 24h |
| **Từ Chối (Sau Manager)** | HR Manager | HR Director | CEO | 24h |

### **Hệ Thống Điểm Số**

| Giai Đoạn | Điểm Tối Thiểu | Điểm Tối Đa | Trọng Số | Người Đánh Giá |
|-----------|----------------|-------------|----------|----------------|
| **Sàng Lọc CV** | 6/10 | 10/10 | 20% | Recruiter |
| **Sàng Lọc HR** | 7/10 | 10/10 | 15% | HR Manager |
| **Phỏng Vấn Điện Thoại** | 6/10 | 10/10 | 10% | Recruiter |
| **Kiểm Tra Kỹ Thuật** | 7/10 | 10/10 | 25% | Technical Lead |
| **Phỏng Vấn Kỹ Thuật** | 7/10 | 10/10 | 20% | Senior Developer |
| **Phỏng Vấn Manager** | 7/10 | 10/10 | 10% | Team Manager |

## 4. BIẾN THỂ QUY TRÌNH

### **Tuyển Dụng Nhanh (Vị Trí Khẩn Cấp)**
```
CV → Phỏng Vấn Điện Thoại → Phỏng Vấn Kỹ Thuật → Phỏng Vấn Manager → Offer
Thời gian: 3-5 ngày làm việc
Bỏ qua: Kiểm Tra Kỹ Thuật, Phỏng Vấn Cuối, Kiểm Tra Lý Lịch
Thẩm quyền: HR Director có thể phê duyệt tuyển nhanh
SLA: 3-5 ngày
```

### **Cấp Cao (Director+)**
```
CV → Sàng Lọc HR Director → Phỏng Vấn HĐQT → Kiểm Tra Tham Chiếu → Offer
Thời gian: 2-3 tuần
Bỏ qua: Vòng kỹ thuật, Phỏng vấn Manager
Thẩm quyền: Cần phê duyệt CEO
SLA: 2-3 tuần
```

### **Thực Tập Sinh/Cấp Nhập Môn**
```
CV → Sàng Lọc HR → Phỏng Vấn Team Lead → Offer
Thời gian: 1-2 tuần
Bỏ qua: Kiểm Tra Kỹ Thuật, Phỏng Vấn Manager, Phỏng Vấn Cuối
Thẩm quyền: HR Manager có thể phê duyệt
SLA: 1-2 tuần
```

### **Chuyển Nội Bộ**
```
Đơn Đăng Ký → Phê Duyệt Manager Hiện Tại → Phỏng Vấn Manager Mới → Phê Duyệt HR → Chuyển
Thời gian: 1 tuần
Bỏ qua: Sàng lọc CV, kiểm tra kỹ thuật, kiểm tra lý lịch
Thẩm quyền: Cả hai manager + HR Director
SLA: 1 tuần
```

### **Hợp Đồng vs Toàn Thời Gian**
```
Hợp Đồng: Cùng quy trình, mẫu offer khác
Toàn Thời Gian: Quy trình chuẩn
Thẩm quyền: Cùng cấp phê duyệt
Đặc biệt: Hợp đồng cần xem xét pháp lý
SLA: Cùng quy trình chuẩn
```

## 5. THÔNG BÁO & GIAO TIẾP

### **Kích Hoạt Email**

| Sự Kiện | Người Nhận | Thời Gian | Mẫu | SLA |
|---------|------------|-----------|-----|-----|
| **Nhận CV** | Recruiter, HR Manager | Ngay lập tức | Tự động | 2h |
| **Lên Lịch Phỏng Vấn** | Ứng viên, Người phỏng vấn | 48-72h trước | Cá nhân hóa | 48-72h |
| **Hoàn Thành Phỏng Vấn** | Người phỏng vấn tiếp theo, HR | Ngay lập tức | Thông báo hệ thống | Ngay lập tức |
| **Ra Quyết Định** | Ứng viên, Team HR | Trong vòng 24h | Cá nhân hóa | 24h |
| **Gửi Offer** | Ứng viên, HR Director | Ngay lập tức | Mẫu pháp lý | Ngay lập tức |
| **Từ Chối** | Ứng viên | Trong vòng 48h | Cá nhân hóa | 48h |

### **Không Gửi Email**

| Tình Huống | Lý Do | Thay Thế |
|------------|-------|----------|
| **Phỏng vấn liên tiếp** | Cùng ngày, không cần di chuyển | Thông báo hệ thống |
| **Cập nhật trạng thái nội bộ** | Giao tiếp team | Slack/Teams |
| **Quy trình hệ thống** | Workflow tự động | Cảnh báo dashboard |
| **Thay đổi khẩn cấp** | Tình huống khẩn cấp | Gọi điện thoại |

## 6. MA TRẬN ESCALATION

| Loại Vấn Đề | Cấp 1 | Cấp 2 | Cấp 3 | Thẩm Quyền Cuối | SLA |
|--------------|-------|-------|-------|-----------------|-----|
| **Bất Đồng Kỹ Thuật** | Technical Lead | Tech Manager | CTO | CTO | 24h |
| **Vấn Đề Phù Hợp Văn Hóa** | HR Manager | HR Director | CHRO | CHRO | 24h |
| **Đàm Phán Lương** | HR Manager | HR Director | CHRO | CHRO | 48h |
| **Vi Phạm Quy Trình** | HR Manager | HR Director | CHRO | CHRO | 24h |
| **Vấn Đề Hệ Thống** | IT Support | IT Manager | CTO | CTO | 4h |
| **Khiếu Nại Ứng Viên** | Recruiter | HR Manager | HR Director | HR Director | 24h |
| **Xung Đột Người Phỏng Vấn** | HR Manager | HR Director | CHRO | CHRO | 24h |

## 7. GIẢI QUYẾT KHOẢNG TRỐNG & XUNG ĐỘT

### **Khoảng Trống Đã Xác Định & Giải Pháp**

| Khoảng Trống | Tác Động | Giải Pháp | Ưu Tiên | Triển Khai |
|---------------|----------|-----------|---------|------------|
| **Vắng Mặt HR Manager** | Trì hoãn quy trình | Senior Recruiter dự phòng với phê duyệt Director | Cao | Gán vai trò dự phòng |
| **Tuyển Dụng Khẩn Cấp** | Quy trình chuẩn quá chậm | Workflow tuyển nhanh tự động | Cao | Phê duyệt tuyển nhanh tự động |
| **Ứng Viên Từ Xa** | Vấn đề múi giờ | Hệ thống lên lịch linh hoạt | Trung bình | Hỗ trợ múi giờ |
| **Nội Bộ vs Bên Ngoài** | Cần quy trình khác nhau | Workflow riêng biệt | Trung bình | Phân biệt quy trình |
| **Hợp Đồng vs Toàn Thời Gian** | Cấp phê duyệt khác nhau | Phân biệt quy trình rõ ràng | Thấp | Tài liệu quy trình |
| **Đào Tạo Người Phỏng Vấn** | Đánh giá không nhất quán | Chương trình đào tạo bắt buộc | Cao | Mô-đun đào tạo |

### **Quản Lý Vai Trò Dự Phòng**

| Vai Trò Chính | Vai Trò Dự Phòng | Cần Phê Duyệt | Escalation |
|----------------|------------------|---------------|------------|
| **HR Manager** | Senior Recruiter | HR Director | HR Director |
| **Technical Lead** | Senior Developer | Department Head | Department Head |
| **Recruiter** | Senior Recruiter | HR Manager | HR Manager |
| **HR Director** | CHRO | CEO | CEO |

## 8. KHUYẾN NGHỊ CUỐI CÙNG

### **Ưu Tiên Triển Khai Hệ Thống**

1. **Giai Đoạn 1 (Ngay Lập Tức)**
   - Triển khai kiểm soát truy cập dựa trên vai trò
   - Thiết lập động cơ workflow tự động
   - Cấu hình hệ thống thông báo

2. **Giai Đoạn 2 (Ngắn Hạn)**
   - Triển khai hệ thống điểm số
   - Triển khai ma trận escalation
   - Thiết lập quản lý vai trò dự phòng

3. **Giai Đoạn 3 (Dài Hạn)**
   - Phân tích và báo cáo nâng cao
   - Khớp ứng viên được hỗ trợ AI
   - Mô hình tuyển dụng dự đoán

### **Chỉ Số Thành Công Chính**

- **Thời Gian Tuyển Dụng**: Giảm 30%
- **Chất Lượng Tuyển Dụng**: Cải thiện 25%
- **Trải Nghiệm Ứng Viên**: Tỷ lệ hài lòng 90%
- **Hiệu Quả Quy Trình**: Tuân thủ SLA 95%
- **Chi Phí Mỗi Lần Tuyển**: Giảm 20%

Bản thiết kế đã sửa này cung cấp nền tảng toàn diện, cấp doanh nghiệp để triển khai hệ thống tuyển dụng HR chuyên nghiệp với vai trò, trách nhiệm và quy trình rõ ràng có thể được điều chỉnh theo nhu cầu tổ chức cụ thể.





