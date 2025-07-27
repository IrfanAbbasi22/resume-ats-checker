'use client'

import { useState } from 'react'
import { Upload, FileText, Target, TrendingUp, CheckCircle, AlertCircle, Info } from 'lucide-react'
import AnalysisForm from '@/components/AnalysisForm'
import AnalysisResults from '@/components/AnalysisResults'
import { AnalysisData } from '@/types/analysis'

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalysis = async (resumeFile: File, jobDescription: string) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ATS Checker</h1>
                <p className="text-sm text-gray-600">Optimize your resume for ATS systems</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisData ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Pass the ATS with Confidence
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your resume and job description to get instant feedback on keyword matching, 
                improvement suggestions, and optimization tips to help you land more interviews.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card text-center">
                <div className="bg-primary-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Resume</h3>
                <p className="text-gray-600 text-sm">
                  Support for PDF, DOCX, DOC, and TXT files
                </p>
              </div>
              
              <div className="card text-center">
                <div className="bg-primary-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Add Job Description</h3>
                <p className="text-gray-600 text-sm">
                  Paste the job description to analyze keyword matching
                </p>
              </div>
              
              <div className="card text-center">
                <div className="bg-primary-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Insights</h3>
                <p className="text-gray-600 text-sm">
                  Receive detailed analysis and improvement suggestions
                </p>
              </div>
            </div>

            {/* Analysis Form */}
            <div className="max-w-4xl mx-auto">
              <div className="card">
                <AnalysisForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-error-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-error-800">Analysis Error</h3>
                    <p className="text-sm text-error-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnalysisResults 
            data={analysisData} 
            onReset={() => setAnalysisData(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ATS Checker. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 