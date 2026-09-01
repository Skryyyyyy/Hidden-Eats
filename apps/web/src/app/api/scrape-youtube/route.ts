import { NextResponse } from 'next/server';
import { extractHiddenShopFromVideoUrl, getAllScrapedShops } from '@/lib/videoScraperNLP';
import { SecuritySchemas, hasSqlInjectionPattern } from '@/lib/security';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

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
    // Rate Limiting Protection (Max 20 video scrape extractions per minute per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`scrape_${clientIp}`, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Scraper rate limit exceeded. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)) } }
      );
    }

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
