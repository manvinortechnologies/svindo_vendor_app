import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Toast from "react-native-toast-message";

const ReminderRow = ({
  title,
  showDaysInput = false,
  value,
  onToggle,
  days,
  onDaysChange,
}: {
  title: string;
  showDaysInput?: boolean;
  value: boolean;
  onToggle: (v: boolean) => void;
  days?: string;
  onDaysChange?: (v: string) => void;
}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <CustomSwitch value={value} onValueChange={onToggle} />
    </View>
    {showDaysInput && (
      <View style={[styles.row, { marginTop: 10 }]}>
        <Text style={styles.caption}>Show in reminder before</Text>
        <TextInput
          value={days}
          onChangeText={onDaysChange}
          keyboardType="number-pad"
          style={styles.daysInput}
          placeholder="30"
        />
        <Text style={styles.caption}>Days</Text>
      </View>
    )}
  </View>
);

const ReminderScreen = () => {
  const [creditReminder, setCreditReminder] = useState(true);
  const [creditDays, setCreditDays] = useState("30");

  const [pendingInvoices, setPendingInvoices] = useState(true);
  const [pendingDays, setPendingDays] = useState("30");

  const [lowStock, setLowStock] = useState(true);
  const [expiryStock, setExpiryStock] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(API_ROUTES.reminderSettings);
        const data = res?.data || {};
        setCreditReminder(data.credit_bill_reminder ?? true);
        setCreditDays(String(data.credit_bill_days || 30));
        setPendingInvoices(data.pending_invoice_reminder ?? true);
        setPendingDays(String(data.pending_invoice_days || 30));
        setLowStock(data.low_stock_reminder ?? true);
        setExpiryStock(data.expiry_stock_reminder ?? true);
      } catch (e) {
        console.error("Failed to fetch reminder settings:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const payload = {
        credit_bill_reminder: creditReminder,
        credit_bill_days: Number(creditDays) || 0,
        pending_invoice_reminder: pendingInvoices,
        pending_invoice_days: Number(pendingDays) || 0,
        low_stock_reminder: lowStock,
        expiry_stock_reminder: expiryStock,
      };
      const res = await api.post(API_ROUTES.reminderSettings, payload);
      if (res.status === 200 || res.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Reminder settings updated",
        });
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update reminder settings",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      <View style={styles.container}>
        <Headerwithback title="Reminder" />
        <Loading visible={isLoading} />

        <ReminderRow
          title="Credit Bill/Purchase Reminder"
          value={creditReminder}
          onToggle={setCreditReminder}
          showDaysInput
          days={creditDays}
          onDaysChange={setCreditDays}
        />

        <ReminderRow
          title="Pending Invoices Reminder"
          value={pendingInvoices}
          onToggle={setPendingInvoices}
          showDaysInput
          days={pendingDays}
          onDaysChange={setPendingDays}
        />

        <ReminderRow
          title="Low Stock Reminder"
          value={lowStock}
          onToggle={setLowStock}
        />

        <ReminderRow
          title="Expiry Stock Reminder"
          value={expiryStock}
          onToggle={setExpiryStock}
        />

        <View style={{ paddingHorizontal: 12, marginTop: 12 }}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainContainer>
  );
};

export default ReminderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#FFF6E8",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  caption: {
    color: "#6B6B6B",
  },
  daysInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCA311",
    backgroundColor: "#FFF",
    textAlign: "center",
    marginHorizontal: 8,
    color: "#000",
    width: 80,
    padding: 0,
  },
  updateButton: {
    backgroundColor: "#FCA311",
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  updateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
