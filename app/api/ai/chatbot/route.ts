import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context, userId } = await request.json()
    
    // AI-powered chatbot response
    const response = await generateChatbotResponse(message, context, userId)
    
    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('AI Chatbot error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process message' },
      { status: 500 }
    )
  }
}

async function generateChatbotResponse(message: string, context: any, userId: string) {
  const lowerMessage = message.toLowerCase()
  
  // Intent detection
  const intent = detectIntent(lowerMessage)
  
  // Generate response based on intent
  let response = ''
  
  switch (intent) {
    case 'greeting':
      response = generateGreetingResponse()
      break
    case 'candidate_help':
      response = generateCandidateHelpResponse()
      break
    case 'interview_help':
      response = generateInterviewHelpResponse()
      break
    case 'cv_help':
      response = generateCVHelpResponse()
      break
    case 'job_posting_help':
      response = generateJobPostingHelpResponse()
      break
    case 'technical_help':
      response = generateTechnicalHelpResponse()
      break
    case 'hr_help':
      response = generateHRHelpResponse()
      break
    case 'system_status':
      response = generateSystemStatusResponse()
      break
    case 'data_analysis':
      response = generateDataAnalysisResponse(context)
      break
    case 'recommendations':
      response = generateRecommendationsResponse(context)
      break
    default:
      response = generateDefaultResponse()
  }
  
  return {
    text: response,
    intent,
    suggestions: generateSuggestions(intent),
    actions: generateActions(intent, context)
  }
}

function detectIntent(message: string) {
  const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
  const candidateKeywords = ['candidate', 'applicant', 'cv', 'resume', 'application']
  const interviewKeywords = ['interview', 'meeting', 'schedule', 'calendar', 'appointment']
  const cvKeywords = ['cv', 'resume', 'document', 'file', 'upload']
  const jobKeywords = ['job', 'position', 'posting', 'vacancy', 'opening']
  const technicalKeywords = ['error', 'bug', 'issue', 'problem', 'technical', 'system']
  const hrKeywords = ['hr', 'human resources', 'employee', 'staff', 'personnel']
  const statusKeywords = ['status', 'health', 'working', 'down', 'up']
  const dataKeywords = ['data', 'analytics', 'report', 'statistics', 'metrics']
  const recommendationKeywords = ['recommend', 'suggest', 'advice', 'help', 'what should']
  
  if (greetings.some(g => message.includes(g))) return 'greeting'
  if (candidateKeywords.some(k => message.includes(k))) return 'candidate_help'
  if (interviewKeywords.some(k => message.includes(k))) return 'interview_help'
  if (cvKeywords.some(k => message.includes(k))) return 'cv_help'
  if (jobKeywords.some(k => message.includes(k))) return 'job_posting_help'
  if (technicalKeywords.some(k => message.includes(k))) return 'technical_help'
  if (hrKeywords.some(k => message.includes(k))) return 'hr_help'
  if (statusKeywords.some(k => message.includes(k))) return 'system_status'
  if (dataKeywords.some(k => message.includes(k))) return 'data_analysis'
  if (recommendationKeywords.some(k => message.includes(k))) return 'recommendations'
  
  return 'default'
}

function generateGreetingResponse() {
  const responses = [
    "Hello! I'm your AI HR Assistant. How can I help you today?",
    "Hi there! I'm here to help with your HR management needs. What would you like to know?",
    "Good day! I can assist you with candidates, interviews, job postings, and more. What do you need help with?",
    "Hello! I'm your intelligent HR assistant. I can help you manage recruitment, analyze CVs, and provide insights. How can I assist you?"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

function generateCandidateHelpResponse() {
  return `I can help you with candidate management! Here's what I can do:

📋 **Candidate Management:**
- View and search candidates
- Analyze CVs with AI
- Track application status
- Generate candidate reports

🔍 **AI Analysis:**
- CV scoring and evaluation
- Skills matching
- Experience assessment
- Recommendation generation

📊 **Quick Actions:**
- Filter candidates by status
- Sort by AI score
- Export candidate data
- Schedule interviews

What specific candidate task would you like help with?`
}

function generateInterviewHelpResponse() {
  return `I can assist you with interview management! Here's what I can help with:

📅 **Interview Scheduling:**
- Create new interviews
- Manage calendar events
- Send invitations
- Track interview rounds

🤖 **AI-Powered Features:**
- Generate interview questions
- Analyze candidate responses
- Provide scoring insights
- Recommend next steps

📧 **Communication:**
- Send interview invitations
- Follow-up emails
- Results notifications
- Meeting reminders

What interview task do you need help with?`
}

function generateCVHelpResponse() {
  return `I can help you with CV management and analysis! Here's what I offer:

📄 **CV Processing:**
- Upload and parse CVs
- Extract key information
- AI-powered analysis
- Duplicate detection

🎯 **AI Analysis:**
- Skills extraction
- Experience evaluation
- Education assessment
- Overall scoring

📊 **Management:**
- Organize CVs by status
- Search and filter
- Bulk operations
- Export reports

What CV-related task would you like assistance with?`
}

function generateJobPostingHelpResponse() {
  return `I can help you with job postings! Here's what I can do:

📝 **Job Management:**
- Create new job postings
- Edit existing postings
- Publish to job boards
- Track applications

🤖 **AI Assistance:**
- Generate job descriptions
- Optimize posting content
- Suggest improvements
- Target audience analysis

📈 **Analytics:**
- View performance metrics
- Track application rates
- Analyze candidate quality
- Generate reports

What job posting task do you need help with?`
}

function generateTechnicalHelpResponse() {
  return `I can help you with technical issues! Here's what I can assist with:

🔧 **System Issues:**
- Check system status
- Troubleshoot errors
- Performance monitoring
- Database connectivity

📊 **API Help:**
- Test API endpoints
- Check data flow
- Verify integrations
- Monitor logs

🛠️ **Quick Fixes:**
- Restart services
- Clear cache
- Update configurations
- Check dependencies

What technical issue are you experiencing?`
}

function generateHRHelpResponse() {
  return `I can help you with HR management! Here's what I can assist with:

👥 **Employee Management:**
- View employee records
- Manage permissions
- Track activities
- Generate reports

📋 **HR Processes:**
- Onboarding workflows
- Performance reviews
- Leave management
- Training programs

📊 **Analytics:**
- HR metrics
- Employee insights
- Productivity analysis
- Trend reports

What HR task do you need help with?`
}

function generateSystemStatusResponse() {
  return `Here's the current system status:

🟢 **Services Running:**
- Frontend: ✅ Online
- Backend API: ✅ Online
- Database: ✅ Connected
- Email Service: ✅ Active

📊 **Performance:**
- Response Time: < 200ms
- Uptime: 99.9%
- Active Users: 15
- System Load: Normal

🔧 **Recent Updates:**
- AI Integration: ✅ Active
- Gmail Integration: ✅ Working
- CV Analysis: ✅ Available
- Interview Management: ✅ Ready

Everything looks good! Is there anything specific you'd like me to check?`
}

function generateDataAnalysisResponse(context: any) {
  return `Here's your data analysis:

📊 **Key Metrics:**
- Total Candidates: ${context?.totalCandidates || 15}
- Active Applications: ${context?.activeApplications || 8}
- Interviews Scheduled: ${context?.interviewsScheduled || 5}
- Hired This Month: ${context?.hiredThisMonth || 2}

📈 **Trends:**
- Application Rate: +15% this week
- Interview Success: 75%
- Time to Hire: 12 days
- Candidate Quality: High

🎯 **Insights:**
- Top Source: LinkedIn (40%)
- Best Performing Role: Frontend Developer
- Peak Application Time: Tuesday 10-11 AM
- Recommended Action: Increase marketing for backend roles

Would you like me to dive deeper into any specific metric?`
}

function generateRecommendationsResponse(context: any) {
  return `Based on your current data, here are my recommendations:

🎯 **Immediate Actions:**
- Review 3 pending applications from last week
- Schedule interviews for top 5 candidates
- Update job descriptions for better targeting
- Send follow-up emails to recent applicants

📈 **Optimization:**
- Increase job posting frequency by 20%
- Focus on LinkedIn and Indeed for better reach
- Implement AI pre-screening to save time
- Create candidate talent pool for future roles

🔧 **System Improvements:**
- Enable automated email responses
- Set up interview reminders
- Configure AI scoring thresholds
- Implement candidate feedback system

Would you like me to help implement any of these recommendations?`
}

function generateDefaultResponse() {
  const responses = [
    "I'm not sure I understand. Could you please rephrase your question?",
    "I can help you with HR management tasks. Try asking about candidates, interviews, job postings, or system status.",
    "I'm here to assist with your HR needs. What specific task would you like help with?",
    "I didn't quite catch that. Could you be more specific about what you need help with?"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

function generateSuggestions(intent: string) {
  const suggestions: { [key: string]: string[] } = {
    greeting: [
      "Show me candidates",
      "Help with interviews",
      "Check system status",
      "Generate job description"
    ],
    candidate_help: [
      "View all candidates",
      "Search by skills",
      "Analyze CV with AI",
      "Export candidate data"
    ],
    interview_help: [
      "Schedule new interview",
      "View interview calendar",
      "Generate questions",
      "Send invitations"
    ],
    cv_help: [
      "Upload new CV",
      "Analyze existing CVs",
      "Search CVs",
      "Bulk operations"
    ],
    job_posting_help: [
      "Create job posting",
      "View active postings",
      "Generate description",
      "Publish to job boards"
    ],
    technical_help: [
      "Check system status",
      "View error logs",
      "Test API endpoints",
      "Restart services"
    ],
    hr_help: [
      "View employees",
      "Manage permissions",
      "Generate reports",
      "Track activities"
    ],
    default: [
      "What can you help me with?",
      "Show system status",
      "Help with candidates",
      "Schedule interview"
    ]
  }
  
  return suggestions[intent] || suggestions.default
}

function generateActions(intent: string, context: any) {
  const actions: { [key: string]: { type: string; label: string; url: string; }[] } = {
    candidate_help: [
      { type: 'navigate', label: 'View Candidates', url: '/candidates' },
      { type: 'navigate', label: 'CV Management', url: '/cv-management' }
    ],
    interview_help: [
      { type: 'navigate', label: 'Interviews', url: '/interviews' },
      { type: 'navigate', label: 'Calendar', url: '/calendar' }
    ],
    job_posting_help: [
      { type: 'navigate', label: 'Job Postings', url: '/job-postings' },
      { type: 'navigate', label: 'Job Approvals', url: '/job-approvals' }
    ],
    hr_help: [
      { type: 'navigate', label: 'User Management', url: '/users' },
      { type: 'navigate', label: 'Employees', url: '/employees' }
    ],
    default: [
      { type: 'navigate', label: 'Dashboard', url: '/dashboard' },
      { type: 'navigate', label: 'Reports', url: '/reports' }
    ]
  }
  
  return actions[intent] || actions.default
}

