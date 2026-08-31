export interface ReportSummary {
  period: { date_from: string; date_to: string };
  totals: {
    total_sales_count: number;
    total_sales_amount: string;
    total_stock_added: number;
    total_stock_removed: number;
    total_stock_transferred: number;
    distinct_products_sold: number;
    shops_with_sales: number;
    warehouses_with_activity: number;
  };
  daily_sales_trend: {
    date: string;
    total_amount: string;
    sale_count: number;
  }[];
  sales_by_shop: {
    shop_id: number;
    shop__name: string;
    total_amount: string;
    sale_count: number;
  }[];
  sales_by_sales_person: {
    sales_person_id: number;
    sales_person__username: string;
    total_amount: string;
    sale_count: number;
  }[];
  sales_by_payment_method: {
    payment_method: string;
    total_amount: string;
    sale_count: number;
  }[];
  top_products: {
    id: number;
    name: string;
    sku: string;
    quantity_sold: number;
    revenue: string;
  }[];
  warehouse_activity: {
    id: number;
    name: string;
    added: number;
    removed: number;
    transferred: number;
    movement_count: number;
  }[];
  low_stock_products: {
    id: number;
    name: string;
    sku: string;
    total_quantity: number;
    low_stock_threshold: number;
  }[];
  inventory_valuation: {
    warehouse_value: string;
    shop_value: string;
    total_value: string;
  };
}
