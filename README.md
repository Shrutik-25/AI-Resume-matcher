# AI Resume Matcher & ATS Optimizer

An AI-powered resume analysis application that evaluates how well a candidate's resume matches a given job description. It uses Google Gemini AI to extract candidate skills and job requirements, identifies skill gaps, calculates a weighted ATS match score, and provides actionable resume improvement recommendations.

## Features

- **Resume Upload:** Upload PDF resumes through a file picker or drag-and-drop interface.
- **PDF Text Extraction:** Extracts text from uploaded PDF documents using Python's `pypdf` library.
- **AI-Powered Skill Extraction:** Uses Google Gemini API to identify skills from resumes and job descriptions.
- **ATS Match Score:** Calculates a weighted compatibility score based on matching required and optional skills.
- **Skill Gap Detection:** Identifies matching qualifications and missing job requirements.
- **Actionable Recommendations:** Generates AI-powered suggestions to improve resume relevance.
- **Interactive Dashboard:** Displays the match percentage, matching skills, missing skills, and optimization recommendations.
- **REST API Integration:** Connects the Next.js frontend with the Python FastAPI backend.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React.js, TypeScript |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| AI Integration | Google Gemini API (`google-genai`) |
| PDF Processing | pypdf |
| Algorithm | Custom Weighted Skill Matching Algorithm |
| API Communication | REST API, HTTP, JSON |
| Development Tools | VS Code, Git, GitHub |

## System Architecture

The application follows a frontend-backend architecture in which Next.js communicates with a separate Python FastAPI service.

```text
                 USER
                   |
                   v
        +----------------------+
        |   Next.js Frontend   |
        |   (React + TS)       |
        +----------------------+
                   |
          Resume PDF + Job JD
                   |
                   v
        +----------------------+
        |  Next.js API Route   |
        |   /api/analyze       |
        +----------------------+
                   |
             HTTP POST
                   |
                   v
        +----------------------+
        |   Python FastAPI     |
        |   /analyze           |
        +----------------------+
                   |
                   v
        +----------------------+
        |   PDF Text Extraction|
        |       (pypdf)        |
        +----------------------+
                   |
                   v
        +----------------------+
        |    Google Gemini AI  |
        |   Skill Extraction   |
        +----------------------+
                   |
                   v
        +----------------------+
        |   matcher.py         |
        |  Weighted Scoring    |
        +----------------------+
                   |
                   v
        +----------------------+
        |    JSON Response     |
        +----------------------+
                   |
                   v
        +----------------------+
        |   Results Dashboard  |
        +----------------------+
```

## Application Workflow

1. The user uploads a resume in PDF format and enters the target job description.
2. The React frontend validates the required inputs and creates a `FormData` object containing the PDF and job description.
3. The frontend sends a POST request to the Next.js API route (`/api/analyze`).
4. The Next.js route forwards the uploaded file and job description to the Python FastAPI backend.
5. FastAPI extracts the resume text using `pypdf`.
6. The extracted resume text and job description are combined into a prompt and sent to the Google Gemini API.
7. Gemini identifies:
   - Candidate skills
   - Required job skills
   - Optional job skills
   - Resume improvement recommendations
8. The extracted skills are passed to the custom weighted matching algorithm in `matcher.py`.
9. The algorithm calculates the final match percentage and identifies matching and missing skills.
10. FastAPI returns the analysis as JSON, which is displayed on the frontend dashboard.

## Weighted Matching Algorithm

The application uses a custom weighted scoring algorithm to calculate the compatibility between candidate skills and job requirements.

Required skills receive a higher weight than optional skills.

- Required skill weight = 2
- Optional skill weight = 1

**Formula:**

Match Score = (Earned Weight / Total Possible Weight) × 100

Where:

- Earned Weight = Total weight of skills found in the candidate's resume.
- Total Possible Weight = Combined weight of all required and optional job skills.

**Example:**

Consider a job description containing:

- Required skills: Python, SQL
- Optional skills: AWS, Docker

Suppose the candidate possesses Python, SQL, and AWS.

Earned Weight = (2 × 2) + (1 × 1) = 5

Total Possible Weight = (2 × 2) + (2 × 1) = 6

Match Score = (5 / 6) × 100 = 83.3%

This approach gives greater importance to essential job requirements while still considering additional skills.

## Project Structure

```text
AI-Resume-matcher/
│
├── backend/
│   ├── main.py
│   ├── matcher.py
│   └── requirements.txt
│
├── public/
│
├── src/
│   └── app/
│       ├── api/
│       │   └── analyze/
│       │       └── route.ts
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
│
├── .gitignore
├── README.md
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── eslint.config.mjs
└── tsconfig.json
```

## Installation and Setup

### Prerequisites

- Node.js (20.9 or later)
- Python
- npm
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Shrutik-25/AI-Resume-matcher.git

cd AI-Resume-matcher
```

### 2. Set Up the Frontend

Install the Node.js dependencies:

```bash
npm install
```

### 3. Set Up the Python Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
pip install python-dotenv
```

Note: `python-dotenv` must also be added to `backend/requirements.txt` because the backend imports it to load environment variables.

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

The API key can be obtained from Google AI Studio.

Optionally, configure the FastAPI endpoint in a `.env.local` file in the project root:

```env
FASTAPI_SERVICE_URL=http://127.0.0.1:8000/analyze
```

The application uses this URL by default if the environment variable is not provided.

**Important:** Never commit API keys or environment files to GitHub.

### 5. Start the FastAPI Backend

From the `backend` directory, run:

```bash
uvicorn main:app --reload --port 8000
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### 6. Start the Next.js Frontend

Open another terminal in the project root and execute:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

Both frontend and backend services must be running for resume analysis to work.

## API Endpoint

### Resume Analysis

**Endpoint:** `POST /analyze`

**Backend:** FastAPI

**Request Type:** `multipart/form-data`

| Parameter | Type | Description |
|---|---|---|
| resume | File (PDF) | Candidate's uploaded resume |
| jobDescription | String | Target job description |

The frontend accesses this functionality through its Next.js API route:

`POST /api/analyze`

### Sample JSON Response

```json
{
  "matchScore": 83.3,
  "matchingSkills": [
    "python",
    "sql",
    "aws"
  ],
  "missingSkills": [
    "docker"
  ],
  "recommendations": [
    "Highlight relevant Python projects.",
    "Add relevant experience with Docker if applicable."
  ]
}
```

The actual response depends on the resume and job description provided.

## Current Limitations

- The application currently supports PDF resume uploads.
- Text extraction depends on readable PDF content; scanned documents may require OCR.
- Resume analysis depends on the availability of the Google Gemini API.
- The application currently calculates scores using skill matching rather than a complete commercial ATS simulation.
- Analysis results are returned to the frontend but are not currently stored in a database.

## Future Enhancements

- Resume analysis history and database integration.
- Support for DOCX resume uploads.
- OCR support for scanned resumes.
- More advanced semantic skill matching.
- Downloadable resume analysis reports.
- Improved resume optimization and keyword recommendations.

## Author

**Shrutik**

GitHub: https://github.com/Shrutik-25

---

*AI Resume Matcher — An AI-powered tool for identifying skill gaps and improving resume alignment with job requirements.*
