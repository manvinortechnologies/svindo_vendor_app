import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { Image } from "react-native";
import { s, ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ImagePreviewModal({
  isImageModalVisible,
  setIsImageModalVisible,
  selectedImage,
}: {
  isImageModalVisible: boolean;
  setIsImageModalVisible: (visible: boolean) => void;
  selectedImage: any;
}) {
  return (
    <Modal
      visible={isImageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsImageModalVisible(false)}
    >
      <SafeAreaView style={styles.imageModalContainer}>
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageCloseButton}
            onPress={() => setIsImageModalVisible(false)}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.imageModalImageContainer}>
            <Image
              source={selectedImage?.image}
              style={[
                styles.fullscreenImage,
                {
                  width: s(300),
                  height: s(500),
                },
              ]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.imageInfo}>
            <Text style={styles.imageProductName}>
              {selectedImage?.productName}
            </Text>
            {selectedImage?.description && (
              <Text style={styles.imageProductDesc}>
                {selectedImage.description}
              </Text>
            )}
            <Text style={styles.imageProductBudget}>
              Budget: ₹{selectedImage?.budget}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = ScaledSheet.create({
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 20,
  },
  imageCloseButton: {
    position: "absolute",
    top: "20@s",
    right: "25@s",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullscreenImage: {
    // maxWidth: "100%",
    // maxHeight: "100%",
    borderRadius: "10@s",
    overflow: "hidden",
  },
  imageInfo: {
    // position: "absolute",
    // bottom: 50,
    // left: 20,
    // right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    marginBottom: "30@s",
    borderRadius: 10,
  },
  imageProductName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  imageProductDesc: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 5,
  },
  imageProductBudget: {
    fontSize: 16,
    color: "#FCA311",
    textAlign: "center",
    fontWeight: "600",
  },
});
