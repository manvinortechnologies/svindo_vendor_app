import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import { launchImageLibrary } from "react-native-image-picker";
import Video from "react-native-video";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";

const AddPostScreen = () => {
  const [boostEnabled, setBoostEnabled] = useState(false);
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [media, setMedia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMediaUpload = () => {
    launchImageLibrary(
      {
        mediaType: "mixed",
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          setMedia(response.assets[0]);
        }
      }
    );
  };
  const handelSubmit = async () => {
    try {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("description", description);
      formdata.append("product", product);
      formdata.append("boost_post", boostEnabled);
      formdata.append("budget", amount);
      formdata.append("media", {
        uri: media.uri,
        type: media.type, // e.g., "video/mp4"
        name: media.fileName || "upload.mp4",
      });
      const apiEndPoing = media?.type?.startsWith("video")
        ? "vendor/reel/"
        : "vendor/post/";
      console.log("formdata--->", formdata);
      console.log("apiendpoint--->", apiEndPoing);
      const res = await api.post(apiEndPoing, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 201) {
        Alert.alert(
          "Success",
          "Upload successful! Your content is now ready for review."
        );
      }
    } catch (error) {
      console.log("error--->", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MainContainer>
      <Headerwithback title="Add Post / Reel" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
          >
            {/* Upload Box */}
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handleMediaUpload}
            >
              {media ? (
                media?.type?.startsWith("video") ? (
                  <Video
                    source={{ uri: media.uri }}
                    style={[styles.uploadedMedia, { width: "20%" }]}
                    resizeMode="cover"
                    repeat
                    muted
                  />
                ) : (
                  <Image
                    source={{ uri: media.uri }}
                    style={styles.uploadedMedia}
                    resizeMode="cover"
                  />
                )
              ) : (
                <>
                  <Text style={styles.uploadText}>+</Text>
                  <Text style={styles.uploadHint}>
                    Upload Media{"\n"}
                    For Photos keep the dimension ratio 1:1{"\n"}
                    for videos use vertical videos
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Description Input */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter here"
              value={description}
              placeholderTextColor={"#727272"}
              onChangeText={setDescription}
            />

            {/* Product Selection */}
            <Text style={styles.label}>Select product to connect</Text>
            <TextInput
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="Select product"
              value={product}
              placeholderTextColor={"#727272"}
              onChangeText={setProduct}
            />

            {/* Boost Post Toggle */}
            <View style={styles.boostRow}>
              <Text style={styles.label}>Boost Post</Text>
              {/* <Switch
          value={boostEnabled}
          onValueChange={setBoostEnabled}
          trackColor={{ false: '#727272', true: '#FCA311' }}
          thumbColor={boostEnabled ? '#fff' : '#fff'}
          
        /> */}
              <CustomSwitch
                value={boostEnabled}
                onValueChange={setBoostEnabled}
                activeColor="#FCA311"
              />
            </View>

            {/* Budget */}
            <Text style={styles.label}>Budget (Minimum - 10 Rupees)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor={"#727272"}
            />

            {/* Approximate Costing Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold", color: "#FCA311" }}>
                  Approximate Costing{"\n \n"}
                </Text>
                per view cost:{" "}
                <Text style={{ fontWeight: "bold" }}>10 paisa</Text>{" "}
                {"        "}
                per view cost:{" "}
                <Text style={{ fontWeight: "bold" }}>10 paisa</Text>
              </Text>
              <Text style={styles.cautionText}>Caution</Text>
              <Text style={styles.termsText}>
                Please follow platforms{" "}
                <Text style={styles.termsHighlight}>terms & conditions</Text>{" "}
                for speedy approval of campaigns
              </Text>
            </View>
            <Loading visible={isLoading} />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handelSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Submit for approval</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </MainContainer>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  uploadBox: {
    height: 150,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 32,
    color: "#888",
  },
  uploadHint: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    backgroundColor: "#FFF7DD",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 48,
    marginBottom: 16,
    color: "#000",
  },
  boostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  cautionText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 4,
  },
  termsText: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  termsHighlight: {
    color: "#FCA311",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadedMedia: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
