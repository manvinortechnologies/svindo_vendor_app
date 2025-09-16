import React from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Searched Product/Service",
  value,
  onChangeText,
  style,
}) => {
  return (
    <View style={[styles.searchBarContainer, style]}>
      <View style={styles.searchBar}>
        <Image
          source={require("../assets/search.png")}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  searchBarContainer: {
    marginBottom: "10@s",
    height: "40@s",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7DD",
    paddingHorizontal: 15,
    borderRadius: 25,
    height: "40@s",
    borderWidth: 1,
    borderColor: "#FFB74D",
  },

  searchIcon: {
    width: "20@s",
    height: "20@s",
    tintColor: "#000",
    marginRight: "10@s",
  },

  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: "14@s",
    fontWeight: "400",
  },
});

export default SearchBar;
