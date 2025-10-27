import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { s, ScaledSheet } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSmartBackNavigationV2 } from "../hooks/useSmartBackNavigationV2";

interface CustomHeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  showBackButton?: boolean;
  titleStyle?: TextStyle;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  rightIcon,
  containerStyle,
  showBackButton = true,
  titleStyle = {},
}) => {
  const navigation = useNavigation();
  const { smartGoBack } = useSmartBackNavigationV2();

  return (
    <View style={[styles.header, containerStyle]}>
      {/* Left: Back Button */}
      {showBackButton && (
        <TouchableOpacity onPress={smartGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={s(18)} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Center: Title */}
      <Text style={[styles.title, titleStyle]}>{title}</Text>

      {/* Right: Optional */}
      <View style={styles.rightContainer}>{rightIcon}</View>
    </View>
  );
};

export default CustomHeader;

const styles = ScaledSheet.create({
  header: {
    height: "50@s",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  backButton: {
    backgroundColor: "#FCA511",
    borderRadius: 20,
    padding: "4@s",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: "16@s",
    fontWeight: "800",
    color: "#000",
    // marginRight: 40, // gives room so title stays center if rightIcon exists
  },
  rightContainer: {
    minWidth: "50@s",
    alignItems: "flex-end",
  },
});
