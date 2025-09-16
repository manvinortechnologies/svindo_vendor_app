import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";

/**
 * Enhanced smart back navigation hook that uses navigation state
 * Skips duplicate routes and goes back to the last different route
 */
export const useSmartBackNavigationV2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeStackRef = useRef<string[]>([]);

  // Track route changes and build a stack of unique routes
  useEffect(() => {
    const currentRouteName = route.name;
    const lastRoute = routeStackRef.current[routeStackRef.current.length - 1];

    // Only add to stack if it's different from the last route
    if (lastRoute !== currentRouteName) {
      routeStackRef.current.push(currentRouteName);

      // Keep only last 15 routes to prevent memory issues
      if (routeStackRef.current.length > 15) {
        routeStackRef.current = routeStackRef.current.slice(-15);
      }
    }
  }, [route.name]);

  const smartGoBack = useCallback(() => {
    const currentRouteName = route.name;
    const routeStack = routeStackRef.current;

    // Find the last different route in the stack
    let targetRouteIndex = -1;
    for (let i = routeStack.length - 2; i >= 0; i--) {
      if (routeStack[i] !== currentRouteName) {
        targetRouteIndex = i;
        break;
      }
    }

    if (targetRouteIndex >= 0) {
      // Found a different route
      const targetRoute = routeStack[targetRouteIndex];
      const stepsBack = routeStack.length - 1 - targetRouteIndex;

      // Update the stack to reflect navigation
      routeStackRef.current = routeStack.slice(0, targetRouteIndex + 1);

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

  const resetRouteStack = useCallback(() => {
    routeStackRef.current = [route.name];
  }, [route.name]);

  return {
    smartGoBack,
    resetRouteStack,
    routeStack: routeStackRef.current,
  };
};
