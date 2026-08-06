import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_MAPS_SERVER_KEY = Deno.env.get("GOOGLE_MAPS_SERVER_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, placeId, query, lat, lng, radius = 5000, photoReference } = await req.json();

    if (!GOOGLE_MAPS_SERVER_KEY) {
      return new Response(
        JSON.stringify({ error: "Server API key missing in environment secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. PLACE DETAILS ACTION
    if (action === "place-details") {
      if (!placeId) {
        return new Response(
          JSON.stringify({ error: "placeId parameter is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Call Google Places API (New) - Place Details
      const googleUrl = `https://places.googleapis.com/v1/places/${placeId}`;
      const res = await fetch(googleUrl, {
        headers: {
          "X-Goog-Api-Key": GOOGLE_MAPS_SERVER_KEY,
          "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,photos,regularOpeningHours,priceLevel,location",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: data.error?.message || "Failed to fetch place details" }),
          { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Sanitize output for client
      const result = {
        place_id: data.id,
        name: data.displayName?.text || "",
        formatted_address: data.formattedAddress || "",
        rating: data.rating || null,
        user_rating_count: data.userRatingCount || 0,
        photos: (data.photos || []).map((p: any) => ({
          photo_reference: p.name,
          height: p.heightPx,
          width: p.widthPx,
        })),
        opening_hours: data.regularOpeningHours ? {
          open_now: data.regularOpeningHours.openNow || false,
          weekday_text: data.regularOpeningHours.weekdayDescriptions || [],
        } : undefined,
        price_level: data.priceLevel ? parsePriceLevel(data.priceLevel) : 2,
        location: data.location ? {
          lat: data.location.latitude,
          lng: data.location.longitude,
        } : undefined,
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. NEARBY SEARCH ACTION
    if (action === "nearby-search") {
      if (!lat || !lng) {
        return new Response(
          JSON.stringify({ error: "lat and lng parameters are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const googleUrl = `https://places.googleapis.com/v1/places:searchNearby`;
      const res = await fetch(googleUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_SERVER_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.priceLevel,places.location",
        },
        body: JSON.stringify({
          includedTypes: ["restaurant", "cafe", "meal_takeaway"],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radius,
            },
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: data.error?.message || "Failed to search nearby places" }),
          { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const places = (data.places || []).map((p: any) => ({
        place_id: p.id,
        name: p.displayName?.text || "",
        formatted_address: p.formattedAddress || "",
        rating: p.rating || null,
        user_rating_count: p.userRatingCount || 0,
        photos: (p.photos || []).map((ph: any) => ({
          photo_reference: ph.name,
          height: ph.heightPx,
          width: ph.widthPx,
        })),
        price_level: p.priceLevel ? parsePriceLevel(p.priceLevel) : 2,
        location: p.location ? {
          lat: p.location.latitude,
          lng: p.location.longitude,
        } : undefined,
      }));

      return new Response(JSON.stringify({ places }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. PHOTO ACTION
    if (action === "photo") {
      if (!photoReference) {
        return new Response(
          JSON.stringify({ error: "photoReference is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const photoUrl = `https://places.googleapis.com/v1/${photoReference}/media?maxHeightPx=800&maxWidthPx=1200&key=${GOOGLE_MAPS_SERVER_KEY}`;
      return new Response(JSON.stringify({ photo_url: photoUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: `Unknown action type: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function parsePriceLevel(priceLevelStr: string): number {
  switch (priceLevelStr) {
    case "PRICE_LEVEL_FREE": return 0;
    case "PRICE_LEVEL_INEXPENSIVE": return 1;
    case "PRICE_LEVEL_MODERATE": return 2;
    case "PRICE_LEVEL_EXPENSIVE": return 3;
    case "PRICE_LEVEL_VERY_EXPENSIVE": return 4;
    default: return 2;
  }
}
