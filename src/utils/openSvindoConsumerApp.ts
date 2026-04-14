import { Linking, Platform } from "react-native";

const ANDROID_PACKAGE_NAME = "in.webgrid.svindo";
const IOS_BUNDLE_ID = "in.webgrid.svindoapp";

const getIosStoreUrl = async () => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}`,
    );
    const data = await response.json();
    const trackViewUrl = data?.results?.[0]?.trackViewUrl;

    if (trackViewUrl) {
      return trackViewUrl;
    }
  } catch (error) {
    console.warn("Unable to resolve iOS App Store URL by bundle id", error);
  }

  return `https://apps.apple.com/in/search?term=${encodeURIComponent(IOS_BUNDLE_ID)}`;
};

export const openSvindoConsumerApp = async (deepLinkUrl: string) => {
  try {
    const canOpenDeepLink = await Linking.canOpenURL(deepLinkUrl);
    if (canOpenDeepLink) {
      await Linking.openURL(deepLinkUrl);
      return;
    }

    if (Platform.OS === "android") {
      await Linking.openURL(`market://details?id=${ANDROID_PACKAGE_NAME}`);
      return;
    }

    const iosStoreUrl = await getIosStoreUrl();
    await Linking.openURL(iosStoreUrl);
  } catch (error) {
    if (Platform.OS === "android") {
      await Linking.openURL(
        `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`,
      );
      return;
    }

    await Linking.openURL(
      `https://apps.apple.com/in/search?term=${encodeURIComponent(IOS_BUNDLE_ID)}`,
    );
  }
};
