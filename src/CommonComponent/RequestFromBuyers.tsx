import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";

type RootStackParamList = {
  BuyersRequest: undefined;
};

type BuyersRequestNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "BuyersRequest"
>;

type BuyersRequestProps = {
  navigation: BuyersRequestNavProp;
  route: RouteProp<RootStackParamList, "BuyersRequest">;
};

interface ProductRequest {
  id: number;
  product_name: string;
  description?: string;
  budget: string;
  category_details?: {
    name: string;
  };
  sub_category_details?: {
    name: string;
  };
}

interface RequestFromBuyersProps {
  requests?: ProductRequest[];
  totalCount?: number;
}

const { width } = Dimensions.get("window");

const RequestFromBuyers: React.FC<RequestFromBuyersProps> = ({
  requests = [],
  totalCount = 0,
}) => {
  const navigation = useNavigation<BuyersRequestNavProp>();

  // Format the count display
  const countText = totalCount > 0 ? `${totalCount}+ ` : "";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          <Text style={styles.countText}>{countText}</Text>
          Request from Buyers
        </Text>
      </View>

      {/* Request List */}
      {requests.length > 0 ? (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.product_name || "Product Name"}
                </Text>
                <View>
                  <Text style={styles.productName}>Category</Text>
                  <Text style={styles.category}>
                    {item.category_details?.name ||
                      item.sub_category_details?.name ||
                      "N/A"}
                  </Text>
                </View>
              </View>
              {item.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <Text style={styles.budget}>Budget - ₹{item.budget || "0"}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No requests available</Text>
        </View>
      )}

      {/* View All Button */}
      <TouchableOpacity
        style={styles.viewAll}
        onPress={() => navigation.navigate(HomeNavigation.BUYERSREQUEST)}
      >
        <Text style={styles.viewAllText}>View all</Text>
        <Icon name="chevron-right" size={18} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default RequestFromBuyers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: "#DEDEDE",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  countText: {
    color: "#F59E0B",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewAllText: {
    fontSize: 13,
    color: "#000",
  },
  card: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FCD34D",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontWeight: "600",
    fontSize: 13,
    color: "#000",
  },
  category: {
    fontSize: 13,
    color: "#000",
  },
  description: {
    fontSize: 12,
    color: "#000",
    marginBottom: 2,
  },
  budget: {
    fontSize: 12,
    color: "#000",
    textAlign: "right",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
});
