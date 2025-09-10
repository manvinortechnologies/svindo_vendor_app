import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Bottomnavigation from "./Bottomnavigation";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { API_ROUTES } from "../constants/api-routes.constants";
import AdjustCashModal from "../Modals/AdjustCashModal";
import BankTransferModal from "../Modals/BankTransferModal";
import { ScaledSheet } from "react-native-size-matters";

const CashInHand = ({ navigation }: any) => {
  const [cash, setCash] = useState<string>("00.00");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [showBankTransferModal, setShowBankTransferModal] =
    useState<boolean>(false);
  useEffect(() => {
    getCash();
  }, []);
  const getCash = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.vendorCash);
      if (res.data) {
        setCash(res.data.balance);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustSuccess = () => {
    // Refresh cash balance after successful adjustment
    getCash();
  };

  const handleBankTransferSuccess = () => {
    // Refresh cash balance after successful bank transfer
    getCash();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Headerwithback title="Cash in hand" />

        <View style={styles.balanceCard}>
          <View style={styles.row}>
            <Image
              source={require("../assets/money.png")} // Replace with your local image
              style={styles.icon}
            />
            <View>
              <Text style={styles.label}>Current Cash Balance</Text>
              <Text style={styles.amount}>Rs {cash}</Text>
            </View>
          </View>
        </View>
      </View>
      <Loading visible={isLoading} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowBankTransferModal(true)}
        >
          <Text style={styles.buttonText}>Bank Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowAdjustModal(true)}
        >
          <Text style={styles.buttonText}>Adjust Cash</Text>
        </TouchableOpacity>
      </View>

      <AdjustCashModal
        visible={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        onSuccess={handleAdjustSuccess}
      />

      <BankTransferModal
        visible={showBankTransferModal}
        onClose={() => setShowBankTransferModal(false)}
        onSuccess={handleBankTransferSuccess}
      />
    </SafeAreaView>
  );
};
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: "20@s",
  },
  balanceCard: {
    backgroundColor: "#FFF7EB",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
    resizeMode: "contain",
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  amount: {
    color: "green",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingHorizontal: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#FCA311",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CashInHand;
