import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import LocationSelectionModal from "../Modals/LocationSelectionModal";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useUpdateVendorStoreMutation } from "../services/api/state-api-slice";
import Toast from "react-native-toast-message";
import Loading from "../CommonComponent/Loading";

type RootStackParamList = {
  SelectLocationScreen: undefined;
  StatisticsScreen: undefined;
  Bottomnavigation: undefined;
};

interface SelectLocationScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "SelectLocationScreen">;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  pincode: string;
}

const SelectLocationScreen: React.FC<SelectLocationScreenProps> = ({
  navigation,
}) => {
  const [updateVendorStore, { isLoading }] = useUpdateVendorStoreMutation();
  const insets = useSafeAreaInsets();
  const handleLocationSelect = async (location: Location) => {
    try {
      // Save store location to API
      const formData = new FormData();
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
      formData.append("address", location.address);
      if (location.pincode) {
        formData.append("pincode", location.pincode);
      }

      await updateVendorStore(formData).unwrap();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Store location saved successfully",
      });

      // Navigate to home page
      navigation.reset({
        index: 0,
        routes: [{ name: HomeNavigation.BOTTOM_NAVIGATION as never }],
      });
    } catch (error: any) {
      console.error("Error saving store location:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error?.data?.error || "Failed to save location. Please try again.",
      });
    }
  };

  const handleClose = () => {
    // Modal is non-skippable, so do nothing
    // User must select a location to proceed
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Loading visible={isLoading} />
      <LocationSelectionModal
        visible={true}
        onClose={handleClose}
        onLocationSelect={handleLocationSelect}
        initialLocation={null}
        nonSkippable={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default SelectLocationScreen;
