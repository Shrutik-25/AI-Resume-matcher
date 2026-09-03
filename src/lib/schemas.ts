import { z } from 'zod';

export const analysisSchema = z.object({
  jobTitle: z.string().describe('Target job title analyzed from the description'),
  matchScore: z.number().min(0).max(100).describe('Overall match percentage from 0 to 100'),
  matchingSkills: z.array(z.string()).describe('List of key skills matching between candidate and job'),
  missingSkills: z.array(z.string()).describe('Required skills present in job description but missing from resume'),
  suggestions: z.array(
    z.object({
      category: z.string().describe('Category of improvement (e.g., Skills, Experience, Impact)'),
      currentText: z.string().optional().describe('Original text snippet from the resume if applicable'),
      recommendedChange: z.string().describe('Actionable suggestion or revised phrase'),
    })
  ).describe('Actionable improvements for the resume'),
});

export type AnalysisOutput = z.infer<typeof analysisSchema>;