// ChatScreenStream.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  OverlayProvider,
  Loading,
} from "stream-chat-react-native";
import api from "../services/api/api";
import getChatChannel, { client } from "../utils/chatUtils";
import { useSelector } from "react-redux";
import { StorageUtils } from "../utils/storage";
import CustomHeader from "../CommonComponent/CustomHeader";

type RouteParams = {
  userId: string;
  token: string;
  channelId?: string; // Optional, will be determined after API call
  otherUserId: string;
};

const ChatScreenStream = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { otherUserId } = route.params || {};

  const [channel, setChannel] = useState<any>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const setupChat = async () => {
      try {
        const initResponse = await api.post("/customer/stream/chatinit/");
        console.log("initResponse", initResponse.data);
        const userData = await StorageUtils.getUserData();
        const token = initResponse.data.token;
        const userId = userData?.id;
        // Connect user with token from navigation params
        if (userId && otherUserId && token) {
          setIsInitializing(true);

          // First, check if channel already exists
          await client.connectUser({ id: userId.toString() }, token);
          let existingChannel: any = await getChatChannel(userId, otherUserId);

          // If channel doesn't exist, initialize it via API
          if (!existingChannel) {
            try {
              const initResponse = await api.post(
                "/customer/stream/chatinit/",
                {
                  other_user_id: parseInt(otherUserId, 10),
                }
              );

              console.log("Chat init response:", initResponse.data);

              // After initialization, check again for the channel
              existingChannel = await getChatChannel(userId, otherUserId);
            } catch (apiError) {
              console.error("[Stream] Chat init API error:", apiError);
              // Continue anyway - channel might still be created
            }
          }

          // Use existing channel if found, otherwise create a new one
          let chatChannel = existingChannel;

          if (!chatChannel) {
            // If still no channel, create one with channelId if provided, otherwise let Stream generate it
            const channelIdToUse = chatChannel?.id;
            chatChannel = client.channel("messaging", channelIdToUse, {
              members: [userId, otherUserId],
            });
          }

          await chatChannel.watch();

          if (isMounted) {
            setChannel(chatChannel);
            setIsClientReady(true);
          }
        }
      } catch (err) {
        console.error("[Stream] Setup error:", err);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    setupChat();

    // return () => {
    //   isMounted = false;
    //   // Cleanup: disconnect user when component unmounts
    //   client.disconnectUser();
    // };
  }, [otherUserId]);

  // Show loading or nothing until channel is ready
  if (!isClientReady || !channel || isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          title={isInitializing ? "Initializing Chat..." : "Loading Chat..."}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <OverlayProvider>
        <Chat client={client}>
          <Channel channel={channel}>
            <CustomHeader title="Chat" />
            <View style={styles.chatContainer}>
              <MessageList />
              <MessageInput InputButtons={() => null} />
            </View>
          </Channel>
        </Chat>
      </OverlayProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  back: {
    fontSize: 20,
    marginRight: 12,
    color: "#007AFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
  },
});

export default ChatScreenStream;
