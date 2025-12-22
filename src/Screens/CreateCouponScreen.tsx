import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import Header from "./Header";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import MainContainer from "../CommonComponent/MainContainer";
import { Platform } from "react-native";
import Loading from "../CommonComponent/Loading";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import CalendarModal from "../Modals/CalendarModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatToISOString, convert24To12Hour } from "../utils/dateandTime";
import api from "../services/api/api";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useRoute, RouteProp, ParamListBase } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import moment from "moment";

const { width } = Dimensions.get("window");

interface RootStackParamList extends ParamListBase {
  CreateCoupon: { customer: any };
}

const CreateCouponScreen = ({ navigation }: any) => {
  const route = useRoute<RouteProp<RootStackParamList, "CreateCoupon">>();
  const customer = route.params?.customer;
  const [selectedType, setSelectedType] = useState<string>("discount");
  const [customerIdEnabled, setCustomerIdEnabled] = useState(!!customer?.id);
  const [customerId, setCustomerIdValue] = useState("USR" + customer?.id || "");
  const [onlyFollowers, setOnlyFollowers] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [minOrderAmmount, setMinOrderAmount] = useState<string>("");
  const [maxOrderAmmount, setMaxOrderAmount] = useState<string>("");
  const [valiDate, setValidDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [valiTime, setValidTime] = useState<string>(moment().format("HH:mm"));
  const [startDate, setstartdDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [startTime, setstartdTime] = useState<string>(moment().format("HH:mm"));
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tittle, setTittle] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const [imageFile, setImageFile] = useState<any>();
  const [imageUrl, setImageUrl] = useState("");
  const [imagePickerModel, setImagePickerModel] = useState(false);
  const [dsicounntType, setDiscountType] = useState<string>("amount");
  const [startDateCallModel, setStartDateCallModel] = useState<boolean>(false);
  const [endDateCallModel, setEndDateCallModel] = useState<boolean>(false);
  const [startTimeCallModel, setStartTimeCallModel] = useState<boolean>(false);
  const [endTimeCallModel, setEndTimeCallModel] = useState<boolean>(false);

  const couponTypes = [
    { name: "Discount Coupon", id: "discount" },
    { name: "No Return & Exchange", id: "no_return" },
    { name: "Online Pay", id: "online_pay" },
  ];

  const handelCreateCoupan = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("code", code);
      formData.append("title", tittle);
      formData.append("description", description);
      formData.append("coupon_type", selectedType);
      formData.append("type", dsicounntType);
      formData.append("discount_percentage", discountPercentage);
      formData.append("discount_amount", discountAmount);
      formData.append("min_purchase", minOrderAmmount);
      formData.append("max_discount", maxOrderAmmount);
      formData.append(
        "start_date",
        formatToISOString(startDate, convert24To12Hour(startTime))
      );
      formData.append(
        "end_date",
        formatToISOString(valiDate, convert24To12Hour(valiTime))
      );
      formData.append("only_followers", onlyFollowers); // Booleans must be strings
      formData.append("is_active", isActive); // Same here
      formData.append("customer_id", customerId || "");

      // If you have an image file to include:
      if (imageFile) {
        formData.append("image", {
          uri: imageFile.uri,
          name: imageFile.name || "file.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }
      const res = await api.post("vendor/coupon/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigation.goBack();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Coupon code added successfully!",
      });
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
    }
  };
  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setStartTimeCallModel(false);
    }

    if (selectedTime) {
      const formatted = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setstartdTime(formatted);
    }
  };
  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setEndTimeCallModel(false);
    }

    if (selectedTime) {
      const formatted = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setValidTime(formatted);
    }
  };

  const renderForm = () => (
    <View style={styles.form}>
      {/* Discount Amount and Discount Percentage */}
      <View
        style={{
          borderColor: "#727272",
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 12,
        }}
      >
        <View>
          <Text style={styles.sectionTitle}>Code</Text>
          <TextInput
            placeholder="Make coupan code(COUP20)"
            placeholderTextColor="#727272"
            style={styles.inputFull}
            autoCapitalize="characters"
            value={code}
            onChangeText={setCode}
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Tittle</Text>
          <TextInput
            placeholder="Enter Tittle"
            placeholderTextColor="#727272"
            style={styles.inputFull}
            value={tittle}
            onChangeText={setTittle}
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            placeholder="Enter Description"
            placeholderTextColor="#727272"
            style={styles.inputFull}
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.sectionTitle}>Discount Amount</Text>
            <TextInput
              placeholder="Enter here"
              placeholderTextColor="#727272"
              style={styles.inputHalf}
              value={discountAmount}
              onChangeText={setDiscountAmount}
              keyboardType="decimal-pad"
              onFocus={() => {
                setDiscountType("amount");
                setDiscountPercentage("");
              }}
            />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Discount Percentage</Text>
            <TextInput
              placeholder="Enter here"
              placeholderTextColor="#727272"
              style={styles.inputHalf}
              value={discountPercentage}
              keyboardType="decimal-pad"
              onChangeText={setDiscountPercentage}
              onFocus={() => {
                setDiscountType("percent");

                setDiscountAmount("");
              }}
            />
          </View>
        </View>
        <Text
          style={{
            color: "#FCA311",
            marginTop: 10,
            marginBottom: 5,
            marginHorizontal: 10,
          }}
        >
          Note: {"\n"}{" "}
          <Text style={{ color: "#000" }}>Only one can be chosen.</Text>
        </Text>
      </View>

      {/* Min Order & Max Discount */}
      <View
        style={{
          borderColor: "#727272",
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 12,
          marginTop: 10,
          paddingVertical: 10,
        }}
      >
        <View style={styles.row}>
          <View>
            <Text style={styles.sectionTitle}>Mini Order Amount</Text>
            <TextInput
              placeholder="Enter here"
              placeholderTextColor="#727272"
              style={styles.inputHalf}
              keyboardType="decimal-pad"
              value={minOrderAmmount}
              onChangeText={setMinOrderAmount}
            />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Max Discount Amount</Text>
            <TextInput
              placeholder="Enter here"
              placeholderTextColor="#727272"
              style={styles.inputHalf}
              keyboardType="decimal-pad"
              value={maxOrderAmmount}
              onChangeText={setMaxOrderAmount}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.sectionTitle}>Start date</Text>
            <TouchableOpacity onPress={() => setStartDateCallModel(true)}>
              <TextInput
                placeholder="Date (YYYY-MM-DD))"
                placeholderTextColor="#727272"
                style={styles.inputHalf}
                editable={false}
                value={startDate}
                pointerEvents="none" // Prevents interaction inside TextInput
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.sectionTitle}></Text>
            <TouchableOpacity onPress={() => setStartTimeCallModel(true)}>
              <TextInput
                placeholder="Time (HH:MM AM)"
                placeholderTextColor="#727272"
                style={styles.inputHalf}
                editable={false}
                value={startTime}
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Validity Date and Time */}
        <View style={styles.row}>
          <View>
            <Text style={styles.sectionTitle}>Validity till</Text>
            <TouchableOpacity onPress={() => setEndDateCallModel(true)}>
              <TextInput
                placeholder="Date (YYYY-MM-DD)"
                placeholderTextColor="#727272"
                style={styles.inputHalf}
                editable={false}
                value={valiDate}
                pointerEvents="none" // Ensures the press passes through to TouchableOpacity
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.sectionTitle}></Text>
            <TouchableOpacity onPress={() => setEndTimeCallModel(true)}>
              <TextInput
                placeholder="Time (HH:MM AM)"
                placeholderTextColor="#727272"
                style={styles.inputHalf}
                editable={false}
                value={valiTime}
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Customer ID with toggle */}
      <View
        style={{
          borderColor: "#727272",
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 12,
          marginTop: 10,
          paddingVertical: 10,
        }}
      >
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Customer Id:</Text>

          <CustomSwitch
            value={customerIdEnabled}
            onValueChange={setCustomerIdEnabled}
            activeColor="#FBBF24"
            inactiveColor="#ccc"
          />
        </View>
        {customerIdEnabled && (
          <TextInput
            placeholder="Enter here"
            placeholderTextColor="#727272"
            style={styles.inputFull}
            value={customerId}
            editable={!customer?.id}
            onChangeText={setCustomerIdValue}
          />
        )}
        <Text
          style={{
            color: "#FCA311",
            marginTop: 10,
            marginBottom: 5,
            marginHorizontal: 10,
          }}
        >
          Note: {"\n"}
          <Text style={{ color: "#000" }}>
            If Customer id is entered then the offer will be valid for only that
            customer.
          </Text>
        </Text>
      </View>

      {/* Only Followers with toggle */}
      <View
        style={{
          borderColor: "#727272",
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 12,
          marginTop: 10,
          paddingVertical: 10,
        }}
      >
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Only Followers</Text>

          <CustomSwitch
            onValueChange={setOnlyFollowers}
            value={onlyFollowers}
            activeColor="#FBBF24"
            inactiveColor="#ccc"
          />
        </View>
        <Text
          style={{
            color: "#FCA311",
            marginTop: 10,
            marginBottom: 5,
            marginHorizontal: 10,
          }}
        >
          Note: {"\n"}
          <Text style={{ color: "#000" }}>
            If enabled only followers will be eligible for offers.
          </Text>
        </Text>
      </View>
      <View
        style={{
          borderColor: "#727272",
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 12,
          marginTop: 10,
          paddingVertical: 10,
        }}
      >
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Active</Text>

          <CustomSwitch
            onValueChange={setIsActive}
            value={isActive}
            activeColor="#FBBF24"
            inactiveColor="#ccc"
          />
        </View>
        <Text
          style={{
            color: "#FCA311",
            marginTop: 10,
            marginBottom: 5,
            marginHorizontal: 10,
          }}
        >
          Note: {"\n"}
          <Text style={{ color: "#000" }}>
            If enabled so your coupon is active.
          </Text>
        </Text>
      </View>
      <View
        style={{
          borderColor: "#727272",
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 12,
          marginTop: 10,
          paddingVertical: 10,
        }}
      >
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Upload Coupon Image </Text>
        </View>
        <TouchableOpacity
          onPress={() => setImagePickerModel(true)}
          style={[
            styles.submitButton,
            { width: "50%", alignSelf: "center", backgroundColor: "#FBBF24" },
          ]}
        >
          <Text style={styles.submitText}>Upload Image</Text>
        </TouchableOpacity>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: 200,
              height: 80,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
        )}
      </View>
      <ModalUpdatePhoto
        isVisible={imagePickerModel}
        onClose={() => setImagePickerModel(false)}
        onSelectedFile={(file: any) => {
          setImageFile(file);
          setImageUrl(file.uri);
        }}
        onChange={(image) => console.log("Full crop picker image:", image)}
      />
      <CalendarModal
        visible={startDateCallModel}
        initialDate={startDate}
        onClose={() => setStartDateCallModel(false)}
        onSelect={setstartdDate}
      />
      <CalendarModal
        visible={endDateCallModel}
        initialDate={valiDate}
        onClose={() => setEndDateCallModel(false)}
        onSelect={setValidDate}
      />
      {startTimeCallModel && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onStartTimeChange}
        />
      )}
      {endTimeCallModel && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onEndTimeChange}
        />
      )}
      {/* Submit */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          handelCreateCoupan();
        }}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust if header overlaps input
      >
        <FlatList
          data={["form"]}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              {/* Header */}
              <Headerwithback title={"Create Coupon"} />

              {/* Coupon Types */}
              <Text
                style={{
                  color: "#727272",
                  fontWeight: "600",
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}
              >
                Types
              </Text>
              <View style={styles.typeContainer}>
                {couponTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    style={[
                      styles.typeButton,
                      selectedType === type.id && styles.typeButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        selectedType === type.id && styles.typeTextSelected,
                      ]}
                    >
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          renderItem={() => renderForm()}
        />
        <Loading visible={isLoading} />
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default CreateCouponScreen;

const styles = StyleSheet.create({
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  typeButton: {
    borderColor: "#FBBF24",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: width / 3.4,
    alignItems: "center",
    backgroundColor: "#FFEFD5",
  },
  typeButtonSelected: {
    backgroundColor: "#FCA311",
  },
  typeText: {
    color: "#727272",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 13,
  },
  typeTextSelected: {
    color: "#727272",
    fontWeight: "bold",
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  inputHalf: {
    backgroundColor: "#FFEFD5",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    width: width / 2 - 30,
    borderColor: "#FCA311",
    borderWidth: 1,
    color: "#000",
  },
  inputFull: {
    backgroundColor: "#FFEFD5",
    borderColor: "#FCA311",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    width: "100%",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    color: "#727272",
  },
  note: {
    color: "#FFEFD5",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  label: {
    fontWeight: "500",
    fontSize: 15,
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#169729",
    marginVertical: 15,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
