'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'

interface JobDescriptionInputProps {
  onDescriptionChange: (description: string) => void
}

export default function JobDescriptionInput({ onDescriptionChange }: JobDescriptionInputProps) {
  const [description, setDescription] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDescription(value)
    setIsValid(value.trim().length >= 50)
    onDescriptionChange(value)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Job Description
      </label>
      
      <div className="relative">
        <textarea
          value={description}
          onChange={handleChange}
          placeholder="Paste the job description here to analyze keyword matching..."
          className={`input-field min-h-[200px] resize-none ${
            !isValid && description.trim().length > 0 
              ? 'border-error-300 focus:ring-error-500' 
              : ''
          }`}
          rows={8}
        />
        
        <div className="absolute top-3 right-3 text-gray-400">
          <FileText className="h-5 w-5" />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-2">
          {!isValid && description.trim().length > 0 && (
            <span className="text-error-600">
              Please enter at least 50 characters
            </span>
          )}
        </div>
        <span className={`${
          description.length > 2000 ? 'text-error-600' : 'text-gray-500'
        }`}>
          {description.length}/2000 characters
        </span>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for better analysis:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include the full job description with requirements and responsibilities</li>
          <li>• Copy directly from the job posting to ensure accuracy</li>
          <li>• Include technical skills, soft skills, and qualifications</li>
        </ul>
      </div>
    </div>
  )
} 