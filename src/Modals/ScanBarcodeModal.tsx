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
import { s, ScaledSheet } from "react-native-size-matters";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type ScannedItem = {
  id: string;
  value: string;
  type: string;
  timestamp: number;
};

interface ScanBarcodeModalProps {
  visible: boolean;
  onClose: () => void;
  onScanComplete: (scannedItems: ScannedItem[]) => void;
}

const ScanBarcodeModal: React.FC<ScanBarcodeModalProps> = ({
  visible,
  onClose,
  onScanComplete,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

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
      setScannedItems([]);
    }
  }, [visible]);

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
      if (codes.length > 0 && isActive && visible) {
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
    if (scannedItems.length > 0) {
      onScanComplete(scannedItems);
    }
    onClose();
  }, [scannedItems, onScanComplete, onClose]);

  const handleRemoveItem = useCallback((id: string) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setScannedItems([]);
  }, []);

  if (!hasPermission) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.permissionContainer}>
            <Icon name="camera-alt" size={48} color="#999" />
            <Text style={styles.permissionText}>
              Camera permission required
            </Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.settingsButtonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButtonModal} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  if (!device) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.permissionContainer}>
            <Icon name="camera-alt" size={48} color="#999" />
            <Text style={styles.permissionText}>No camera device found</Text>
            <TouchableOpacity style={styles.closeButtonModal} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

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
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
                    <Text style={styles.itemType}>
                      {item.type.toUpperCase()}
                    </Text>
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
      </SafeAreaView>
    </Modal>
  );
};

export default ScanBarcodeModal;

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
  closeButtonModal: {
    backgroundColor: "#FF5C5C",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
