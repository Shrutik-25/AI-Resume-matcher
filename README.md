# 🚀 AI Resume Matcher & ATS Optimizer

An AI-powered full-stack ATS resume analysis platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and a **Python FastAPI** backend microservice powered by **Google Gemini AI**. The application extracts native PDF content, categorizes candidate qualifications against job requirements, and computes a deterministic weighted ATS match score with actionable optimization feedback.

---

## 🌟 Key Features

- **📄 Native PDF Text Extraction**: Reads and parses PDF byte streams in memory using `pypdf` without saving sensitive resume files to disk.
- **🤖 AI Structured Skill Extraction**: Leverages the Google Gemini API (`google-genai`) to parse candidate qualifications, required job skills, and optional skills into structured JSON.
- **🧮 Deterministic Weighted Scoring Engine**: Features a custom algorithm (`matcher.py`) assigning higher weight ($w=2.0$) to required skills and ($w=1.0$) to optional skills to calculate precise match percentages.
- **🔄 Resilient Exponential Backoff**: Built-in retry loops handle third-party API throttling and high-demand `503` server spikes gracefully.
- **🔍 Visual Skill Gap Analysis**: Categorizes extracted data into visual chips displaying **Matching Qualifications** vs. **Missing Qualifications**.
- **💡 Actionable Recommendations**: Generates tailored, high-impact suggestions to optimize resume keywords and formatting for ATS scanners.
- **🗄️ Asynchronous Persistence**: Records evaluation runs using **Prisma ORM** and **Neon PostgreSQL** without blocking client UI rendering.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | Next.js (App Router), React, TypeScript, Tailwind CSS |
| **Backend Microservice** | Python 3, FastAPI, Uvicorn |
| **PDF Processing** | `pypdf` |
| **Generative AI** | Google Gemini API (`google-genai`, model: `gemini-3.8-flash`) |
| **Algorithm Engine** | Custom Python Skill Matcher (`matcher.py`) |
| **Database & ORM** | Neon PostgreSQL (Serverless), Prisma ORM |

---

## 🏗️ System Architecture

```text
[ Client Dashboard (port 3000) ]
        │
        │ (1) POST FormData (PDF Resume + Job Description)
        ▼
[ Next.js Proxy Route: /api/analyze ]
        │
        │ (2) Proxy Payload HTTP Request
        ▼
[ Python FastAPI Microservice (port 8000) ]
        │
        ├───► (3) Extract Text via pypdf
        │
        ├───► (4) Google Gemini API (gemini-3.8-flash)
        │         └── Structured JSON Skill & Gap Extraction
        │
        ├───► (5) Deterministic Matcher (matcher.py)
        │         └── Calculate Weighted Percentage Score
        │
        ▼
[ Next.js Client Dashboard ] (Renders Match Score Badge, Skill Pills & Feedback)
