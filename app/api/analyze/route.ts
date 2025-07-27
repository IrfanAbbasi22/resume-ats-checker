import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { ATSService } from '@/lib/atsService'

// Test endpoint to verify the route is working
export async function GET() {
  return NextResponse.json({ 
    message: 'ATS Analyze API is working!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as string

    if (!resumeFile) {
      return NextResponse.json(
        { error: 'No resume file uploaded' },
        { status: 400 }
      )
    }

    if (!jobDescription || jobDescription.trim() === '') {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt']
    const fileExtension = '.' + resumeFile.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(resumeFile.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file temporarily
    const bytes = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileName = `${Date.now()}-${resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)

    try {
      // Analyze resume using ATSService
      const atsService = new ATSService()
      const analysis = await atsService.analyzeResume(filePath, jobDescription)

      return NextResponse.json(analysis)
    } catch (analysisError) {
      console.error('Analysis error:', analysisError)
      return NextResponse.json(
        { 
          error: 'Failed to analyze resume',
          message: analysisError instanceof Error ? analysisError.message : 'Unknown analysis error'
        },
        { status: 500 }
      )
    } finally {
      // Clean up uploaded file
      try {
        await unlink(filePath)
      } catch (error) {
        console.error('Failed to delete temporary file:', error)
      }
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 