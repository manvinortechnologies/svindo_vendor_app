import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance("c7wwttj85hg7");

const getChatChannel = async (currentUserId: string, otherUserId: string) => {
  const filters = {
    type: "messaging",
    member_count: 2,
    members: { $eq: [currentUserId.toString(), otherUserId.toString()] },
  };
  const channels = await client.queryChannels(filters);
  console.log("channels", channels);
  return channels[0];
};

export default getChatChannel;

export { client };
