import { posts } from "./../../node_modules/@reduxjs/toolkit/src/query/tests/mocks/handlers";
export interface Vendor {
  id: number;
  name: string;
  email: string;
  contact: string;
  balance: number;
  company_name: string | null;
  gst: string | null;
  aadhar: string | null;
  pan: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  pincode: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  user: number;
  is_online: boolean;
  is_location: boolean;
  display_as_catalog: boolean;
  private_catalog: boolean;
}

export interface VendorStore {
  id: number;
  user: number;
  working_hours: any[];
  spotlight_products: any[];
  name: string;
  about: string | null;
  profile_image: string | null;
  banner_image: string | null;
  posts: any[];
  reels: any[];
  banners: any[];
  storetag: string | null;
  is_store_open: boolean;
  latitude: number;
  longitude: number;
  address: string;
  pincode: string;
  is_offline: boolean;
  store_images: string[];
}
