import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type HeaderProps = {
  title: string;
  subtitle?: string; // Optional subtitle below title
  onInfoPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  borderBottomColor?: string;
  paddingTop ?: number;
};

{
    /* we can use like this in another page 
    <Header
        title="Orders"
        subtitle="Track your recent purchases"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
      /> */}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onInfoPress,
  backgroundColor = "#fff",
  textColor = "#000",
  borderBottomColor = "#ddd",
  paddingTop=0,
}) => {
  return (
    <View style={[styles.container, { backgroundColor, borderBottomColor , paddingTop}]}>
      <View>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>}
      </View>
      <TouchableOpacity onPress={onInfoPress}>
        <Icon name="information-circle-outline" size={22} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-start",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
});

export default Header;

