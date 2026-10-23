import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fastApiUrl = process.env.FASTAPI_SERVICE_URL || "http://127.0.0.1:8000/analyze";

    // Forward the uploaded file and job description to the Python FastAPI backend
    const fastApiRes = await fetch(fastApiUrl, {
      method: "POST",
      body: formData,
    });

    if (!fastApiRes.ok) {
      const errText = await fastApiRes.text();
      throw new Error(`FastAPI service error: ${errText}`);
    }

    const data = await fastApiRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to analyze resume." },
      { status: 500 }
    );
  }
}