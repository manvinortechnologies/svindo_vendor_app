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
