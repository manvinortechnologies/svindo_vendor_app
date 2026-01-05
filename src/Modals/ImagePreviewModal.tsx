import { Modal, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { Image } from "react-native";
import { s, ScaledSheet, vs } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Carousel from "react-native-reanimated-carousel";
import { useState } from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ImagePreviewModal({
  isImageModalVisible,
  setIsImageModalVisible,
  selectedImage,
  showDetails = true,
}: {
  isImageModalVisible: boolean;
  setIsImageModalVisible: (visible: boolean) => void;
  selectedImage: any;
  showDetails?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get images array - prioritize photos array, fallback to single image
  const images =
    selectedImage?.photos && selectedImage.photos.length > 0
      ? selectedImage.photos
      : selectedImage?.image
      ? [selectedImage.image]
      : [];

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image
          source={typeof item === "string" ? { uri: item } : item}
          style={styles.fullscreenImage}
          resizeMode="contain"
        />
      </View>
    );
  };

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
            {images.length > 1 ? (
              <>
                <Carousel
                  width={screenWidth}
                  height={screenHeight * 0.7}
                  data={images}
                  renderItem={renderCarouselItem}
                  onSnapToItem={(index) => setCurrentIndex(index)}
                  loop={false}
                  pagingEnabled
                />
                {/* Pagination indicator */}
                {/* <View style={styles.paginationContainer}>
                  {images.map((_item: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentIndex && styles.paginationDotActive,
                      ]}
                    />
                  ))}
                </View> */}
                {/* Image counter */}
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {currentIndex + 1} / {images.length}
                  </Text>
                </View>
              </>
            ) : images.length === 1 ? (
              <Image
                source={
                  typeof images[0] === "string" ? { uri: images[0] } : images[0]
                }
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            ) : null}
          </View>

          {showDetails && (
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
          )}
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
    width: "100%",
    height: screenHeight - vs(220),
    borderRadius: "10@s",
    overflow: "hidden",
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth,
    height: screenHeight - vs(100),
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  paginationDotActive: {
    backgroundColor: "#FCA311",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  imageCounter: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 5,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
