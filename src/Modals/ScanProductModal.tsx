import React, { useEffect, useState, useCallback, useRef } from "react";
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
  Modal,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from "react-native-vision-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../services/api/api";
import Toast from "react-native-toast-message";
import { s, ScaledSheet } from "react-native-size-matters";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export type VerifiedProduct = {
  id: string;
  barcode: string;
  productId: number;
  name: string;
  price: number;
  image?: string;
  stock?: number;
  sale_available_stock?: number;
  product_type?: string;
  track_stock?: boolean;
  timestamp: number;
  verified: boolean;
  quantity: number;
};

interface ScanProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductsScanned?: (products: VerifiedProduct[]) => void;
  onProductScanned?: (product: VerifiedProduct) => void; // Single product callback
}

const ScanProductModal: React.FC<ScanProductModalProps> = ({
  visible,
  onClose,
  onProductsScanned,
  onProductScanned,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [verifiedProducts, setVerifiedProducts] = useState<VerifiedProduct[]>(
    []
  );
  const [isVerifying, setIsVerifying] = useState(false);
  // Track products by barcode for quantity management
  const [productsByBarcode, setProductsByBarcode] = useState<
    Map<string, VerifiedProduct>
  >(new Map());
  // Use ref to access current state in async callback
  const productsByBarcodeRef = useRef<Map<string, VerifiedProduct>>(new Map());

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (visible && !hasPermission) {
      requestPermission();
    }
  }, [visible, hasPermission, requestPermission]);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setIsActive(true);
      setVerifiedProducts([]);
      const newMap = new Map();
      setProductsByBarcode(newMap);
      productsByBarcodeRef.current = newMap;
    }
  }, [visible]);

  // Sync ref with state
  useEffect(() => {
    productsByBarcodeRef.current = productsByBarcode;
  }, [productsByBarcode]);

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
            sale_available_stock: apiProduct.sale_available_stock,
            product_type: apiProduct.product_type,
            track_stock: apiProduct.track_stock,
            timestamp: Date.now(),
            verified: true,
            quantity: 1,
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
          quantity: 1,
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
      if (codes.length > 0 && isActive && !isVerifying && visible) {
        const { type, value } = codes[0];
        const scannedValue = value || "";

        // Temporarily pause scanning
        setIsActive(false);

        // Check if this barcode was already scanned using ref for immediate access
        const existingProduct = productsByBarcodeRef.current.get(scannedValue);

        if (existingProduct && existingProduct.verified) {
          // Increment quantity for existing product
          const updatedProduct: VerifiedProduct = {
            ...existingProduct,
            quantity: existingProduct.quantity + 1,
            timestamp: Date.now(),
          };

          setProductsByBarcode((prev) => {
            const newMap = new Map(prev);
            newMap.set(scannedValue, updatedProduct);
            return newMap;
          });

          // Update verified products list
          setVerifiedProducts((prevList) =>
            prevList.map((p) =>
              p.barcode === scannedValue ? updatedProduct : p
            )
          );

          // Call single product callback with updated quantity
          if (onProductScanned) {
            onProductScanned(updatedProduct);
          }

          Toast.show({
            type: "success",
            text1: "Quantity Updated",
            text2: `${updatedProduct.name} (Qty: ${updatedProduct.quantity})`,
          });

          // Resume scanning
          setTimeout(() => {
            setIsActive(true);
          }, 1000);
          return;
        }

        // Verify barcode via API for new product
        const verifiedProduct = await verifyBarcode(scannedValue);

        if (verifiedProduct) {
          if (verifiedProduct.verified) {
            // Add to products map and list
            setProductsByBarcode((prev) => {
              const newMap = new Map(prev);
              newMap.set(scannedValue, verifiedProduct);
              productsByBarcodeRef.current = newMap; // Update ref immediately
              return newMap;
            });

            setVerifiedProducts((prev) => [...prev, verifiedProduct]);

            // Call single product callback
            if (onProductScanned) {
              onProductScanned(verifiedProduct);
            }

            Toast.show({
              type: "success",
              text1: "Product Added",
              text2: `${verifiedProduct.name} (Qty: ${verifiedProduct.quantity})`,
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
      const product = verifiedProducts.find((p) => p.id === id);
      if (product) {
        if (product.quantity > 1) {
          // Decrement quantity
          const updatedProduct: VerifiedProduct = {
            ...product,
            quantity: product.quantity - 1,
          };

          setProductsByBarcode((prev) => {
            const newMap = new Map(prev);
            newMap.set(product.barcode, updatedProduct);
            return newMap;
          });

          setVerifiedProducts((prev) =>
            prev.map((p) => (p.id === id ? updatedProduct : p))
          );
        } else {
          // Remove product completely
          setVerifiedProducts((prev) => prev.filter((item) => item.id !== id));
          setProductsByBarcode((prev) => {
            const newMap = new Map(prev);
            newMap.delete(product.barcode);
            return newMap;
          });
        }
      }
    },
    [verifiedProducts]
  );

  const handleClearAll = useCallback(() => {
    setVerifiedProducts([]);
    setProductsByBarcode(new Map());
  }, []);

  const handleDone = useCallback(() => {
    // Send all verified products if callback exists
    if (onProductsScanned && verifiedProducts.length > 0) {
      onProductsScanned(verifiedProducts.filter((p) => p.verified));
    }
    onClose();
  }, [onProductsScanned, verifiedProducts, onClose]);

  const renderPermissionView = () => (
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
  );

  const renderNoDeviceView = () => (
    <View style={styles.permissionContainer}>
      <Icon name="camera-alt" size={48} color="#999" />
      <Text style={styles.permissionText}>No camera device found</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Half - Scanner */}
        <View style={styles.cameraContainer}>
          {device && hasPermission ? (
            <>
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive && visible}
                codeScanner={codeScanner}
                enableZoomGesture
              />

              {/* Scanning overlay */}
              <View style={styles.overlay}>
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                  >
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
            </>
          ) : !hasPermission ? (
            renderPermissionView()
          ) : (
            renderNoDeviceView()
          )}
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
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 4,
                            }}
                          >
                            <Text style={styles.productQuantity}>
                              Qty: {item.quantity}
                            </Text>
                            <Text style={styles.productPrice}>
                              {" "}
                              • ₹{item.price.toFixed(2)}
                            </Text>
                          </View>
                          {item.sale_available_stock !== undefined && (
                            <Text style={styles.productStock}>
                              Stock: {item.sale_available_stock}
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
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleRemoveProduct(item.id)}
                    >
                      <Icon
                        name={item.quantity > 1 ? "remove" : "close"}
                        size={20}
                        color="#FF5C5C"
                      />
                    </TouchableOpacity>
                    {item.quantity > 1 && (
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    )}
                  </View>
                </View>
              )}
              contentContainerStyle={styles.listContent}
            />
          )}

          {/* Done Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleDone}
            >
              <Text style={styles.continueButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ScanProductModal;

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
    color: "#fff",
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
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    minWidth: 30,
    textAlign: "center",
  },
  productQuantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FCA311",
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
