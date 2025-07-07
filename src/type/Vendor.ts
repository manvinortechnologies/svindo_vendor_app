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
}