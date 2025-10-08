# HR Recruitment System - Bản Thiết Kế Hoàn Chỉnh V3

## PHÂN TÍCH VẤN ĐỀ HIỆN TẠI

### ❌ **Vấn Đề Đã Phát Hiện:**

1. **Roles & Permissions:**
   - Thiếu vai trò "Interviewer" chuyên biệt
   - Chồng chéo giữa HR Manager và Talent Acquisition Manager
   - Không có vai trò "Recruitment Admin" cho quản trị hệ thống
   - Thiếu vai trò "Legal Counsel" cho hợp đồng

2. **Workflow:**
   - Quá nhiều bước (11 bước) gây phức tạp
   - Thiếu bước "Pre-screening" quan trọng
   - Không có bước "Talent Pool" cho ứng viên tiềm năng
   - Thiếu xử lý "On Hold" status

3. **Quy Tắc:**
   - SLA không thực tế (2h cho CV processing)
   - Thiếu quy tắc xử lý "Counter Offer"
   - Không có quy tắc "Re-application" sau khi từ chối

4. **Escalation:**
   - Thiếu escalation cho "Budget Approval"
   - Không có escalation cho "Legal Issues"
   - Thiếu xử lý "System Downtime"

---

## 1. ROLES & PERMISSIONS - PHIÊN BẢN TỐI ƯU

### **Cấp Điều Hành (Executive Level)**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Backup Role | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|-------------|
| **CEO** | C-Suite | • Quyết định chiến lược<br>• Phê duyệt ngân sách lớn<br>• Quyết định C-level | • Xem tất cả dữ liệu<br>• Override mọi quyết định<br>• Truy cập tài chính | • Không sửa hệ thống<br>• Không xóa audit logs | COO | HĐQT |
| **CHRO** | C-Suite | • Chiến lược HR toàn công ty<br>• Quyết định chính sách<br>• Quản lý rủi ro pháp lý | • Truy cập toàn bộ HR<br>• Phê duyệt chính sách<br>• Quản lý compliance | • Không truy cập technical<br>• Không sửa hệ thống | VP HR | CEO |

### **Cấp Quản Lý Cao (Senior Management)**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Backup Role | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|-------------|
| **VP Human Resources** | Senior Mgmt | • Quản lý HR operations<br>• Phê duyệt ngân sách HR<br>• Quyết định tuyển dụng cao cấp | • Phê duyệt ngân sách HR<br>• Quản lý HR team<br>• Truy cập dữ liệu HR | • Không truy cập technical<br>• Không sửa hệ thống | HR Director | CHRO |
| **HR Director** | Senior Mgmt | • Chiến lược tuyển dụng<br>• Quyết định tuyển dụng cuối cùng<br>• Quản lý team recruitment | • Phê duyệt tất cả hires<br>• Truy cập recruitment data<br>• Quản lý recruitment team | • Không truy cập technical<br>• Không sửa hệ thống | Senior HR Manager | VP HR |
| **Department Head** | Senior Mgmt | • Nhu cầu tuyển dụng phòng ban<br>• Yêu cầu kỹ thuật<br>• Phê duyệt ngân sách phòng ban | • Phê duyệt phòng ban<br>• Đặt tiêu chí kỹ thuật<br>• Truy cập dữ liệu phòng ban | • Không truy cập phòng ban khác<br>• Không sửa quy trình HR | Deputy Head | CEO |

### **Cấp Quản Lý (Management Level)**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Backup Role | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|-------------|
| **Senior HR Manager** | Management | • Quản lý chiến dịch tuyển dụng<br>• Phối hợp team<br>• Giám sát quy trình | • Quản lý recruiters<br>• Phê duyệt lịch phỏng vấn<br>• Truy cập candidate data | • Không truy cập salary data<br>• Không override director | HR Manager | HR Director |
| **Talent Acquisition Manager** | Management | • Chiến lược sourcing<br>• Quản lý sourcing team<br>• Phân tích thị trường talent | • Quản lý sourcing team<br>• Truy cập candidate database<br>• Tạo báo cáo analytics | • Không quyết định cuối<br>• Không truy cập salary | Senior Recruiter | HR Director |
| **Recruitment Admin** | Management | • Quản trị hệ thống recruitment<br>• Cấu hình workflow<br>• Quản lý permissions | • Cấu hình hệ thống<br>• Quản lý user accounts<br>• Truy cập system logs | • Không quyết định tuyển<br>• Không truy cập candidate data | IT Admin | HR Director |

### **Cấp Thực Thi (Operational Level)**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Backup Role | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|-------------|
| **Senior Recruiter** | Senior | • Vị trí phức tạp/senior<br>• Hướng dẫn junior recruiters<br>• Đảm bảo chất lượng | • Toàn bộ recruitment workflow<br>• Lên lịch tất cả interviews<br>• Đưa ra recommendations | • Không phê duyệt cuối<br>• Không truy cập salary | Recruiter | Senior HR Manager |
| **Recruiter** | Operational | • Tìm kiếm và sourcing<br>• Sàng lọc ban đầu<br>• Phối hợp phỏng vấn | • Source candidates<br>• Lên lịch initial interviews<br>• Cập nhật candidate status | • Không lên lịch final interviews<br>• Không quyết định tuyển | Senior Recruiter | Senior HR Manager |
| **Technical Lead** | Senior | • Đánh giá kỹ thuật<br>• Hướng dẫn technical team<br>• Thiết lập tiêu chuẩn kỹ thuật | • Conduct technical interviews<br>• Đánh giá technical skills<br>• Recommend technical fit | • Không truy cập HR data<br>• Không quyết định cuối | Senior Developer | Department Head |
| **Interviewer** | Operational | • Thực hiện phỏng vấn<br>• Đánh giá ứng viên<br>• Cung cấp feedback | • View assigned candidates<br>• Submit interview feedback<br>• Access interview materials | • Không modify candidate status<br>• Không access other interviews | Senior Interviewer | Team Lead |
| **Recruitment Coordinator** | Administrative | • Lên lịch phỏng vấn<br>• Hậu cần và logistics<br>• Giao tiếp với ứng viên | • Schedule interviews<br>• Send notifications<br>• Manage calendars | • Không quyết định<br>• Không truy cập sensitive data | Senior Coordinator | Senior HR Manager |

### **Vai Trò Chuyên Biệt (Specialized Roles)**

| Vai Trò | Cấp | Trách Nhiệm Chính | Quyền Hạn | Hạn Chế | Backup Role | Báo Cáo Cho |
|---------|-----|-------------------|-----------|---------|-------------|-------------|
| **Legal Counsel** | Specialized | • Tư vấn pháp lý<br>• Xem xét hợp đồng<br>• Quản lý rủi ro pháp lý | • Review contracts<br>• Access legal documents<br>• Provide legal advice | • Không quyết định tuyển<br>• Chỉ đọc dữ liệu | External Legal | CHRO |
| **Compliance Officer** | Specialized | • Tuân thủ pháp luật<br>• Kiểm toán quy trình<br>• Quản lý rủi ro compliance | • Audit all processes<br>• Access compliance data<br>• Ensure legal compliance | • Không quyết định tuyển<br>• Chỉ đọc dữ liệu | Senior Compliance | CHRO |
| **Background Check Specialist** | Specialized | • Xác minh thông tin<br>• Kiểm tra lý lịch<br>• Reference checking | • Access verification data<br>• Conduct background checks<br>• Update verification status | • Không truy cập salary<br>• Không quyết định tuyển | Senior Specialist | Senior HR Manager |
| **Onboarding Specialist** | Operational | • Tích hợp nhân viên mới<br>• Phối hợp phòng ban<br>• Theo dõi tiến độ onboarding | • Manage onboarding process<br>• Coordinate with departments<br>• Track onboarding progress | • Không truy cập recruitment data<br>• Không modify hire decisions | Senior Onboarding | Senior HR Manager |

---

## 2. RECRUITMENT WORKFLOW - PHIÊN BẢN TỐI ƯU

### **Giai Đoạn 1: Application & Initial Processing (1-2 ngày)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CV RECEIPT & PARSING                         │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: System + Recruitment Coordinator                   │
│ Conditions: Valid CV format, required fields completed         │
│ SLA: 4 hours                                                    │
│ Actions: Auto-parse CV, create candidate profile, assign ID    │
│ Notifications: Email to Recruiter, SMS to Candidate            │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ Move to     │    │ Auto-reject │                             │
│ │ Pre-screen  │    │ + Email     │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRE-SCREENING                               │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: Recruiter                                          │
│ Conditions: CV parsed successfully, basic requirements met     │
│ SLA: 24 hours                                                   │
│ Duration: 15-30 minutes                                         │
│ Scoring: 1-10 scale (minimum 6 required)                       │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ (Score ≥6)  │    │ (Score <6)  │                             │
│ │ Move to     │    │ Move to     │                             │
│ │ HR Screen   │    │ Talent Pool │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HR SCREENING                                 │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: HR Manager / Senior Recruiter                      │
│ Conditions: Pre-screening passed, cultural fit check            │
│ SLA: 48 hours                                                   │
│ Duration: 30-45 minutes                                         │
│ Scoring: 1-10 scale (minimum 7 required)                       │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ (Score ≥7)  │    │ (Score <7)  │                             │
│ │ Move to     │    │ Move to     │                             │
│ │ Phone Screen│    │ Talent Pool │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### **Giai Đoạn 2: Interview Process (1-2 tuần)**

```
┌─────────────────────────────────────────────────────────────────┐
│                 PHONE/VIDEO SCREENING                           │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: Recruiter                                          │
│ Conditions: HR screening passed, candidate available           │
│ SLA: 72 hours                                                   │
│ Duration: 30-45 minutes                                         │
│ Scoring: 1-10 scale (minimum 6 required)                       │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ (Score ≥6)  │    │ (Score <6)  │                             │
│ │ Move to     │    │ Move to     │                             │
│ │ Technical   │    │ Talent Pool │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 TECHNICAL ASSESSMENT                            │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: Technical Lead                                     │
│ Conditions: Phone screening passed, technical requirements met  │
│ SLA: 5 business days                                            │
│ Duration: 60-90 minutes                                         │
│ Scoring: 1-10 scale (minimum 7 required)                       │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ (Score ≥7)  │    │ (Score <7)  │                             │
│ │ Move to     │    │ Move to     │                             │
│ │ Technical   │    │ Talent Pool │                             │
│ │ Interview   │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 TECHNICAL INTERVIEW                             │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: Senior Developer / Technical Lead                  │
│ Conditions: Technical assessment passed                         │
│ SLA: 7 business days                                            │
│ Duration: 60-90 minutes                                         │
│ Scoring: 1-10 scale (minimum 7 required)                       │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ (Score ≥7)  │    │ (Score <7)  │                             │
│ │ Move to     │    │ Move to     │                             │
│ │ Manager     │    │ Talent Pool │                             │
│ │ Interview   │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 MANAGER INTERVIEW                               │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: Team Manager / Department Head                     │
│ Conditions: Technical interview passed                          │
│ SLA: 7 business days                                            │
│ Duration: 45-60 minutes                                         │
│ Scoring: 1-10 scale (minimum 7 required)                       │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ (Score ≥7)  │    │ (Score <7)  │                             │
│ │ Move to     │    │ Move to     │                             │
│ │ Final       │    │ Talent Pool │                             │
│ │ Interview   │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 FINAL INTERVIEW                                 │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: HR Director / Department Head                      │
│ Conditions: Manager interview passed                            │
│ SLA: 7 business days                                            │
│ Duration: 30-45 minutes                                         │
│ Scoring: 1-10 scale (minimum 7 required)                       │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ (Score ≥7)  │    │ (Score <7)  │                             │
│ │ Move to     │    │ Move to     │                             │
│ │ Background  │    │ Talent Pool │                             │
│ │ Check       │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### **Giai Đoạn 3: Verification & Decision (1-2 tuần)**

```
┌─────────────────────────────────────────────────────────────────┐
│                 BACKGROUND CHECK                                │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: Background Check Specialist                        │
│ Conditions: Final interview passed                              │
│ SLA: 10 business days                                           │
│ Duration: 5-10 business days                                    │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ Move to     │    │ Reject +    │                             │
│ │ Reference   │    │ Email       │                             │
│ │ Check       │    │             │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 REFERENCE CHECK                                 │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: HR Manager                                         │
│ Conditions: Background check passed                             │
│ SLA: 5 business days                                            │
│ Duration: 2-3 business days                                     │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │    PASS     │    │    FAIL     │                             │
│ │ Move to     │    │ Reject +    │                             │
│ │ Offer Prep  │    │ Email       │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 OFFER PREPARATION                               │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: HR Manager + HR Director                           │
│ Conditions: Reference check passed                              │
│ SLA: 3 business days                                            │
│ Duration: 1-2 business days                                     │
│ Actions: Prepare offer letter, salary negotiation, benefits     │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 OFFER APPROVAL                                  │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: HR Director + Department Head                      │
│ Conditions: Offer prepared within budget                        │
│ SLA: 2 business days                                            │
│ Duration: 1 business day                                        │
│ ┌─────────────┐    ┌─────────────┐                             │
│ │  APPROVE    │    │   REJECT    │                             │
│ │ Move to     │    │ Modify      │                             │
│ │ Offer Sent  │    │ Offer       │                             │
│ └─────────────┘    └─────────────┘                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 OFFER SENT                                      │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: HR Manager                                         │
│ Conditions: Offer approved                                       │
│ SLA: 1 business day                                             │
│ Duration: 1 business day                                        │
│ ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│ │   ACCEPT    │    │   REJECT    │    │ COUNTER-OFFER│         │
│ │ Move to     │    │ End Process │    │ Move to     │         │
│ │ Onboarding  │    │ + Feedback  │    │ Negotiation │         │
│ └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ONBOARDING                                      │
├─────────────────────────────────────────────────────────────────┤
│ Responsible: Onboarding Specialist + HR Team                    │
│ Conditions: Offer accepted                                       │
│ SLA: 2 weeks                                                    │
│ Duration: 1-2 weeks                                             │
│ Actions: Prepare workspace, accounts, welcome package           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. QUY TẮC & ĐIỀU KIỆN - PHIÊN BẢN TỐI ƯU

### **Quy Tắc Lên Lịch Phỏng Vấn**

| Điều Kiện | Quy Tắc | Người Chịu Trách Nhiệm | SLA | Thông Báo | Escalation |
|-----------|---------|------------------------|-----|-----------|------------|
| **Cùng Ngày Liên Tiếp** | Không cần email, chỉ thông báo hệ thống | Hệ thống | Ngay lập tức | Thông báo nội bộ | - |
| **Khác Ngày** | Gửi email 48-72 giờ trước | Recruitment Coordinator | 48-72h | Email + SMS | Recruitment Admin |
| **Dời Lịch** | Cho phép tối đa 2 lần dời lịch | Recruiter | 24h | Email xác nhận | Senior Recruiter |
| **No-show (Lần 1)** | Tự động dời lịch | Recruiter | 24h | Email nhắc nhở | Senior Recruiter |
| **No-show (Lần 2)** | Tự động từ chối ứng viên | Hệ thống | Ngay lập tức | Email từ chối | HR Manager |
| **Phỏng Vấn Khẩn Cấp** | Cùng ngày được phép với phê duyệt | HR Manager | 4h | Thông báo ngay lập tức | HR Director |
| **Remote Interview** | Hỗ trợ múi giờ, công nghệ | Recruitment Coordinator | 24h | Email + Calendar invite | IT Support |

### **Quy Tắc Ra Quyết Định**

| Loại Quyết Định | Thẩm Quyền | Cần Phê Duyệt | Escalation Path | SLA | Backup Authority |
|------------------|------------|---------------|-----------------|-----|------------------|
| **Pre-screening Pass/Fail** | Recruiter | Không | Senior Recruiter | 24h | Senior Recruiter |
| **HR Screening Pass/Fail** | HR Manager | Không | HR Director | 24h | Senior HR Manager |
| **Technical Pass/Fail** | Technical Lead | Không | Tech Manager | 24h | Senior Developer |
| **Cultural Fit** | HR Manager | Không | HR Director | 24h | Senior HR Manager |
| **Final Hiring Decision** | HR Director | Department Head | CEO | 48h | VP HR |
| **Salary Negotiation** | HR Director | Department Head | CEO | 48h | VP HR |
| **Counter Offer** | HR Director | Department Head | CEO | 72h | VP HR |
| **Rejection (Early)** | Recruiter | Không | HR Manager | 24h | Senior Recruiter |
| **Rejection (After Tech)** | Technical Lead | HR Manager | HR Director | 24h | Tech Manager |
| **Rejection (After Manager)** | HR Manager | HR Director | VP HR | 24h | Senior HR Manager |
| **On Hold Decision** | HR Manager | HR Director | VP HR | 24h | Senior HR Manager |

### **Hệ Thống Điểm Số**

| Giai Đoạn | Điểm Tối Thiểu | Điểm Tối Đa | Trọng Số | Người Đánh Giá | Backup Evaluator |
|-----------|----------------|-------------|----------|----------------|------------------|
| **Pre-screening** | 6/10 | 10/10 | 15% | Recruiter | Senior Recruiter |
| **HR Screening** | 7/10 | 10/10 | 20% | HR Manager | Senior HR Manager |
| **Phone Screening** | 6/10 | 10/10 | 10% | Recruiter | Senior Recruiter |
| **Technical Assessment** | 7/10 | 10/10 | 25% | Technical Lead | Senior Developer |
| **Technical Interview** | 7/10 | 10/10 | 20% | Senior Developer | Technical Lead |
| **Manager Interview** | 7/10 | 10/10 | 10% | Team Manager | Department Head |

### **Quy Tắc Xử Lý Đặc Biệt**

| Tình Huống | Quy Tắc | Người Chịu Trách Nhiệm | SLA | Escalation |
|------------|---------|------------------------|-----|------------|
| **Re-application** | Cho phép sau 6 tháng | HR Manager | 24h | HR Director |
| **Internal Transfer** | Ưu tiên nội bộ | HR Manager | 48h | HR Director |
| **Counter Offer** | Tối đa 2 lần đàm phán | HR Director | 72h | VP HR |
| **On Hold** | Tối đa 30 ngày | HR Manager | 24h | HR Director |
| **Talent Pool** | Tự động follow-up sau 3 tháng | Recruiter | 24h | Senior Recruiter |

---

## 4. WORKFLOW VARIATIONS - PHIÊN BẢN TỐI ƯU

### **Fast Track (Urgent Positions)**
```
CV → Pre-screening → Phone Screening → Technical Interview → Manager Interview → Offer
Duration: 3-5 business days
Skip: HR Screening, Technical Assessment, Final Interview, Background Check
Authority: HR Director can approve fast track
SLA: 3-5 days
Special: Requires urgent hiring justification
```

### **Executive Level (Director+)**
```
CV → HR Director Screening → Board Interview → Reference Check → Offer
Duration: 2-3 weeks
Skip: Technical rounds, Manager interview, Background Check
Authority: CEO approval required
SLA: 2-3 weeks
Special: Board interview mandatory
```

### **Intern/Entry Level**
```
CV → Pre-screening → Team Lead Interview → Offer
Duration: 1-2 weeks
Skip: Technical Assessment, Manager Interview, Final Interview, Background Check
Authority: HR Manager can approve
SLA: 1-2 weeks
Special: Mentorship program included
```

### **Internal Transfer**
```
Application → Current Manager Approval → New Manager Interview → HR Approval → Transfer
Duration: 1 week
Skip: Pre-screening, technical assessment, background check
Authority: Both managers + HR Director
SLA: 1 week
Special: Performance review required
```

### **Contract vs Full-time**
```
Contract: Same process, different offer template, legal review required
Full-time: Standard process
Authority: Same approval levels
Special: Contract requires Legal Counsel review
SLA: Same as standard process
```

### **Remote Positions**
```
Standard process + Remote work assessment + Time zone considerations
Duration: Same as standard
Special: Remote work compatibility check
Authority: Same as standard
SLA: Same as standard
```

### **Bulk Hiring (5+ positions)**
```
CV → Pre-screening → Group Assessment → Individual Interviews → Batch Offer
Duration: 2-3 weeks
Special: Group assessment round
Authority: HR Director + Department Head
SLA: 2-3 weeks
```

---

## 5. NOTIFICATIONS & COMMUNICATIONS - PHIÊN BẢN TỐI ƯU

### **Email Triggers**

| Sự Kiện | Người Nhận | Thời Gian | Template | SLA | Escalation |
|---------|------------|-----------|----------|-----|------------|
| **CV Received** | Recruiter, HR Manager | Ngay lập tức | Auto-generated | 2h | Recruitment Admin |
| **Pre-screening Scheduled** | Candidate, Recruiter | 48-72h trước | Personalized | 48-72h | Recruitment Coordinator |
| **Interview Scheduled** | Candidate, Interviewer | 48-72h trước | Personalized | 48-72h | Recruitment Coordinator |
| **Interview Completed** | Next Interviewer, HR | Ngay lập tức | System notification | Ngay lập tức | Recruitment Admin |
| **Decision Made** | Candidate, HR Team | Trong vòng 24h | Personalized | 24h | HR Manager |
| **Offer Sent** | Candidate, HR Director | Ngay lập tức | Legal template | Ngay lập tức | Legal Counsel |
| **Counter Offer** | Candidate, HR Director | Ngay lập tức | Negotiation template | Ngay lập tức | VP HR |
| **Rejection** | Candidate | Trong vòng 48h | Personalized | 48h | HR Manager |
| **On Hold** | Candidate, HR Team | Ngay lập tức | Status update | Ngay lập tức | HR Manager |
| **Talent Pool** | Candidate | 3 tháng sau | Follow-up | 24h | Recruiter |

### **Không Gửi Email**

| Tình Huống | Lý Do | Thay Thế | Escalation |
|------------|-------|----------|------------|
| **Phỏng vấn liên tiếp** | Cùng ngày, không cần di chuyển | Thông báo hệ thống | - |
| **Cập nhật trạng thái nội bộ** | Giao tiếp team | Slack/Teams | Team Lead |
| **Quy trình hệ thống** | Workflow tự động | Dashboard alerts | IT Support |
| **Thay đổi khẩn cấp** | Tình huống khẩn cấp | Gọi điện thoại | HR Manager |
| **System maintenance** | Bảo trì hệ thống | System notification | IT Support |

### **SMS Triggers**

| Sự Kiện | Người Nhận | Thời Gian | Nội Dung | SLA |
|---------|------------|-----------|----------|-----|
| **Interview Reminder** | Candidate | 2h trước | "Interview reminder" | 2h |
| **Interview Rescheduled** | Candidate | Ngay lập tức | "Interview rescheduled" | Ngay lập tức |
| **Decision Ready** | Candidate | Ngay lập tức | "Decision ready, check email" | Ngay lập tức |
| **Offer Sent** | Candidate | Ngay lập tức | "Offer sent, check email" | Ngay lập tức |

---

## 6. ESCALATION MATRIX - PHIÊN BẢN TỐI ƯU

| Loại Vấn Đề | Cấp 1 | Cấp 2 | Cấp 3 | Thẩm Quyền Cuối | SLA | Backup |
|--------------|-------|-------|-------|-----------------|-----|--------|
| **Technical Disagreement** | Technical Lead | Tech Manager | CTO | CTO | 24h | Senior Developer |
| **Cultural Fit Issues** | HR Manager | HR Director | VP HR | VP HR | 24h | Senior HR Manager |
| **Salary Negotiation** | HR Manager | HR Director | VP HR | VP HR | 48h | Senior HR Manager |
| **Process Violation** | HR Manager | HR Director | VP HR | VP HR | 24h | Senior HR Manager |
| **System Issues** | IT Support | IT Manager | CTO | CTO | 4h | IT Admin |
| **Candidate Complaints** | Recruiter | HR Manager | HR Director | HR Director | 24h | Senior Recruiter |
| **Interviewer Conflicts** | HR Manager | HR Director | VP HR | VP HR | 24h | Senior HR Manager |
| **Budget Approval** | HR Manager | HR Director | VP HR | CEO | 48h | Senior HR Manager |
| **Legal Issues** | Legal Counsel | VP HR | CHRO | CHRO | 24h | External Legal |
| **Compliance Issues** | Compliance Officer | HR Director | VP HR | CHRO | 24h | Senior Compliance |
| **System Downtime** | IT Support | IT Manager | CTO | CTO | 2h | IT Admin |
| **Data Security** | IT Support | IT Manager | CTO | CTO | 1h | IT Admin |

---

## 7. GAPS & CONFLICT RESOLUTION - PHIÊN BẢN TỐI ƯU

### **Khoảng Trống Đã Xác Định & Giải Pháp**

| Khoảng Trống | Tác Động | Giải Pháp | Ưu Tiên | Triển Khai | Owner |
|---------------|----------|-----------|---------|------------|-------|
| **HR Manager Absence** | Process delays | Senior HR Manager backup with Director approval | Cao | Backup role assignment | HR Director |
| **Technical Lead Absence** | Technical evaluation delays | Senior Developer backup with Manager approval | Cao | Backup role assignment | Department Head |
| **System Downtime** | Process halt | Manual process + offline mode | Cao | Disaster recovery plan | IT Manager |
| **Emergency Hiring** | Standard process too slow | Fast track workflow | Cao | Automated fast track approval | HR Director |
| **Remote Candidates** | Time zone issues | Flexible scheduling system | Trung bình | Time zone support | Recruitment Admin |
| **Internal vs External** | Different processes needed | Separate workflows | Trung bình | Workflow differentiation | HR Director |
| **Contract vs Full-time** | Different approval levels | Clear process differentiation | Thấp | Process documentation | Legal Counsel |
| **Interviewer Training** | Inconsistent evaluations | Mandatory training program | Cao | Training module | HR Director |
| **Data Security Breach** | Compliance violation | Incident response plan | Cao | Security protocols | IT Manager |
| **Budget Overrun** | Process halt | Budget approval workflow | Cao | Financial controls | VP HR |
| **Legal Compliance** | Risk exposure | Compliance monitoring | Cao | Legal review process | Legal Counsel |
| **Talent Pool Management** | Lost opportunities | Automated follow-up system | Trung bình | CRM integration | Recruiter |

### **Quản Lý Vai Trò Dự Phòng**

| Vai Trò Chính | Vai Trò Dự Phòng | Cần Phê Duyệt | Escalation | SLA |
|----------------|------------------|---------------|------------|-----|
| **HR Manager** | Senior HR Manager | HR Director | HR Director | 24h |
| **Technical Lead** | Senior Developer | Department Head | Department Head | 24h |
| **Recruiter** | Senior Recruiter | HR Manager | HR Manager | 24h |
| **HR Director** | VP HR | CHRO | CHRO | 48h |
| **Recruitment Coordinator** | Senior Coordinator | HR Manager | HR Manager | 24h |
| **Interviewer** | Senior Interviewer | Team Lead | Team Lead | 24h |
| **Background Check Specialist** | Senior Specialist | HR Manager | HR Manager | 24h |
| **Onboarding Specialist** | Senior Onboarding | HR Manager | HR Manager | 24h |

### **Xử Lý Xung Đột**

| Loại Xung Đột | Quy Trình Xử Lý | Người Chịu Trách Nhiệm | SLA | Escalation |
|----------------|-----------------|------------------------|-----|------------|
| **Role Overlap** | Clear role definition | HR Director | 24h | VP HR |
| **Process Confusion** | Process documentation | Recruitment Admin | 24h | HR Director |
| **Authority Dispute** | Escalation matrix | HR Director | 24h | VP HR |
| **Resource Conflict** | Resource allocation | HR Manager | 24h | HR Director |
| **Timeline Dispute** | SLA enforcement | HR Manager | 24h | HR Director |
| **Quality Issues** | Quality assurance | Senior HR Manager | 24h | HR Director |

---

## 8. KHUYẾN NGHỊ CUỐI CÙNG

### **Ưu Tiên Triển Khai Hệ Thống**

1. **Giai Đoạn 1 (Ngay Lập Tức - 1 tháng)**
   - Triển khai kiểm soát truy cập dựa trên vai trò
   - Thiết lập động cơ workflow tự động
   - Cấu hình hệ thống thông báo
   - Thiết lập backup roles

2. **Giai Đoạn 2 (Ngắn Hạn - 3 tháng)**
   - Triển khai hệ thống điểm số
   - Triển khai ma trận escalation
   - Thiết lập quản lý vai trò dự phòng
   - Triển khai talent pool management

3. **Giai Đoạn 3 (Trung Hạn - 6 tháng)**
   - Phân tích và báo cáo nâng cao
   - Khớp ứng viên được hỗ trợ AI
   - Tích hợp hệ thống compliance
   - Triển khai mobile app

4. **Giai Đoạn 4 (Dài Hạn - 12 tháng)**
   - Mô hình tuyển dụng dự đoán
   - Tích hợp AI interview analysis
   - Advanced analytics dashboard
   - Global talent acquisition

### **Chỉ Số Thành Công Chính (KPIs)**

| Chỉ Số | Mục Tiêu | Cách Đo | Owner |
|--------|----------|---------|-------|
| **Time to Hire** | Giảm 40% | Từ CV đến offer | HR Director |
| **Quality of Hire** | Cải thiện 30% | Retention rate 12 tháng | HR Director |
| **Candidate Experience** | 95% satisfaction | Survey sau mỗi interview | HR Manager |
| **Process Efficiency** | 98% SLA compliance | Dashboard monitoring | Recruitment Admin |
| **Cost per Hire** | Giảm 25% | Total cost / successful hire | VP HR |
| **Interviewer Satisfaction** | 90% satisfaction | Survey hàng quý | HR Manager |
| **System Uptime** | 99.9% | IT monitoring | IT Manager |
| **Compliance Rate** | 100% | Audit results | Compliance Officer |

### **Rủi Ro & Giảm Thiểu**

| Rủi Ro | Tác Động | Xác Suất | Giảm Thiểu | Owner |
|--------|----------|----------|------------|-------|
| **System Downtime** | Cao | Trung bình | Disaster recovery plan | IT Manager |
| **Data Breach** | Rất cao | Thấp | Security protocols | IT Manager |
| **Compliance Violation** | Cao | Thấp | Regular audits | Compliance Officer |
| **Key Person Dependency** | Trung bình | Trung bình | Backup roles | HR Director |
| **Budget Overrun** | Trung bình | Trung bình | Financial controls | VP HR |
| **Process Bottleneck** | Trung bình | Cao | Process optimization | HR Director |

### **Tài Liệu Cần Thiết**

1. **User Manual** - Hướng dẫn sử dụng cho từng vai trò
2. **Process Documentation** - Tài liệu quy trình chi tiết
3. **Training Materials** - Tài liệu đào tạo cho interviewers
4. **Compliance Guide** - Hướng dẫn tuân thủ pháp luật
5. **Escalation Procedures** - Quy trình escalation
6. **Backup Procedures** - Quy trình dự phòng
7. **Security Protocols** - Giao thức bảo mật
8. **Audit Checklist** - Danh sách kiểm tra audit

Bản thiết kế này cung cấp nền tảng toàn diện, cấp doanh nghiệp để triển khai hệ thống tuyển dụng HR chuyên nghiệp với vai trò, trách nhiệm và quy trình rõ ràng, có thể được điều chỉnh theo nhu cầu tổ chức cụ thể.





