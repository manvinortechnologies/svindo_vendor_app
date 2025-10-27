import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";
import NavigationButton from "./NavigationButton";
import CustomSwitch from "./CustomSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, ScaledSheet } from "react-native-size-matters";
import {
  useGetVendorStoresQuery,
  useUpdateVendorStoreMutation,
} from "../services/api/state-api-slice";
import EditStoreModal from "../Modals/EditStoreModal";
import { APP_CONSTANTS } from "../constants/app.constants";
import { HomeNavigation } from "../constants/app-routes.constants";
import Carousel from "react-native-reanimated-carousel";
import Video from "react-native-video";
import Modal from "react-native-modal";
import CustomHeader from "../CommonComponent/CustomHeader";
const screenWidth = Dimensions.get("window").width - 20;
const { width, height } = Dimensions.get("window");

interface Product {
  id: string;
  name: string;
  image: any;
}

const orderTypes = ["Online Store", " | ", "Tools"];

const products = [
  {
    id: "1",
    name: "Product 1",
    discount: "30",
    description: "This is product 1",
    price: "10",
    image: require("../assets/product.png"),
    type: "Top Liked",
  },
  {
    id: "2",
    name: "Product 2",
    discount: "30",
    description: "This is product 2",
    price: "20",
    image: require("../assets/product.png"),
    type: "Top Liked",
  },
  {
    id: "3",
    name: "Product 3",
    discount: "30",
    description: "This is product 3",
    price: "30",
    image: require("../assets/product.png"),
    type: "Top Liked",
  },
  {
    id: "4",
    name: "Product 4",
    discount: "30",
    description: "This is product 4",
    price: "40",
    image: require("../assets/product.png"),
    type: "Top Rated",
  },
  {
    id: "5",
    name: "Product 5",
    discount: "30",
    description: "This is product 5",
    price: "50",
    image: require("../assets/product.png"),
    type: "Top Rated",
  },
  {
    id: "6",
    name: "Product 6",
    discount: "30",
    description: "This is product 6",
    price: "60",
    image: require("../assets/product.png"),
    type: "Top Rated",
  },
];

const getFilteredProducts = (type: string) => {
  return products
    .filter((product) => product.type === type)
    .slice(0, type === "Low Stock" ? 6 : 3);
};
const videoData = [
  { id: 1, source: require("../assets/product/product3.png") },
  { id: 2, source: require("../assets/product/product3.png") },
  { id: 3, source: require("../assets/product/product3.png") },
  { id: 4, source: require("../assets/product/product3.png") },
];
const spotlightProducts = [
  {
    id: 1,
    image: require("../assets/product/spotlight.png"),
    discount: "50% OFF",
  },
  {
    id: 2,
    image: require("../assets/product/spotlight1.png"),
    discount: "40% OFF",
  },
  {
    id: 3,
    image: require("../assets/product/spotlight3.png"),
    discount: "30% OFF",
  },
  {
    id: 4,
    image: require("../assets/product/spotlight1.png"),
    discount: "20% OFF",
  },
  {
    id: 5,
    image: require("../assets/product/spotlight.png"),
    discount: "10% OFF",
  },
  {
    id: 6,
    image: require("../assets/product/spotlight3.png"),
    discount: "60% OFF",
  },
];
const Storescreen = ({ navigation }: any) => {
  const [disabletab, setdisable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Video Modal state
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState<
    "name" | "banner" | "logo" | "about" | null
  >(null);

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideo(null);
    setIsVideoPaused(false);
    setIsVideoLoading(false);
  };

  const toggleVideoPlayPause = () => {
    setIsVideoPaused(!isVideoPaused);
  };

  const handleVideoPress = (video: any) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
    setIsVideoLoading(true);
  };

  // Fetch store data from API
  const {
    data: storeData,
    error,
    isLoading,
    refetch,
  } = useGetVendorStoresQuery();
  const [updateVendorStore, { isLoading: isUpdating }] =
    useUpdateVendorStoreMutation();

  // Handle edit actions
  const handleEditPress = (type: "name" | "banner" | "logo" | "about") => {
    setEditType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditType(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      await updateVendorStore(formData).unwrap();
      Alert.alert("Success", "Store details updated successfully");
      handleModalClose();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.error || "Failed to update store details"
      );
    }
  };

  const toggleDisable = async () => {
    try {
      await updateVendorStore({ is_active: !disabletab }).unwrap();
      Alert.alert("Success", "Store disabled successfully");
      setdisable(!disabletab);
    } catch (error) {
      console.error("Error updating disable status:", error);
    }
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#006EB2" />
        <Text style={styles.loadingText}>Loading store details...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>Failed to load store details</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Store"
        titleStyle={{ textAlign: "left" }}
        showBackButton={false}
        rightIcon={
          <TouchableOpacity
            style={{
              padding: 5,
              backgroundColor: "#006EB2",
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#fff" }}>View Store</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#006EB2"]} // Android
            tintColor="#006EB2" // iOS
            title="Pull to refresh" // iOS
            titleColor="#666" // iOS
          />
        }
      >
        {/* Top Header */}

        {/* Store Banner */}
        <Image
          source={
            storeData?.banner_image
              ? { uri: APP_CONSTANTS.API_BASE_URL + storeData.banner_image }
              : require("../assets/product/product2.png")
          }
          style={styles.banner}
        />

        {/* Store Details Card */}
        <View style={styles.detailsCardContainer}>
          <View style={styles.detailsCard}>
            {/* Store Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={
                  storeData?.profile_image
                    ? {
                        uri:
                          APP_CONSTANTS.API_BASE_URL + storeData.profile_image,
                      }
                    : require("../assets/product/storelogo.png")
                }
                style={styles.logo}
              />
              <TouchableOpacity onPress={() => handleEditPress("logo")}>
                <Text style={styles.openLabel}>Edit Logo</Text>
              </TouchableOpacity>
              <View style={styles.storeContainer}>
                <Text style={styles.storetext}>
                  {storeData?.name || "Business Name"}
                </Text>
                <TouchableOpacity onPress={() => handleEditPress("name")}>
                  <Icon
                    name="pencil-outline"
                    size={28}
                    color="#000"
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Store Info */}
            <View style={styles.infoContainer}>
              <View style={styles.editbannner}>
                <TouchableOpacity onPress={() => handleEditPress("banner")}>
                  <Text style={{ color: "#000" }}>
                    Edit <Icon name="pencil-outline" size={20} color="#000" />
                    {"\n"}
                    banner
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.ratingContainer}>
                <MaterialIcon name="location-on" size={25} color="#006EB2" />
                <Text style={{ color: "#000" }}>Location</Text>
              </View>
              {/* Follow Button and Icons */}
              <View style={styles.actionsContainer}>
                {/* <Icon name="bell-outline" size={24} color="#000" style={styles.actionIcon} /> */}
                <CustomSwitch
                  value={disabletab}
                  onValueChange={toggleDisable}
                  activeColor="#830002"
                  inactiveColor="#999"
                  borderColor="#4CAF50"
                />

                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followText}>Disable</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.textheaderContainer}>
              <Text style={styles.textheader}>About</Text>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => handleEditPress("about")}
              >
                <Icon name="pencil-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.additionalText}>{storeData?.about}</Text>
          </View>
        </View>
        {/* Additional Text at the Bottom */}

        <View style={[styles.Containertitle, { marginHorizontal: s(10) }]}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FCA311",
              padding: 6,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
            onPress={() => {
              navigation.navigate(HomeNavigation.ADD_BANNER_SCREEN);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Add Banners
            </Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitleRight}>Max - 3</Text>
        </View>
        {/* Scrollable Banner */}
        <Carousel
          data={storeData?.banners || []}
          renderItem={({ item }) => (
            <Image
              source={{ uri: APP_CONSTANTS.API_BASE_URL + item.banner_image }}
              style={styles.scrollBanner}
            />
          )}
          width={width}
          height={s(150)}
        />

        <View style={styles.spotlightSection}>
          <View style={styles.Containerspotlight}>
            <TouchableOpacity
              style={{
                backgroundColor: "#FCA311",
                padding: 6,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
              onPress={() => {
                navigation.navigate("AddSpotlightScreen");
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Add Spotlight
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitleRight}>Max - 4 Max - 8</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.productcontainer}
          >
            {storeData?.spotlight_products &&
              storeData.spotlight_products.length > 0 &&
              storeData.spotlight_products.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <View style={styles.stockBadgeAbove}>
                    <Text style={styles.stockText}>
                      {product.discount} % OFF
                    </Text>
                  </View>
                  <Image source={product.image} style={styles.productImage} />

                  <View style={styles.productDetails}>
                    <View style={styles.productTextContainer}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productDescription}>
                        {product?.description?.slice(0, 15)}...
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.productPrice}>
                        Rs {product.price}
                      </Text>
                      <Text style={styles.addbtn}>Remove</Text>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
          <View></View>
        </View>

        <View style={styles.highlightsSection}>
          <View style={styles.Containertitle}>
            <TouchableOpacity
              style={{
                backgroundColor: "#FCA311",
                padding: 6,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
              onPress={() => {
                navigation.navigate("AddPostScreen");
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Add Posts
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitleRight}>Max - 4</Text>
          </View>
          <Carousel
            data={storeData?.posts || []}
            renderItem={({ item: post }) => (
              <View style={styles.highlightCard}>
                <Image
                  source={
                    post.media
                      ? { uri: APP_CONSTANTS.API_BASE_URL + post.media }
                      : require("../assets/product/product2.png")
                  }
                  style={styles.highlightImage}
                />
                <View style={styles.postcontainer}>
                  <Text style={styles.highlightDescription}>
                    Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit
                    amet consectetur Lorem ipsum dolor sit amet consectetur.
                  </Text>

                  <View style={styles.highlightControls}>
                    <TouchableOpacity style={styles.openButton}>
                      <Text style={styles.openText}>Boost</Text>
                    </TouchableOpacity>
                    <Icon name="tray-arrow-up" size={24} color="#000" />
                    <Icon name="dots-vertical" size={24} color="#000" />
                  </View>
                </View>
              </View>
            )}
            width={width}
            height={s(250)}
          />
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            style={{ marginBottom: 20 }}
          >
            {storeData?.posts &&
              storeData.posts.length > 0 &&
              storeData.posts.map((post) => (
                <View style={styles.highlightCard}>
                  <Image
                    source={
                      post.media
                        ? { uri: APP_CONSTANTS.API_BASE_URL + post.media }
                        : require("../assets/product/product2.png")
                    }
                    style={styles.highlightImage}
                  />
                  <View style={styles.postcontainer}>
                    <Text style={styles.highlightDescription}>
                      Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor
                      sit amet consectetur Lorem ipsum dolor sit amet
                      consectetur.
                    </Text>

                    <View style={styles.highlightControls}>
                      <TouchableOpacity style={styles.openButton}>
                        <Text style={styles.openText}>Boost</Text>
                      </TouchableOpacity>
                      <Icon name="tray-arrow-up" size={24} color="#000" />
                      <Icon name="dots-vertical" size={24} color="#000" />
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView> */}
        </View>

        <View style={styles.Containerspotlight}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FCA311",
              padding: 6,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
              marginLeft: 10,
            }}
            onPress={() => {
              navigation.navigate(HomeNavigation.ADD_POST_SCREEN);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Add Reel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.sectionTitleRight, { marginRight: 10 }]}>
            Max - 4
          </Text>
        </View>

        <View style={styles.videoSection}>
          {Array.from(
            { length: Math.ceil(storeData?.reels?.length || 0 / 2) },
            (_, rowIndex: number) => (
              <View key={rowIndex} style={styles.videoRow}>
                {storeData?.reels
                  .slice(rowIndex * 2, rowIndex * 2 + 2)
                  .map((video: any) => (
                    <TouchableOpacity
                      key={video.id}
                      style={styles.videoCard}
                      onPress={() => handleVideoPress(video)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("../assets/product/product2.png")}
                        style={styles.videoImage}
                      />
                      <Icon
                        name="play-circle-outline"
                        size={s(40)}
                        color="#fff"
                        style={styles.playIcon}
                      />
                      <Icon
                        name="cards-heart"
                        size={s(24)}
                        color="red"
                        style={styles.videoIcon}
                      />
                      <Icon
                        name="briefcase-upload-outline"
                        size={s(24)}
                        color="#000"
                        style={styles.videoIcon1}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            )
          )}
        </View>

        {/* <View style={[styles.highlightsSection]}>
          <View style={styles.Containerspotlight}>
            <Text style={styles.sectionTitle}>Live Review</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginBottom: 10,
              }}
            >
              <CustomSwitch
                value={disabletab}
                onValueChange={setdisable}
                activeColor="#830002"
                inactiveColor="#999"
                borderColor="#4CAF50"
              />

              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followText}>Disabled</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.reviewContainer}>
            <View style={styles.starContainer}>
              <Icon name="star" size={25} color="#FCA311" />
              <Icon name="star" size={25} color="#FCA311" />
              <Icon name="star" size={25} color="#FCA311" />
              <Icon name="star" size={25} color="#FCA311" />
            </View>
            <View>
              <Text style={styles.reviewtext}>
                Very good brand to purchase T-Shirts, good quality products
              </Text>
              <Text style={styles.reviewuser}>Nikita</Text>
            </View>
          </View>
        </View> */}

        <View style={styles.fottercontainer}>
          <View style={styles.textRow}>
            <View style={styles.line} />
            <Text style={styles.title}>Keep Shopping</Text>
            <View style={styles.line} />
          </View>
          <Text style={styles.location}>
            @ Lacoste, Panjaguga, Hyderabad - A.P.
            <TouchableOpacity>
              <Icon
                name="pencil-outline"
                size={20}
                color="#000"
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>

      <EditStoreModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        editType={editType as "name" | "banner" | "logo" | "about" | null}
        currentData={{
          name: storeData?.name,
          banner_image: storeData?.banner_image,
          profile_image: storeData?.profile_image,
          about_text: storeData?.about,
        }}
        isLoading={isUpdating}
      />

      {/* Video Modal */}
      <View>
        <Modal
          isVisible={videoModalVisible}
          onBackdropPress={closeVideoModal}
          onBackButtonPress={closeVideoModal}
        >
          <View style={styles.videoModalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeVideoModal}
            >
              <Icon name="close" size={s(25)} color="#000" />
            </TouchableOpacity>

            {/* Video Player */}
            {selectedVideo && (
              <Video
                source={{
                  uri: APP_CONSTANTS.API_BASE_URL + selectedVideo.media,
                }}
                style={styles.videoPlayer}
                paused={isVideoPaused}
                resizeMode="contain"
                repeat={true}
                controls={!isVideoLoading}
                onBuffer={(e) => {
                  setIsVideoLoading(e.isBuffering);
                }}
                onError={(error) => {
                  console.log("Video Error:", error);
                }}
                onLoad={() => {
                  console.log("Video Loaded");
                }}
              />
            )}

            {/* Play/Pause Button */}
            {isVideoLoading && (
              <View style={styles.playPauseButton}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}

            {/* Video Controls */}
            {/* <View style={styles.videoControls}>
              <TouchableOpacity style={styles.controlButton}>
                <Icon name="cards-heart" size={s(30)} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Icon name="share-variant" size={s(30)} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Icon name="comment-outline" size={s(30)} color="#fff" />
              </TouchableOpacity>
            </View> */}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#006EB2",
    fontWeight: "500",
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: "#FF6B6B",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  banner: {
    width: "100%",
    height: "500@s",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "black" },

  headerContainer: {
    position: "absolute", // Fixed at the top
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000, // Ensures it's above other components
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  verifiedIcon: {
    marginLeft: 5,
    backgroundColor: "#006EB2",
    borderRadius: 19,
  },
  openStatus: {
    fontSize: 14,
    color: "#00DC30",
    marginLeft: 5,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15,
  },

  detailsCardContainer: {
    top: -80,
    // alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 15,
    padding: 15,
  },
  detailsCard: {
    width: "95%",

    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 30,
  },
  logoContainer: {
    width: 200,
    height: 90,
    borderRadius: 45,

    justifyContent: "flex-start",

    position: "absolute",
    top: -50,
    left: 15,
  },
  openLabel: {
    position: "absolute",
    bottom: 0,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "rgba(211, 211, 211, 0.4)", // red with 40% opacity
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderEndStartRadius: 10,
  },
  storetext: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
  },
  storeContainer: {
    flexDirection: "row",
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 35,
  },
  infoContainer: {
    flex: 1,
    marginTop: -10,
    justifyContent: "flex-end",
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  staractionIcon: {
    backgroundColor: "#006EB2",
    borderRadius: 20,
    padding: 6,
    marginLeft: 5,
  },

  editbannner: {
    flexDirection: "row",
    justifyContent: "flex-end",
    top: -100,
    backgroundColor: "#C7C2C0",
    alignSelf: "flex-end",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 5,
    alignContent: "center",
    alignItems: "center",
    gap: 5,
    top: -60,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    top: -60,
    left: 15,
  },
  Containertitle: {
    marginTop: -50,
    flexDirection: "row",
    // paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  stockBadgeAbove: {
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: -20,
    zIndex: 1,
    backgroundColor: "#FCA511",
  },
  stockText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  followButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  followText: {
    fontWeight: "bold",
    color: "#AA0000",
    fontSize: 16,
  },

  actionIcon: {
    marginLeft: 10,
  },
  textContainer: {
    position: "relative",
    marginTop: -50,
    padding: 20,
  },
  textheaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textheader: {
    fontSize: 16,
    textAlign: "left",
    fontWeight: 600,
    color: "#000",
  },
  additionalText: {
    fontSize: 16,
    textAlign: "left",
    color: "#000",
  },

  Containerspotlight: {
    flexDirection: "row",
    // paddingHorizontal: 10,
    justifyContent: "space-between",
    marginTop: 20,
  },
  subContainerspotlight: {
    flexDirection: "row",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },

  sectionTitleRight: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#505050",
  },

  filterButton: {
    backgroundColor: "#B9DAEE",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
  filterText: {
    color: "#006EB2",
  },
  catalogGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  catalogCard: {
    width: 150,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  catalogImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },

  buyText: {
    color: "#fff",
    textAlign: "center",
  },
  bannerScroll: {},
  scrollBanner: {
    width: width - s(20), // Adjust width based on content
    height: "150@s",
    alignSelf: "center",
    borderRadius: 10,
  },
  spotlightSection: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  productCard1: {
    width: 120, // Adjust width as per content
    marginRight: 10,
    alignItems: "center",
  },
  productImagespot: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  discountTextspotligt: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff0000",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#B9DAEE",
    padding: 5,
    borderRadius: 5,
  },
  discountlikeBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
    justifyContent: "flex-end",
  },
  discountText: { color: "#006EB2", fontSize: 12 },

  rating: { color: "gray", fontSize: 12 },
  price: { fontWeight: "bold" },
  mrp: { textDecorationLine: "line-through", color: "gray", marginLeft: 5 },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  buyButton: {
    backgroundColor: "#006EB2",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
    width: "48%",
  },
  cartButton: {
    padding: 10,
    backgroundColor: "#006EB2",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  highlightsSection: {
    paddingHorizontal: 10,
    marginTop: 40,
  },

  highlightCard: {
    width: width - 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  highlightImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  highlightControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginVertical: 10,
  },
  openButton: {
    paddingVertical: 5,
  },
  openText: {
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#006EB2",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  highlightDescription: {
    fontSize: 11,
    color: "#000",
    fontWeight: "normal",
    maxWidth: "65%",
    textAlign: "left",
    padding: 5,
  },
  postcontainer: {
    flexDirection: "row",
    gap: 5,
  },
  videoSection: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  videoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  videoCard: {
    width: "48%",
    height: "335@s",
    backgroundColor: "#fff",
    borderRadius: 10,
    // padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  videoImage: {
    width: "100%",
    height: "100%",
  },
  playIcon: {
    position: "absolute",
    top: "40%",
    left: "40%",
  },
  videoIcon: {
    position: "absolute",
    bottom: 10,
    right: 40,
  },
  videoIcon1: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  reviewContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    elevation: 5,
  },
  starContainer: {
    flexDirection: "row",
    marginVertical: 5,
    gap: 5,
  },
  reviewuser: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: 600,
    color: "#000",
  },
  reviewtext: {
    fontSize: 16,
    color: "#000",
  },

  line: {
    flex: 1,
    height: 4,
    backgroundColor: "#006EB2",
    marginHorizontal: 40,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006EB2",
    textAlign: "center",
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  location: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  fottercontainer: {
    marginTop: 30,
  },

  productcontainer: {
    marginBottom: 20,
  },
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },

  productCard: {
    width: screenWidth / 3 - 10,
    marginRight: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },

  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  productTextContainer: { flex: 1 },
  productName: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "left",
    color: "#000",
  },
  productDescription: {
    fontSize: 8,
    textAlign: "left",
    color: "#6B6B6B",
    marginHorizontal: 5,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    color: "#FCA311",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  addbtn: {
    borderWidth: 1,
    paddingHorizontal: 4,
    borderRadius: 5,
    fontSize: 10,
    marginTop: 5,
    color: "#000",
  },
  drafttext: {
    fontSize: 18,
  },
  ButtonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },

  typeButtonWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 40,
    elevation: 2,
    borderColor: "#C3C3C3",
    borderWidth: 1,
  },

  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },

  selectedType: {
    backgroundColor: "#fff",
  },

  typeText: {
    color: "#333",
    fontWeight: "bold",
  },

  selectedTypeText: {
    color: "#ffb347",
  },
  // About Edit Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  aboutModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxHeight: "70%",
  },
  aboutModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  aboutModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  aboutModalContent: {
    padding: 20,
  },
  aboutModalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  aboutTextInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    minHeight: 120,
    textAlignVertical: "top",
  },
  aboutModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  aboutModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#FCA311",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  videoModalContainer: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.9)',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  videoModalContent: {
    flex: 1,
    // width: '100%',
    // height: height - s(100),
    // justifyContent: 'center',
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: s(5),
    right: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderRadius: s(50),
    padding: s(5),
  },
  videoPlayer: {
    width: width - s(50),
    height: height - s(150),
    // aspectRatio: 16 / 9,
  },
  playPauseButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -s(20) }, { translateY: -s(0) }],
    zIndex: 1000,
  },
});

export default Storescreen;
