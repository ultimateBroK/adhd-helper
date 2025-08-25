import { NextRequest, NextResponse } from 'next/server';
import { getOllamaApiUrl } from '@/lib/ai/provider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(getOllamaApiUrl('/chat'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    // For streaming responses, we need to proxy the stream
    if (body.stream) {
      const stream = response.body;
      return new NextResponse(stream, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // For non-streaming responses
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with Ollama server' },
      { status: 500 }
    );
  }
}
