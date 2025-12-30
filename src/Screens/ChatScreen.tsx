import React, { useState, useCallback, useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { GiftedChat, IMessage, User } from "react-native-gifted-chat";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { s } from "react-native-size-matters";

interface NavigationProp {
  navigate: (screen: string, params: any) => void;
  goBack: () => void;
}

type RootStackParamList = {
  Chat: {
    ticket: {
      id: number;
      user: string;
      messages: {
        id: number;
        sender: string;
        message: string;
        is_admin: boolean;
        attachment: string | null;
        created_at: string;
        ticket: number;
      }[];
      role: string;
      subject: string;
      status: string;
      created_at: string;
      updated_at: string;
      order: number;
    };
  };
};

export default function ChatScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, "Chat">>();
  const { ticket } = route.params;
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // User object for GiftedChat (current user)
  const user: User = useMemo(
    () => ({
      _id: ticket.user, // Use the user phone number as ID
      name: "You",
    }),
    [ticket.user]
  );

  // Support agent user object
  const supportUser: User = useMemo(
    () => ({
      _id: "admin",
      name: "Svindo Support",
    }),
    []
  );

  const convertMessagesToGiftedChat = useCallback(
    (ticketMessages: any[]) => {
      const convertedMessages: IMessage[] = ticketMessages.map(
        (msg, index) => ({
          _id: msg.id,
          text: msg.message,
          createdAt: new Date(msg.created_at),
          user: msg.is_admin ? supportUser : user,
        })
      );

      // Sort messages by creation time (oldest first for GiftedChat)
      return convertedMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    },
    [supportUser, user]
  );

  useEffect(() => {
    const sortedMessages = convertMessagesToGiftedChat(ticket.messages);
    setMessages(sortedMessages);
  }, [ticket.messages, convertMessagesToGiftedChat]);

  const refreshMessages = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Fetch the latest ticket data
      const tickets = await api.get(
        API_ROUTES.supportTicketMessages.replace(
          ":ticket_id",
          ticket.id.toString()
        )
      );
      const currentTicket = tickets.data.find((t: any) => t.id === ticket.id);

      if (currentTicket) {
        const sortedMessages = convertMessagesToGiftedChat(
          currentTicket.messages
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [ticket.id, convertMessagesToGiftedChat]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (newMessages.length === 0 || isSending) return;

      const newMessage = newMessages[0];
      setIsSending(true);

      // Optimistically add the message to the UI
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      try {
        // Send message to API
        const response = await api.post(
          API_ROUTES.supportTicketMessages.replace(
            ":ticket_id",
            ticket.id.toString()
          ),
          {
            message: newMessage.text,
          }
        );

        console.log("Message sent successfully:", response);

        // Update the message with the response data if needed
        // The message is already in the UI, so we don't need to update it
      } catch (error) {
        console.error("Error sending message:", error);

        // Remove the optimistically added message on error
        setMessages((previousMessages) =>
          previousMessages.filter((msg) => msg._id !== newMessage._id)
        );

        // Show error alert
      } finally {
        setIsSending(false);
      }
    },
    [ticket.id, isSending]
  );
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={s(22)} color="black" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Chat with Svindo</Text>
          <Text style={styles.headerSubtitle}>
            Ticket #{ticket.id} - {ticket.subject}
          </Text>
          <Text style={styles.headerStatus}>
            Status: {ticket.status.toUpperCase()} | Order: #{ticket.order}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshMessages}
          disabled={isRefreshing}
        >
          <Ionicons
            name="refresh"
            size={s(20)}
            color={isRefreshing ? "#ccc" : "#FCA311"}
          />
        </TouchableOpacity>
      </View>

      {/* GiftedChat Component */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        placeholder="Type your message..."
        renderBubble={(props) => (
          <View
            style={[
              styles.messageBubble,
              props.currentMessage?.user._id === ticket.user
                ? styles.userBubble
                : styles.supportBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                props.currentMessage?.user._id === ticket.user
                  ? styles.userText
                  : styles.supportText,
              ]}
            >
              {props.currentMessage?.text}
            </Text>
          </View>
        )}
        showUserAvatar={false}
        alwaysShowSend={true}
        infiniteScroll={true}
        minInputToolbarHeight={60}
        renderSend={(props) => (
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isSending || !props.text?.trim()) && styles.sendButtonDisabled,
            ]}
            disabled={isSending || !props.text?.trim()}
            onPress={() => {
              if (props.text && props.onSend && !isSending) {
                props.onSend(
                  {
                    text: props.text.trim(),
                    user: user,
                    createdAt: new Date(),
                  },
                  true
                );
              }
            }}
          >
            <Ionicons
              name="send"
              size={s(20)}
              color={isSending ? "#ccc" : "#FCA311"}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: s(15),
    paddingVertical: s(10),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },

  headerContent: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: s(10),
  },

  headerTitle: {
    fontSize: s(16),
    fontWeight: "bold",
    color: "#FCA311",
  },

  headerSubtitle: {
    fontSize: s(12),
    color: "#666",
    marginTop: s(2),
  },

  headerStatus: {
    fontSize: s(10),
    color: "#999",
    marginTop: s(2),
  },

  refreshButton: {
    padding: s(8),
    borderRadius: s(20),
    backgroundColor: "#f0f0f0",
  },

  // Message bubble styles
  messageBubble: {
    padding: s(12),
    borderRadius: s(18),
    marginVertical: s(4),
    maxWidth: "80%",
  },

  userBubble: {
    backgroundColor: "#FCA311",
    alignSelf: "flex-end",
    borderBottomRightRadius: s(4),
  },

  supportBubble: {
    backgroundColor: "#E3EFF7",
    alignSelf: "flex-start",
    borderBottomLeftRadius: s(4),
  },

  messageText: {
    fontSize: s(14),
    fontWeight: "500",
    lineHeight: s(20),
  },

  userText: {
    color: "#fff",
  },

  supportText: {
    color: "#000",
  },

  timeText: {
    fontSize: s(10),
    color: "#999",
    marginTop: s(4),
    textAlign: "center",
  },

  avatar: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    alignItems: "center",
    justifyContent: "center",
  },

  userAvatar: {
    backgroundColor: "#FCA311",
  },

  supportAvatar: {
    backgroundColor: "#4CAF50",
  },

  avatarText: {
    color: "#fff",
    fontSize: s(12),
    fontWeight: "bold",
  },

  sendButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: "#E3EFF7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(8),
    marginVertical: s(10),
  },

  sendButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
});
