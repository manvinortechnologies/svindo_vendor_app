import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Permissions {
  Signatures: boolean;
  Reports: boolean;
  Analytics: boolean;
  POS: boolean;
  OnlineOrders: boolean;
  Products: boolean;
}

interface RolePermissions {
  role: string;
  permissions: Permissions;
}

const ManageRoles = () => {
  const [activeTab, setActiveTab] = useState<"allUsers" | "permissions">(
    "allUsers"
  );
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "General"
  );

  const handleTabChange = (tab: "allUsers" | "permissions") =>
    setActiveTab(tab);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const permissionSections = [
    "General",
    "Bills",
    "Parties",
    "Payments",
    "Uploads",
    "Conversions",
  ];
  const permissionLabels = [
    "Signatures",
    "Reports",
    "Analytics",
    "POS",
    "OnlineOrders",
    "Products",
  ];

  const rolePermissions: RolePermissions[] = [
    {
      role: "Admin",
      permissions: {
        Signatures: true,
        Reports: true,
        Analytics: true,
        POS: true,
        OnlineOrders: true,
        Products: true,
      },
    },
  ];

  const renderAllUsers = () => (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Contact Info</Text>
        <Text style={styles.headerCell}>Role</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>

      {rolePermissions.map((user, index) => (
        <View key={index} style={styles.dataRow}>
          <Text style={styles.dataCell}>{user.role}</Text>
          <Text style={styles.dataCell}>9876543210{"\n"}example@gmail.com</Text>
          <Text style={[styles.dataCell, { color: "red" }]}>{user.role}</Text>
          <Text style={styles.dataCell}>Delete Edit</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderPermissions = () => (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
      <TouchableOpacity style={styles.addRoleButton}>
        <Icon name="add" size={18} />
        <Text style={{ marginLeft: 4, color: "#000" }}>Add Role</Text>
      </TouchableOpacity>

      {permissionSections.map((section, index) => (
        <View key={index} style={styles.permissionBox}>
          <TouchableOpacity
            style={styles.permissionHeader}
            onPress={() => toggleSection(section)}
          >
            <Text style={styles.permissionTitle}>{section}</Text>
            <Icon
              name={
                expandedSection === section
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-right"
              }
              size={20}
            />
          </TouchableOpacity>

          {expandedSection === section && (
            <View style={styles.permissionContent}>
              {/* Header Row */}
              <View style={styles.permissionRow}>
                <Text style={[styles.cell, { fontWeight: "bold" }]}>Name</Text>
                {permissionLabels.map((label, i) => (
                  <Text
                    key={i}
                    style={{
                      flex: 1,
                      fontWeight: "bold",
                      fontSize: 10,
                      color: "#000",
                    }}
                  >
                    {label}
                  </Text>
                ))}
              </View>

              {/* Roles and Permissions */}
              {rolePermissions.map((roleItem, i) => (
                <View key={i} style={styles.permissionRow}>
                  <Text style={[styles.cell, { color: "red" }]}>
                    {roleItem.role}
                  </Text>
                  {permissionLabels.map((label, j) => (
                    <Text key={j} style={{ flex: 1, color: "#000" }}>
                      {roleItem.permissions[label as keyof Permissions]
                        ? "✔️"
                        : ""}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Manage Roles" />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "allUsers" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("allUsers")}
        >
          <Text
            style={
              activeTab === "allUsers" ? styles.activeTabText : styles.tabText
            }
          >
            All Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "permissions" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("permissions")}
        >
          <Text
            style={
              activeTab === "permissions"
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Roles & Permissions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {activeTab === "allUsers" ? renderAllUsers() : renderPermissions()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#FFB000",
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: "#FFB000",
  },
  tabText: {
    color: "#000",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginTop: 16,
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#000",
  },
  dataCell: {
    flex: 1,
    color: "#000",
  },
  permissionBox: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  permissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,

    borderColor: "#ddd",
  },
  permissionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  permissionContent: {
    marginTop: 8,
  },
  permissionRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  cell: {
    flex: 1.2,
    color: "#000",
  },
  addRoleButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginVertical: 8,
  },
});

export default ManageRoles;
