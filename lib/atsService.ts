import { readFileSync } from 'fs'
import { extname } from 'path'
import pdfParse from 'pdf-parse'
import stringSimilarity from 'string-similarity'

export class ATSService {
  private stopWords: Set<string>

  constructor() {
    // Common English stop words
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 
      'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with',
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 
      'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 
      'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 
      'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 
      'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 
      'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 
      'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 
      'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 
      'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 
      'any', 'these', 'give', 'day', 'most', 'us'
    ])
  }

  async analyzeResume(filePath: string, jobDescription: string) {
    try {
      // Extract text from resume
      const resumeText = await this.extractTextFromFile(filePath)
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Could not extract text from the uploaded file. Please ensure the file contains readable text.')
      }
      
      // Extract keywords from job description
      const jobKeywords = await this.extractKeywords(jobDescription)
      
      // Analyze resume against job description
      const analysis = await this.performAnalysis(resumeText, jobDescription, jobKeywords)
      
      return analysis
    } catch (error) {
      throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async extractTextFromFile(filePath: string): Promise<string> {
    const fileExtension = extname(filePath).toLowerCase()
    
    try {
      switch (fileExtension) {
        case '.pdf':
          const dataBuffer = readFileSync(filePath)
          const pdfData = await pdfParse(dataBuffer)
          return pdfData.text || ''
        
        case '.txt':
          return readFileSync(filePath, 'utf8')
        
        case '.docx':
        case '.doc':
          // For now, we'll handle these as text files
          // In a production environment, you'd want to use a proper DOCX parser
          try {
            return readFileSync(filePath, 'utf8')
          } catch {
            throw new Error('DOCX/DOC files are not fully supported yet. Please convert to PDF or TXT format.')
          }
        
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unsupported file type')) {
        throw error
      }
      throw new Error(`Failed to extract text from file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async extractKeywords(text: string): Promise<string[]> {
    if (!text || text.trim().length === 0) {
      return []
    }

    // Simple tokenization and keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/) // Split on whitespace
      .filter(word => 
        word.length > 2 && 
        !this.stopWords.has(word) && 
        !/^\d+$/.test(word) // Not just numbers
      )

    // Count word frequencies
    const wordFreq: { [key: string]: number } = {}
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })

    // Sort by frequency and return top keywords
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word)

    return sortedWords
  }

  private async performAnalysis(resumeText: string, jobDescription: string, jobKeywords: string[]) {
    // Simple tokenization for resume
    const resumeWords = new Set(
      resumeText.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => 
          word.length > 2 && 
          !this.stopWords.has(word) && 
          !/^\d+$/.test(word)
        )
    )

    // Calculate keyword match score
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeWords.has(keyword) || 
      Array.from(resumeWords).some(word => 
        this.calculateSimilarity(keyword, word) > 0.8
      )
    )

    const matchScore = jobKeywords.length > 0 ? (matchedKeywords.length / jobKeywords.length) * 100 : 0

    // Analyze different sections
    const sections = this.analyzeSections(resumeText)
    
    // Generate improvement suggestions
    const suggestions = await this.getImprovementSuggestions(resumeText, jobDescription)

    return {
      overallScore: Math.round(matchScore),
      matchedKeywords,
      missingKeywords: jobKeywords.filter(k => !matchedKeywords.includes(k)),
      sections,
      suggestions,
      resumeLength: resumeText.length,
      wordCount: resumeText.split(/\s+/).length
    }
  }

  private calculateSimilarity(str1: string, str2: string): number {
    try {
      return stringSimilarity.compareTwoStrings(str1, str2)
    } catch {
      return 0
    }
  }

  private analyzeSections(resumeText: string) {
    const sections = {
      contact: this.extractContactInfo(resumeText),
      education: this.extractEducation(resumeText),
      experience: this.extractExperience(resumeText),
      skills: this.extractSkills(resumeText)
    }

    return sections
  }

  private extractContactInfo(text: string) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
    
    const emails = text.match(emailRegex) || []
    const phones = text.match(phoneRegex) || []
    
    return {
      hasEmail: emails.length > 0,
      hasPhone: phones.length > 0,
      emails,
      phones
    }
  }

  private extractEducation(text: string) {
    const educationKeywords = [
      'bachelor', 'master', 'phd', 'degree', 'university', 'college', 'school',
      'graduated', 'graduation', 'gpa', 'gpa:', 'grade point average'
    ]
    
    const hasEducation = educationKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    )
    
    return { hasEducation }
  }

  private extractExperience(text: string) {
    const experienceKeywords = [
      'experience', 'work', 'employment', 'job', 'position', 'role',
      'responsibilities', 'duties', 'achievements', 'accomplishments'
    ]
    
    const hasExperience = experienceKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    )
    
    return { hasExperience }
  }

  private extractSkills(text: string) {
    const skillKeywords = [
      'skills', 'technologies', 'tools', 'languages', 'frameworks',
      'software', 'programming', 'technical', 'competencies'
    ]
    
    const hasSkills = skillKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    )
    
    return { hasSkills }
  }

  private async getImprovementSuggestions(resumeText: string, jobDescription: string) {
    const suggestions: Array<{
      type: string
      priority: 'high' | 'medium' | 'low'
      title: string
      description: string
      keywords: string[]
    }> = []
    
    // Check for missing keywords
    const jobKeywords = await this.extractKeywords(jobDescription)
    const resumeWords = new Set(
      resumeText.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2)
    )
    
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeWords.has(keyword) && 
      !Array.from(resumeWords).some(word => 
        this.calculateSimilarity(keyword, word) > 0.8
      )
    )

    if (missingKeywords.length > 0) {
      suggestions.push({
        type: 'missing_keywords',
        priority: 'high',
        title: 'Add Missing Keywords',
        description: `Consider adding these important keywords from the job description: ${missingKeywords.slice(0, 5).join(', ')}`,
        keywords: missingKeywords.slice(0, 10)
      })
    }

    // Check resume length
    if (resumeText.length < 1000) {
      suggestions.push({
        type: 'length',
        priority: 'medium',
        title: 'Resume Too Short',
        description: 'Your resume appears to be quite short. Consider adding more details about your experience, skills, and achievements.',
        keywords: []
      })
    } else if (resumeText.length > 5000) {
      suggestions.push({
        type: 'length',
        priority: 'medium',
        title: 'Resume Too Long',
        description: 'Your resume is quite long. Consider condensing it to focus on the most relevant information for this position.',
        keywords: []
      })
    }

    // Check for action verbs
    const actionVerbs = [
      'developed', 'implemented', 'managed', 'created', 'designed',
      'analyzed', 'improved', 'increased', 'decreased', 'coordinated',
      'led', 'supervised', 'trained', 'maintained', 'optimized'
    ]
    
    const hasActionVerbs = actionVerbs.some(verb => 
      resumeText.toLowerCase().includes(verb)
    )
    
    if (!hasActionVerbs) {
      suggestions.push({
        type: 'action_verbs',
        priority: 'medium',
        title: 'Use Action Verbs',
        description: 'Consider using more action verbs to make your resume more dynamic and impactful.',
        keywords: actionVerbs.slice(0, 10)
      })
    }

    // Check for quantifiable achievements
    const quantifiablePatterns = [
      /\d+%/g,  // percentages
      /\$\d+/g, // dollar amounts
      /\d+\s*(increase|decrease|improvement|growth)/gi, // improvements
      /\d+\s*(people|team|clients|customers)/gi // people counts
    ]
    
    const hasQuantifiable = quantifiablePatterns.some(pattern => 
      pattern.test(resumeText)
    )
    
    if (!hasQuantifiable) {
      suggestions.push({
        type: 'quantifiable',
        priority: 'medium',
        title: 'Add Quantifiable Achievements',
        description: 'Include specific numbers, percentages, and metrics to demonstrate your impact and achievements.',
        keywords: ['metrics', 'percentages', 'numbers', 'results', 'achievements']
      })
    }

    return suggestions
  }
} 