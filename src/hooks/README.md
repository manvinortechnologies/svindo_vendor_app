# Smart Back Navigation

This directory contains hooks for implementing smart back navigation that skips duplicate routes.

## Problem

When users navigate through multiple instances of the same screen (e.g., SaleScreen → SaleScreen → SaleScreen → HomeScreen), pressing the back button would normally go back one step at a time, potentially getting stuck in a loop of the same screen.

## Solution

The smart back navigation hooks track route history and automatically skip duplicate routes, taking users directly to the last different screen.

## Usage

### Option 1: Using CustomHeader (Recommended)

The `CustomHeader` component automatically uses smart back navigation:

```tsx
import CustomHeader from "../CommonComponent/CustomHeader";

const MyScreen = () => {
  return (
    <View>
      <CustomHeader title="My Screen" />
      {/* Your screen content */}
    </View>
  );
};
```

### Option 2: Using the Hook Directly

```tsx
import { useSmartBackNavigationV2 } from "../hooks/useSmartBackNavigationV2";

const MyScreen = () => {
  const { smartGoBack } = useSmartBackNavigationV2();

  return (
    <TouchableOpacity onPress={smartGoBack}>
      <Text>Go Back</Text>
    </TouchableOpacity>
  );
};
```

### Option 3: Using the Utility Function

```tsx
import { createSmartBackHandler } from "../utils/smartNavigation";

const MyScreen = ({ navigation }) => {
  const { smartGoBack, addRoute } = createSmartBackHandler(navigation);

  // Add current route when component mounts
  useEffect(() => {
    addRoute("MyScreen");
  }, []);

  return (
    <TouchableOpacity onPress={smartGoBack}>
      <Text>Go Back</Text>
    </TouchableOpacity>
  );
};
```

## How It Works

1. **Route Tracking**: The hook tracks each unique route as it's navigated to
2. **Duplicate Detection**: When back is pressed, it looks for the last different route in the history
3. **Smart Navigation**: It calculates how many steps back to take and navigates directly to the different route
4. **History Management**: The route history is automatically maintained and cleaned up

## Example Scenario

```
Navigation History: [HomeScreen, SaleScreen, SaleScreen, SaleScreen, ProductScreen]
Current Screen: ProductScreen

Normal Back: ProductScreen → SaleScreen (first duplicate)
Smart Back: ProductScreen → HomeScreen (skips all SaleScreen duplicates)
```

## Notes

- The hook automatically limits history to 15 routes to prevent memory issues
- It gracefully falls back to normal back navigation if no different route is found
- The route tracking is automatic when using the hook or CustomHeader
