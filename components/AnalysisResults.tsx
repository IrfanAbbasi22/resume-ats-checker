'use client'

import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, TrendingUp, Target, FileText, Users, Award } from 'lucide-react'
import { AnalysisData } from '@/types/analysis'

interface AnalysisResultsProps {
  data: AnalysisData
  onReset: () => void
}

export default function AnalysisResults({ data, onReset }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-excellent'
    if (score >= 60) return 'score-good'
    return 'score-poor'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6" />
    if (score >= 60) return <AlertTriangle className="h-6 w-6" />
    return <XCircle className="h-6 w-6" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error-600 bg-error-50 border-error-200'
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'low': return 'text-success-600 bg-success-50 border-success-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600 mt-2">Here's how your resume matches the job description</p>
        </div>
        <button
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Overall Score */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall ATS Score</h3>
            <p className="text-gray-600">How well your resume matches the job requirements</p>
          </div>
          <div className={`flex items-center space-x-3 p-4 rounded-lg border ${getScoreColor(data.overallScore)}`}>
            {getScoreIcon(data.overallScore)}
            <div className="text-center">
              <div className="text-3xl font-bold">{data.overallScore}%</div>
              <div className="text-sm">
                {data.overallScore >= 80 ? 'Excellent' : data.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="bg-primary-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Target className="h-6 w-6 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900">{data.matchedKeywords.length}</h4>
          <p className="text-sm text-gray-600">Keywords Matched</p>
        </div>
        
        <div className="card text-center">
          <div className="bg-warning-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-warning-600" />
          </div>
          <h4 className="font-semibold text-gray-900">{data.missingKeywords.length}</h4>
          <p className="text-sm text-gray-600">Keywords Missing</p>
        </div>
        
        <div className="card text-center">
          <div className="bg-success-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-6 w-6 text-success-600" />
          </div>
          <h4 className="font-semibold text-gray-900">{data.wordCount}</h4>
          <p className="text-sm text-gray-600">Total Words</p>
        </div>
        
        <div className="card text-center">
          <div className="bg-info-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-info-600" />
          </div>
          <h4 className="font-semibold text-gray-900">{data.suggestions.length}</h4>
          <p className="text-sm text-gray-600">Suggestions</p>
        </div>
      </div>

      {/* Keywords Analysis */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Matched Keywords */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <span>Matched Keywords</span>
          </h3>
          {data.matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.matchedKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No keywords matched</p>
          )}
        </div>

        {/* Missing Keywords */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-error-600" />
            <span>Missing Keywords</span>
          </h3>
          {data.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.slice(0, 10).map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-800"
                >
                  {keyword}
                </span>
              ))}
              {data.missingKeywords.length > 10 && (
                <span className="text-sm text-gray-500">
                  +{data.missingKeywords.length - 10} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-gray-500">All keywords matched!</p>
          )}
        </div>
      </div>

      {/* Resume Sections */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Sections Analysis</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className={`p-2 rounded-full ${data.sections.contact.hasEmail ? 'bg-success-100' : 'bg-error-100'}`}>
              <Users className={`h-4 w-4 ${data.sections.contact.hasEmail ? 'text-success-600' : 'text-error-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Contact Info</p>
              <p className="text-xs text-gray-500">
                {data.sections.contact.hasEmail ? 'Complete' : 'Missing email'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className={`p-2 rounded-full ${data.sections.education.hasEducation ? 'bg-success-100' : 'bg-error-100'}`}>
              <Award className={`h-4 w-4 ${data.sections.education.hasEducation ? 'text-success-600' : 'text-error-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Education</p>
              <p className="text-xs text-gray-500">
                {data.sections.education.hasEducation ? 'Present' : 'Missing'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className={`p-2 rounded-full ${data.sections.experience.hasExperience ? 'bg-success-100' : 'bg-error-100'}`}>
              <TrendingUp className={`h-4 w-4 ${data.sections.experience.hasExperience ? 'text-success-600' : 'text-error-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Experience</p>
              <p className="text-xs text-gray-500">
                {data.sections.experience.hasExperience ? 'Present' : 'Missing'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className={`p-2 rounded-full ${data.sections.skills.hasSkills ? 'bg-success-100' : 'bg-error-100'}`}>
              <Target className={`h-4 w-4 ${data.sections.skills.hasSkills ? 'text-success-600' : 'text-error-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Skills</p>
              <p className="text-xs text-gray-500">
                {data.sections.skills.hasSkills ? 'Present' : 'Missing'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h3>
        {data.suggestions.length > 0 ? (
          <div className="space-y-4">
            {data.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{suggestion.title}</h4>
                    <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                    {suggestion.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {suggestion.keywords.slice(0, 5).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/50 text-gray-700"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    suggestion.priority === 'high' ? 'bg-error-200 text-error-800' :
                    suggestion.priority === 'medium' ? 'bg-warning-200 text-warning-800' :
                    'bg-success-200 text-success-800'
                  }`}>
                    {suggestion.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Great job! No specific improvements needed.</p>
        )}
      </div>
    </div>
  )
} 