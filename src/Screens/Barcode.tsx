import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";

const Barcode = () => {
  const [showPackageDate, setShowPackageDate] = useState(true);
  const [showPriceWithText, setShowPriceWithText] = useState(true);
  const [mrpLabel, setMrpLabel] = useState("MRP");
  const [productFontSize, setProductFontSize] = useState("16");
  const [mrpFontSize, setMrpFontSize] = useState("16");
  const [barcodeSize, setBarcodeSize] = useState("16");
  const [size, setSize] = useState("25x50");

  return (
    <View style={styles.container}>
      <Headerwithback title="Barcode" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Show Package Date */}
        <View style={styles.Boxcontainer}>
          <View style={styles.rowBox}>
            <Text style={styles.label}>Show Package Date:</Text>
            <CustomSwitch
              value={showPackageDate}
              onValueChange={() => setShowPackageDate(!showPackageDate)}
            />
          </View>
          <Text style={styles.subText}>
            package date will be shown on barcode if enabled
          </Text>
        </View>

        {/* MRP Label */}
        <View style={styles.Boxcontainer}>
          <View style={styles.rowBox}>
            <Text style={styles.label}>MRP Label:</Text>
            <TextInput
              style={styles.smallInput}
              value={mrpLabel}
              onChangeText={setMrpLabel}
              placeholder="MRP"
              placeholderTextColor="#FCA311"
            />
          </View>
          <Text style={styles.subText}>leave blank to hide label on mrp</Text>
        </View>

        {/* Show Discount */}
        <View style={styles.Boxcontainer}>
          <View style={styles.rowBox}>
            <Text style={styles.label}>Show Discount:</Text>
            <CustomSwitch
              value={showPackageDate}
              onValueChange={() => setShowPackageDate(!showPackageDate)}
            />
          </View>
          <Text style={styles.subText}>
            Discount will be shown on barcode if enabled
          </Text>
        </View>

        {/* Show Price with Text */}
        <View style={styles.Boxcontainer}>
          <View style={styles.rowBox}>
            <Text style={styles.label}>Show price with Text:</Text>
            <CustomSwitch
              value={showPackageDate}
              onValueChange={() => setShowPackageDate(!showPackageDate)}
            />
          </View>
          <Text style={styles.subText}>
            price with text will be shown on barcode if enabled
          </Text>
        </View>

        {/* Font Sizes */}
        <View style={styles.Boxcontainer}>
          <View style={styles.rowBox}>
            <Text style={styles.label}>Product Name Font Size:</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={productFontSize}
              onChangeText={setProductFontSize}
            />
          </View>
        </View>

        <View style={styles.Boxcontainer}>
          <View style={styles.rowBox}>
            <Text style={styles.label}>MRP Font Size:</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={mrpFontSize}
              onChangeText={setMrpFontSize}
            />
          </View>
        </View>

        <View style={styles.Boxcontainer}>
          <Text style={[styles.label, { margin: 10 }]}>Barcode Size:</Text>

          <View style={styles.sizeRow}>
            <Text style={styles.label}>25MM * 50MM</Text>
            <CustomSwitch
              value={size === "25x50"}
              onValueChange={() => setSize("25x50")}
            />
          </View>

          <View style={styles.sizeRow}>
            <Text style={styles.label}>50MM * 100MM</Text>
            <CustomSwitch
              value={size === "50x100"}
              onValueChange={() => setSize("50x100")}
            />
          </View>

          <Text style={styles.subText}>barcode will generate in this size</Text>
        </View>
      </ScrollView>
      {/* Generate Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Barcode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  content: {
    padding: 16,
  },
  Boxcontainer: {
    backgroundColor: "#FFF1D6",
    marginBottom: 8,
    borderColor: "#FCA311",
    borderWidth: 1,
    padding: 4,
    borderRadius: 5,
  },
  rowBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF1D6",
    padding: 12,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#323232",
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    marginRight: 15,
    marginVertical: 6,
  },
  subText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
    paddingHorizontal: 8,
    textAlign: "right",
  },
  smallInput: {
    width: 80,
    backgroundColor: "#FFF1D6",
    borderColor: "#FCA311",
    borderWidth: 1,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#FCA311",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
