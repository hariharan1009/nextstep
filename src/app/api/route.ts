import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Ensure fresh responses

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
});

export async function POST(req: Request) {
  // Verify API key first
  if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    console.error('Missing NEXT_PUBLIC_GROQ_API_KEY environment variable');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Validate request
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body = await req.json();
    
    // Validate message structure
    if (!body?.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Call Groq API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const completion = await groq.chat.completions.create({
      messages: body.messages,
      model: "llama3-8b-8192",
      temperature: 0.7,
    }, { signal: controller.signal });
    
    clearTimeout(timeout);

    return NextResponse.json({
      content: completion.choices[0]?.message?.content || "No response generated"
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'API request failed',
        content: "Our servers are busy. Please try again in a moment."
      },
      { status: 500 }
    );
  }
}