import yt_dlp
import logging
from typing import List

logger = logging.getLogger(__name__)

def scrape_youtube_urls(query_or_url: str, max_results: int = 5) -> List[str]:
    """
    Scrapes YouTube video URLs based on a search query or a channel/playlist URL.
    Uses yt-dlp to extract metadata without downloading the videos.
    """
    logger.info(f"Starting YouTube scrape for: '{query_or_url}' (max results: {max_results})")
    
    # If the input is not a URL, treat it as a search query
    if not query_or_url.startswith("http"):
        search_query = f"ytsearch{max_results}:{query_or_url}"
    else:
        search_query = query_or_url

    # yt-dlp options for fast metadata extraction
    ydl_opts = {
        'extract_flat': True,       # Do not download videos, just extract metadata
        'quiet': True,
        'no_warnings': True,
        'playlist_items': f'1-{max_results}', # Limit playlist/channel extraction
    }

    video_urls = []
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(search_query, download=False)
            
            if 'entries' in info:
                # It's a playlist, channel, or search result
                for entry in info['entries']:
                    if entry and entry.get('url'):
                        url = entry.get('url')
                        # Sometimes yt-dlp returns relative URLs for searches
                        if not url.startswith('http'):
                            url = f"https://www.youtube.com/watch?v={url}"
                        video_urls.append(url)
            elif 'url' in info:
                # It's a single video URL
                video_urls.append(info['url'])
                
    except Exception as e:
        logger.error(f"Failed to scrape YouTube URLs: {e}")
        raise e

    logger.info(f"Scraped {len(video_urls)} video URLs successfully.")
    return video_urls

if __name__ == "__main__":
    # Test execution
    # urls = scrape_youtube_urls("hidden street food in mumbai", max_results=3)
    # print(urls)
    pass
