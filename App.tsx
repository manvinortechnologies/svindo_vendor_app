import "react-native-url-polyfill/auto";
import React, { RefObject, useEffect, useRef } from "react";
import AppNavigation from "./src/navigation/AppNavigation";
import { Provider } from "react-redux";
import { store } from "./src/services/store/api-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NotificationService from "./src/services/notification-service";
import { NotificationProvider } from "./src/contexts/NotificationContext";
import { NavigationContainerRef } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<any> | null>(null);

  useEffect(() => {
    // Initialize push notifications with delay to ensure app is ready
    const initializeNotifications = async () => {
      try {
        // Wait a bit to ensure the app is fully mounted
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Set navigation reference
        if (navigationRef.current) {
          NotificationService.setNavigationRef(
            navigationRef.current as NavigationContainerRef<any>
          );
        }

        // Initialize notification service with error handling
        try {
          await NotificationService.initialize();
          console.log("Push notifications initialized successfully");
        } catch (initError: any) {
          console.error("Error initializing push notifications:", initError);
          // Don't crash the app - just log the error
        }
      } catch (error: any) {
        console.error("Error in notification initialization setup:", error);
        // Don't crash the app - just log the error
      }
    };

    // Use a timeout to ensure React Native is fully initialized
    const timeoutId = setTimeout(() => {
      initializeNotifications();
    }, 2000);

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationProvider>
          <AppNavigation />
        </NotificationProvider>
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  );
};
export default App;

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
// import auth from '@react-native-firebase/auth';

// export default function App({ navigation }) {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [confirm, setConfirm] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSendCode = async () => {

//     if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
//       setError('Please enter a valid 10-digit phone number.');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     try {
//       const fullPhoneNumber = `+91${phoneNumber}`;
//       const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
//       console.log(confirmation)

//       setConfirm(confirmation);
//       Alert.alert('Verification code sent to your phone.');
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmCode = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const userCredential = await confirm.confirm(verificationCode);
//     console.log('User info:', userCredential?.user);
//      const idToken = await userCredential.user.getIdToken();
//      console.log('Firebase ID Token:', idToken);
//       // await AsyncStorage.setItem('isLoggedIn', 'true');

//       navigation.replace('Home');
//     } catch (error) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>

//       <View style={{alignItems:'center', justifyContent:'center', marginBottom:20,}}>

//         <Text style={{color:"#000000"}}>Need Help? Call Now</Text>
//         <Text style={{fontSize:20, color:"#000000"}}>+91 9253176337</Text>
//       </View>
//       {!confirm ? (
//         <>
//           <View style={styles.phoneInputContainer}>
//             <Text style={styles.countryCode}>+91</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//               keyboardType="phone-pad"
//               maxLength={10}
//               placeholderTextColor="#000000"
//             />
//           </View>
//           {loading ? (
//             <ActivityIndicator size="large" color="#0000ff" />
//           ) : (
//             <TouchableOpacity
//               onPress={handleSendCode}
//               style={{ height: 60, backgroundColor: 'teal', justifyContent: 'center', alignItems: 'center' }}>
//               <Text style={{ color: 'white' }}>Send Code</Text>
//             </TouchableOpacity>
//           )}
//         </>
//       ) : (
//         <>
//         <View style={styles.phoneInputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Verification Code"
//             value={verificationCode}
//             onChangeText={setVerificationCode}
//             keyboardType="number-pad"
//           />
//           </View>
//           {loading ? (
//             <ActivityIndicator size="large" color="#0000ff" />
//           ) : (
//             <TouchableOpacity
//               onPress={handleConfirmCode}
//               style={{
//                 height: 60,
//                 backgroundColor: 'teal',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//               <Text style={{ color: 'white' }}>Confirm Code</Text>
//             </TouchableOpacity>
//           )}
//         </>
//       )}
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     padding: 20,
//     marginTop:'20%',
//   },
//   phoneInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   countryCode: {
//     fontSize: 18,
//     marginRight: 10,
//     color:'#000',
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//     height:50,
//     color:'#000',
//   },
//   error: {
//     color: '#83160C',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
// });
