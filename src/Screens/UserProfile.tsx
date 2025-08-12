import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import CustomTextInput from "../CommonComponent/CustomeTextInput";
import CustomButton from "../CommonComponent/CustomeButton";
import { API_ROUTES } from "../constants/api-routes.constants";
type RootStackParamList = {
  MyAccount: undefined;
  DeleteAccountScreen: undefined;
  ResetDataScreen: undefined;
};

// Type the navigation prop for this screen
type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ResetDataScreen"
>;

const UserProfile = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLasttName] = useState<string>("");
  const [email, setemail] = useState<string>("");

  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.userProfile);
      console.log("userData-->", res);
      if (res.data) {
        setFirstName(res.data.first_name);
        setLasttName(res.data.last_name);
        setemail(res.data.email);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Headerwithback title="User Profile" />
      <ScrollView contentContainerStyle={styles.formcontainer}>
        {/* <View style={styles.avatar}>
        <Text style={styles.avatarText}>T</Text>
      </View>

      <Text style={styles.title}>Update profile picture</Text> */}
        <CustomTextInput
          styles={{ marginTop: 10 }}
          value={firstName}
          placeholder="Enter yout first name"
          onChangeText={setFirstName}
        />
        <CustomTextInput
          styles={{ marginTop: 10 }}
          value={lastName}
          placeholder="Enter your last name"
          onChangeText={setLasttName}
        />
        <CustomTextInput
          styles={{ marginTop: 10 }}
          value={email}
          placeholder=""
          onChangeText={setemail}
        />

        {/* <TextInput style={styles.input} placeholder="Your name" />
      <TextInput style={styles.input} placeholder="9876543210" />
      <TextInput style={styles.input} placeholder="Tarunkumar@gmail.com" /> */}
        {/* <CustomButton
      title='Update Profile'
      onPress={()=>{}}
      /> */}

        <Text style={styles.sectionLabel}>Privacy Settings</Text>

        <View style={styles.rowButtons}>
          <TouchableOpacity
            style={styles.outlinedButton}
            onPress={() => navigation.navigate("ResetDataScreen")}
          >
            <Text style={styles.outlinedButtonText}>Reset Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlinedButton}
            onPress={() => navigation.navigate("DeleteAccountScreen")}
          >
            <Text style={styles.outlinedButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.outlinedFullButton}>
          <Text style={styles.outlinedButtonText}>Logout of all devices</Text>
        </TouchableOpacity>
      </ScrollView>
      <Loading visible={isLoading} />
      <Bottomnavigation />
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  formcontainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: "#FFF1DC",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    color: "#FCA311",
    fontWeight: "bold",
  },
  title: {
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  rowButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  outlinedFullButton: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  outlinedButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
