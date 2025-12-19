import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomSwitch from "./CustomSwitch";
import Headerwithback from "./Headerwithback";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { formatOrderDate } from "../utils/dateandTime";
import CalendarModal from "../Modals/CalendarModal";
import moment from "moment";
import CustomTextInput from "../CommonComponent/CustomeTextInput";
import Toast from "react-native-toast-message";

interface ReviewItem {
  id: number;
  order_item: number;
  photo: string | null;
  is_visible: boolean;
  rating: number;
  comment: string;
  user_details: {
    id: number;
    firebase_uid: string;
    mobile: string;
    first_name: string;
    last_name: string;
    email: string;
    pincode: number;
    is_customer: boolean;
    is_vendor: boolean;
    is_subuser: boolean;
  };
  created_at: string;
  updated_at: string;
}

interface TransformedReview {
  id: number;
  name: string;
  date: string;
  dateOriginal: string; // Store original ISO date for filtering
  rating: number;
  profile: any;
  review: string;
  images: string[];
  visible: boolean;
}

const CustomerFeedback = () => {
  const [allReviews, setAllReviews] = useState<TransformedReview[]>([]);
  const [reviews, setReviews] = useState<TransformedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [switchStates, setSwitchStates] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Filter states
  const [selectedDate, setSelectedDate] = useState<string | null>(
    moment().format("YYYY-MM-DD")
  );
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<
    string | null
  >("highToLow");
  const [showDateModal, setShowDateModal] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Rating filter options
  const ratingFilterOptions = [
    { id: "highToLow", name: "High To Low" },
    { id: "lowToHigh", name: "Low To High" },
    { id: "all", name: "All" },
  ];

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ROUTES.storeReviews);
      const reviewsData: ReviewItem[] = response.data || [];

      // Transform API response to match component structure
      const transformedReviews: TransformedReview[] = reviewsData.map(
        (item) => ({
          id: item.id,
          name: `${item.user_details.first_name} ${item.user_details.last_name}`,
          date: formatOrderDate(item.created_at),
          dateOriginal: item.created_at, // Store original ISO date for filtering
          rating: item.rating,
          profile: require("../assets/user.png"),
          review: item.comment || "",
          images: item.photo ? [item.photo] : [],
          visible: item.is_visible,
        })
      );

      // Calculate average rating
      if (transformedReviews.length > 0) {
        const totalRating = transformedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating(totalRating / transformedReviews.length);
      } else {
        setAverageRating(0);
      }

      setReviewCount(transformedReviews.length);
      setAllReviews(transformedReviews);
      // Initialize switch states using review IDs
      const initialSwitchStates: { [key: number]: boolean } = {};
      transformedReviews.forEach((review) => {
        initialSwitchStates[review.id] = review.visible;
      });
      setSwitchStates(initialSwitchStates);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Keep empty state on error
      setReviews([]);
      setAllReviews([]);
      setSwitchStates({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Apply filters whenever allReviews, selectedDate, selectedRatingFilter, or searchQuery changes
  useEffect(() => {
    let filtered = [...allReviews];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((review) => {
        // Search in review comment, user name
        const reviewText = review.review.toLowerCase();
        const userName = review.name.toLowerCase();
        return reviewText.includes(query) || userName.includes(query);
      });
    }

    // Apply date filter
    if (selectedDate) {
      const filterDate = moment(selectedDate).format("YYYY-MM-DD");
      filtered = filtered.filter((review) => {
        // Use original ISO date for filtering
        const reviewDate = moment(review.dateOriginal).format("YYYY-MM-DD");
        return reviewDate === filterDate;
      });
    }

    // Apply rating filter
    if (selectedRatingFilter === "highToLow") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (selectedRatingFilter === "lowToHigh") {
      filtered.sort((a, b) => a.rating - b.rating);
    }
    // "all" doesn't need sorting, keep original order

    setReviews(filtered);

    // Recalculate stats for filtered reviews
    if (filtered.length > 0) {
      const totalRating = filtered.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      setAverageRating(totalRating / filtered.length);
    } else {
      setAverageRating(0);
    }
    setReviewCount(filtered.length);
  }, [allReviews, selectedDate, selectedRatingFilter, searchQuery]);

  const toggleSwitch = async (reviewId: number) => {
    // Optimistically update UI
    const previousState = switchStates[reviewId] ?? false;
    const newState = !previousState;

    setSwitchStates((prev) => ({
      ...prev,
      [reviewId]: newState,
    }));

    try {
      // Update API
      const response = await api.patch(
        `${API_ROUTES.storeReviews}${reviewId}/`,
        {
          id: reviewId,
          is_visible: newState,
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Success - update the allReviews state as well
        setAllReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId ? { ...review, visible: newState } : review
          )
        );
      } else {
        // Revert on failure
        setSwitchStates((prev) => ({
          ...prev,
          [reviewId]: previousState,
        }));
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to update review visibility",
        });
      }
    } catch (error) {
      console.error("Error updating review visibility:", error);
      // Revert on error
      setSwitchStates((prev) => ({
        ...prev,
        [reviewId]: previousState,
      }));
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update review visibility. Please try again.",
      });
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDateModal(false);
  };

  const handleRatingFilterSelect = (option: any) => {
    setSelectedRatingFilter(option?.id || null);
    setShowRatingDropdown(false);
  };

  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return "Select Date";
    return moment(dateString).format("DD MMM, YYYY");
  };

  const getRatingFilterDisplay = () => {
    const option = ratingFilterOptions.find(
      (opt) => opt.id === selectedRatingFilter
    );
    return option ? option.name : "High To Low";
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Rating & Review" />

      <ScrollView>
        <CustomTextInput
          placeholder="Search Reviews"
          containerStyle={styles.searchInputContainer}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* <View style={styles.reviewHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewTitle}>Reviews</Text>
            <View style={styles.reviewStatsRow}>
              <Icon name="star" size={16} color="#fff" />
              <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>
                {" "}
                | {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
              </Text>
            </View>
          </View>

          <View style={styles.reviewCirclesRow}>
            <View style={styles.circleContainer}>
              <View style={styles.circle} />
              <View style={[styles.circle, { left: 12 }]} />
              <View style={[styles.circle, { left: 24 }]} />
              <View
                style={[styles.circle, styles.activeCircle, { left: 36 }]}
              />
            </View>
            <Icon
              name="dots-horizontal"
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </View>
        </View> */}

        {/* Filters */}
        <View style={styles.filterscontainer}>
          <View style={styles.filterGroup}>
            <Icon name="filter" size={18} color="#000" />
            <Text style={styles.filterLabel}>Filters</Text>
          </View>
          <View style={styles.filters}>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowDateModal(true)}
            >
              <Text style={styles.dropdownLabel}>Date : </Text>
              <Text style={styles.dropdownValue}>
                {formatDateDisplay(selectedDate)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowRatingDropdown(true)}
            >
              <Text style={styles.dropdownLabel}>Ratings : </Text>
              <Text style={styles.dropdownValue}>
                {getRatingFilterDisplay()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FCA311" />
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews found</Text>
          </View>
        ) : (
          /* Review Cards */
          reviews.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.userRow}>
                <Image source={item.profile} style={styles.avatar} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.dateRow}>
                    <Text style={styles.ratingBadge}> {item.rating} ⭐ </Text>
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>
                {item.review.length > 90
                  ? `${item.review.substring(0, 90)}...`
                  : item.review}
                {item.review.length > 90 && (
                  <Text style={styles.readMore}> read more</Text>
                )}
              </Text>

              <View style={styles.imageRow}>
                {item.images.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={styles.reviewImage}
                  />
                ))}
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.visibleText}>Visible on Svindo</Text>
                <CustomSwitch
                  value={switchStates[item.id] ?? item.visible}
                  onValueChange={() => toggleSwitch(item.id)}
                  activeColor="#FCA311"
                  inactiveColor="#999"
                  borderColor="#999"
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Date Picker Modal */}
      <CalendarModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        onSelect={handleDateSelect}
        initialDate={selectedDate || moment().format("YYYY-MM-DD")}
        maxDate={moment().format("YYYY-MM-DD")}
      />

      {/* Rating Filter Dropdown Modal */}
      <Modal
        visible={showRatingDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRatingDropdown(false)}
        >
          <View style={styles.ratingModalContainer}>
            <View style={styles.ratingModalHeader}>
              <Text style={styles.ratingModalTitle}>Sort by Rating</Text>
              <TouchableOpacity onPress={() => setShowRatingDropdown(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.ratingOptionsContainer}>
              {ratingFilterOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.ratingOption,
                    selectedRatingFilter === option.id &&
                      styles.ratingOptionSelected,
                  ]}
                  onPress={() => handleRatingFilterSelect(option)}
                >
                  <Text
                    style={[
                      styles.ratingOptionText,
                      selectedRatingFilter === option.id &&
                        styles.ratingOptionTextSelected,
                    ]}
                  >
                    {option.name}
                  </Text>
                  {selectedRatingFilter === option.id && (
                    <Icon name="check" size={20} color="#FCA311" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  reviewHeader: {
    backgroundColor: "#FCA311",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 15,
  },
  reviewTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  reviewStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginHorizontal: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#fff",
  },
  reviewCirclesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleContainer: {
    width: 70,
    height: 22,
    position: "relative",
    flexDirection: "row",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
  },
  activeCircle: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#D9D9D9",
  },
  searchInputContainer: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  filterscontainer: {
    paddingHorizontal: 12,
    marginVertical: 20,
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  filterGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  filterLabel: {
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 16,
    color: "#000",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    elevation: 4,
    padding: 10,
    borderRadius: 6,
    minWidth: "45%",
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownLabel: {
    fontWeight: "bold",
    color: "#000",
  },
  dropdownValue: {
    color: "#000",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    elevation: 3,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 12,
    marginRight: 6,
    color: "#fff",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  reviewText: {
    marginTop: 8,
    color: "#333",
    fontSize: 15,
  },
  readMore: {
    color: "red",
  },
  imageRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  visibleText: {
    color: "#FCA311",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  switchWrapper: {
    borderWidth: 4,
    borderColor: "#FCA311",
    borderRadius: 20,
    padding: 2,
  },
  label: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    maxWidth: 300,
  },
  ratingModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  ratingModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  ratingOptionsContainer: {
    padding: 10,
  },
  ratingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#F5F5F5",
  },
  ratingOptionSelected: {
    backgroundColor: "#FFF4E5",
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  ratingOptionText: {
    fontSize: 16,
    color: "#333",
  },
  ratingOptionTextSelected: {
    color: "#FCA311",
    fontWeight: "600",
  },
});

export default CustomerFeedback;
