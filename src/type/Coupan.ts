export interface Coupon {
  id: number;
  coupon_type: string;
  type: 'percent' | 'net';
  customer_id: number | null;
  code: string;
  title: string;
  description: string;
  discount_percentage: string | null;
  discount_amount: string | null;
  min_purchase: string | null;
  max_discount: string | null;
  image: string | null;
  start_date: string;
  end_date: string;
  only_followers: boolean;
  is_active: boolean;
  user: number;
}