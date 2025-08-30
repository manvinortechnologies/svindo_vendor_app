import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";
import MainContainer from "../CommonComponent/MainContainer";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { DeliveryPerson } from "../type/common";

const AddDeliveryBoy = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [rating, setRating] = useState("");
  const [imageFile, setImageFile] = useState<any>();
  const [imageModel, setImageModel] = useState<boolean>(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryPerson[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.deliveryBoys);
      console.log(res);
      setDeliveryBoys(res.data);
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter delivery boy name");
      return false;
    }
    if (!mobile.trim()) {
      Alert.alert("Error", "Please enter mobile number");
      return false;
    }
    if (mobile.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!rating.trim()) {
      Alert.alert("Error", "Please enter rating");
      return false;
    }
    const ratingValue = parseFloat(rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      Alert.alert("Error", "Please enter a valid rating between 0 and 5");
      return false;
    }
    return true;
  };

  const handleCreateDeliveryBoy = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name: name.trim(),
        mobile: mobile.trim(),
        is_active: true,
        rating: parseFloat(rating),
      };

      console.log("Creating delivery boy with payload:", payload);

      const response = await api.post(API_ROUTES.deliveryBoys, payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Delivery boy created successfully!");
        // Reset form
        setName("");
        setMobile("");
        setRating("");
        setImageFile(null);
        // Refresh the list
        getData();
      } else {
        Alert.alert("Error", "Failed to create delivery boy");
      }
    } catch (error) {
      console.error("Error creating delivery boy:", error);
      Alert.alert("Error", "Failed to create delivery boy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      <Headerwithback title="Add Own Delivery Boy" />
      <View style={styles.container}>
        <ModalUpdatePhoto
          isVisible={imageModel}
          onClose={() => {
            setImageModel(false);
          }}
          onSelectedFile={(e) => {
            setImageFile(e);
          }}
        />

        {/* Upload Photo */}
        <TouchableOpacity
          onPress={() => {
            setImageModel(true);
          }}
          style={styles.uploadBox}
        >
          {imageFile?.uri ? (
            <Image
              source={{ uri: imageFile.uri }}
              style={styles.uploadedMedia}
              resizeMode="cover"
            />
          ) : (
            <>
              <Icon name="camera-plus" size={24} color="#888" />
              <Text style={styles.uploadText}>Upload Photo</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Name */}
        <Text style={styles.label}> Name</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#999"
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* Mobile */}
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          maxLength={10}
        />

        {/* Rating */}
        <Text style={styles.label}>Rating</Text>
        <TextInput
          placeholder="Enter rating (0-5)"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="decimal-pad"
          value={rating}
          onChangeText={setRating}
        />

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={handleCreateDeliveryBoy}
        >
          <Text style={styles.createBtnText}>Create</Text>
        </TouchableOpacity>

        {/* Delivery Boys List */}
        <Text style={styles.sectionTitle}>Delivery Boys</Text>
        <FlatList
          data={deliveryBoys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: DeliveryPerson }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: item.is_active ? "#D8FFDE" : "#D8FFDE" },
              ]}
            >
              {/* Status */}
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: item.is_active ? "#75FF89" : "#FFCCCC",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.is_active ? "Active" : "Pause"}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Icon name="delete" size={20} color="red" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.contentRow}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.nameText}>Name: {item.name}</Text>
                  <Text style={styles.subText}>Mobile: {item.mobile}</Text>
                  <Text style={styles.subText}>
                    Total Deliveries - {item.total_deliveries}
                  </Text>
                  {/* <Text style={styles.subText}>Earnings - {item.earnings}</Text> */}
                  <Text style={styles.subText}>Rating</Text>
                  <View style={styles.ratingRow}>
                    {Array.from({ length: parseInt(item.rating) }).map(
                      (_, idx) => (
                        <Icon key={idx} name="star" size={20} color="#FCA311" />
                      )
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        />
        <Loading visible={isLoading} />
      </View>
    </MainContainer>
  );
};

export default AddDeliveryBoy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 30,
    width: "50%",
    alignSelf: "center",
  },
  uploadText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: "#656565",
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#FFEFD5",
  },
  createBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#169729",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#FCA311",
    fontSize: 20,
    marginVertical: 10,
  },
  card: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  logo: {
    width: "20%",
    height: "80%",
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  subText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
    alignSelf: "flex-end",
  },
  uploadedMedia: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
