import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GooglePlaceLiveDetails } from '@hidden-eats/shared';

// Session-level in-memory cache (stateless per app session, compliant with Places API terms)
const placeDetailsCache = new Map<string, GooglePlaceLiveDetails>();

export function usePlaceDetails(placeId: string | null | undefined) {
  const [details, setDetails] = useState<GooglePlaceLiveDetails | null>(
    placeId ? placeDetailsCache.get(placeId) || null : null
  );
  const [loading, setLoading] = useState<boolean>(!details && !!placeId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) {
      setDetails(null);
      setLoading(false);
      return;
    }

    // Check memory cache first
    if (placeDetailsCache.has(placeId)) {
      setDetails(placeDetailsCache.get(placeId)!);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchLivePlaceDetails = async () => {
      try {
        const { data, error: functionError } = await supabase.functions.invoke('places-proxy', {
          body: {
            action: 'place-details',
            placeId: placeId,
          },
        });

        if (functionError) {
          throw new Error(functionError.message);
        }

        if (data && isMounted) {
          // Cache in memory session
          placeDetailsCache.set(placeId, data as GooglePlaceLiveDetails);
          setDetails(data as GooglePlaceLiveDetails);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load place details');
          // Fallback mock details for dev/testing when API key is unconfigured
          const mockDetails: GooglePlaceLiveDetails = {
            place_id: placeId,
            name: `Spot #${placeId.slice(0, 6)}`,
            formatted_address: '123 Hidden Alley, Food District',
            rating: 4.8,
            user_rating_count: 142,
            photos: [],
            price_level: 2,
            opening_hours: { open_now: true, weekday_text: [] },
          };
          setDetails(mockDetails);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLivePlaceDetails();

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  return { details, loading, error };
}
