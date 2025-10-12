import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Gmail configuration
const GMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'nguyenphihung275202@gmail.com',
    pass: 'vqbv gmjq emhn ajid'
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      candidateEmail,
      candidateName,
      interviewerEmail,
      interviewerName,
      jobTitle,
      companyName,
      meetingId,
      joinUrl,
      startTime,
      duration
    } = await request.json()
    
    // Create transporter
    const transporter = nodemailer.createTransporter(GMAIL_CONFIG)
    
    // Format start time
    const meetingDate = new Date(startTime)
    const formattedDate = meetingDate.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const formattedTime = meetingDate.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
    
    // Create email content
    const emailContent = createMeetingInvitationEmail({
      candidateName,
      interviewerName,
      jobTitle,
      companyName,
      meetingId,
      joinUrl,
      formattedDate,
      formattedTime,
      duration
    })
    
    // Send email
    const info = await transporter.sendMail({
      from: `"${companyName} HR Team" <${GMAIL_CONFIG.auth.user}>`,
      to: candidateEmail,
      cc: interviewerEmail,
      subject: `Lịch phỏng vấn - ${jobTitle} tại ${companyName}`,
      html: emailContent
    })
    
    console.log('📧 Meeting invitation sent:', info.messageId)
    
    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Meeting invitation sent successfully'
    })
    
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send meeting invitation' },
      { status: 500 }
    )
  }
}

function createMeetingInvitationEmail(data: any) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lịch phỏng vấn - ${data.jobTitle}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .title {
            font-size: 28px;
            color: #2c3e50;
            margin: 0;
        }
        .content {
            margin-bottom: 30px;
        }
        .meeting-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 10px;
            align-items: center;
        }
        .detail-label {
            font-weight: bold;
            color: #495057;
            width: 120px;
            flex-shrink: 0;
        }
        .detail-value {
            color: #212529;
            flex: 1;
        }
        .zoom-button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .zoom-button:hover {
            background: #0056b3;
        }
        .instructions {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .instructions h3 {
            color: #1976d2;
            margin-top: 0;
        }
        .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .urgent {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
            }
            .detail-label {
                width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${data.companyName}</div>
            <h1 class="title">Lịch phỏng vấn</h1>
        </div>
        
        <div class="content">
            <p>Xin chào <strong>${data.candidateName}</strong>,</p>
            
            <p>Cảm ơn bạn đã quan tâm đến vị trí <strong>${data.jobTitle}</strong> tại ${data.companyName}. 
            Chúng tôi rất ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia buổi phỏng vấn.</p>
            
            <div class="meeting-details">
                <h3 style="margin-top: 0; color: #007bff;">📅 Thông tin buổi phỏng vấn</h3>
                <div class="detail-row">
                    <span class="detail-label">Vị trí:</span>
                    <span class="detail-value">${data.jobTitle}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Công ty:</span>
                    <span class="detail-value">${data.companyName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ngày:</span>
                    <span class="detail-value">${data.formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Giờ:</span>
                    <span class="detail-value">${data.formattedTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Thời lượng:</span>
                    <span class="detail-value">${data.duration} phút</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Người phỏng vấn:</span>
                    <span class="detail-value">${data.interviewerName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Hình thức:</span>
                    <span class="detail-value">Phỏng vấn trực tuyến qua Zoom</span>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.joinUrl}" class="zoom-button">
                    🎥 Tham gia phỏng vấn
                </a>
            </div>
            
            <div class="instructions">
                <h3>📋 Hướng dẫn tham gia</h3>
                <ul>
                    <li><strong>Trước buổi phỏng vấn:</strong> Kiểm tra camera, microphone và kết nối internet</li>
                    <li><strong>Thời gian:</strong> Vui lòng tham gia đúng giờ hoặc sớm hơn 5 phút</li>
                    <li><strong>Môi trường:</strong> Chọn nơi yên tĩnh, ánh sáng tốt</li>
                    <li><strong>Trang phục:</strong> Ăn mặc lịch sự, chuyên nghiệp</li>
                    <li><strong>Chuẩn bị:</strong> Mang theo CV và các tài liệu liên quan</li>
                </ul>
            </div>
            
            <div class="urgent">
                <strong>⚠️ Lưu ý quan trọng:</strong>
                <ul style="margin: 10px 0;">
                    <li>Nếu không thể tham gia, vui lòng liên hệ trước ít nhất 2 giờ</li>
                    <li>Đảm bảo thiết bị của bạn đã cài đặt Zoom</li>
                    <li>Kiểm tra email thường xuyên để nhận thông tin cập nhật</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <h4>📞 Thông tin liên hệ</h4>
                <p><strong>Người phỏng vấn:</strong> ${data.interviewerName}</p>
                <p><strong>Email:</strong> ${data.interviewerEmail}</p>
                <p><strong>ID cuộc họp:</strong> ${data.meetingId}</p>
            </div>
            
            <p>Chúng tôi rất mong được gặp bạn và tìm hiểu thêm về kinh nghiệm cũng như kỹ năng của bạn.</p>
            
            <p>Chúc bạn may mắn!</p>
            
            <p>Trân trọng,<br>
            <strong>${data.interviewerName}</strong><br>
            <strong>${data.companyName} HR Team</strong></p>
        </div>
        
        <div class="footer">
            <p>Email này được gửi tự động từ hệ thống HR Management của ${data.companyName}</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi</p>
        </div>
    </div>
</body>
</html>
  `
}

