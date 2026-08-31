const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const endpoints = (param?: string | number) => {
  const user = {
    login: `${baseUrl}/auth/token/`,
    refresh: `${baseUrl}/auth/token/refresh/`,
    me: `${baseUrl}/users/me/`,
    changePassword: `${baseUrl}/users/me/change-password/`,
    list: `${baseUrl}/users/`,
    detail: `${baseUrl}/users/${param}/`,
    shopAssignments: `${baseUrl}/users/shop-assignments/`,
    shopAssignmentDetail: `${baseUrl}/users/shop-assignments/${param}/`,
    warehouseAssignments: `${baseUrl}/users/warehouse-assignments/`,
    warehouseAssignmentDetail: `${baseUrl}/users/warehouse-assignments/${param}/`,
  };

  const dashboard = {
    overview: `${baseUrl}/dashboard/`,
    warehouseKeeper: `${baseUrl}/dashboard/warehouse-keeper/`,
    salesPerson: `${baseUrl}/dashboard/sales-person/`,
  };

  const shops = {
    list: `${baseUrl}/shops/`,
    detail: `${baseUrl}/shops/${param}/`,
  };

  const warehouses = {
    list: `${baseUrl}/warehouses/`,
    detail: `${baseUrl}/warehouses/${param}/`,
  };

  const inventory = {
    categories: `${baseUrl}/inventory/categories/`,
    categoryDetail: `${baseUrl}/inventory/categories/${param}/`,
    products: `${baseUrl}/inventory/products/`,
    productDetail: `${baseUrl}/inventory/products/${param}/`,
    movements: `${baseUrl}/inventory/movements/`,
    movementDetail: `${baseUrl}/inventory/movements/${param}/`,
    shopStock: `${baseUrl}/inventory/shop-stock/`,
    shopStockDetail: `${baseUrl}/inventory/shop-stock/${param}/`,
    warehouseStock: `${baseUrl}/inventory/warehouse-stock/`,
    warehouseStockDetail: `${baseUrl}/inventory/warehouse-stock/${param}/`,
    addStock: `${baseUrl}/inventory/actions/add-stock/`,
    removeStock: `${baseUrl}/inventory/actions/remove-stock/`,
    transferStock: `${baseUrl}/inventory/actions/transfer-stock/`,
  };

  const sales = {
    list: `${baseUrl}/sales/`,
    detail: `${baseUrl}/sales/${param}/`,
    reverse: `${baseUrl}/sales/${param}/reverse/`,
    receipt: `${baseUrl}/sales/${param}/receipt/`,
  };

  const activityLog = {
    list: `${baseUrl}/activity-log/`,
  };

  const reports = {
    summary: `${baseUrl}/reports/summary/`,
  };

  return {
    user,
    dashboard,
    shops,
    warehouses,
    inventory,
    sales,
    activityLog,
    reports,
  };
};