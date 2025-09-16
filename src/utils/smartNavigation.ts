import { NavigationProp } from "@react-navigation/native";

/**
 * Utility function for smart back navigation
 * Can be used in any component that has access to navigation prop
 */
export const createSmartBackHandler = (navigation: NavigationProp<any>) => {
  let routeStack: string[] = [];
  let currentRoute = "";

  const addRoute = (routeName: string) => {
    if (currentRoute !== routeName) {
      routeStack.push(routeName);
      currentRoute = routeName;

      // Keep only last 15 routes
      if (routeStack.length > 15) {
        routeStack = routeStack.slice(-15);
      }
    }
  };

  const smartGoBack = () => {
    const currentRouteName = currentRoute;

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
      const stepsBack = routeStack.length - 1 - targetRouteIndex;

      // Update the stack
      routeStack = routeStack.slice(0, targetRouteIndex + 1);

      // Navigate back
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
  };

  return {
    addRoute,
    smartGoBack,
    getRouteStack: () => routeStack,
  };
};
