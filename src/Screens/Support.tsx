import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Headerwithback from "./Headerwithback";
import { s } from "react-native-size-matters";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import { HomeNavigation } from "../constants/app-routes.constants";
import Toast from "react-native-toast-message";

interface NavigationProp {
  navigate: (screen: string, params: any) => void;
}

const Support = () => {
  const navigation = useNavigation<NavigationProp>();

  const [searchQuery, setSearchQuery] = useState<any>("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [subject, setSubject] = useState<any>("");

  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const response = await api.get(API_ROUTES.supportTickets);
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch support tickets",
      });
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!subject) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select an order first",
      });
      return;
    }

    setIsCreatingTicket(true);
    try {
      const payload = {
        subject: subject,
        role: "vendor",
      };

      const response = await api.post(API_ROUTES.supportTickets, payload);

      setSubject("");
      fetchTickets();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Support ticket created successfully",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create support ticket. Please try again.",
      });
    } finally {
      setIsCreatingTicket(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Help & Support" />

      <View style={styles.chatconatiner}>
        {/* Search Bar */}
        <View style={styles.searchcontainer}>
          <Ionicons
            name="magnify"
            size={s(18)}
            color="#A0A0A0"
            style={styles.icon}
          />
          <TextInput
            placeholder="Search Tickets"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.dropdowncontainer}>
          <TextInput
            placeholder="Enter Subject"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!subject || isCreatingTicket) && styles.buttonDisabled,
          ]}
          disabled={!subject || isCreatingTicket}
          onPress={handleCreateTicket}
        >
          <Text style={styles.buttontext}>
            {isCreatingTicket ? "Creating Ticket..." : "Raise Ticket"}
          </Text>
        </TouchableOpacity>

        <View style={styles.ticketsContainer}>
          <Text style={styles.sectionTitle}>My Support Tickets</Text>
          {isLoadingTickets ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading tickets...</Text>
            </View>
          ) : tickets.length > 0 ? (
            <FlatList
              data={tickets.filter((item) =>
                item.subject.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.ticketCard}
                  onPress={() =>
                    navigation.navigate(HomeNavigation.CHAT_SCREEN, {
                      ticket: item,
                    })
                  }
                >
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketSubject}>{item.subject}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        item.status === "open"
                          ? styles.statusOpen
                          : styles.statusClosed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          item.status === "open"
                            ? styles.statusTextOpen
                            : styles.statusTextClosed,
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.ticketOrder}>
                    Subject: {item.subject}
                  </Text>
                  <Text style={styles.ticketDate}>
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                  {/* <Text style={styles.ticketRole}>Role: {item.role}</Text> */}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tickets found</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  chatconatiner: {
    flex: 1,
    marginTop: s(10),
  },

  searchcontainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: s(25),
    paddingHorizontal: s(15),
    height: s(40),
    marginHorizontal: s(10),
    marginBottom: s(10),
  },

  icon: {
    marginRight: s(8),
  },

  sendIcon: {
    marginLeft: s(8),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: s(15),
    paddingVertical: s(10),
    borderWidth: 1,
    borderColor: "#ddd",
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
  },

  headerTitle: {
    fontSize: s(16),
    fontWeight: "bold",
    color: "#FCA311",
  },

  chatContainer: {
    flex: 1,
    padding: s(10),
  },

  messageBubble: {
    backgroundColor: "#E3EFF7",
    padding: s(10),
    borderRadius: s(10),
    alignSelf: "flex-start",
    marginVertical: s(5),
    maxWidth: "85%",
  },

  primaryBubble: {
    backgroundColor: "#FCA311",
    alignSelf: "flex-start",
  },

  primarytext: {
    color: "#fff",
  },

  messageText: {
    fontSize: s(10),
    fontWeight: "500",
    color: "#000",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3EFF7",
    padding: s(10),
    borderRadius: s(30),
    margin: s(10),
  },

  input: {
    flex: 1,
    paddingLeft: s(10),
    fontSize: s(14),
    color: "#000",
  },

  dropdowncontainer: {
    margin: s(10),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: s(25),
    paddingHorizontal: s(15),
    height: s(40),
    marginHorizontal: s(20),
    marginBottom: s(10),
    backgroundColor: "#F2F2F2",
  },

  dropdowntitle: {
    fontSize: s(16),
    fontWeight: "bold",
    color: "#000",
    marginBottom: s(10),
  },

  button: {
    backgroundColor: "#FCA311",
    paddingVertical: s(10),
    paddingHorizontal: s(10),
    borderRadius: s(25),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: s(50),
    marginBottom: s(10),
  },

  buttontext: {
    color: "#fff",
    fontSize: s(16),
    fontWeight: "bold",
  },

  buttonDisabled: {
    backgroundColor: "#ccc",
  },

  // Toggle buttons
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: s(15),
    marginBottom: s(15),
    backgroundColor: "#f0f0f0",
    borderRadius: s(25),
    padding: s(3),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: s(10),
    paddingHorizontal: s(15),
    borderRadius: s(22),
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#FCA311",
  },
  toggleButtonText: {
    fontSize: s(14),
    fontWeight: "500",
    color: "#666",
  },
  toggleButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Tickets list
  ticketsContainer: {
    flex: 1,
    marginHorizontal: s(15),
  },
  sectionTitle: {
    fontSize: s(18),
    fontWeight: "bold",
    color: "#000",
    marginBottom: s(15),
  },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: s(10),
    padding: s(15),
    margin: s(10),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: s(8),
  },
  ticketSubject: {
    fontSize: s(16),
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    marginRight: s(10),
  },
  statusBadge: {
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    borderRadius: s(12),
  },
  statusOpen: {
    backgroundColor: "#e8f5e8",
  },
  statusClosed: {
    backgroundColor: "#f5e8e8",
  },
  statusText: {
    fontSize: s(10),
    fontWeight: "bold",
  },
  statusTextOpen: {
    color: "#4caf50",
  },
  statusTextClosed: {
    color: "#f44336",
  },
  ticketOrder: {
    fontSize: s(14),
    color: "#666",
    marginBottom: s(4),
  },
  ticketDate: {
    fontSize: s(12),
    color: "#999",
    marginBottom: s(4),
  },
  ticketRole: {
    fontSize: s(12),
    color: "#999",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: s(20),
  },
  loadingText: {
    fontSize: s(14),
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: s(40),
  },
  emptyText: {
    fontSize: s(16),
    color: "#999",
  },
});

export default Support;
