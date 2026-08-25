export interface DashboardOverview {
  total_shops: number;
  total_warehouses: number;
  total_products: number;
  total_inventory_units: number;
}

export interface SalesSummary {
  today_count: number;
  today_total: string;
  all_time_count: number;
  all_time_total: string;
  average_sale_value: string;
}

export interface RecentSale {
  id: number;
  transaction_number: string;
  shop__name: string;
  sales_person__username: string;
  total_amount: string;
  created_at: string;
}

export interface RecentStockAddition {
  id: number;
  product__name: string;
  quantity: number;
  to_warehouse__name: string;
  performed_by__username: string;
  created_at: string;
}

export interface RecentStockRemoval {
  id: number;
  product__name: string;
  quantity: number;
  from_warehouse__name: string;
  reason: string;
  performed_by__username: string;
  created_at: string;
}

export interface RecentTransfer {
  id: number;
  product__name: string;
  quantity: number;
  from_warehouse__name: string;
  to_warehouse__name: string;
  to_shop__name: string;
  performed_by__username: string;
  created_at: string;
}

export interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  total_quantity: number;
  low_stock_threshold: number;
}

export interface SalesByShop {
  shop_id: number;
  shop__name: string;
  total_amount: string;
  sale_count: number;
}

export interface SalesBySalesPerson {
  sales_person_id: number;
  sales_person__username: string;
  total_amount: string;
  sale_count: number;
}

export interface WarehouseActivity {
  id: number;
  name: string;
  movement_count_last_30_days: number;
}

export interface SalesTrend {
  date: string;
  total_amount: string;
  sale_count: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sku: string;
  quantity_sold: number;
  revenue: string;
}

export interface InventoryValuation {
  warehouse_value: string;
  shop_value: string;
  total_value: string;
}

export interface SalesByPaymentMethod {
  payment_method: string;
  total_amount: string;
  sale_count: number;
}

export interface MovementCount {
  movement_type: string;
  count: number;
}

export interface DashboardResponse {
  overview: DashboardOverview;
  sales_summary: SalesSummary;

  recent_sales: RecentSale[];
  recent_stock_additions: RecentStockAddition[];
  recent_stock_removals: RecentStockRemoval[];
  recent_transfers: RecentTransfer[];

  low_stock_products: LowStockProduct[];

  sales_by_shop: SalesByShop[];
  sales_by_sales_person: SalesBySalesPerson[];

  warehouse_activity: WarehouseActivity[];

  sales_trend: SalesTrend[];
  top_products: TopProduct[];

  inventory_valuation: InventoryValuation;

  sales_by_payment_method: SalesByPaymentMethod[];

  movement_counts_last_30_days: MovementCount[];
}