import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import CustomHeader from "../CommonComponent/CustomHeader";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../CommonComponent/Loading";
import { BannerCampaign } from "../type/common";
import api from "../services/api/api";
import DeleteModal from "./DeleteModal";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Active":
      return {
        borderColor: "#4CAF50",
        labelColor: "#4CAF50",
        bgColor: "#E8F5E9",
      };
    case "Ended":
      return {
        borderColor: "#9E9E9E",
        labelColor: "#757575",
        bgColor: "#ECEFF1",
      };
    case "Pending":
      return {
        borderColor: "#FFC107",
        labelColor: "#FF9800",
        bgColor: "#FFF8E1",
      };
    case "Rejected":
      return {
        borderColor: "#F44336",
        labelColor: "#F44336",
        bgColor: "#FFEBEE",
      };
    default:
      return {};
  }
};

const BannerAds = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerData, setBannerData] = useState<BannerCampaign[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteBannerData, setDeleteBannerData] =
    useState<BannerCampaign | null>(null);
  // useFocusEffect(
  //   useCallback(() => {
  //     getBannerData();
  //     return () => {};
  //   }, [])
  // );

  const getBannerData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("vendor/banner-campaigns/");
      setBannerData(res.data);
    } catch (error) {
      console.error("Error fetching banner data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBanner = (bannerId: number, campaignName: string) => {
    setShowDeleteModal(true);
    setDeleteBannerData({
      id: bannerId,
      campaign_name: campaignName,
    } as BannerCampaign);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteBannerData(null);
  };

  const handleConfirmDelete = () => {
    if (deleteBannerData) {
      deleteBanner(deleteBannerData.id);
    }
  };

  const deleteBanner = async (bannerId: number) => {
    try {
      setDeletingId(bannerId);
      await api.delete(`vendor/banner-campaigns/${bannerId}/`);

      // Remove the deleted banner from the local state
      setBannerData((prevData) =>
        prevData.filter((banner) => banner.id !== bannerId)
      );
      setShowDeleteModal(false);
      setDeleteBannerData(null);
    } catch (error) {
      console.error("Error deleting banner:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const renderCard = (item: BannerCampaign) => {
    const status = item.is_approved ? "Active" : "Pending";
    const statusStyle = getStatusStyle(status);

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: statusStyle.bgColor,
            borderColor: statusStyle.borderColor,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.labelColor + "20" },
            ]}
          >
            <Text
              style={[styles.statusText, { color: statusStyle.labelColor }]}
            >
              {status}
            </Text>
          </View>
          {(status === "Active" || status === "Pending") && (
            <TouchableOpacity
              onPress={() => handleDeleteBanner(item.id, item.campaign_name)}
              disabled={deletingId === item.id}
              style={{
                opacity: deletingId === item.id ? 0.5 : 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 24,
                minHeight: 24,
              }}
            >
              {deletingId === item.id ? (
                <ActivityIndicator size="small" color="#D32F2F" />
              ) : (
                <Icon name="delete" size={24} color="#D32F2F" />
              )}
            </TouchableOpacity>
          )}
        </View>

        <Image
          source={{ uri: item.banner_image }}
          resizeMode="cover"
          style={styles.logo}
        />

        {/* New Row for campaign on left and others on right */}
        <View style={styles.rowBetween}>
          <View style={{ width: "40%" }}>
            <Text style={styles.campaignTitle}>
              Campaign: {item.campaign_name}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.budgetText}>
              Budget: ₹{parseFloat(item.budget).toFixed(2)}
            </Text>
            <Text style={styles.dateText}>
              Start:{" "}
              {new Date(item.created_at).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <MainContainer>
      <CustomHeader title="Banner Ads" />
      <View style={styles.container}>
        <Loading visible={isLoading || deletingId !== null} />

        {/* Summary Box */}
        <View style={styles.summaryContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#FCA311", fontSize: 20, fontWeight: "600" }}>
              Campaign Details
            </Text>
            <CustomDropdown
              onSelect={() => {}}
              placeholder="Select Day"
              options={[{ id: "day", name: "Till Day" }]}
              selectedValue="day"
              dropDownBoxStyle={{ height: hp(5), width: wp(30) }}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.spentActiveView}>
              <Text style={styles.summaryTitle}>Spent</Text>
              <Text style={styles.summaryValue}>₹2000.00</Text>
            </View>
            <View style={styles.spentActiveView}>
              <Text style={styles.summaryTitle}>Active</Text>
              <Text style={styles.summaryValue}>₹1000.00</Text>
            </View>
          </View>
        </View>

        {/* Campaign List */}
        {bannerData.length === 0 && !isLoading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No banners found
          </Text>
        ) : (
          <FlatList
            data={bannerData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderCard(item)}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Add Banner Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddBannerScreen")}
          style={styles.addBannerBtn}
        >
          <Text style={styles.addBannerText}>Add Banner</Text>
        </TouchableOpacity>
      </View>
      <DeleteModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        styles={styles}
        title="Delete Banner"
        message={`Are you sure you want to delete "${deleteBannerData?.campaign_name}"? This action cannot be undone.`}
        subMessage="This action cannot be undone and will permanently remove all banner campaign data."
        buttonText="Cancel"
        buttonText2="Delete"
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp(4),
  },
  summaryContainer: {
    marginBottom: hp(2),
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "#C7C7C7",
    padding: 10,
    marginTop: hp(1),
  },
  summaryTitle: {
    color: "#000",
    fontWeight: "600",
    fontSize: wp(5),
  },
  summaryValue: {
    paddingBottom: wp(2),
    borderRadius: 6,
    marginTop: 4,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: hp(10),
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(2),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    fontWeight: "600",
  },
  logo: {
    height: hp(12),
    width: "100%",
    borderRadius: 8,
    marginVertical: hp(1),
  },
  campaignTitle: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: hp(1),
    color: "#000",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dateText: {
    fontSize: wp(2.8),
    color: "#000",
  },
  addBannerBtn: {
    backgroundColor: "#4CAF50",
    padding: wp(3),
    borderRadius: 50,
    position: "absolute",
    bottom: hp(2),
    alignSelf: "center",
    width: "40%",
    alignItems: "center",
    right: 10,
  },
  addBannerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp(4),
  },
  spentActiveView: {
    width: "48%",
    backgroundColor: "#FFE8C2",
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  budgetText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#333",
  },
});

export default BannerAds;
