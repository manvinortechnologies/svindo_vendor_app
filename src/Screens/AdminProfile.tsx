import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import CustomTextInput from '../CommonComponent/CustomeTextInput';
import Loading from '../CommonComponent/Loading';
import apis from '../services/api/api';
import api from '../services/api/api';
import { DEFAULT_STATUS_CODE_SUCCESS } from '../constants/api-const';
import { HomeNavigation } from '../constants/app-routes.constants';

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const AdminProfile = ({navigation}:any) => {
    const {
        control,
        handleSubmit,
        watch,
        setError,
        trigger,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onSubmit', // only show errors after submit
    });

    const [isLoading,setIsLoading]= useState<boolean>(false)
    const values = watch();
    const allFieldsFilled = Object.values(values).every((v) => v.trim() !== '');

    const onSubmit = async (data: FormData) => {
        const isValid = await trigger();

        if (!isValid) return;

        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }
        const bodyData = {
            first_name: data.firstName,
            last_name: data.lastName,
            email:data.email,
            password: data.password
        }

        console.log('✅ SUBMITTING:', data);
        console.log("data-->",bodyData);
        try {
            setIsLoading(true)
            const res= await api.put("users/profile/me/",data)
            console.log("res--->",res)
            if(res.status==DEFAULT_STATUS_CODE_SUCCESS){
                 navigation.navigate(HomeNavigation.SIGNUP_DETAIL_SCREEN);
            }
            console.log("status-->",res.status)
        } catch (error) {
            console.log("error--->",error)
        }finally{
            setIsLoading(false)
        }
        
        // API call logic here
    };

    return (

        <View
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Profile</Text>
            </View>

            {/* Name Fields */}
            <View style={styles.row}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>First Name</Text>
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{ required: 'First name is required' }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <CustomTextInput
                                    placeholder="Enter your First Name"
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.firstName && (
                                    <Text style={styles.errorText}>{errors.firstName.message}</Text>
                                )}
                            </>
                        )}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Last Name</Text>
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{ required: 'Last name is required' }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <CustomTextInput
                                    placeholder="Enter your Last Name"
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.lastName && (
                                    <Text style={styles.errorText}>{errors.lastName.message}</Text>
                                )}
                            </>
                        )}
                    />
                </View>
            </View>

            {/* Email */}
            <View style={styles.fullWidth}>
                <Text style={styles.label}>E-mail</Text>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Invalid email format',
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <CustomTextInput
                                placeholder="Enter your email"
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}
                        </>
                    )}
                />
            </View>

            {/* Password */}
            <View style={styles.fullWidth}>
                <Text style={styles.label}>Password (For Web Access )</Text>
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Min 6 characters' },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <CustomTextInput
                                placeholder="Enter your password"
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password.message}</Text>
                            )}
                        </>
                    )}
                />
            </View>

            {/* Confirm Password */}
            <View style={styles.fullWidth}>
                <Text style={styles.label}>Confirm Password</Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: 'Confirm password is required',
                        validate: (val) =>
                            val === watch('password') || 'Passwords do not match',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <CustomTextInput
                                placeholder="Confirm your password"
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </>
                    )}
                />
            </View>

            {/* Submit Button */}

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(onSubmit)}
            >
                <LinearGradient
                    colors={['#F9C313', '#FCA511']}
                    style={styles.gradientButton}
                >
                    <Text style={styles.submitText}>Submit</Text>
                </LinearGradient>
            </TouchableOpacity>
            <Loading
            visible={isLoading}
            />


            {/* Footer */}
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

export default AdminProfile;

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
    errorText: {
        color: 'red',
        fontSize: 12,

    },
    fullWidth: {
        width: "95%",
        marginTop: 15
    }
});
