import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { storage } from '../../utils/storage';

const getTokenFromStorage = async () => {
  try {
    const token = storage.getString('accessToken');
    return token;
  } catch (error) {
    console.error('Failed to fetch token from storage', error);
    return null;
  }
};


export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const token = await getTokenFromStorage();
  const query = fetchBaseQuery({
    baseUrl: APP_CONSTANTS.API_BASE_URL,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
  console.log('Request:',token, args);
  return query(args, api, extraOptions);
};


