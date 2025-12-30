import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";

interface Addon {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  isSelected?: boolean;
}

const SelectAddonsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ROUTES.addons);

      if (response.data && Array.isArray(response.data)) {
        const transformedAddons = response.data.map((item: any) => ({
          id: item.id,
          name: item.name || "White T shirt",
          description: item.description || "White cotton logo print",
          image:
            item.image ||
            "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=T-Shirt",
          price: parseFloat(item.price || item.selling_price || 0),
          stock: parseInt(item.stock || item.quantity || 5),
        }));
        setAddons(transformedAddons);
      }
    } catch (error) {
      console.error("Error fetching addons:", error);
      // Fallback to dummy data if API fails
      setAddons([
        {
          id: 1,
          name: "White T shirt",
          description: "White cotton logo print",
          image:
            "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=T-Shirt",
          price: 299,
          stock: 5,
        },
        {
          id: 2,
          name: "White T shirt",
          description: "White cotton logo print",
          image:
            "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=T-Shirt",
          price: 299,
          stock: 5,
        },
        {
          id: 3,
          name: "White T shirt",
          description: "White cotton logo print",
          image:
            "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=T-Shirt",
          price: 299,
          stock: 0,
        },
        {
          id: 4,
          name: "White T shirt",
          description: "White cotton logo print",
          image:
            "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=T-Shirt",
          price: 299,
          stock: 0,
        },
        {
          id: 5,
          name: "White T shirt",
          description: "White cotton logo print",
          image:
            "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=T-Shirt",
          price: 299,
          stock: 5,
        },
        {
          id: 6,
          name: "White T shirt",
          description: "White cotton logo print",
          image:
            "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=T-Shirt",
          price: 299,
          stock: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddon = (addonId: number) => {
    setSelectedAddons((prev) => {
      if (prev.includes(addonId)) {
        return prev.filter((id) => id !== addonId);
      } else {
        return [...prev, addonId];
      }
    });
  };

  const handleContinue = () => {
    const selectedAddonData = addons.filter((addon) =>
      selectedAddons.includes(addon.id)
    );
    console.log("Selected addons:", selectedAddonData);
    // Navigate to next screen or handle selection
    navigation.goBack();
  };

  const renderAddonItem = ({ item }: { item: Addon }) => (
    <View style={styles.addonCard}>
      {item.stock > 0 && (
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>{item.stock} Pieces Left</Text>
        </View>
      )}

      <Image source={{ uri: item.image }} style={styles.addonImage} />

      <Text style={styles.addonName}>{item.name}</Text>
      <Text style={styles.addonDescription}>{item.description}</Text>

      <TouchableOpacity
        style={[
          styles.addButton,
          selectedAddons.includes(item.id) && styles.addButtonSelected,
          item.stock === 0 && styles.addButtonDisabled,
        ]}
        onPress={() => item.stock > 0 && toggleAddon(item.id)}
        disabled={item.stock === 0}
      >
        <Icon
          name={selectedAddons.includes(item.id) ? "check" : "plus"}
          size={16}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#FCA511" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Addons</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FCA511" />
          <Text style={styles.loadingText}>Loading addons...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FCA511" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Addons</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={addons}
        renderItem={renderAddonItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.addonsList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedAddons.length === 0 && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={selectedAddons.length === 0}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "20@s",
    paddingVertical: "15@s",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: "18@s",
    fontWeight: "bold",
    color: "#333",
    textDecorationLine: "underline",
    textDecorationColor: "#FCA511",
  },
  addonsList: {
    padding: "20@s",
  },
  addonCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "12@s",
    margin: "8@s",
    padding: "15@s",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  stockBadge: {
    position: "absolute",
    top: "10@s",
    left: "10@s",
    backgroundColor: "#666",
    borderRadius: "12@s",
    paddingHorizontal: "8@s",
    paddingVertical: "4@s",
    zIndex: 1,
  },
  stockText: {
    color: "#fff",
    fontSize: "10@s",
    fontWeight: "500",
  },
  addonImage: {
    width: "120@s",
    height: "120@s",
    borderRadius: "8@s",
    marginBottom: "10@s",
  },
  addonName: {
    fontSize: "14@s",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4@s",
    textAlign: "center",
  },
  addonDescription: {
    fontSize: "12@s",
    color: "#666",
    marginBottom: "15@s",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: "15@s",
    right: "15@s",
    width: "32@s",
    height: "32@s",
    borderRadius: "16@s",
    backgroundColor: "#FCA511",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButton: {
    backgroundColor: "#FCA511",
    marginHorizontal: "20@s",
    marginVertical: "20@s",
    paddingVertical: "15@s",
    borderRadius: "8@s",
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: "16@s",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: "10@s",
    fontSize: "16@s",
    color: "#666",
  },
});

export default SelectAddonsScreen;
