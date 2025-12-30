import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Headerwithback from "./Headerwithback"; // ✅ your custom header
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const RateUsScreen = () => {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleRate = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log("Rating:", rating);
    console.log("Comment:", comment);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Rate Us" />
      <ScrollView contentContainerStyle={styles.scroolcontainer}>
        {/* Header */}

        {/* Title */}
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subText}>
          We value your feedback. Please rate us below:
        </Text>

        {/* Stars */}
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => handleRate(i)}>
              <Icon
                name="star"
                size={32}
                color={i <= rating ? "#FFA500" : "#ccc"}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment */}
        <Text style={styles.commentLabel}>Additional Comments:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tell us how we can improve......"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>

        {/* Discount message */}
        <Text style={styles.discountText}>
          As a thank you, enjoy a 10% discount on your next order!
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroolcontainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  subText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  commentLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#FFA500",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  discountText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default RateUsScreen;
