import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { SignUpScreenProps, THomeNavigation } from '../type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeNavigation } from '../constants/app-routes.constants';
import Loading from '../CommonComponent/Loading';








const SignupScreen: FC<SignUpScreenProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<THomeNavigation>>();

  const route = useRoute<RouteProp<THomeNavigation, HomeNavigation.SIGNUP_SCREEN>>();
  const { authType } = route?.params
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [confirm, setConfirm] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);




  const handleContinue = async () => {

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const fullPhoneNumber = `+91${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
      console.log("confirmaiton --->",confirmation)
      setConfirm(confirmation);
      navigation.navigate(HomeNavigation.OTP_SCREEN, { confirmAuth: confirmation, phoneNumber: fullPhoneNumber,authType:authType });
      // Alert.alert('Verification code sent to your phone.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const requestSmsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          PermissionsAndroid.PERMISSIONS.READ_SMS,
        ]);
        // console.log('SMS permissions:', granted);
        if (
          granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          // console.log('SMS permissions granted');
        } else {
          // console.log('SMS permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestSmsPermission();
  }, []);


  return (
    <View style={styles.container}>
      {/* Logo & Title */}
      <LinearGradient colors={['#F9C313', '#FCA511']} style={styles.header}>
        <Image
          source={require('../assets/logo.png')} // Replace with your logo
          style={styles.logo}
        />
        <Text style={styles.title}> Svindo</Text>
        <Text style={styles.title}>Business</Text>
        <Text style={styles.subtitle}>Window to Real Growth</Text>
      </LinearGradient>

      {/* Content Wrapper - Input & Button Centered */}
      <View style={styles.contentWrapper}>
        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor={"#909090"}
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            maxLength={10}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.continueButtonWrapper}
          disabled={!phoneNumber}
        >
          <LinearGradient
            colors={['#F9C313', '#FCA511']}
            style={styles.continueButtonGradient}>
            <Text style={styles.continueText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Terms & Privacy - Pinned to Bottom */}
      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our {'\n'}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
      <Loading
      visible={loading}
      />


    </View>
  );
};

export default SignupScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  logo: {
    width: 120,
    height: 140,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF7DD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '90%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCA511',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  continueButtonWrapper: {
    width: '90%',
    borderRadius: 30,
    overflow: 'hidden', // Ensures the gradient stays within rounded corners
    alignSelf: 'center',
    marginBottom: 20,
  },
  continueButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    width: '90%',
  },
  linkText: {
    color: '#FCA511',
    textDecorationLine: 'underline',
  },


  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -50,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
});





// const handleAllow = () => {
//   setModalVisible(false);
//   navigation.navigate('OtpScreen');
// };



// const handleContinue = () => {
//   setModalVisible(true); // Show the modal on Continue
// };


{/* Permission Popup */ }
{/* <Modal transparent visible={isModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../assets/message.png')}
              style={styles.messageIcon}
            />
            <Text style={styles.modalText}>
              Allow svindo to send and view SMS messages?
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleAllow}>
              <Text style={styles.modalButtonText}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Don't allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}





// Modal Styles
// modalOverlay: {
//   flex: 1,
//   backgroundColor: 'rgba(0,0,0,0.5)',
//   alignItems: 'center',
//   justifyContent: 'center',
// },
// modalContainer: {
//   backgroundColor: '#fff',
//   width: '85%',
//   borderRadius: 10,
//   padding: 20,
//   alignItems: 'center',
// },
// messageIcon: {
//   width: 40,
//   height: 40,
//   marginBottom: 10,
// },
// modalText: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   textAlign: 'center',
//   marginBottom: 20,
// },
// modalButton: {
//   backgroundColor: '#FFF7DD',
//   paddingVertical: 10,
//   borderRadius: 20,
//   width: '100%',
//   alignItems: 'center',
//   marginBottom: 10,
// },
// modalButtonText: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   color: '#333',
// },