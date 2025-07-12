export interface Customer {
  id: number;
  name: string;
  email: string;
  contact: string;
  balance: number;

  company_name: string;
  gst_number: string | null;
  aadhar_number: string | null;
  pan_number: string | null;

  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_pincode: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_country: string | null;

  dispatch_address_line1: string | null;
  dispatch_address_line2: string | null;
  dispatch_pincode: string | null;
  dispatch_city: string | null;
  dispatch_state: string | null;
  dispatch_country: string | null;

  transport_name: string | null;
  user: number;
}
