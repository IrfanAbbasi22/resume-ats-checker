'use client'

import { useState } from 'react'
import FileUpload from './FileUpload'
import JobDescriptionInput from './JobDescriptionInput'

interface AnalysisFormProps {
  onAnalyze: (resumeFile: File, jobDescription: string) => void
  isAnalyzing: boolean
}

export default function AnalysisForm({ onAnalyze, isAnalyzing }: AnalysisFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!resumeFile) {
      newErrors.resume = 'Please upload a resume file'
    }

    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Please enter a job description'
    } else if (jobDescription.trim().length < 50) {
      newErrors.jobDescription = 'Job description must be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm() && resumeFile) {
      onAnalyze(resumeFile, jobDescription)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FileUpload onFileSelect={setResumeFile} />
      {errors.resume && (
        <p className="text-error-600 text-sm">{errors.resume}</p>
      )}

      <JobDescriptionInput onDescriptionChange={setJobDescription} />
      {errors.jobDescription && (
        <p className="text-error-600 text-sm">{errors.jobDescription}</p>
      )}
      
      <button
        type="submit"
        disabled={isAnalyzing}
        className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Analyzing...</span>
          </div>
        ) : (
          'Analyze Resume'
        )}
      </button>
    </form>
  )
} 