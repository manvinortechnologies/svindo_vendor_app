export interface Company {
  id: number;
  company_name: string;
  brand_name: string;
  email: string;
  gstin: string | null;
  is_gst_registered: boolean;
  contact: string | null;
  billing_address: string | null;
  address: string;
  pan: string | null;
  upi_id: string | null;
  website: string | null;
  profile_image: string | null;
  user: number;
}