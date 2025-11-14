import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import AddBankDetailsModal from "../Modals/AddBankDetailsModal";
import TransferFundsModal from "../Modals/TransferFundsModal";
import { BankDetails } from "../type/common";
import { API_ROUTES } from "../constants/api-routes.constants";
import { ScaledSheet } from "react-native-size-matters";

const BankAccounts = ({ navigation }: any) => {
  const [cash, setCash] = useState<string>("00.00");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [bankList, setBankList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  useEffect(() => {
    getCash();
  }, []);
  const getCash = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.vendorCash);
      const res2 = await api.get(API_ROUTES.vendorAddBank);
      if (res.data) {
        setCash(res.data.balance);
      }
      if (res2.data) {
        setBankList(res2.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCash();
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveBankDetails = async (details: BankDetails) => {
    console.log("Bank details submitted:", details);
    try {
      setIsLoading(true);
      const res = await api.post(API_ROUTES.vendorAddBank, details);
      console.log("res-->", res);
      getCash();
    } catch (error) {
      console.log("bank api Error 41--", error);
    } finally {
      setIsLoading(false);
    }
    // Submit to API or save locally
  };

  const handleTransferSuccess = () => {
    getCash(); // Refresh the data after successful transfer
  };
  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Bank Account" />

      <FlatList
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item) => item.id.toString()}
        data={bankList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FCA311"]} // Android
            tintColor="#FCA311" // iOS
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BankNameScreen", { bankId: item.id })
            }
            style={[styles.card, styles.accCard]}
          >
            <View style={styles.row}>
              <Image
                source={require("../assets/bank.png")}
                style={styles.icon}
              />
              <View>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.accName}>{item.account_holder}</Text>
              </View>
            </View>
            <Text style={styles.accBalance}>{item.balance}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View>
            {/* Add Bank Card */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Image
                  source={require("../assets/bank.png")}
                  style={styles.icon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>
                    Add your bank & UPI to Invoices
                  </Text>
                  <Text style={styles.description}>
                    Let your customers pay you directly from the invoice no
                    fuss, no delays
                  </Text>
                </View>
              </View>
            </View>

            {/* Accounts Label */}
            <Text style={styles.sectionTitle}>Accounts</Text>

            {/* Cash Card */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Image
                  source={require("../assets/money.png")}
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.title}>Cash</Text>
                  <Text style={styles.amount}>Rs {cash}</Text>
                </View>
              </View>
            </View>

            {/* Transfer Funds Card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setIsTransferModalVisible(true)}
            >
              <View style={styles.row}>
                <Image
                  source={require("../assets/transfer.png")}
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.title}>Transfer funds</Text>
                  <Text style={styles.description}>
                    Transfer funds between internal banks
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add New Bank Button */}
      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(true);
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add New Bank</Text>
      </TouchableOpacity>
      <AddBankDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSaveBankDetails}
      />
      <TransferFundsModal
        visible={isTransferModalVisible}
        onClose={() => setIsTransferModalVisible(false)}
        onSuccess={handleTransferSuccess}
      />
      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: "16@s",
    paddingBottom: "60@s",
  },
  card: {
    backgroundColor: "#FFF7EB",
    borderColor: "#FCA311",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    width: "26@s",
    height: "26@s",
    marginRight: "8@s",
    resizeMode: "contain",
  },
  title: {
    fontSize: "12@s",
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: "10@s",
    color: "#333",
    marginTop: 2,
    // width: "80%",
  },
  sectionTitle: {
    fontSize: "14@s",
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  amount: {
    fontSize: "14@s",
    color: "green",
    fontWeight: "700",
  },
  accName: {
    fontSize: "10@s",
    color: "#000",
  },
  accBalance: {
    fontSize: "10@s",
    color: "#000",
  },
  accCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    padding: "16@s",
    backgroundColor: "#fff",
  },
  button: {
    position: "absolute",
    bottom: "20@s",
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#FCA311",
    paddingVertical: "10@s",
    paddingHorizontal: "20@s",
    borderRadius: "8@s",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    marginHorizontal: "100@s",
  },
  buttonText: {
    color: "#fff",
    fontSize: "12@s",
    fontWeight: "600",
  },
});

export default BankAccounts;
