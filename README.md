# 🚀 AI Resume Matcher & ATS Optimizer

An AI-powered, full-stack ATS resume analysis platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Google Gemini AI**. The application processes raw PDF resumes against job descriptions to provide real-time ATS scoring, skill gap detection, and actionable optimization feedback.

---

## 🌟 Key Features

- **📄 Multimodal Drag-and-Drop PDF Upload**: Interactive file upload zone with client-side mime-type validation and drag-and-drop feedback.
- **📊 Real-Time ATS Scoring**: Evaluates candidate resumes against job descriptions to compute a weighted percentage match score (0–100%).
- **🔍 Skill Gap Analysis**: Categorizes skills into visual chips showing **Matching Qualifications** vs. **Missing Qualifications**.
- **💡 Actionable Feedback**: Provides personalized recommendations to optimize resume keywords, structure, and formatting.
- **⚙️ Automated Model Fallback**: Built-in resilience engine that handles model rate limits and API updates by automatically retrying failed requests across Gemini model aliases (`gemini-1.5-flash-latest` → `gemini-2.0-flash`).
- **🗄️ Asynchronous Persistence**: Records evaluation runs asynchronously using **Prisma ORM** and **Neon PostgreSQL** without slowing down client UI rendering.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Generative AI** | Google Gemini Multimodal API (`@google/genai`) |
| **Database** | Neon PostgreSQL (Serverless) |
| **ORM** | Prisma ORM |

---

## 🏗️ System Architecture

```text
[ Client Dashboard ]
       │
       │ (1) POST FormData (PDF + Job Description)
       ▼
[ Next.js API Route: /api/analyze ]
       │
       ├───► (2) Convert PDF Buffer to Base64
       │
       ├───► (3) Gemini AI Inference Engine
       │         ├── Primary: gemini-1.5-flash-latest
       │         └── Fallback: gemini-2.0-flash
       │         └── Structured JSON Output
       │
       ├───► (4) Prisma ORM → Neon PostgreSQL (Async Persistence)
       │
       ▼
[ Client UI ] (Renders Match Dashboard & Recommendations)
```

---

## 🚀 Getting Started Locally

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher
- **npm** or **yarn**
- A **Google Gemini API Key** ([Get your key here](https://aistudio.google.com/))
- A **Neon PostgreSQL Connection String** ([Get your database here](https://neon.tech/))

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shrutik-25/ai-resume-matcher.git
   cd ai-resume-matcher
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database Connection
   DATABASE_URL="postgresql://user:password@ep-example.neon.tech/neondb?sslmode=require"

   # Google Gemini API Key
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Run Prisma Migrations:**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

---

## 🔒 Security & Best Practices

- **Environment Secrets**: API keys and database credentials are kept strictly in `.env`, which is ignored by `.gitignore`.
- **In-Memory Streaming**: PDF file buffers are processed in memory as Base64 data without saving sensitive documents to local disk storage.
- **Type Safety**: Fully typed end-to-end using TypeScript interfaces and strict JSON schemas.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
