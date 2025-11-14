import { GOOGLE_PLACES_API_KEY } from "./apiKeys";

export const getLocationDetails = async (
  latitude: number,
  longitude: number
) => {
  try {
    // First, get basic address using reverse geocoding
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`
    );
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status === "OK" && geocodeData.results.length > 0) {
      const result = geocodeData.results[0];
      const addressComponents = result.address_components;

      // Extract location details from address components
      let city = "";
      let state = "";
      let country = "";
      let postalCode = "";
      let placeName = "";

      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (types.includes("country")) {
          country = component.long_name;
        } else if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      // Try to get a more specific place name using Places API
      try {
        const placesResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=100&key=${GOOGLE_PLACES_API_KEY}`
        );
        const placesData = await placesResponse.json();

        if (placesData.status === "OK" && placesData.results.length > 0) {
          // Find the most relevant place (usually the first one)
          const place = placesData.results[0];
          placeName = place.name;
        }
      } catch (placesError) {
        console.log("Places API error:", placesError);
        // Continue without place name if Places API fails
      }

      return {
        latitude,
        longitude,
        address: result.formatted_address,
        placeName: placeName || city || "Unknown Location",
        city,
        state,
        country,
        postalCode,
      };
    } else {
      throw new Error("Unable to get location details");
    }
  } catch (error) {
    console.error("Error getting location details:", error);
    throw error;
  }
};
