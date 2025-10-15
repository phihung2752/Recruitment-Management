import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    
    let generatedText = ''
    
    switch (type) {
      case 'job_description':
        generatedText = generateJobDescription(data)
        break
      case 'interview_questions':
        generatedText = generateInterviewQuestions(data)
        break
      case 'rejection_email':
        generatedText = generateRejectionEmail(data)
        break
      case 'offer_email':
        generatedText = generateOfferEmail(data)
        break
      case 'interview_invitation':
        generatedText = generateInterviewInvitation(data)
        break
      default:
        throw new Error('Invalid text generation type')
    }
    
    return NextResponse.json({
      success: true,
      generatedText,
      type,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('AI Text Generation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate text' },
      { status: 500 }
    )
  }
}

function generateJobDescription(data: any) {
  return `# ${data.title}

## Company Overview
${data.company} is a leading technology company looking for a talented ${data.title} to join our dynamic team.

## Job Description
We are seeking a skilled ${data.title} with ${data.experience} years of experience to work on exciting projects. The ideal candidate will have strong expertise in ${data.skills.join(', ')}.

## Key Responsibilities
- Develop and maintain high-quality software applications
- Collaborate with cross-functional teams
- Participate in code reviews and technical discussions
- Mentor junior developers
- Contribute to architectural decisions

## Required Skills
- ${data.skills.map((skill: string) => `- ${skill}`).join('\n')}
- Strong problem-solving abilities
- Excellent communication skills
- Experience with agile methodologies

## Benefits
- Competitive salary: ${data.salary}
- Health insurance
- Flexible working hours
- Professional development opportunities
- Modern office environment

## How to Apply
Please send your CV and cover letter to ${data.email} with the subject line "Application for ${data.title}".

We look forward to hearing from you!`
}

function generateInterviewQuestions(data: any) {
  return `# Interview Questions for ${data.position}

## Technical Questions
1. Can you walk me through your experience with ${data.primarySkill}?
2. How would you approach debugging a performance issue in a web application?
3. Describe a challenging project you worked on and how you overcame obstacles.
4. What's your experience with version control and collaborative development?

## Behavioral Questions
1. Tell me about a time when you had to work with a difficult team member.
2. How do you stay updated with the latest technologies in your field?
3. Describe a situation where you had to learn a new technology quickly.
4. How do you handle tight deadlines and multiple priorities?

## Role-Specific Questions
1. What interests you most about this ${data.position} role?
2. Where do you see yourself in 5 years?
3. What questions do you have about our company and this position?

## Coding Challenge
Please prepare to discuss or demonstrate:
- A recent project you're proud of
- Your approach to code organization and best practices
- How you would implement ${data.technicalChallenge || 'a specific feature'}

## Next Steps
- Technical interview: 60 minutes
- System design discussion: 30 minutes
- Cultural fit interview: 45 minutes`
}

function generateRejectionEmail(data: any) {
  return `Subject: Thank you for your interest in the ${data.position} position

Dear ${data.candidateName},

Thank you for your interest in the ${data.position} position at ${data.company}. We were impressed by your qualifications and experience.

After careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs.

We encourage you to apply for future opportunities that match your skills and interests. We will keep your application on file and may reach out if a suitable position becomes available.

Thank you again for your time and interest in ${data.company}.

Best regards,
${data.hrName}
HR Team
${data.company}`
}

function generateOfferEmail(data: any) {
  return `Subject: Job Offer - ${data.position} at ${data.company}

Dear ${data.candidateName},

We are delighted to offer you the position of ${data.position} at ${data.company}. We were very impressed with your qualifications and believe you will be a valuable addition to our team.

## Offer Details
- Position: ${data.position}
- Start Date: ${data.startDate}
- Salary: ${data.salary}
- Benefits: Health insurance, paid time off, professional development
- Reporting to: ${data.manager}

## Next Steps
Please review the attached offer letter and employment contract. If you accept this offer, please sign and return the documents by ${data.deadline}.

We are excited about the possibility of you joining our team and look forward to your response.

If you have any questions, please don't hesitate to contact me.

Best regards,
${data.hrName}
HR Manager
${data.company}
Phone: ${data.phone}
Email: ${data.email}`
}

function generateInterviewInvitation(data: any) {
  return `Subject: Interview Invitation - ${data.position} at ${data.company}

Dear ${data.candidateName},

Thank you for your interest in the ${data.position} position at ${data.company}. We were impressed by your application and would like to invite you for an interview.

## Interview Details
- Date: ${data.date}
- Time: ${data.time}
- Duration: ${data.duration}
- Format: ${data.format} (${data.location})
- Interviewer: ${data.interviewer}

## What to Expect
- Technical discussion about your experience
- Behavioral questions
- Opportunity to ask questions about the role and company
- Brief overview of our team and projects

## Preparation
Please bring:
- Updated resume
- Portfolio or examples of your work
- Questions about the role and company

## Meeting Link
${data.meetingLink}

If you need to reschedule, please contact us at least 24 hours in advance.

We look forward to meeting you!

Best regards,
${data.hrName}
HR Team
${data.company}`
}

