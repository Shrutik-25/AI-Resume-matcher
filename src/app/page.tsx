'use client';

import { useState } from 'react';

interface AnalysisResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary?: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a valid PDF file.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError('Please provide both a resume PDF and a job description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      setResult(data.data || data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-rose-500 bg-rose-50 border-rose-200';
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
            Powered by Gemini AI
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            AI Resume Matcher
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your resume and paste a job description to get real-time ATS scoring, skill gap detection, and actionable feedback.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Upload Zone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload Resume (PDF)
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                    📄
                  </div>
                  <div className="text-sm text-slate-600">
                    {file ? (
                      <span className="font-medium text-indigo-600">{file.name}</span>
                    ) : (
                      <>
                        <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">PDF documents up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Job Description Textarea */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Description
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition shadow-sm hover:shadow"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing Resume with AI...
                </span>
              ) : (
                'Analyze Match Score'
              )}
            </button>
          </form>
        </div>

        {/* Results Dashboard */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8 animate-fade-in">
            
            {/* Header / Score Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Analysis Breakdown</h2>
                <p className="text-sm text-slate-500">Evaluation based on key qualification matches</p>
              </div>

              <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${getScoreColor(result.matchScore)}`}>
                <span className="text-3xl font-black">{result.matchScore}%</span>
                <span className="text-xs font-semibold uppercase tracking-wider">Match<br/>Score</span>
              </div>
            </div>

            {/* Summary text if provided */}
            {result.summary && (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-700 text-sm leading-relaxed border border-slate-100">
                <span className="font-semibold text-slate-900">Summary: </span>
                {result.summary}
              </div>
            )}

            {/* Skills Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matching Skills */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-2">
                  <span>✓</span> Matching Qualifications ({result.matchingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchingSkills?.length > 0 ? (
                    result.matchingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No direct skill matches detected.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wide flex items-center gap-2">
                  <span>!</span> Missing Qualifications ({result.missingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? (
                    result.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No critical missing skills!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Actionable Optimization Steps
              </h3>
              <ul className="space-y-2">
                {result.recommendations?.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}