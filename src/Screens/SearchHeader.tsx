import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TextInput,
  ImageSourcePropType,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

{
  /* <SearchHeader
  title="Search Products"
  draftName="Edit Product Draft"
  imageIcon={require("../assets/draft-icon.png")}
  paddingTop={30}
/> */
}

// HeaderProps with dynamic icon, title, draft name, and padding
type HeaderProps = {
  title?: string;
  draftName?: string;
  imageIcon?: ImageSourcePropType;
  paddingTop?: number;
  value?: string;
  onChangeText?: (text: string) => void;
};

const SearchHeader: React.FC<HeaderProps> = ({
  title = "Search",
  draftName = "",
  imageIcon = require("../assets/img.png"),
  paddingTop = 0,
  value,
  onChangeText,
}) => {
  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Image
            source={require("../assets/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder={title}
            placeholderTextColor="#000"
            style={styles.searchInput}
            value={value}
            onChangeText={onChangeText}
          />
          {/* <TouchableOpacity>
            <Image
              source={require("../assets/mic.png")}
              style={styles.micIcon}
            />
          </TouchableOpacity> */}
        </View>

        {/* Draft Section */}
        <View style={styles.draftSection}>
          <Image source={imageIcon} style={styles.draftIcon} />
          <Text style={styles.draftText}>{draftName}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    borderColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 25,
    height: 40,
    flex: 1,
    marginRight: 10,
    elevation: 3,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#000",
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 14,
  },
  micIcon: {
    width: 18,
    height: 18,
    tintColor: "red",
    marginLeft: 5,
  },
  draftSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  draftIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
    resizeMode: "contain",
  },
  draftText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});

export default SearchHeader;
