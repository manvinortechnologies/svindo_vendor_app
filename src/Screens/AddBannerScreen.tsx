import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import MainContainer from "../CommonComponent/MainContainer";
import CustomHeader from "../CommonComponent/CustomHeader";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import { ScrollView } from "react-native";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useRoute, RouteProp } from "@react-navigation/native";
import { APP_CONSTANTS } from "../constants/app.constants";
import Toast from "react-native-toast-message";

type RootStackParamList = {
  AddBanner: {
    item?: any;
    store?: any;
  };
};

type AddBannerRouteProp = RouteProp<RootStackParamList, "AddBanner">;
const AddBannerScreen = ({ navigation }: any) => {
  const route = useRoute<AddBannerRouteProp>();
  const item = route.params?.item;
  const store = route.params?.store;
  const [campaignName, setCampaignName] = useState(item?.campaign_name || "");
  const [amount, setAmount] = useState(item?.budget || "");
  const [boost, setBoost] = useState(true);
  const [redirectTo, setRedirectTo] = useState(item?.redirect_to || "");
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(
    item?.product ? { id: item.product, name: item?.product?.name || "" } : null
  );
  const [items, setItems] = useState([
    { name: "Store", id: "store" },
    { name: "Product", id: "product" },
  ]);
  const [imageFile, setImageFile] = useState<any>(
    item?.banner_image
      ? { uri: APP_CONSTANTS.API_BASE_URL + item.banner_image }
      : null
  );
  const [imageModel, setImageModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const openProductPicker = async () => {
    try {
      setLoadingProducts(true);
      if (products.length === 0) {
        const res = await api.get(API_ROUTES.vendorProduct);
        setProducts(res.data.filter((product: any) => product.is_active));
        if (item?.product) {
          const foundProduct = res.data
            .filter((product: any) => product.is_active)
            .find((product: any) => product.id === item.product);
          setSelectedProduct(foundProduct || null);
        }
      }
      setShowProductModal(true);
    } catch (e) {
      setProducts([]);
      setShowProductModal(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handelSaveBtn = async () => {
    try {
      if (!campaignName || !redirectTo || !imageFile) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please fill in all required fields and upload an image.",
        });
        return;
      }

      if (redirectTo === "product" && !selectedProduct?.id) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please select a product to continue.",
        });
        return;
      }

      setIsLoading(true);

      const formData = new FormData();

      formData.append("campaign_name", campaignName);
      formData.append("redirect_to", redirectTo);
      if (redirectTo === "product") {
        formData.append("store", "");
        formData.append("product", selectedProduct?.id);
      } else {
        formData.append("product", "");
        formData.append("store", store);
      }

      formData.append("boost_post", boost ? "true" : "false");

      if (boost) {
        formData.append("budget", amount || "0");
      }
      console.log(imageFile, "imageFile");
      if (imageFile?.name) {
        formData.append("banner_image", {
          uri: imageFile.uri,
          name: imageFile.name || "banner.jpg",
          type: imageFile.mime || "image/jpeg",
        });
      }
      setIsLoading(true);

      const response = await api[item ? "patch" : "post"](
        "vendor/banner-campaigns/" + (item?.id ? `/${item?.id}/` : ""),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigation.goBack();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get(API_ROUTES.vendorProduct);
      setProducts(res.data.filter((product: any) => product.is_active));
      const foundProduct = res.data
        .filter((product: any) => product.is_active)
        .find((product: any) => product.id === item.product);
      setSelectedProduct(foundProduct || null);
    } catch (error) {
      console.log(error, "error");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (item?.product) {
      fetchProducts();
    }
  }, [item?.product]);

  return (
    <MainContainer>
      <CustomHeader title="Add Banner" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Banner</Text>
      </View> */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {/* Upload Banner Box */}
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => {
                  setImageModel(true);
                }}
              >
                {imageFile?.uri ? (
                  <Image
                    source={{ uri: imageFile.uri }}
                    style={styles.uploadedMedia}
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    <Text style={styles.uploadText}>+</Text>
                    <Text style={styles.uploadSubtext}>
                      Upload banner{"\n"}Size - less than 1 MB{"\n"}Ratio : 1:3
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Campaign Name */}
              <Text style={styles.label}>Campaign name</Text>
              <TextInput
                placeholder="Enter here"
                value={campaignName}
                onChangeText={setCampaignName}
                style={styles.input}
                placeholderTextColor="#888"
              />

              {/* Redirect Dropdown */}
              <Text style={styles.label}>On click redirect to</Text>
              <CustomDropdown
                placeholder="Select Option"
                options={items}
                selectedValue={redirectTo}
                onSelect={(option) => setRedirectTo(option.id)}
                dropDownBoxStyle={styles.dropdown}
              />

              {redirectTo === "product" && (
                <View style={{ marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={openProductPicker}
                    style={{
                      backgroundColor: "#006EB2",
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    {loadingProducts ? (
                      <Text style={{ color: "#fff", fontWeight: "700" }}>
                        Loading...
                      </Text>
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "700" }}>
                        {selectedProduct?.name
                          ? `Selected: ${selectedProduct.name}`
                          : "Select Product"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Boost Post Switch */}
              <View style={styles.switchRow}>
                <Text style={styles.label}>Boost Post</Text>
                {/* <Switch
          value={boost}
          onValueChange={setBoost}
          trackColor={{ false: '#ccc', true: '#ffb300' }}
          thumbColor={boost ? '#ffa000' : '#f4f3f4'}
        /> */}
                <CustomSwitch
                  value={boost}
                  onValueChange={setBoost}
                  disabled={true}
                />
              </View>

              {/* Budget Input */}
              {boost && (
                <>
                  <Text style={styles.label}>Budget (Minimum - 0 Rupees)</Text>
                  <TextInput
                    placeholder="Boosted by default"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#000"
                    editable={false}
                  />
                </>
              )}

              {/* Approx Cost Section */}
              <View style={styles.costBox}>
                <Text style={{ color: "#ff9800" }}>
                  We are offering free boost post for limited time!
                </Text>
                {/* <Text style={styles.costText}>
                  <Text style={{ color: "#ff9800" }}>Approximate Costing</Text>
                  {"\n"}
                  per view cost: <Text style={styles.bold}>10 paisa</Text> per
                  click cost: <Text style={styles.bold}>10 paisa</Text>
                </Text>
                <Text style={styles.caution}>
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    Caution{"\n"}
                  </Text>
                  Please follow platforms{" "}
                  <Text style={styles.terms}>terms & conditions</Text> for
                  speedy approval of campaigns
                </Text> */}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={() => {
                  handelSaveBtn();
                }}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>Submit for approval</Text>
              </TouchableOpacity>

              <ModalUpdatePhoto
                isVisible={imageModel}
                onClose={() => {
                  setImageModel(false);
                }}
                onSelectedFile={(e) => {
                  setImageFile(e);
                }}
              />
              <Loading visible={isLoading} />
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        {/* Product Picker Modal */}
        <Modal visible={showProductModal} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "92%",
                borderRadius: 12,
                padding: 12,
                maxHeight: "80%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#000" }}
                >
                  Select Product
                </Text>
                <TouchableOpacity onPress={() => setShowProductModal(false)}>
                  <Text style={{ color: "#006EB2", fontWeight: "700" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              {loadingProducts ? (
                <View style={{ paddingVertical: 20, alignItems: "center" }}>
                  <Text style={{ color: "#666" }}>Loading...</Text>
                </View>
              ) : (
                <FlatList
                  data={products}
                  keyExtractor={(it: any) =>
                    it.id?.toString() || Math.random().toString()
                  }
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                  renderItem={({ item }: { item: any }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedProduct(item);
                        setShowProductModal(false);
                      }}
                      style={{
                        width: "48%",
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#eee",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={
                          item.image
                            ? { uri: item.image }
                            : require("../assets/product.png")
                        }
                        style={{ width: "100%", height: 110 }}
                        resizeMode="cover"
                      />
                      <Text
                        style={{ padding: 8, color: "#000" }}
                        numberOfLines={1}
                      >
                        {item.name || "Unnamed"}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </MainContainer>
  );
};

export default AddBannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: "#fff",
    paddingTop: hp(2),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: "bold",
    marginLeft: wp(2),
  },
  uploadBox: {
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(2),
  },
  uploadText: {
    fontSize: wp(8),
    color: "#888",
  },
  uploadSubtext: {
    textAlign: "center",
    color: "#888",
    fontSize: wp(3),
  },
  label: {
    fontWeight: "600",
    fontSize: wp(3.6),
    marginBottom: 4,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffcc80",
    borderRadius: 6,
    padding: wp(3),
    marginBottom: hp(2),
    backgroundColor: "#fff3e0",
    fontSize: wp(3.8),
    color: "#000",
  },
  dropdown: {
    borderColor: "#ffcc80",
    backgroundColor: "#fff3e0",
  },
  dropdownList: {
    borderColor: "#ffcc80",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  costBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(3),
  },
  costText: {
    fontSize: wp(3.5),
    marginBottom: hp(1),
    color: "#000",
  },
  bold: {
    fontWeight: "600",
    color: "#000",
  },
  caution: {
    fontSize: wp(3.2),
    color: "#444",
  },
  terms: {
    color: "red",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: hp(1.8),
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp(4),
  },
  uploadedMedia: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
