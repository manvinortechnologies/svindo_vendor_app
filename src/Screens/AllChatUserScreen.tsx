import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  Chat,
  ChannelList,
  ChannelPreviewMessenger,
  OverlayProvider,
} from "stream-chat-react-native";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { HomeNavigation } from "../constants/app-routes.constants";
import { StorageUtils } from "../utils/storage";
import CustomHeader from "../CommonComponent/CustomHeader";
import { client } from "../utils/chatUtils";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  [HomeNavigation.ALL_CHAT_USER_SCREEN]: undefined;
  [HomeNavigation.CHAT_SCREEN_STREAM]: {
    userId: string;
    token?: string;
    channelId?: string; // Optional - will be determined after checking for existing channel
    otherUserId: string;
  };
};

const AllChatUserScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClientReady, setIsClientReady] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    token: string;
    vendor_user_id: string;
  }>({
    token: "",
    vendor_user_id: "",
  });

  useEffect(() => {
    getTokenFromBackend();
  }, []);

  const getTokenFromBackend = async () => {
    try {
      setIsLoading(true);
      const response = await StorageUtils.getUserData();
      const initResponse = await api.post("/customer/stream/chatinit/");
      const token = initResponse?.data?.token;
      // console.log("Token response:", response);
      setUserData({
        token: token,
        vendor_user_id: initResponse?.data?.user?.id.toString(),
      });

      // Connect user to Stream Chat
      await client.connectUser(
        { id: initResponse?.data?.user?.id.toString() },
        token
      );
      setIsClientReady(true);
    } catch (error) {
      console.error("Token fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Channel filters - show only channels where user is a member
  const filters = useMemo(() => {
    if (!userData.vendor_user_id) return null;
    return {
      members: { $in: [userData.vendor_user_id] },
      type: "messaging",
    };
  }, [userData.vendor_user_id]);

  // Channel sort - most recent messages first
  const sort = useMemo(() => [{ last_message_at: -1 } as const], []);

  // Handle channel selection
  const onSelectChannel = (channel: any) => {
    if (!userData.token || !userData.vendor_user_id) return;

    const otherUser = Object.values(channel.state.members)
      .map((m: any) => m.user)
      .find((u: any) => u?.id !== userData.vendor_user_id);
    console.log("otherUser", {
      userId: userData.vendor_user_id,
      token: userData.token,
      channelId: channel.id, // Optional - will be determined in ChatScreenStream
      otherUserId: otherUser?.id || "",
    });
    navigation.navigate(HomeNavigation.CHAT_SCREEN_STREAM, {
      userId: userData.vendor_user_id,
      token: userData.token,
      channelId: channel.id, // Optional - will be determined in ChatScreenStream
      otherUserId: otherUser?.id || "",
    });
  };

  if (!isClientReady || !filters) {
    return (
      <SafeAreaView style={styles.safe}>
        {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>
        <Loading visible={isLoading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}
      <CustomHeader title="Chats" />
      <OverlayProvider>
        <Chat client={client}>
          <ChannelList
            filters={filters}
            sort={sort}
            onSelect={onSelectChannel}
            Preview={ChannelPreviewMessenger}
          />
        </Chat>
      </OverlayProvider>
      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};

export default AllChatUserScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
