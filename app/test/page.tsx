'use client'

import { useState } from 'react'

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analyze')
      const data = await response.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testMainPage = async () => {
    setLoading(true)
    try {
      const response = await fetch('/')
      setTestResult(`Main page status: ${response.status}`)
    } catch (error) {
      setTestResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={testAPI}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Testing...' : 'Test API Endpoint'}
        </button>
        
        <button
          onClick={testMainPage}
          disabled={loading}
          className="btn-secondary ml-4"
        >
          {loading ? 'Testing...' : 'Test Main Page'}
        </button>
      </div>

      {testResult && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Test Result:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {testResult}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Manual Tests:</h2>
        <ul className="space-y-2">
          <li>
            <a href="/api/analyze" target="_blank" className="text-blue-600 hover:underline">
              Test API directly: /api/analyze
            </a>
          </li>
          <li>
            <a href="/api/test" target="_blank" className="text-blue-600 hover:underline">
              Test API: /api/test
            </a>
          </li>
          <li>
            <a href="/" className="text-blue-600 hover:underline">
              Go to main page: /
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
} 