import { NextResponse } from 'next/server';
import { extractHiddenShopFromVideoUrl, getAllScrapedShops } from '@/lib/videoScraperNLP';
import { SecuritySchemas, hasSqlInjectionPattern } from '@/lib/security';

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
    const rawBody = await request.json();
    const parseResult = SecuritySchemas.videoScraper.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Valid YouTube or Instagram video link is required' },
        { status: 400 }
      );
    }

    const { videoUrl } = parseResult.data;

    if (hasSqlInjectionPattern(videoUrl)) {
      return NextResponse.json(
        { error: 'Security violation: Disallowed URL syntax detected' },
        { status: 403 }
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
