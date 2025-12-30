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
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from "react-native-vision-camera";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type ScannedItem = {
  id: string;
  value: string;
  type: string;
  timestamp: number;
};

type RootStackParamList = {
  ScanBarcode: {
    onScanComplete: (scannedItems: ScannedItem[]) => void;
  };
};

const VisionCameraScanner = () => {
  const insets = useSafeAreaInsets();
  const [isActive, setIsActive] = useState(true);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ScanBarcode">>();
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

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
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isActive) {
        const { type, value } = codes[0];
        const scannedValue = value || "";

        // Check if this code was already scanned
        const isDuplicate = scannedItems.some(
          (item) => item.value === scannedValue && item.type === type
        );

        if (!isDuplicate && scannedValue) {
          // Add to scanned items list
          const newItem: ScannedItem = {
            id: `${Date.now()}-${Math.random()}`,
            value: scannedValue,
            type: type || "unknown",
            timestamp: Date.now(),
          };
          setScannedItems((prev) => [...prev, newItem]);

          // Temporarily pause scanning to prevent duplicate scans
          setIsActive(false);
          setTimeout(() => {
            setIsActive(true);
          }, 1000);
        }
      }
    },
  });

  const handleContinue = useCallback(() => {
    if (route.params?.onScanComplete && scannedItems.length > 0) {
      route.params.onScanComplete(scannedItems);
    }
    navigation.goBack();
  }, [scannedItems, route.params, navigation]);

  const handleRemoveItem = useCallback((id: string) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setScannedItems([]);
  }, []);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No camera device found</Text>
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
              Position the code within the frame
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Half - Scanned Data List */}
      <View style={styles.dataContainer}>
        <View style={styles.dataHeader}>
          <Text style={styles.dataHeaderText}>
            Scanned Items ({scannedItems.length})
          </Text>
          {scannedItems.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {scannedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="qr-code-scanner" size={48} color="#999" />
            <Text style={styles.emptyText}>No items scanned yet</Text>
            <Text style={styles.emptySubtext}>
              Scan barcodes to see them here
            </Text>
          </View>
        ) : (
          <FlatList
            data={scannedItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.scannedItem}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemValue} numberOfLines={1}>
                    {item.value}
                  </Text>
                  <Text style={styles.itemType}>{item.type.toUpperCase()}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Icon name="close" size={20} color="#FF5C5C" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Continue Button */}
        {scannedItems.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default VisionCameraScanner;

const styles = StyleSheet.create({
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
  scannedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  itemType: {
    fontSize: 12,
    color: "#666",
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
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
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
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
  },
  resultContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    width: "100%",
  },
  resultLabel: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 5,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  scanButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
