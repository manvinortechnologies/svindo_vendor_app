import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";
import { VendorStore } from "../../type/Vendor";

// interface registerUser {
//   mobile: string;
//   countryCode: string;
// }

// interface ResigerResponse {
//   success: boolean;
//   message: string;
//   user: {
//     id: string;
//     mobile: string;
//     verified: boolean;
//   }
// }

// interface verifyOtp {
//   mobile: string;
//   otp: string;
//   countryCode: string;

// }
// interface VerifyOtpResponse {
//   success: boolean;
//   message: string;
//   user: {
//     id: string;
//     fullName: string;
//     mobile: string;
//     email: null;
//     gender: null;
//     role: string;
//     verified: boolean;
//     avatar: null;
//     referralCode: any;
//     documentsUploaded: string;
//   },
//   tokens:{
//     accessToken: string;
//     refreshToken:string;
//     tokenType:string;
//     expiresIn:string;
//     refreshExpiresIn:string;
//   }
// }
interface signUp {
  idToken: string;
  user_type: string;
}
interface SignUpRes {
  access: string;
  refresh: string;
  user: {
    id: number;
    mobile: string;
    email: string;
    name: string;
    user_type: string;
    created: boolean;
  };
  status: number;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["VendorStore"],
  endpoints: (builder) => ({
    login: builder.mutation<SignUpRes, signUp>({
      query: (login) => ({
        url: "users/login/",
        method: "POST",
        body: login,
      }),
      transformResponse: (
        response: SignUpRes,
        meta: { response: Response }
      ) => {
        return { ...response, status: meta.response.status };
      },
    }),
    addCompany: builder.mutation<any, any>({
      query: (companyDetails) => ({
        url: `vendor/company-profile/`,
        method: "POST",
        body: companyDetails,
      }),
      transformResponse: (response: any, meta: { response: Response }) => {
        return { ...response, status: meta.response.status };
      },
    }),
    updateProfile: builder.mutation<any, any>({
      query: (updateprofile) => ({
        url: `auth/profile`,
        method: "PUT",
        body: updateprofile,
      }),
      transformResponse: (response: any, meta: { response: Response }) => {
        return { ...response, status: meta.response.status };
      },
    }),
    getUserDocument: builder.query<any, void>({
      query: () => ({
        url: "documents/user",
        method: "GET",
      }),
    }),
    referralGenerate: builder.mutation<any, any>({
      query: () => ({
        url: `referral/user/generate`,
        method: "POST",
      }),
      transformResponse: (response: any, meta: { response: Response }) => {
        return { ...response, status: meta.response.status };
      },
    }),
    ratingUser: builder.mutation<any, any>({
      query: (rating) => ({
        url: "ratings/user",
        method: "POST",
        body: rating,
      }),
      transformResponse: (response: any, meta: { response: Response }) => {
        return { ...response, status: meta.response.status };
      },
    }),
    getVendorStores: builder.query<VendorStore, void>({
      query: () => ({
        url: "vendor/vendor-stores/",
        method: "GET",
      }),
      providesTags: ["VendorStore"],
    }),
    updateVendorStore: builder.mutation<VendorStore, FormData>({
      query: (formData) => ({
        url: "vendor/vendor-stores/",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["VendorStore"],
    }),
  }),
});

export const {
  useLoginMutation,
  useAddCompanyMutation,
  useUpdateProfileMutation,
  useGetUserDocumentQuery,
  useReferralGenerateMutation,
  useRatingUserMutation,
  useGetVendorStoresQuery,
  useUpdateVendorStoreMutation,
} = api;
