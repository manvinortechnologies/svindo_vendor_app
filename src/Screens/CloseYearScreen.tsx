import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import moment from "moment";

import Bottomnavigation from "./Bottomnavigation";
import Headerwithback from "./Headerwithback";

const CloseYearScreen = () => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [closingDate, setClosingDate] = useState(new Date());

  const handleConfirm = (date: Date) => {
    setClosingDate(date);
    setDatePickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Close Financial Books" />

      <ScrollView>
        {/* <Text style={styles.title}>Close Financial Books</Text> */}
        <Text style={styles.subtitle}>How do you want to close the books</Text>

        {/* Restart Transaction Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Restart Transaction Numbers</Text>
          <Text style={styles.cardDescription}>
            Keep your data as it is. This option will just allow you to change
            the transaction prefixes.
          </Text>
          <TouchableOpacity style={styles.prefixBtn}>
            <Text style={styles.prefixBtnText}>CHANGE PREFIXES</Text>
            <Icon name="chevron-right" size={16} color="#FF9900" />
          </TouchableOpacity>
        </View>

        {/* Backup All Data Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backup all data and start fresh</Text>
          <Text style={styles.cardDescription}>
            Keep your data as is. This option will just allow you to change the
            transaction prefixes.
          </Text>

          <View style={styles.dateRow}>
            <Icon name="calendar" size={16} color="#000" />
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <Text style={styles.dateText}>
                {moment(closingDate).format("DD/MM/YYYY")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.startFreshBtn}>
            <Text style={styles.startFreshText}>START FRESH</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          date={closingDate}
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisible(false)}
          maximumDate={new Date()}
        />
      </ScrollView>
      <Bottomnavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#FFF", flex: 1 },
  backButton: {
    // marginTop: 12,
    marginBottom: 6,
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 8,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF5E6",
    borderColor: "#FFA726",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
    color: "#000",
  },
  cardDescription: {
    fontSize: 12,
    color: "#333",
    marginBottom: 14,
  },
  prefixBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  prefixBtnText: {
    color: "#FF9900",
    fontWeight: "600",
    fontSize: 13,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    borderBottomWidth: 1,
    borderColor: "#000",
    color: "#000",
  },
  startFreshBtn: {
    marginTop: 4,
  },
  startFreshText: {
    color: "#FF9900",
    fontWeight: "700",
    fontSize: 13,
  },
});

export default CloseYearScreen;
