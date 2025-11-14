import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

{
  /* <ReportHeader
        title="Sale Report"
        onBack={() => console.log('Back pressed')}
        onPdfPress={() => console.log('Download PDF')}
        onXlsPress={() => console.log('Download XLS')}
      /> */
}

interface ReportHeaderProps {
  title: string;
  onBack?: () => void;
  onPdfPress?: () => void;
  onXlsPress?: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  title,
  onBack,
  onPdfPress,
  onXlsPress,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {/* <View style={styles.exportButtons}>
        <TouchableOpacity onPress={onPdfPress}>
          <Text style={styles.pdfText}>Pdf</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onXlsPress} style={{ marginLeft: 8 }}>
          <Text style={styles.xlsText}>Xls</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FCA311",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#000",
  },
  exportButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  pdfText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
  xlsText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ReportHeader;
