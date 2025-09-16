import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for smart back navigation that skips duplicate routes
 * Goes back to the last different route instead of just the previous route
 */
export const useSmartBackNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeHistoryRef = useRef<string[]>([]);
  const currentRouteRef = useRef<string>("");

  // Track route changes
  useEffect(() => {
    const currentRouteName = route.name;

    // Only add to history if it's a different route
    if (currentRouteRef.current !== currentRouteName) {
      routeHistoryRef.current.push(currentRouteName);
      currentRouteRef.current = currentRouteName;

      // Keep only last 10 routes to prevent memory issues
      if (routeHistoryRef.current.length > 10) {
        routeHistoryRef.current = routeHistoryRef.current.slice(-10);
      }
    }
  }, [route.name]);

  const smartGoBack = useCallback(() => {
    const currentRouteName = route.name;
    const history = routeHistoryRef.current;

    // Find the last different route in history
    let targetRouteIndex = -1;
    for (let i = history.length - 2; i >= 0; i--) {
      if (history[i] !== currentRouteName) {
        targetRouteIndex = i;
        break;
      }
    }

    if (targetRouteIndex >= 0) {
      // Found a different route, calculate how many steps back
      const stepsBack = history.length - 1 - targetRouteIndex;

      // Update history to reflect the navigation
      routeHistoryRef.current = history.slice(0, targetRouteIndex + 1);

      // Navigate back the calculated number of steps
      for (let i = 0; i < stepsBack; i++) {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }
    } else {
      // No different route found, use default back navigation
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [navigation, route.name]);

  return {
    smartGoBack,
    routeHistory: routeHistoryRef.current,
  };
};
