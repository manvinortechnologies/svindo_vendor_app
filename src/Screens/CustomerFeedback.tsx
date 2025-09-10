import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Text,
  Image,
} from "react-native";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";
import SearchHeader from "./SearchHeader";
import { Switch } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomSwitch from "./CustomSwitch";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    date: "3/2/2025",
    rating: 5,
    profile: require("../assets/user.png"),
    review:
      "Absolutely love my new clothes—great fit, amazing quality, and fast shipping. Highly recommend this brand!",
    images: [
      require("../assets/revimg.png"),
      require("../assets/revimg.png"),
      require("../assets/revimg.png"),
    ],
    visible: true,
  },
  {
    id: 2,
    name: "Rahul Sharma",
    date: "3/2/2025",
    rating: 5,
    profile: require("../assets/user.png"),
    review:
      "Absolutely love my new clothes—great fit, amazing quality, and fast shipping. Highly recommend this brand!",
    images: [
      require("../assets/revimg.png"),
      require("../assets/revimg.png"),
      require("../assets/revimg.png"),
    ],
    visible: true,
  },
  {
    id: 3,
    name: "Rahul Sharma",
    date: "3/2/2025",
    rating: 5,
    profile: require("../assets/user.png"),
    review:
      "Absolutely love my new clothes—great fit, amazing quality, and fast shipping. Highly recommend this brand!",
    images: [
      require("../assets/revimg.png"),
      require("../assets/revimg.png"),
      require("../assets/revimg.png"),
    ],
    visible: true,
  },
];

const CustomerFeedback = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const [switchStates, setSwitchStates] = useState(reviews.map(() => false));

  const toggleSwitch = (index: number) => {
    const updated = [...switchStates];
    updated[index] = !updated[index];
    setSwitchStates(updated);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Rating & Review"
        backgroundColor="#FCA311"
        textColor="#fff"
        borderBottomColor="#ccc"
        paddingTop={50}
      />
      <ScrollView>
        <SearchHeader title="Search Products" draftName="" paddingTop={10} />

        <View style={styles.reviewHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewTitle}>Reviews</Text>
            <View style={styles.reviewStatsRow}>
              <Icon name="star" size={16} color="#fff" />
              <Text style={styles.ratingText}>4.5</Text>
              <Text style={styles.reviewCount}> | 850 Reviews</Text>
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
        </View>

        {/* Filters */}
        <View style={styles.filterscontainer}>
          <View style={styles.filterGroup}>
            <Icon name="filter" size={18} />
            <Text style={styles.filterLabel}>Filters</Text>
          </View>
          <View style={styles.filters}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Date :</Text>
              <Text style={styles.dropdownValue}>3 Feb, 2025 ⌄</Text>
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Ratings :</Text>
              <Text style={styles.dropdownValue}>High To Low ⌄</Text>
            </View>
          </View>
        </View>

        {/* Review Cards */}
        {reviews.map((item, index) => (
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
              {item.review.substring(0, 90)}...
              <Text style={styles.readMore}>read more</Text>
            </Text>

            <View style={styles.switchRow}>
              <View style={styles.imageRow}>
                {item.images.map((img, i) => (
                  <Image key={i} source={img} style={styles.reviewImage} />
                ))}
              </View>
              <Text style={styles.visibleText}>Visible on Svindo</Text>
              <CustomSwitch
                value={switchStates[index]}
                onValueChange={() => toggleSwitch(index)}
                activeColor="#FCA311"
                inactiveColor="#999"
                borderColor="#999"
              />
              {/* <View style={styles.switchWrapper}>
                <Switch
                  trackColor={{
                    false: "#E6E6E6", // Light gray
                    true: "#FFF4E5", // Soft orange glow when on
                  }}
                  thumbColor={switchStates[index] ? "#FCA311" : "#D9D9D9"} // Thumb orange when on
                  ios_backgroundColor="#E6E6E6"
                  onValueChange={() => toggleSwitch(index)}
                  value={switchStates[index]}
                  style={styles.switch}
                />
              </View> */}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
    marginTop: 10,
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
});

export default CustomerFeedback;
