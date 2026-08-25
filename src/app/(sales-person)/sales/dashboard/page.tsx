"use client";

import { useMemo } from "react";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useSales } from "@/hooks/use-sales";
import { useShopStock, useProducts } from "@/hooks/use-inventory";
import { useShopsList } from "@/hooks/use-locations";
import { StatCard } from "@/components/dashboard/stat-card";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Skeleton, Button } from "@/components/ui";
import { formatMNumber } from "@/lib/currency";

function isToday(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function SalesPersonDashboard() {
  const { data: shops } = useShopsList();
  const shopId = shops?.[0]?.id;

  const { data: salesData, isLoading: salesLoading } = useSales({
    shop: shopId,
    page: 1,
  });
  const { data: shopStock, isLoading: stockLoading } = useShopStock(shopId);
  const { data: products } = useProducts({ is_active: true });

  const todaysSales = useMemo(
    () => salesData?.results.filter((sale) => isToday(sale.created_at)) ?? [],
    [salesData]
  );

  const todaysRevenue = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.total_amount),
    0
  );

  const lowStockItems = useMemo(() => {
    if (!shopStock || !products) return [];
    return shopStock.filter((stock) => {
      const product = products.find((p) => p.id === stock.product);
      return product && stock.quantity <= product.low_stock_threshold;
    });
  }, [shopStock, products]);

  const isLoading = salesLoading || stockLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {shops?.[0]?.name ?? "Your Shop"}
          </h1>
          <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening today</p>
        </div>
        <Link href="/sales/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus size={16} className="mr-2" />
            New Sale
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={ShoppingCart}
          title="Sales Today"
          value={todaysSales.length}
          unit="transactions"
        />
        <StatCard
          icon={TrendingUp}
          title="Revenue Today"
          value={todaysRevenue}
          money
        />
        <StatCard
          icon={Package}
          title="Products in Stock"
          value={shopStock?.length ?? 0}
        />
        <StatCard
          icon={AlertTriangle}
          title="Low Stock Items"
          value={lowStockItems.length}
        />
      </div>

      <BorderedLayout>
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
        </div>
        <div className="px-6 pb-4">
          {!salesData?.results.length ? (
            <p className="text-sm text-gray-400 py-4">No sales recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {salesData.results.slice(0, 5).map((sale) => (
                <li
                  key={sale.id}
                  className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-800 font-medium">
                      {sale.transaction_number}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(sale.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {sale.payment_method}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatMNumber(Number(sale.total_amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </BorderedLayout>

      <BorderedLayout>
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Low Stock Alerts
          </h2>
        </div>
        <div className="px-6 pb-4">
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">
              Everything&apos;s well stocked.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {lowStockItems.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {item.product_name} ({item.product_sku})
                  </span>
                  <span className="font-medium text-red-500">
                    {item.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </BorderedLayout>
    </div>
  );
}
