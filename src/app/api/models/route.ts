import { NextResponse } from 'next/server';
import { getOllamaApiUrl } from '@/lib/ai/provider';

export async function GET() {
  try {
    const response = await fetch(getOllamaApiUrl('/tags'), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    // Expected shape: { models: [{ name: string, ... }] }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models from Ollama' },
      { status: 500 }
    );
  }
}


