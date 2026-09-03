import { GoogleGenAI } from '@google/genai';
import { analysisSchema, AnalysisOutput } from './schemas';

// Initialize the Google Gen AI client with your env API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisOutput> {
  const prompt = `
You are an expert ATS (Applicant Tracking System) reviewer and technical recruiter.
Analyze the following resume against the given job description.

RESUME TEXT:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Provide a detailed structured analysis matching the requested JSON schema.
`;

  // Request structured JSON generation from Gemini 2.5 Flash
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          jobTitle: { type: 'STRING' },
          matchScore: { type: 'INTEGER' },
          matchingSkills: { type: 'ARRAY', items: { type: 'STRING' } },
          missingSkills: { type: 'ARRAY', items: { type: 'STRING' } },
          suggestions: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                category: { type: 'STRING' },
                currentText: { type: 'STRING' },
                recommendedChange: { type: 'STRING' },
              },
              required: ['category', 'recommendedChange'],
            },
          },
        },
        required: [
          'jobTitle',
          'matchScore',
          'matchingSkills',
          'missingSkills',
          'suggestions',
        ],
      },
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Received empty response from Gemini API.');
  }

  // Parse JSON and run runtime validation via Zod schema
  const rawData = JSON.parse(responseText);
  return analysisSchema.parse(rawData);
}
