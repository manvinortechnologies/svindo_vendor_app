export interface Expense {
  id: number;
  amount: string; // assuming it's stringified like "1000.00"
  expense_date: string; // format: YYYY-MM-DD
  is_paid: boolean;
  payment_type: 'cash' | 'upi' | 'bank' | string;
  payment_date: string;
  bank: string;
  description: string;
  attachment: string; // full URL to file
  user: number; // user ID
  category: number; // category ID
}

export interface BankDetails {
  name: string;
  account_holder: string;
  account_number: string;
  ifsc_code: string;
  branch: string;
}

export interface BannerCampaign {
  id: number;
  banner_image: string;
  campaign_name: string;
  redirect_to: string;
  redirect_target: string;
  boost_post: boolean;
  budget: string;
  is_approved: boolean;
  created_at: string;
  user: number;
}
export interface DeliveryPerson {
  id: number;
  name: string;
  mobile: string;
  photo: string | null;
  is_active: boolean;
  total_deliveries: number;
  rating: string; // or number if it's always numeric like "4.8"
}
