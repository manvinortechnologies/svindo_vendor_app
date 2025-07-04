// api.js
import axios from 'axios';
import { Alert } from 'react-native';
import { storage } from '../../utils/storage';
import { APP_CONSTANTS } from '../../constants/app.constants';

const api = axios.create({
  baseURL: APP_CONSTANTS.API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  async (config: any) => {
    try {
      const tokenString = await storage.getString('accessToken');
      if (tokenString) {
        console.log("Access token →", tokenString);
        config.headers.Authorization = `Bearer ${tokenString}`;
      }
    } catch (err) {
      console.error('Token fetch error:', err);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: any) => {
    // 👇 return entire response (status, headers, data, etc.)
    return response;
  },
  (error: any) => {
    console.log("API Error Response →", error);

    if (error.response?.data?.error) {
      Alert.alert("Alert", error.response.data.error);
    } else {
      Alert.alert("Error", "Something went wrong, please try again.");
    }

    if (error.response?.status === 401) {
      console.log('Unauthorized - redirecting to login...');
      // Optionally trigger logout or redirect here
    } else {
      console.log('Error message:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
