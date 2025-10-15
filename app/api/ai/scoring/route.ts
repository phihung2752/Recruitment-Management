import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { cvData, jobRequirements, scoringCriteria } = await request.json()
    
    // AI-powered scoring algorithm
    const scores = calculateAIScores(cvData, jobRequirements, scoringCriteria)
    
    return NextResponse.json({
      success: true,
      scores,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('AI Scoring error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to calculate scores' },
      { status: 500 }
    )
  }
}

function calculateAIScores(cvData: any, jobRequirements: any, criteria: any) {
  // Technical Skills Score (0-100)
  const technicalScore = calculateTechnicalScore(cvData.skills, jobRequirements.requiredSkills)
  
  // Experience Score (0-100)
  const experienceScore = calculateExperienceScore(cvData.experience, jobRequirements.experience)
  
  // Education Score (0-100)
  const educationScore = calculateEducationScore(cvData.education, jobRequirements.education)
  
  // Language Score (0-100)
  const languageScore = calculateLanguageScore(cvData.languages, jobRequirements.languages)
  
  // Project Score (0-100)
  const projectScore = calculateProjectScore(cvData.projects, jobRequirements.projectTypes)
  
  // Overall AI Score (weighted average)
  const overallScore = Math.round(
    (technicalScore * 0.3) +
    (experienceScore * 0.25) +
    (educationScore * 0.15) +
    (languageScore * 0.1) +
    (projectScore * 0.2)
  )
  
  // AI Recommendations
  const recommendations = generateAIRecommendations({
    technicalScore,
    experienceScore,
    educationScore,
    languageScore,
    projectScore,
    overallScore
  })
  
  // Risk Assessment
  const riskFactors = assessRiskFactors(cvData, jobRequirements)
  
  // Match Quality
  const matchQuality = calculateMatchQuality(overallScore, riskFactors)
  
  // Create scores object for AI insights
  const scores = {
    technical: technicalScore,
    experience: experienceScore,
    education: educationScore,
    languages: languageScore,
    projects: projectScore
  }
  
  return {
    overall: {
      score: overallScore,
      grade: getScoreGrade(overallScore),
      recommendation: getOverallRecommendation(overallScore)
    },
    breakdown: {
      technical: {
        score: technicalScore,
        grade: getScoreGrade(technicalScore),
        details: getTechnicalDetails(cvData.skills, jobRequirements.requiredSkills)
      },
      experience: {
        score: experienceScore,
        grade: getScoreGrade(experienceScore),
        details: getExperienceDetails(cvData.experience, jobRequirements.experience)
      },
      education: {
        score: educationScore,
        grade: getScoreGrade(educationScore),
        details: getEducationDetails(cvData.education, jobRequirements.education)
      },
      languages: {
        score: languageScore,
        grade: getScoreGrade(languageScore),
        details: getLanguageDetails(cvData.languages, jobRequirements.languages)
      },
      projects: {
        score: projectScore,
        grade: getScoreGrade(projectScore),
        details: getProjectDetails(cvData.projects, jobRequirements.projectTypes)
      }
    },
    aiInsights: {
      strengths: extractStrengths(cvData, scores),
      weaknesses: extractWeaknesses(cvData, jobRequirements, scores),
      recommendations,
      riskFactors,
      matchQuality
    },
    nextSteps: generateNextSteps(overallScore, recommendations)
  }
}

function calculateTechnicalScore(skills: string[], requiredSkills: string[]) {
  if (!skills || !requiredSkills) return 0
  
  const skillMatches = requiredSkills.filter(reqSkill => 
    skills.some(skill => 
      skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(skill.toLowerCase())
    )
  ).length
  
  return Math.round((skillMatches / requiredSkills.length) * 100)
}

function calculateExperienceScore(experience: any, requiredExperience: any) {
  if (!experience || !requiredExperience) return 50
  
  const years = experience.years || 0
  const requiredYears = requiredExperience.years || 0
  
  if (years >= requiredYears) {
    return Math.min(100, 70 + (years - requiredYears) * 5)
  } else {
    return Math.max(0, (years / requiredYears) * 70)
  }
}

function calculateEducationScore(education: any, requiredEducation: any) {
  if (!education || !requiredEducation) return 50
  
  const educationLevels = {
    'high school': 1,
    'associate': 2,
    'bachelor': 3,
    'master': 4,
    'phd': 5
  }
  
  const candidateLevel = educationLevels[education.degree?.toLowerCase() as keyof typeof educationLevels] || 0
  const requiredLevel = educationLevels[requiredEducation.degree?.toLowerCase() as keyof typeof educationLevels] || 0
  
  if (candidateLevel >= requiredLevel) {
    return 100
  } else {
    return (candidateLevel / requiredLevel) * 80
  }
}

function calculateLanguageScore(languages: string[], requiredLanguages: string[]) {
  if (!languages || !requiredLanguages) return 50
  
  const languageMatches = requiredLanguages.filter(reqLang => 
    languages.some(lang => 
      lang.toLowerCase().includes(reqLang.toLowerCase())
    )
  ).length
  
  return Math.round((languageMatches / requiredLanguages.length) * 100)
}

function calculateProjectScore(projects: any[], requiredTypes: string[]) {
  if (!projects || !requiredTypes) return 50
  
  const relevantProjects = projects.filter(project => 
    requiredTypes.some(type => 
      project.type?.toLowerCase().includes(type.toLowerCase()) ||
      project.description?.toLowerCase().includes(type.toLowerCase())
    )
  ).length
  
  return Math.round((relevantProjects / Math.max(projects.length, 1)) * 100)
}

function getScoreGrade(score: number) {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B+'
  if (score >= 60) return 'B'
  if (score >= 50) return 'C+'
  if (score >= 40) return 'C'
  return 'D'
}

function getOverallRecommendation(score: number) {
  if (score >= 85) return 'Strong Hire'
  if (score >= 70) return 'Hire'
  if (score >= 60) return 'Consider'
  if (score >= 50) return 'Maybe'
  return 'No Hire'
}

function generateAIRecommendations(scores: any) {
  const recommendations = []
  
  if (scores.technicalScore < 70) {
    recommendations.push('Consider technical training or certification')
  }
  
  if (scores.experienceScore < 60) {
    recommendations.push('Look for candidates with more relevant experience')
  }
  
  if (scores.overallScore >= 80) {
    recommendations.push('Excellent candidate - prioritize for interview')
  }
  
  if (scores.overallScore < 50) {
    recommendations.push('Consider other candidates or different role')
  }
  
  return recommendations
}

function assessRiskFactors(cvData: any, jobRequirements: any) {
  const risks = []
  
  if (cvData.gaps?.length > 0) {
    risks.push('Employment gaps detected')
  }
  
  if (cvData.jobHops > 3) {
    risks.push('High job turnover rate')
  }
  
  if (cvData.salaryExpectation > jobRequirements.budget * 1.2) {
    risks.push('Salary expectations may be too high')
  }
  
  return risks
}

function calculateMatchQuality(overallScore: number, riskFactors: string[]) {
  let quality = overallScore
  
  // Reduce quality based on risk factors
  quality -= riskFactors.length * 10
  
  return Math.max(0, Math.min(100, quality))
}

function extractStrengths(cvData: any, scores: any) {
  const strengths = []
  
  if (scores.technicalScore >= 80) {
    strengths.push('Strong technical skills')
  }
  
  if (scores.experienceScore >= 80) {
    strengths.push('Relevant work experience')
  }
  
  if (cvData.certifications?.length > 0) {
    strengths.push('Professional certifications')
  }
  
  return strengths
}

function extractWeaknesses(cvData: any, jobRequirements: any, scores: any) {
  const weaknesses = []
  
  if (scores.technicalScore < 60) {
    weaknesses.push('Limited technical skills match')
  }
  
  if (scores.experienceScore < 60) {
    weaknesses.push('Insufficient relevant experience')
  }
  
  return weaknesses
}

function generateNextSteps(overallScore: number, recommendations: string[]) {
  if (overallScore >= 80) {
    return ['Schedule interview', 'Prepare technical assessment', 'Check references']
  } else if (overallScore >= 60) {
    return ['Consider for interview', 'Review additional qualifications', 'Check availability']
  } else {
    return ['Review other candidates', 'Consider different role', 'Provide feedback']
  }
}

// Helper functions for detailed breakdowns
function getTechnicalDetails(skills: string[], requiredSkills: string[]) {
  const matches = requiredSkills.filter(req => 
    skills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))
  )
  const missing = requiredSkills.filter(req => 
    !skills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))
  )
  
  return { matches, missing }
}

function getExperienceDetails(experience: any, required: any) {
  return {
    years: experience?.years || 0,
    required: required?.years || 0,
    relevance: experience?.relevance || 'Unknown'
  }
}

function getEducationDetails(education: any, required: any) {
  return {
    degree: education?.degree || 'Not specified',
    required: required?.degree || 'Not specified',
    institution: education?.institution || 'Not specified'
  }
}

function getLanguageDetails(languages: string[], required: string[]) {
  const matches = required.filter(req => 
    languages?.some(lang => lang.toLowerCase().includes(req.toLowerCase()))
  )
  return { matches, total: languages?.length || 0 }
}

function getProjectDetails(projects: any[], requiredTypes: string[]) {
  const relevant = projects?.filter(project => 
    requiredTypes.some(type => 
      project.type?.toLowerCase().includes(type.toLowerCase())
    )
  ) || []
  
  return {
    relevant: relevant.length,
    total: projects?.length || 0,
    types: relevant.map(p => p.type).filter(Boolean)
  }
}

