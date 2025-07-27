export interface AnalysisData {
  overallScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  sections: {
    contact: {
      hasEmail: boolean
      hasPhone: boolean
      emails: string[]
      phones: string[]
    }
    education: {
      hasEducation: boolean
    }
    experience: {
      hasExperience: boolean
    }
    skills: {
      hasSkills: boolean
    }
  }
  suggestions: Suggestion[]
  resumeLength: number
  wordCount: number
}

export interface Suggestion {
  type: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  keywords: string[]
} 