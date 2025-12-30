import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import CustomSwitch from "./CustomSwitch";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s, ScaledSheet } from "react-native-size-matters";
import {
  useGetVendorStoresQuery,
  useUpdateVendorStoreMutation,
} from "../services/api/state-api-slice";
import EditStoreModal from "../Modals/EditStoreModal";
import CustomModal from "../Modals/CustomModal";
import LocationSelectionModal from "../Modals/LocationSelectionModal";
import { APP_CONSTANTS } from "../constants/app.constants";
import { HomeNavigation } from "../constants/app-routes.constants";
import Carousel from "react-native-reanimated-carousel";
import Video from "react-native-video";
import Modal from "react-native-modal";
import CustomHeader from "../CommonComponent/CustomHeader";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { getLocationDetails } from "../utils/locationUtils";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
import BlastedImage from "react-native-blasted-image";

const { width, height } = Dimensions.get("window");

const Storescreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const [disabletab, setdisable] = useState(true);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string>(
    "You have reached the limit. Please remove items to add or edit current items."
  );
  const [refreshing, setRefreshing] = useState(false);

  // Video Modal state
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const insets = useSafeAreaInsets();
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState<
    "name" | "banner" | "logo" | "about" | "storetag" | null
  >(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

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
  const handleEditPress = (
    type: "name" | "banner" | "logo" | "about" | "storetag"
  ) => {
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
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Store details updated successfully",
      });
      handleModalClose();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.data?.error || "Failed to update store details",
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const handleLocationSelect = async (location: {
    latitude: number;
    longitude: number;
    address: string;
    pincode: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
      formData.append("address", location.address);
      formData.append("pincode", location.pincode);

      await updateVendorStore(formData).unwrap();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Store location updated successfully",
      });
      setLocationModalVisible(false);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.data?.error || "Failed to update store location",
      });
    }
  };

  const handleDeleteBanner = (id: string | number) => {
    Alert.alert(
      "Delete Banner",
      "Are you sure you want to delete this banner?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`${API_ROUTES.bannerCampaigns}${id}/`);
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Banner deleted successfully",
              });
              refetch();
            } catch (e) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete banner",
              });
            }
          },
        },
      ]
    );
  };

  const handleDeleteSpotlight = (id: string | number) => {
    Alert.alert(
      "Delete Spotlight",
      "Are you sure you want to delete this spotlight?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`${API_ROUTES.spotlightProduct}${id}/`);
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Spotlight deleted successfully",
              });
              refetch();
            } catch (e) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete spotlight",
              });
            }
          },
        },
      ]
    );
  };

  const handleDeletePost = async (id: string | number) => {
    Alert.alert(
      "Delete Spotlight",
      "Are you sure you want to delete this spotlight?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`${API_ROUTES.post}${id}/`);
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Spotlight deleted successfully",
              });
              refetch();
            } catch (e) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete spotlight",
              });
            }
          },
        },
      ]
    );
  };

  const handleDeleteReel = async (id: string | number) => {
    Alert.alert(
      "Delete Spotlight",
      "Are you sure you want to delete this spotlight?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`${API_ROUTES.reel}${id}/`);
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Spotlight deleted successfully",
              });
              refetch();
            } catch (e) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete spotlight",
              });
            }
          },
        },
      ]
    );
  };

  const toggleDisable = async () => {
    try {
      const formData = new FormData();
      formData.append("is_location", (!disabletab).toString());
      await updateVendorStore(formData).unwrap();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Store disabled successfully",
      });
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

  const getLocationAddress = async () => {
    const locationDetails = await getLocationDetails(
      storeData?.latitude || 0,
      storeData?.longitude || 0
    );
    setLocation(locationDetails);
  };

  useEffect(() => {
    if (storeData) {
      getLocationAddress();
    }
  }, [storeData]);

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#006EB2" />
        <Text style={styles.loadingText}>Loading store details...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>Failed to load store details</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
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
      <CustomHeader
        title="Store"
        titleStyle={{ textAlign: "left" }}
        showBackButton={false}
        rightIcon={
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`https://svindo.com/#/store/${storeData?.id}`)
            }
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
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Top Header */}

        {/* Store Banner */}
        {storeData?.banner_image ? (
          <BlastedImage
            source={
              storeData?.banner_image
                ? {
                    uri: APP_CONSTANTS.API_BASE_URL + storeData.banner_image,
                  }
                : require("../assets/product/product2.png")
            }
            style={styles.banner}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity
            onPress={() => handleEditPress("banner")}
            style={[
              styles.banner,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
              },
            ]}
          >
            <Icon name="image-plus" size={s(60)} color="#999" />
          </TouchableOpacity>
        )}

        {/* Store Details Card */}
        <View style={styles.detailsCardContainer}>
          <View style={styles.detailsCard}>
            {/* Store Logo */}
            <View style={styles.logoContainer}>
              <View
                style={{
                  position: "relative",
                  alignSelf: "flex-start",
                }}
              >
                {storeData?.profile_image ? (
                  <BlastedImage
                    source={{
                      uri: APP_CONSTANTS.API_BASE_URL + storeData.profile_image,
                    }}
                    resizeMode="cover"
                    style={styles.logo}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => handleEditPress("logo")}
                    style={[
                      styles.logo,
                      {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                      },
                    ]}
                  >
                    <Icon name="image-plus" size={s(60)} color="#999" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleEditPress("logo")}
                  style={styles.editLogoButton}
                >
                  <Icon name="pencil-outline" size={28} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.storeContainer}>
                <Text
                  style={styles.storetext}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
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
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    justifyContent: "flex-end",
                    width: "40%",
                  }}
                  onPress={() => setLocationModalVisible(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      // alignSelf: "flex-end",
                    }}
                  >
                    <MaterialIcon
                      name="location-on"
                      size={s(20)}
                      color="#006EB2"
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        // fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      Location
                    </Text>
                  </View>
                  <Text style={{ color: "#000" }} numberOfLines={2}>
                    {location?.address || "Press to add location"}
                  </Text>
                </TouchableOpacity>
                {/* Follow Button and Icons */}
                <View style={styles.actionsContainer}>
                  {/* <Icon name="bell-outline" size={24} color="#000" style={styles.actionIcon} /> */}
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#006EB2" />
                  ) : (
                    <CustomSwitch
                      value={disabletab}
                      onValueChange={toggleDisable}
                      activeColor="#006EB2"
                      inactiveColor="#999"
                      // borderColor="#4CAF50"
                    />
                  )}
                </View>
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
              const current = storeData?.banners?.length || 0;
              const MAX = 3;
              if (current >= MAX) {
                setLimitMessage(
                  "You have reached the limit. Please remove items to add or edit current items."
                );
                setShowLimitModal(true);
              } else {
                navigation.navigate(HomeNavigation.ADD_BANNER_SCREEN, {
                  store: storeData?.id,
                });
              }
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Add Banners
            </Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitleRight}>Max - 3</Text>
        </View>
        {/* Scrollable Banner */}
        {storeData?.banners && storeData?.banners?.length > 0 ? (
          <Carousel
            data={storeData?.banners || []}
            loop={false}
            renderItem={({ item }) => (
              <View style={{ position: "relative" }}>
                <Image
                  source={{
                    uri: APP_CONSTANTS.API_BASE_URL + item.banner_image,
                  }}
                  style={styles.scrollBanner}
                />
                <TouchableOpacity
                  style={styles.editBannerButton}
                  onPress={() =>
                    navigation.navigate(HomeNavigation.ADD_BANNER_SCREEN, {
                      item: item,
                      store: storeData?.id,
                    })
                  }
                >
                  <Icon name="pencil-outline" size={s(25)} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBannerButton}
                  onPress={() => handleDeleteBanner(item?.id)}
                >
                  <Icon name="delete-outline" size={s(25)} color="#FF0000" />
                </TouchableOpacity>
              </View>
            )}
            width={width}
            height={s(150)}
          />
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(HomeNavigation.ADD_BANNER_SCREEN, {
                store: storeData?.id,
              })
            }
            style={[
              styles.scrollBanner,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
              },
            ]}
          >
            <Icon name="image-plus" size={s(60)} color="#999" />
          </TouchableOpacity>
        )}

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
                const current = storeData?.spotlight_products?.length || 0;
                const MAX = 9; // as per UI note "Max - 4 Max - 8"
                if (current >= MAX) {
                  setLimitMessage(
                    "You have reached the limit. Please remove items to add or edit current items."
                  );
                  setShowLimitModal(true);
                } else {
                  navigation.navigate("AddSpotlightScreen");
                }
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Add Spotlight
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitleRight}>Max - 9</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productcontainer}
          >
            {storeData?.spotlight_products &&
            storeData.spotlight_products.length > 0 ? (
              storeData.spotlight_products.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <View style={{ position: "relative" }}>
                    {product.discount_tag && (
                      <View style={styles.stockBadgeAbove}>
                        <Text style={styles.stockText}>
                          {product.discount_tag}
                        </Text>
                      </View>
                    )}
                    <Image
                      source={{
                        uri:
                          APP_CONSTANTS.API_BASE_URL +
                          product.product_details?.image,
                      }}
                      style={styles.productImage}
                    />
                    <TouchableOpacity
                      style={styles.editSpotlightButton}
                      onPress={() =>
                        navigation.navigate("AddSpotlightScreen", {
                          item: product,
                        })
                      }
                    >
                      <Icon name="pencil-outline" size={s(20)} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.deleteBannerButton,
                        { bottom: s(5), right: s(5) },
                      ]}
                      onPress={() => handleDeleteSpotlight(product.id)}
                    >
                      <Icon
                        name="delete-outline"
                        size={s(20)}
                        color="#FF0000"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.productDetails}>
                    <View style={styles.productTextContainer}>
                      <Text
                        style={styles.productName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {product.product_details?.name}
                      </Text>
                      {/* {product.product_details?.description && (
                        <Text style={styles.productDescription}>
                          {product.product_details?.description?.slice(0, 15)}
                          ...
                        </Text>
                      )} */}
                    </View>
                    <View>
                      {/* <Text style={styles.productPrice}>
                        Rs {product.product_details?.sales_price}
                        </Text> */}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("AddSpotlightScreen")}
                style={[
                  styles.productCard,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                  },
                ]}
              >
                <Icon name="image-plus" size={s(60)} color="#999" />
              </TouchableOpacity>
            )}
          </ScrollView>
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
                const current = storeData?.posts?.length || 0;
                const MAX = 4;
                if (current >= MAX) {
                  setLimitMessage(
                    "You have reached the limit. Please remove items to add or edit current items."
                  );
                  setShowLimitModal(true);
                } else {
                  navigation.navigate(HomeNavigation.ADD_POST_SCREEN, {
                    type: "post",
                  });
                }
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Add Posts
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitleRight}>Max - 4</Text>
          </View>
          {Array.isArray(storeData?.posts) && storeData.posts.length > 0 ? (
            storeData.posts.map((post: any) => (
              <View style={[styles.highlightCard, { position: "relative" }]}>
                <Image
                  source={
                    post.media
                      ? { uri: APP_CONSTANTS.API_BASE_URL + post.media }
                      : require("../assets/product/product2.png")
                  }
                  style={styles.highlightImage}
                />
                <TouchableOpacity
                  style={[
                    styles.editBannerButton,
                    { right: s(10), top: s(10) },
                  ]}
                  onPress={() =>
                    navigation.navigate(HomeNavigation.ADD_POST_SCREEN, {
                      item: post,
                      type: "post",
                    })
                  }
                >
                  <Icon name="pencil-outline" size={s(25)} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.deleteBannerButton,
                    { bottom: s(5), right: s(5) },
                  ]}
                  onPress={() => handleDeletePost(post.id)}
                >
                  <Icon name="delete-outline" size={s(25)} color="#FF0000" />
                </TouchableOpacity>
                <Text style={styles.highlightDescription}>
                  {post.description}
                </Text>
              </View>
            ))
          ) : (
            <TouchableOpacity
              style={[
                styles.highlightCard,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  backgroundColor: "#f0f0f0",
                },
              ]}
              onPress={() =>
                navigation.navigate(HomeNavigation.ADD_POST_SCREEN, {
                  type: "post",
                })
              }
            >
              <Icon name="image-plus" size={s(60)} color="#999" />
            </TouchableOpacity>
          )}
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
            ))}
        </ScrollView> */}
        </View>

        <View style={styles.videoSection}>
          <View style={[styles.Containertitle, { marginTop: 0 }]}>
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
                const current = storeData?.reels?.length || 0;
                const MAX = 4;
                if (current >= MAX) {
                  setLimitMessage(
                    "You have reached the limit. Please remove items to add or edit current items."
                  );
                  setShowLimitModal(true);
                } else {
                  navigation.navigate(HomeNavigation.ADD_POST_SCREEN, {
                    type: "reel",
                  });
                }
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Add Reels
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitleRight}>Max - 4</Text>
          </View>
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
                      <Icon
                        name="video-outline"
                        size={s(150)}
                        color="#FCA311"
                      />
                      <Icon
                        name="play-circle-outline"
                        size={s(40)}
                        color="#FCA311"
                        style={styles.playIcon}
                      />
                      <TouchableOpacity
                        style={[
                          styles.editBannerButton,
                          { top: s(5), right: s(5) },
                        ]}
                        onPress={() =>
                          navigation.navigate(HomeNavigation.ADD_POST_SCREEN, {
                            item: video,
                            type: "reel",
                          })
                        }
                      >
                        <Icon name="pencil-outline" size={s(20)} color="#000" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.deleteBannerButton,
                          { bottom: s(5), right: s(5) },
                        ]}
                        onPress={() => handleDeleteReel(video.id)}
                      >
                        <Icon
                          name="delete-outline"
                          size={s(20)}
                          color="#FF0000"
                        />
                      </TouchableOpacity>
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <Text style={styles.location}>
              {storeData?.storetag || "Store Tag"}
            </Text>
            <TouchableOpacity onPress={() => handleEditPress("storetag")}>
              <Icon
                name="pencil-outline"
                size={20}
                color="#000"
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <EditStoreModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        editType={
          editType as "name" | "banner" | "logo" | "about" | "storetag" | null
        }
        currentData={{
          name: storeData?.name,
          banner_image: storeData?.banner_image + "?t=" + new Date().getTime(),
          profile_image:
            storeData?.profile_image + "?t=" + new Date().getTime(),
          about_text: storeData?.about,
          storetag: storeData?.storetag,
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
      <CustomModal
        visible={showLimitModal}
        title="Limit Reached"
        onClose={() => setShowLimitModal(false)}
      >
        <Text
          style={{
            color: "#000",
            fontSize: 15,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          {limitMessage}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => setShowLimitModal(false)}
            style={{
              backgroundColor: "#FCA311",
              paddingVertical: 10,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <LocationSelectionModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={
          (storeData as any)?.latitude && (storeData as any)?.longitude
            ? {
                latitude: parseFloat((storeData as any).latitude.toString()),
                longitude: parseFloat((storeData as any).longitude.toString()),
                address: (storeData as any).address || "",
                pincode: (storeData as any).pincode || "",
              }
            : null
        }
      />
    </View>
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
    width: width,
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
    borderWidth: 1,
    borderColor: "#CDECFF",
  },
  detailsCard: {
    // width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "25@s",
  },
  logoContainer: {
    width: "200@s",
    height: "90@s",
    borderRadius: "45@s",

    justifyContent: "flex-start",

    position: "absolute",
    top: "-60@s",
    left: "6@s",
  },
  editLogoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: "2@s",
    elevation: 5,
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
    maxWidth: "80%",
  },

  logo: {
    width: "100@s",
    height: "100@s",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#505050",
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
    // flexDirection: "row",
    // justifyContent: "flex-end",
    marginVertical: 5,
    // alignContent: "center",
    // alignItems: "center",
    gap: 5,
    top: -60,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
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
    marginTop: "-50@s",
    paddingTop: "10@s",
    paddingHorizontal: "6@s",
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
  editBannerButton: {
    position: "absolute",
    top: "5@s",
    right: "15@s",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: "2@s",
    elevation: 5,
  },
  editSpotlightButton: {
    position: "absolute",
    bottom: "5@s",
    left: "5@s",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: "2@s",
    elevation: 5,
  },
  deleteBannerButton: {
    position: "absolute",
    bottom: "5@s",
    right: "15@s",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: "2@s",
    elevation: 5,
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
    // width: width - 20,
    backgroundColor: "#fff",
    borderRadius: "10@s",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: "8@s",
    marginBottom: "10@s",
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: "2@s",
    borderColor: "#FCA311",
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
    // top: "40%",
    left: "30%",
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
  },
  fottercontainer: {
    marginTop: 30,
  },

  productcontainer: {
    flexGrow: 1,
    marginBottom: 20,
  },
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },

  productCard: {
    width: "120@s",
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
    width: "105@s",
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },

  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 10,
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
  removeButton: {
    backgroundColor: "#FF0000",
    // padding: 5,
    borderRadius: 5,
    marginTop: "5@s",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#940000",
    paddingVertical: "1@s",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  addbtn: {
    paddingHorizontal: 4,
    fontSize: 10,
    color: "#fff",
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
