import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { SignUpDetailScreenProps } from '../type';
import { useAddCompanyMutation } from '../services/api/state-api-slice';
import { HomeNavigation } from '../constants/app-routes.constants';
import { useForm, Controller } from 'react-hook-form';


type FormData = {
  company_name: string;
  brand_name: string;
  email: string;
  address: string;
};
const SignupDetailScreen: React.FC<SignUpDetailScreenProps> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    defaultValues: {
      company_name: '',
      brand_name: '',
      email: '',
      address: '',
    },
    mode: 'onChange',
  });

  const [profileImage, setProfileImage] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [addCompany, { isLoading, error: signupError }] = useAddCompanyMutation();


  const selectProfilePicture = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri && asset.type && asset.fileName) {
          setProfileImage({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          });
        }
      }
    });
  };


  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      formData.append('company_name', data.company_name);
      formData.append('brand_name', data.brand_name);
      formData.append('email', data.email);
      formData.append('address', data.address);

      if (profileImage) {
        formData.append('image', {
          uri: profileImage.uri,
          type: profileImage.type,
          name: profileImage.name,
        });
      }


      const res = await addCompany(formData).unwrap();
      console.log(res)

      // navigation.navigate(HomeNavigation.SELECT_LOCATION_SCREEN);
    } catch (error) {
      console.log('Comapny Error:', error);
    }
  };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Company</Text>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate(HomeNavigation.SELECT_LOCATION_SCREEN)}>
          <LinearGradient
            colors={['#F9C313', '#FCA511']}
            style={styles.skipButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Company Name</Text>
          <Controller
            control={control}
            name="company_name"
            render={({ field: {onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Company Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Brand Name</Text>

          <Controller
            control={control}
            name="brand_name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Brand Name"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </View>

      {/* Email field */}
      <View style={{ width: '95%' }}>
        <Text style={styles.label}>E-mail</Text>
        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputFull}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
      {/* Birthday */}
      <View style={{ width: '95%' }}>
        <Text style={styles.label}>Address</Text>

        <Controller
          control={control}
          rules={{ required: 'Address is required' }}
          name="address"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputFull}
              placeholder="Enter your address"
              placeholderTextColor="#999"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
      {/* Profile Picture Upload */}
      <TouchableOpacity
        onPress={selectProfilePicture}
        style={styles.uploadContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
        ) : (
          <Text style={styles.initials}>T</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.uploadText}>Upload Logo</Text>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { opacity: isValid ? 1 : 0.5 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isLoading}>

        <LinearGradient
          colors={['#F9C313', '#FCA511']}
          style={styles.gradientButton}>
          <Text style={styles.submitText}>Submit</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Terms and Privacy Policy */}
      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our {'\n'}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
};

export default SignupDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#222',
  },
  skipButton: {
    borderRadius: 20,
    overflow: 'hidden', // To ensure the gradient respects the border radius
  },

  skipButtonGradient: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  skipText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    padding: 10,
    textAlign: 'left',
  },
  inputWrapper: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF7DD',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    color: '#333',
    marginBottom: 20,
    borderColor: '#FCA511',
    borderWidth: 1,
  },
  inputFull: {
    backgroundColor: '#FFF7DD',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
    marginBottom: 25,
    color: '#333',
    textAlign: 'left',
    borderColor: '#FCA511',
    borderWidth: 1,

  },
  uploadContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  initials: {
    fontSize: 32,
    color: '#FCA511',
    fontWeight: 'bold',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  uploadText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  submitButton: {
    marginTop: 20,
    width: '90%',
  },
  gradientButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
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
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
});
