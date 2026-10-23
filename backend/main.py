
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from google import genai
from matcher import calculate_weighted_score
from dotenv import load_dotenv
import json
import io
import os
import re
import time

# Load environment variables from backend/.env
load_dotenv()

app = FastAPI(title="AI Resume Matcher API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    extracted_text = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            extracted_text += text + "\n"
    return extracted_text.strip()

def parse_json_safely(raw_text: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"```\s*$", "", cleaned, flags=re.MULTILINE).strip()
    return json.loads(cleaned)

@app.get("/")
def health_check():
    return {"status": "FastAPI Resume Matcher Engine Active"}

@app.post("/analyze")
def analyze_resume(
    resume: UploadFile = File(...),
    jobDescription: str = Form(...)
):
    try:
        print("\n--- Processing Resume Analysis Request ---")
        
        # 1. Extract text from PDF
        pdf_bytes = resume.file.read()
        extracted_text = extract_text_from_pdf(pdf_bytes)

        if not extracted_text:
            raise HTTPException(status_code=400, detail="Could not extract text from the provided PDF.")

        # 2. Check API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable is missing.")

        client = genai.Client(api_key=api_key)

        prompt = f"""
        Extract skills and analysis from the following Candidate Resume and Job Description.

        --- CANDIDATE RESUME ---
        {extracted_text}

        --- JOB DESCRIPTION ---
        {jobDescription}

        Respond ONLY in valid JSON with this exact structure:
        {{
          "extractedCandidateSkills": ["skill1", "skill2"],
          "requiredJobSkills": ["skill1", "skill2"],
          "optionalJobSkills": ["skill1"],
          "recommendations": ["suggestion1", "suggestion2"]
        }}
        """

        # 3. Active valid model list with retries for transient demand spikes
        candidate_models = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"]
        gemini_response = None
        last_error = None

        for model in candidate_models:
            for attempt in range(1, 3):
                try:
                    print(f"Calling Gemini model: {model} (Attempt {attempt})...")
                    response = client.models.generate_content(
                        model=model,
                        contents=prompt,
                        config={"response_mime_type": "application/json"}
                    )
                    if response and response.text:
                        gemini_response = response
                        print(f"Successfully received response from: {model}")
                        break
                except Exception as err:
                    print(f"Model {model} attempt {attempt} failed ({err}).")
                    last_error = err
                    time.sleep(1.5)
            
            if gemini_response:
                break

        if not gemini_response or not gemini_response.text:
            raise HTTPException(
                status_code=503,
                detail=f"Gemini API temporarily busy. Please try again in a few seconds. Details: {str(last_error)}"
            )

        parsed_ai = parse_json_safely(gemini_response.text)

        # 4. Calculate score via matcher.py
        match_result = calculate_weighted_score(
            candidate_skills=parsed_ai.get("extractedCandidateSkills", []),
            required_skills=parsed_ai.get("requiredJobSkills", []),
            optional_skills=parsed_ai.get("optionalJobSkills", [])
        )

        return {
            "matchScore": match_result["matchScore"],
            "matchingSkills": match_result["matchingSkills"],
            "missingSkills": match_result["missingSkills"],
            "recommendations": parsed_ai.get("recommendations", [])
        }

    except Exception as e:
        print(f"Error encountered: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))