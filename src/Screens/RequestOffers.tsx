import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../CommonComponent/CustomHeader";
import Carousel from "react-native-reanimated-carousel";
import { APP_CONSTANTS } from "../constants/app.constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { s, ScaledSheet, vs } from "react-native-size-matters";
import ImagePreviewModal from "../Modals/ImagePreviewModal";
import Loading from "../CommonComponent/Loading";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

interface RootStackParamList extends ParamListBase {
  RequestOffers: { requestId: string };
}

type RequestOffersScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function RequestOffers() {
  const route = useRoute<RouteProp<RootStackParamList, "RequestOffers">>();
  const requestId = route.params?.requestId;
  const navigation = useNavigation<RequestOffersScreenNavigationProp>();

  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  // Handle image press to show fullscreen modal
  const handleImagePress = (item: any) => {
    setSelectedImage(item);
    setIsImageModalVisible(true);
  };

  const transformOfferData = (offer: any) => {
    return {
      id: offer.id.toString(),
      productName: offer.heading || "Special Offer",
      category: offer.request_details?.category_details?.name || "Unknown",
      subCategory:
        offer.request_details?.sub_category_details?.name || "Unknown",
      vendorId: offer.vendor_details?.id?.toString() || "Unknown",
      vendorName: offer.vendor_details?.company_name || "Unknown Vendor",
      city: offer.vendor_details?.city || "Unknown",
      description: offer.description,
      offerPrice: offer.selling_price?.toString() || "0",
      originalPrice: offer.request_details?.budget?.toString() || "0",
      discount: offer.discount || "0%",
      image: offer.media
        ? {
            uri: offer.media.includes("http")
              ? offer.media
              : APP_CONSTANTS.API_BASE_URL + offer.media,
          }
        : require("../assets/product/product1.png"),
      rating: offer.rating || 4.5,
      reviews: offer.reviews_count || 0,
      created_at: offer.created_at,
      vendor_details: offer.seller_user_details,
      store_details: offer.store,
      request_details: offer.request_details,
    };
  };

  // Fetch offers for a specific request
  const fetchOffers = async () => {
    try {
      setLoadingOffers(true);
      const response = await api.get(
        `${API_ROUTES.getOffersById}/${requestId}`
      );
      const offersData = response.data || [];
      setOffers(offersData.map(transformOfferData));
    } catch (error) {
      console.error("Error fetching offers:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load offers. Please try again.",
      });
    } finally {
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchOffers();
    }
  }, [requestId]);

  return (
    <SafeAreaView>
      <CustomHeader title="Request Offers" showBackButton={true} />
      <Loading visible={loadingOffers} />
      <Carousel
        vertical={true}
        pagingEnabled={true}
        loop={false}
        width={width}
        height={Dimensions.get("window").height}
        data={offers || []}
        onProgressChange={() => {}}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.fullScreenCard}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => handleImagePress(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={item.image}
                  style={styles.fullScreenProductImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>

            {/* Customer wants to buy */}
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerText}>
                  Store : {item.store_details?.name}
                </Text>
                {/* {item.type && (
                  <View
                    style={[
                      styles.requestTypeBadge,
                      {
                        backgroundColor:
                          item.type === "personal" ? "#4CAF50" : "#2196F3",
                      },
                    ]}
                  >
                    <Text style={styles.requestTypeText}>
                      {item.type === "personal" ? "Personal" : "Business"}
                    </Text>
                  </View>
                )} */}
              </View>
              <TouchableOpacity
                style={styles.sellButton}
                onPress={() => {
                  // Buy now for offers
                  console.log("Buy now:", item.id);
                }}
              >
                <Text style={styles.sellButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>

            {/* Product Name */}
            {<Text style={styles.productName}>{item.productName}</Text>}

            {/* Details */}
            <View style={styles.detailsRow}>
              {/* {selectedTab === "Requested" && ( */}
              {/* // Your request or other tabs details */}
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: s(10),
                  }}
                >
                  <View>
                    <Text style={styles.label}>
                      Category{"\n"}
                      <Text style={styles.subLabel}>{item.category}</Text>
                    </Text>
                  </View>
                  <Text style={styles.budgetText}>₹{item.offerPrice}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: s(10),
                  }}
                >
                  <View>
                    <Text style={styles.label}>Sub Category</Text>
                    <Text style={styles.subLabel}>{item.subCategory}</Text>
                  </View>
                </View>
                <View>
                  <Text style={[styles.label]}>Description</Text>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
              </>
            </View>
          </View>
        )}
      />
      <ImagePreviewModal
        isImageModalVisible={isImageModalVisible}
        setIsImageModalVisible={setIsImageModalVisible}
        selectedImage={selectedImage}
      />
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  fullScreenCard: {
    backgroundColor: "#FFFAF2",
    marginHorizontal: 12,
    // marginVertical: 6,
    borderRadius: 12,
    padding: 15,
    height: Dimensions.get("window").height - vs(120), // Exact height for paging
    // justifyContent: "space-between",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
    height: "250@s",
    // backgroundColor: "red",
  },
  fullScreenProductImage: {
    width: "100%",
    height: "100%",
    // backgroundColor: "yellow",
    borderRadius: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  customerText: {
    color: "#F59E0B",
    fontSize: 20,
    fontWeight: "600",
  },
  requestTypeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  requestTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  sellButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "#000",
    minWidth: "100@s",
    alignItems: "center",
    justifyContent: "center",
  },
  sellButtonText: {
    fontSize: "14@s",
    color: "#fff",
    fontWeight: "600",
  },
  productName: {
    fontSize: "18@s",
    fontWeight: "600",
    color: "#000",
    marginVertical: 8,
  },
  detailsRow: {
    marginTop: 6,
  },
  detailsLeft: {
    flex: 1,
    gap: 5,
  },
  label: {
    fontSize: "10@s",
    color: "#727272",

    fontWeight: "600",
  },
  subLabel: {
    fontSize: "14@s",
    fontWeight: "500",
    color: "#000",
  },
  descriptionText: {
    fontSize: "12@s",
    fontWeight: "500",
    color: "#000",
  },
  budgetText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
});
