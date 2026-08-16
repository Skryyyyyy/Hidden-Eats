import { NextResponse } from 'next/server';
import { extractHiddenShopFromVideoUrl } from '@/lib/videoScraperNLP';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl } = body;

    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Valid YouTube video URL is required' },
        { status: 400 }
      );
    }

    // Call NLP Location Extraction Engine
    const extractedData = await extractHiddenShopFromVideoUrl(videoUrl);

    return NextResponse.json({
      success: true,
      data: extractedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to extract hidden shop location' },
      { status: 500 }
    );
  }
}
