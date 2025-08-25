import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

export async function POST(request: NextRequest) {
  try {
    const { model, messages, think } = await request.json();
    // Use AI SDK streaming with maintained Ollama provider (v2)
    const result = await streamText({
      model: ollama(model),
      messages,
      providerOptions: think ? { ollama: { think: true } } : undefined,
    });

    // Return plain text token stream; client will parse <think> ... </think>
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with Ollama server' },
      { status: 500 }
    );
  }
}
