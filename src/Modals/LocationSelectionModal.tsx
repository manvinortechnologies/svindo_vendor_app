import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  PermissionsAndroid,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import {
  scale,
  verticalScale,
  moderateScale,
  s,
} from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";
import { GOOGLE_PLACES_API_KEY } from "../utils/apiKeys";
import { getLocationDetails } from "../utils/locationUtils";
import Toast from "react-native-toast-message";

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  pincode: string;
}

interface LocationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location | null;
  nonSkippable?: boolean;
}

const { width, height } = Dimensions.get("window");

// Utility function to round coordinates to 6 decimal places (10 cm precision)
const roundCoordinate = (coordinate: number): number => {
  return Math.round(coordinate * 1000000) / 1000000;
};

const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  visible,
  onClose,
  onLocationSelect,
  initialLocation,
  nonSkippable = false,
}) => {
  const mapRef = useRef<MapView>(null);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocation || null,
  );
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || 0,
    longitude: initialLocation?.longitude || 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Google Places states
  const [searchQuery, setSearchQuery] = useState(
    initialLocation?.address || "",
  );
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Check and request location permissions
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This app needs access to your location to show your current position.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          return true;
        } else {
          Toast.show({
            text1: "Permission Denied",
            type: "error",
          });
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS permissions are handled automatically
      setLocationPermission(true);
      return true;
    }
  };

  // Handle map press to select location
  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Round coordinates to 6 decimal places for better accuracy (10 cm precision)
    const roundedLatitude = roundCoordinate(latitude);
    const roundedLongitude = roundCoordinate(longitude);

    // Get address for the selected coordinates
    const locationDetails = await getLocationDetails(
      roundedLatitude,
      roundedLongitude,
    );
    const location: Location = {
      latitude: roundedLatitude,
      longitude: roundedLongitude,
      address: locationDetails?.address || "Address not found",
      pincode: locationDetails?.postalCode || "",
    };

    setSelectedLocation(location);
    setSearchQuery(locationDetails?.address || "");
  };

  // Confirm location selection
  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      Toast.show({
        text1: "No Location Selected",
        type: "error",
      });
      return;
    }

    onLocationSelect(selectedLocation);
    onClose();
  };

  // Google Places API functions
  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query,
        )}&key=${GOOGLE_PLACES_API_KEY}&components=country:in`,
      );
      const data = await response.json();

      if (data.status === "OK") {
        setPredictions(data.predictions);
        setShowPredictions(true);
      } else {
        console.error("Places API error:", data.status);
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setPredictions([]);
      setShowPredictions(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,address_components&key=${GOOGLE_PLACES_API_KEY}`,
      );
      const data = await response.json();

      if (data.status === "OK") {
        const place = data.result;
        const { lat, lng } = place.geometry.location;
        const address = place.formatted_address;

        // Round coordinates to 6 decimal places for better accuracy (10 cm precision)
        const roundedLatitude = roundCoordinate(lat);
        const roundedLongitude = roundCoordinate(lng);

        // Extract pincode from address components
        let pincode = "";
        if (place.address_components) {
          const postalCodeComponent = place.address_components.find(
            (component: any) => component.types.includes("postal_code"),
          );
          if (postalCodeComponent) {
            pincode = postalCodeComponent.long_name;
          }
        }

        const location: Location = {
          latitude: roundedLatitude,
          longitude: roundedLongitude,
          address,
          pincode,
        };

        setSelectedLocation(location);
        setSearchQuery(address);
        setShowPredictions(false);

        // Update map region
        const newRegion = {
          latitude: roundedLatitude,
          longitude: roundedLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    } catch (error) {
      console.error("Error getting place details:", error);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    // If user clears the search, hide predictions
    if (text.length === 0) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    // If user types coordinates manually (lat, lng format)
    // const coordinateMatch = text.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    // if (coordinateMatch) {
    //   const latitude = parseFloat(coordinateMatch[1]);
    //   const longitude = parseFloat(coordinateMatch[2]);

    //   if (
    //     latitude >= -90 &&
    //     latitude <= 90 &&
    //     longitude >= -180 &&
    //     longitude <= 180
    //   ) {
    //     // Valid coordinates
    //     const location: Location = {
    //       latitude,
    //       longitude,
    //       address: `${latitude}, ${longitude}`,
    //       pincode: '',
    //     };

    //     setSelectedLocation(location);
    //     setShowPredictions(false);

    //     // Update map region
    //     const newRegion = {
    //       latitude,
    //       longitude,
    //       latitudeDelta: 0.01,
    //       longitudeDelta: 0.01,
    //     };
    //     setRegion(newRegion);

    //     if (mapRef.current) {
    //       mapRef.current.animateToRegion(newRegion, 1000);
    //     }
    //     return;
    //   }
    // }

    // Otherwise, search for places
    searchPlaces(text);
  };

  const handlePredictionSelect = (prediction: PlacePrediction) => {
    getPlaceDetails(prediction.place_id);
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }

    setLoading(true);
    Geolocation.getCurrentPosition(
      async (position: any) => {
        const { latitude, longitude } = position.coords;

        // Round coordinates to 6 decimal places for better accuracy (10 cm precision)
        const roundedLatitude = roundCoordinate(latitude);
        const roundedLongitude = roundCoordinate(longitude);

        // Get address for current location
        const locationDetails = await getLocationDetails(
          roundedLatitude,
          roundedLongitude,
        );

        const newLocation: Location = {
          latitude: roundedLatitude,
          longitude: roundedLongitude,
          address: locationDetails?.address || "Address not found",
          pincode: locationDetails?.postalCode || "",
        };

        setCurrentLocation(newLocation);
        setSelectedLocation(newLocation);
        setSearchQuery(locationDetails?.address || "");

        const newRegion = {
          latitude: roundedLatitude,
          longitude: roundedLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        setLoading(false);
      },
      (error: any) => {
        setLoading(false);
        Toast.show({
          text1: "Error",
          type: "error",
          text2:
            "Unable to get current location. Please type your location manually.",
        });
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  };

  // Initialize location permission on component mount
  useEffect(() => {
    if (visible) {
      requestLocationPermission();
    }
  }, [visible]);

  // Reset state when modal opens
  useEffect(() => {
    if (visible && initialLocation) {
      setSelectedLocation(initialLocation);
      setSearchQuery(initialLocation.address || "");
      setRegion({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [visible, initialLocation]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={nonSkippable ? undefined : onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {!nonSkippable && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          )}
          {nonSkippable && <View style={styles.closeButton} />}
          <Text style={styles.headerTitle}>Select Location</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a place..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => setShowPredictions(predictions.length > 0)}
            />
            {searchLoading && (
              <ActivityIndicator size="small" color="#006EB2" />
            )}
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
            disabled={loading}
          >
            <Icon name="location" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Predictions List */}
        {showPredictions && predictions.length > 0 && (
          <View style={styles.predictionsContainer}>
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.predictionItem}
                  onPress={() => handlePredictionSelect(item)}
                >
                  <Icon name="location-outline" size={20} color="#666" />
                  <View style={styles.predictionTextContainer}>
                    <Text style={styles.predictionMainText}>
                      {item.structured_formatting.main_text}
                    </Text>
                    <Text style={styles.predictionSecondaryText}>
                      {item.structured_formatting.secondary_text}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.predictionsList}
            />
          </View>
        )}

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={region}
            onPress={handleMapPress}
            showsUserLocation={locationPermission}
            showsMyLocationButton={true}
            mapType="standard"
          >
            {!!currentLocation?.latitude && !!currentLocation?.longitude && (
              <Marker
                coordinate={currentLocation}
                title="Your Location"
                description="Your current location"
                pinColor="blue"
              />
            )}

            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Selected Location"
                description="Tap to select this location"
                pinColor="red"
              />
            )}
          </MapView>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#006EB2" />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          )}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedLocation && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmLocation}
          disabled={!selectedLocation}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#fff",
  },
  closeButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: scale(40),
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    marginRight: scale(8),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#333",
    paddingVertical: verticalScale(8),
  },
  currentLocationButton: {
    backgroundColor: "#006EB2",
    borderRadius: scale(8),
    padding: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  predictionsContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    maxHeight: height * 0.3,
  },
  predictionsList: {
    maxHeight: height * 0.3,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  predictionTextContainer: {
    marginLeft: scale(12),
    flex: 1,
  },
  predictionMainText: {
    fontSize: moderateScale(16),
    color: "#333",
    fontWeight: "500",
  },
  predictionSecondaryText: {
    fontSize: moderateScale(14),
    color: "#666",
    marginTop: verticalScale(2),
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(16),
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#006EB2",
    marginHorizontal: scale(16),
    marginVertical: verticalScale(16),
    paddingVertical: verticalScale(16),
    borderRadius: scale(8),
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});

export default LocationSelectionModal;
