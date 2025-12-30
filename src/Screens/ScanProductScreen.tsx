import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from "react-native-vision-camera";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../services/api/api";
import Toast from "react-native-toast-message";
import { s, ScaledSheet } from "react-native-size-matters";
import { THomeNavigation } from "../type/index";
import { HomeNavigation } from "../constants/app-routes.constants";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type VerifiedProduct = {
  id: string;
  barcode: string;
  productId: number;
  name: string;
  price: number;
  image?: string;
  stock?: number;
  product_type?: string;
  track_stock?: boolean;
  timestamp: number;
  verified: boolean;
};

const ScanProductScreen = () => {
  const insets = useSafeAreaInsets();
  const [isActive, setIsActive] = useState(true);
  const [verifiedProducts, setVerifiedProducts] = useState<VerifiedProduct[]>(
    []
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<Set<string>>(
    new Set()
  );

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation<StackNavigationProp<THomeNavigation>>();
  const route =
    useRoute<RouteProp<THomeNavigation, typeof HomeNavigation.SCAN_PRODUCT>>();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Verify barcode via API
  const verifyBarcode = useCallback(
    async (barcode: string): Promise<VerifiedProduct | null> => {
      try {
        setIsVerifying(true);
        const response = await api.get(
          `vendor/barcode-lookup/?barcode=${encodeURIComponent(barcode)}`
        );

        if (response.data && response.data.id) {
          const apiProduct = response.data;
          return {
            id: `${Date.now()}-${Math.random()}`,
            barcode: barcode,
            productId: apiProduct.id,
            name:
              apiProduct.name || apiProduct.product_name || "Unknown Product",
            price: apiProduct.sales_price || apiProduct.price || 0,
            image: apiProduct.image || "",
            stock: apiProduct.stock,
            product_type: apiProduct.product_type,
            track_stock: apiProduct.track_stock,
            timestamp: Date.now(),
            verified: true,
          };
        }
        return null;
      } catch (error: any) {
        console.error(`Error verifying barcode ${barcode}:`, error);
        // Return a failed verification product
        return {
          id: `${Date.now()}-${Math.random()}`,
          barcode: barcode,
          productId: 0,
          name: "Not Found",
          price: 0,
          timestamp: Date.now(),
          verified: false,
        };
      } finally {
        setIsVerifying(false);
      }
    },
    []
  );

  const codeScanner = useCodeScanner({
    codeTypes: [
      "qr",
      "ean-13",
      "ean-8",
      "code-128",
      "code-39",
      "code-93",
      "codabar",
      "data-matrix",
      "pdf-417",
      "upc-a",
      "upc-e",
    ],
    onCodeScanned: async (codes) => {
      if (codes.length > 0 && isActive && !isVerifying) {
        const { type, value } = codes[0];
        const scannedValue = value || "";

        // Check if this barcode was already scanned
        if (scannedBarcodes.has(scannedValue)) {
          return;
        }

        // Add to scanned set
        setScannedBarcodes((prev) => new Set(prev).add(scannedValue));

        // Temporarily pause scanning
        setIsActive(false);

        // Verify barcode via API
        const verifiedProduct = await verifyBarcode(scannedValue);

        if (verifiedProduct) {
          if (verifiedProduct.verified) {
            setVerifiedProducts((prev) => [...prev, verifiedProduct]);

            // Immediately add to cart via callback if available
            if (route.params?.onProductsScanned) {
              route.params.onProductsScanned([verifiedProduct]);
            }

            Toast.show({
              type: "success",
              text1: "Product Added",
              text2: verifiedProduct.name,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Not Found",
              text2: `Barcode ${scannedValue} not found in system`,
            });
          }
        }

        // Resume scanning after a delay to allow continuous scanning
        setTimeout(() => {
          setIsActive(true);
        }, 1000);
      }
    },
  });

  const handleRemoveProduct = useCallback(
    (id: string) => {
      setVerifiedProducts((prev) => prev.filter((item) => item.id !== id));
      // Also remove from scanned barcodes set
      setScannedBarcodes((prev) => {
        const newSet = new Set(prev);
        const product = verifiedProducts.find((p) => p.id === id);
        if (product) {
          newSet.delete(product.barcode);
        }
        return newSet;
      });
    },
    [verifiedProducts]
  );

  const handleClearAll = useCallback(() => {
    setVerifiedProducts([]);
    setScannedBarcodes(new Set());
  }, []);

  const handleContinue = useCallback(() => {
    // Continue button is optional now since products are added immediately
    // But we can still send all verified products if needed
    navigation.goBack();
  }, [navigation]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Icon name="camera-alt" size={48} color="#999" />
          <Text style={styles.permissionText}>Camera permission required</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Icon name="camera-alt" size={48} color="#999" />
          <Text style={styles.permissionText}>No camera device found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Top Half - Scanner */}
      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          enableZoomGesture
        />

        {/* Scanning overlay */}
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Position the barcode within the frame
            </Text>
            {isVerifying && (
              <View style={styles.verifyingContainer}>
                <ActivityIndicator size="small" color="#FCA311" />
                <Text style={styles.verifyingText}>Verifying...</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Bottom Half - Verified Products List */}
      <View style={styles.dataContainer}>
        <View style={styles.dataHeader}>
          <Text style={styles.dataHeaderText}>
            Verified Products (
            {verifiedProducts.filter((p) => p.verified).length})
          </Text>
          {verifiedProducts.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {verifiedProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="qr-code-scanner" size={48} color="#999" />
            <Text style={styles.emptyText}>No products scanned yet</Text>
            <Text style={styles.emptySubtext}>
              Scan product barcodes to verify and add them
            </Text>
          </View>
        ) : (
          <FlatList
            data={verifiedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <View style={styles.productContent}>
                  <View style={styles.productInfo}>
                    <Text
                      style={[
                        styles.productName,
                        !item.verified && styles.productNameError,
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {item.verified ? (
                      <>
                        <Text style={styles.productBarcode}>
                          Barcode: {item.barcode}
                        </Text>
                        <Text style={styles.productPrice}>
                          ₹{item.price.toFixed(2)}
                        </Text>
                        {item.stock !== undefined && (
                          <Text style={styles.productStock}>
                            Stock: {item.stock}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text style={styles.errorText}>
                        Barcode {item.barcode} not found
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveProduct(item.id)}
                >
                  <Icon name="close" size={20} color="#FF5C5C" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Done Button - Optional, products are added immediately */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ScanProductScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cameraContainer: {
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: "#1a1a1a",
  },
  dataContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopWidth: 2,
    borderTopColor: "#FCA311",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#00ff00",
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instructions: {
    padding: 20,
    alignItems: "center",
  },
  instructionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 8,
  },
  verifyingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  verifyingText: {
    color: "#FCA311",
    fontSize: 14,
    marginLeft: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  permissionText: {
    color: "#666",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  settingsButton: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  settingsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dataHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dataHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: "#FF5C5C",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  productContent: {
    flex: 1,
    marginRight: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  productNameError: {
    color: "#FF5C5C",
  },
  productBarcode: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FCA311",
    marginTop: 4,
  },
  productStock: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#FF5C5C",
    marginTop: 4,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  continueButton: {
    backgroundColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
