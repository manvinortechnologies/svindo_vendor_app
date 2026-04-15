// ChatScreenStream.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-react-native";
import api from "../services/api/api";
import getChatChannel, { client } from "../utils/chatUtils";
import { StorageUtils } from "../utils/storage";
import CustomHeader from "../CommonComponent/CustomHeader";
import { s } from "react-native-size-matters";

type RouteParams = {
  userId: string;
  token: string;
  channelId?: string; // Optional, will be determined after API call
  otherUserId: string;
};

const ChatScreenStream = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { otherUserId } = route.params || {};
  const insets = useSafeAreaInsets();
  const [channel, setChannel] = useState<any>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const setupChat = async () => {
      try {
        const initResponse = await api.post("/customer/stream/chatinit/");
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
                },
              );

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
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <CustomHeader
          title={isInitializing ? "Initializing Chat..." : "Loading Chat..."}
        />
      </View>
    );
  }


  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Chat client={client} >
        <Channel channel={channel} keyboardVerticalOffset={s(0)} >
          <CustomHeader title="Chat" />
          <MessageList />
          <MessageInput
            InputButtons={() => null}
          />
        </Channel>
      </Chat>
    </View>
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
