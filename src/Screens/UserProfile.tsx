import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeNavigation } from "../constants/app-routes.constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageUtils } from "../utils/storage";
import Toast from "react-native-toast-message";

const UserProfile = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLasttName] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [isFormModified, setIsFormModified] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<any>({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.userProfile);
      await StorageUtils.setUserData(res.data);
      if (res.data) {
        const userData = {
          firstName: res.data.first_name || "",
          lastName: res.data.last_name || "",
          email: res.data.email || "",
          contact: res.data.mobile || "",
        };
        setFirstName(userData.firstName);
        setLasttName(userData.lastName);
        setemail(userData.email);
        setContact(userData.contact);
        setOriginalData(userData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form has been modified
  const checkFormModified = () => {
    const currentData = {
      firstName,
      lastName,
      email,
      contact,
    };
    const hasChanged =
      JSON.stringify(currentData) !== JSON.stringify(originalData);
    setIsFormModified(hasChanged);
  };

  // Update form modification when any field changes
  useEffect(() => {
    if (Object.keys(originalData).length > 0) {
      checkFormModified();
    }
  }, [firstName, lastName, email, contact, originalData]);

  // Update profile function
  const updateProfile = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);

      const res = await api.put(API_ROUTES.userProfile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully",
        });
        // Update original data to reflect changes
        setOriginalData({
          firstName,
          lastName,
          email,
          contact,
        });
        setIsFormModified(false);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => setShowLogoutModal(false);

  const confirmLogout = () => {
    closeLogoutModal();
    performLogout();
  };

  const performLogout = async () => {
    try {
      setIsLoading(true);

      // Clear all storage data
      AsyncStorage.clear();
      StorageUtils.clearAll();
      // Reset navigation to welcome screen
      navigation.reset({
        index: 0,
        routes: [{ name: HomeNavigation.WELCOME_SCREEN }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to logout. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="User Profile" />
      <ScrollView contentContainerStyle={styles.formcontainer}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "T"}
            </Text>
          </View>
          <Text style={styles.updateProfileText}>Profile</Text>
        </View>

        {/* User Information Fields */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              placeholder="Your first name"
              placeholderTextColor="#999"
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              placeholder="Your last name"
              placeholderTextColor="#999"
              onChangeText={setLasttName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contact</Text>
            <TextInput
              style={[styles.input, styles.readonlyInput]}
              value={contact}
              placeholder="9876543210"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email id</Text>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Tarunkumar@gmail.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              onChangeText={setemail}
            />
          </View>
        </View>

        {/* Update Profile Button - Shows only when form is modified */}
        {isFormModified && (
          <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        )}

        {/* Privacy Settings Section */}
        <Text style={styles.sectionLabel}>Privacy Settings</Text>

        <View style={styles.privacyButtons}>
          <TouchableOpacity
            style={styles.resetDataButton}
            onPress={() =>
              navigation.navigate(HomeNavigation.RESET_DATA_SCREEN)
            }
          >
            <Text style={styles.resetDataButtonText}>Reset Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              navigation.navigate(HomeNavigation.DELETE_ACCOUNT_SCREEN)
            }
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Settings */}
        {/* <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate("NotificationSettings")}
        >
          <Text style={styles.notificationButtonText}>
            {hasPermission ? "🔔" : "🔕"} Notification Settings
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout of all devices</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={closeLogoutModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout? This will clear all your data and
              you'll need to sign in again.
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={closeLogoutModal}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.modalConfirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formcontainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  // Profile Picture Section
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: "#FFF1DC",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    color: "#FCA311",
    fontWeight: "bold",
  },
  updateProfileText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  // Input Section
  inputSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  readonlyInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  // Update Profile Button
  updateButton: {
    backgroundColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Privacy Settings Section
  sectionLabel: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 20,
  },
  privacyButtons: {
    flexDirection: "row",
    gap: 15,
  },
  resetDataButton: {
    flex: 1,
    backgroundColor: "#6C757D",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  resetDataButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FFF1DC",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FCA311",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F44336",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "600",
  },
  notificationButton: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  notificationButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalCancelButton: {
    borderColor: "#C4C4C4",
    backgroundColor: "#F6F6F6",
  },
  modalConfirmButton: {
    borderColor: "#FCA311",
    backgroundColor: "#FCA311",
  },
  modalCancelText: {
    color: "#4A4A4A",
    fontWeight: "600",
  },
  modalConfirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
