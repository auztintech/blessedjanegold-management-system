export interface Product {
  id: number;
  name: string;
  sku: string;
  category: number;
  category_name: string;
  description: string;
  unit_price: string;
  low_stock_threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPayload {
  name: string;
  sku: string;
  category: number;
  description: string;
  unit_price: string;
  low_stock_threshold: number;
  is_active: boolean;
}

export interface ProductListParams {
  category?: number;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  search?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
}

export interface CategoryListParams {
  ordering?: string;
  page?: number;
  search?: string;
}

export interface ShopStock {
  id: number;
  shop: number;
  shop_name: string;
  product: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  updated_at: string;
}

export interface WarehouseStock {
  id: number;
  warehouse: number;
  warehouse_name: string;
  product: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  updated_at: string;
}

export interface InventoryMovement {
  id: number;
  movement_type: "ADD" | "REMOVE" | "TRANSFER" | "SALE" | "REVERSAL";
  product: number;
  product_name: string;
  quantity: number;
  from_warehouse: number | null;
  to_warehouse: number | null;
  from_shop: number | null;
  to_shop: number | null;
  reason: string;
  performed_by: number;
  performed_by_username: string;
  created_at: string;
}

export interface AddStockPayload {
  warehouse: number;
  product: number;
  quantity: number;
  reason: string;
}

export interface RemoveStockPayload {
  warehouse: number;
  product: number;
  quantity: number;
  reason: string;
}

export interface TransferStockPayload {
  from_warehouse: number;
  product: number;
  quantity: number;
  to_warehouse?: number;
  to_shop?: number;
  reason: string;
}
