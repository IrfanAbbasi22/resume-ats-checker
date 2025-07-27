# ATS Checker - Resume Analysis Tool

A web application built with Next.js that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). The app analyzes resume content against job descriptions and provides detailed feedback and improvement suggestions.

## 🚀 Features

- **Resume Upload**: Support for PDF, DOCX, DOC, and TXT files
- **Job Description Analysis**: Paste job descriptions to analyze keyword matching
- **ATS Score**: Get an overall compatibility score with detailed breakdown
- **Keyword Analysis**: See which keywords match and which are missing
- **Section Analysis**: Check if your resume has all essential sections
- **Improvement Suggestions**: Get actionable advice to improve your resume
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **File Processing**: pdf-parse, natural language processing
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/IrfanAbbasi22/resume-ats-checker.git
   cd ats-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
ats-checker/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   └── analyze/       # Resume analysis endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── FileUpload.tsx     # File upload component
│   ├── JobDescriptionInput.tsx # Job description input
│   └── AnalysisResults.tsx # Results display
├── lib/                   # Utility libraries
│   └── atsService.ts      # ATS analysis logic
├── types/                 # TypeScript type definitions
│   └── analysis.ts        # Analysis data types
├── uploads/               # Temporary file storage
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Configure upload directory
UPLOAD_DIR=./uploads

# Optional: Configure file size limits
MAX_FILE_SIZE=5242880
```

### File Upload Settings

- **Supported formats**: PDF, DOCX, DOC, TXT
- **Maximum file size**: 5MB
- **Temporary storage**: Files are automatically deleted after analysis

## 📊 Analysis Features

### Keyword Matching
- Extracts important keywords from job descriptions
- Compares resume content against job requirements
- Provides similarity scoring for partial matches

### Section Analysis
- **Contact Information**: Checks for email and phone
- **Education**: Identifies education-related content
- **Experience**: Detects work experience sections
- **Skills**: Analyzes skills and technical competencies

### Improvement Suggestions
- **Missing Keywords**: Highlights important terms to add
- **Resume Length**: Suggests optimal content length
- **Action Verbs**: Recommends dynamic language
- **Quantifiable Achievements**: Encourages metrics and numbers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy job hunting! 🎯** 