import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import Headerwithback from "./Headerwithback";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from "react-native-image-picker";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface RootStackParamList {
  CreateOffer: { requestId: string };
}
const CreateOffer = () => {
  const route = useRoute<RouteProp<any, any>>();
  const requestId = route.params?.requestId;
  const navigation = useNavigation();
  // Form state
  const [formData, setFormData] = useState({
    heading: "",
    connected_product: "",
    selling_price: "",
    description: "",
  });

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    heading: "",
    selling_price: "",
    description: "",
    image: "",
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle image picker
  const handleImagePicker = () => {
    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.8 as any,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setSelectedImage(asset);
        if (errors.image) {
          setErrors((prev) => ({ ...prev, image: "" }));
        }
      }
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      heading: "",
      selling_price: "",
      description: "",
      image: "",
    };

    let isValid = true;

    if (!formData.heading.trim()) {
      newErrors.heading = "Please enter heading";
      isValid = false;
    }
    if (
      !formData.selling_price.trim() ||
      isNaN(Number(formData.selling_price))
    ) {
      newErrors.selling_price = "Please enter a valid selling price";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please enter description";
      isValid = false;
    }
    if (!selectedImage) {
      newErrors.image = "Please upload an image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Create offer
  const createOffer = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("request", requestId);
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("product", formData.connected_product);
      formDataToSend.append("selling_price", formData.selling_price);
      formDataToSend.append("description", formData.description);

      if (selectedImage) {
        formDataToSend.append("media", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
          name: selectedImage.fileName || "offer_image.jpg",
        });
      }

      const response = await api.post(API_ROUTES.createOffer, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Offer created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setFormData({
              heading: "",
              connected_product: "",
              selling_price: "",
              description: "",
            });
            setSelectedImage(null);
            setErrors({
              heading: "",
              selling_price: "",
              description: "",
              image: "",
            });
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating offer:", error);
      Alert.alert("Error", "Failed to create offer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Upload Media Box */}
      <TouchableOpacity
        style={[styles.uploadBox, errors.image && styles.inputError]}
        onPress={handleImagePicker}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.selectedImage}
          />
        ) : (
          <>
            <Icon name="add" size={24} color="#727272" />
            <Text style={styles.uploadText}>Upload Media</Text>
            <Text style={styles.uploadNote}>
              For Photos keep the dimension ratio 1:1
            </Text>
          </>
        )}
      </TouchableOpacity>
      {errors.image ? (
        <Text style={styles.errorText}>{errors.image}</Text>
      ) : null}

      {/* Heading */}
      <Text style={styles.label}>Heading</Text>
      <TextInput
        placeholder="Enter here"
        placeholderTextColor="#ccc"
        style={[styles.input, errors.heading && styles.inputError]}
        value={formData.heading}
        onChangeText={(text) => handleInputChange("heading", text)}
      />
      {errors.heading ? (
        <Text style={styles.errorText}>{errors.heading}</Text>
      ) : null}

      {/* Select Product */}
      <Text style={styles.label}>
        Select Product to connect (Optional - for retail only)
      </Text>
      <TextInput
        placeholder="Select product"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={formData.connected_product}
        onChangeText={(text) => handleInputChange("connected_product", text)}
        // keyboardType="numeric"
      />

      {/* Selling Price */}
      <Text style={styles.label}>Selling Price</Text>
      <TextInput
        placeholder="Enter Amount"
        placeholderTextColor="#ccc"
        style={[styles.input, errors.selling_price && styles.inputError]}
        keyboardType="numeric"
        value={formData.selling_price}
        onChangeText={(text) => handleInputChange("selling_price", text)}
      />
      {errors.selling_price ? (
        <Text style={styles.errorText}>{errors.selling_price}</Text>
      ) : null}

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Enter details"
        placeholderTextColor="#ccc"
        style={[styles.textArea, errors.description && styles.inputError]}
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => handleInputChange("description", text)}
      />
      {errors.description ? (
        <Text style={styles.errorText}>{errors.description}</Text>
      ) : null}

      {/* Note */}
      <Text style={styles.note}>
        Note:{"\n"}Use short description and lowest sales price to increase your
        chances of sales.{"\n"}Offer will be valid for 7 days.
      </Text>

      {/* Submit Offer Button */}
      <TouchableOpacity style={styles.submitButton} onPress={createOffer}>
        <Text style={styles.submitText}>Submit Offer</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title={"Create Offer"} />
      <Loading visible={isLoading} />
      <FlatList
        data={["form"]}
        keyExtractor={(item) => item}
        renderItem={renderForm}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default CreateOffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingVertical: 20
  },
  listContainer: {
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  uploadText: {
    color: "#727272",
    fontWeight: "600",
    marginTop: 4,
  },
  uploadNote: {
    color: "#727272",
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  label: {
    color: "#727272",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#FFF3E1",
    color: "#000",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#FFF3E1",
    color: "#000",
  },
  note: {
    fontSize: 12,
    color: "#727272",
    fontWeight: "600",
    marginBottom: 20,
  },
  submitButton: {
    width: "40%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  inputError: {
    borderColor: "#FF0000",
  },
});
