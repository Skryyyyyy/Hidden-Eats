import { NextResponse } from 'next/server';
import { extractHiddenShopFromVideoUrl, getAllScrapedShops } from '@/lib/videoScraperNLP';

export async function GET() {
  try {
    const shops = await getAllScrapedShops();
    return NextResponse.json({
      success: true,
      count: shops.length,
      data: shops,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ML extracted hidden spots' },
      { status: 500 }
    );
  }
}

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

    // Call ML NLP Location Extraction Engine & Save to DB
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
