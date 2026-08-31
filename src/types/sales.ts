export type PaymentMethod = "CASH" | "CARD" | "MOBILE_MONEY" | "BANK_TRANSFER";

export interface SaleItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface Sale {
  id: number;
  transaction_number: string;
  shop: number;
  shop_name: string;
  sales_person: number;
  sales_person_username: string;
  payment_method: PaymentMethod;
  total_amount: string;
  items: SaleItem[];

  customer_name: string;
  customer_phone: string;

  is_reversed: boolean;
  reversed_at: string | null;
  reversed_by: number | null;
  reversed_by_username: string | null;
  reversal_reason: string | null;

  created_at: string;
}

export interface CreateSaleItemPayload {
  product: number;
  quantity: number;
  unit_price: string;
}

export interface CreateSalePayload {
  shop: number;
  payment_method: PaymentMethod;
  items: CreateSaleItemPayload[];
  customer_name: string;
  customer_phone: string;
}

export interface ReverseSalePayload {
  reason: string;
}
