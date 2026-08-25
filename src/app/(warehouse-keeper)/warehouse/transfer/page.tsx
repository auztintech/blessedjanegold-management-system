"use client";

import { useFormik } from "formik";
import { Check, InfoIcon } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { PleaseWaitState } from "@/components/shared/loading-button";
import {
  useProducts,
  useTransferStock,
  useWarehouseStock,
} from "@/hooks/use-inventory";
import { useShopsList, useWarehousesList } from "@/hooks/use-locations";
import { transferStockSchema } from "@/lib/validations/warehouse-inventory";

export default function TransferStockPage() {
  const { data: warehouses } = useWarehousesList();
  const { data: shops } = useShopsList();
  const { data: productsData } = useProducts({ is_active: true });
  const products = productsData ?? [];
  const transferStock = useTransferStock();

  const formik = useFormik({
    initialValues: {
      from_warehouse: "",
      product: "",
      quantity: 1,
      destination_type: "warehouse",
      to_warehouse: "",
      to_shop: "",
      reason: "",
    },
    validationSchema: transferStockSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        from_warehouse: Number(values.from_warehouse),
        product: Number(values.product),
        quantity: Number(values.quantity),
        ...(values.destination_type === "warehouse"
          ? { to_warehouse: Number(values.to_warehouse) }
          : { to_shop: Number(values.to_shop) }),
        reason: values.reason,
      };

      await transferStock.mutateAsync(payload);
      resetForm();
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik;

  const { data: stockData } = useWarehouseStock(
    values.from_warehouse ? Number(values.from_warehouse) : undefined
  );

  const currentStock =
    stockData?.results.find((stock) => String(stock.product) === values.product)
      ?.quantity ?? null;

  const exceedsStock =
    currentStock !== null && Number(values.quantity) > currentStock;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfer Stock</h1>
        <p className="text-gray-500 text-sm">
          Transfer goods to another warehouse or shop
        </p>
      </div>

      <BorderedLayout>
        <form onSubmit={handleSubmit} className="space-y-6 py-8 px-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>From Warehouse</Label>
              <Select
                value={values.from_warehouse}
                onValueChange={(value) => {
                  setFieldValue("from_warehouse", value);
                  setFieldValue("product", "");
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select warehouse">
                    {
                      warehouses?.find(
                        (warehouse) =>
                          String(warehouse.id) === values.from_warehouse
                      )?.name
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {warehouses?.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.from_warehouse && errors.from_warehouse && (
                <p className="text-xs flex gap-1 items-center font-medium text-red-600">
                  <InfoIcon className="h-3 w-3" />
                  {errors.from_warehouse}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Product</Label>
              <Select
                value={values.product}
                onValueChange={(value) => setFieldValue("product", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product">
                    {
                      products.find(
                        (product) => String(product.id) === values.product
                      )?.name
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentStock !== null && (
                <p className="text-xs text-gray-400">
                  Available:{" "}
                  <span className="font-medium text-gray-700">
                    {currentStock}
                  </span>
                </p>
              )}
              {touched.product && errors.product && (
                <p className="text-xs flex gap-1 items-center font-medium text-red-600">
                  <InfoIcon className="h-3 w-3" />
                  {errors.product}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                value={values.quantity}
                onChange={handleChange}
              />
              {exceedsStock && (
                <p className="text-xs font-medium text-red-500">
                  Cannot transfer more than the available stock ({currentStock}
                  ).
                </p>
              )}
              {touched.quantity && errors.quantity && (
                <p className="text-xs flex gap-1 items-center font-medium text-red-600">
                  <InfoIcon className="h-3 w-3" />
                  {errors.quantity}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Destination</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={
                    values.destination_type === "warehouse"
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    setFieldValue("destination_type", "warehouse");
                    setFieldValue("to_shop", "");
                  }}
                  className={
                    values.destination_type === "warehouse"
                      ? "bg-orange-500 hover:bg-orange-600 text-white h-10"
                      : "h-10"
                  }>
                  Warehouse
                </Button>
                <Button
                  type="button"
                  variant={
                    values.destination_type === "shop" ? "default" : "outline"
                  }
                  onClick={() => {
                    setFieldValue("destination_type", "shop");
                    setFieldValue("to_warehouse", "");
                  }}
                  className={
                    values.destination_type === "shop"
                      ? "bg-orange-500 hover:bg-orange-600 text-white h-10"
                      : "h-10"
                  }>
                  Shop
                </Button>
              </div>
            </div>

            {values.destination_type === "warehouse" && (
              <div className="space-y-1.5">
                <Label>Destination Warehouse</Label>
                <Select
                  value={values.to_warehouse}
                  onValueChange={(value) =>
                    setFieldValue("to_warehouse", value)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination warehouse">
                      {
                        warehouses?.find(
                          (warehouse) =>
                            String(warehouse.id) === values.to_warehouse
                        )?.name
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses
                      ?.filter(
                        (warehouse) =>
                          String(warehouse.id) !== values.from_warehouse
                      )
                      .map((warehouse) => (
                        <SelectItem
                          key={warehouse.id}
                          value={String(warehouse.id)}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {touched.to_warehouse && errors.to_warehouse && (
                  <p className="text-xs flex gap-1 items-center font-medium text-red-600">
                    <InfoIcon className="h-3 w-3" />
                    {errors.to_warehouse}
                  </p>
                )}
              </div>
            )}

            {values.destination_type === "shop" && (
              <div className="space-y-1.5">
                <Label>Destination Shop</Label>
                <Select
                  value={values.to_shop}
                  onValueChange={(value) => setFieldValue("to_shop", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination shop">
                      {
                        shops?.find(
                          (shop) => String(shop.id) === values.to_shop
                        )?.name
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {shops
                      ?.filter((shop) => shop.is_active)
                      .map((shop) => (
                        <SelectItem key={shop.id} value={String(shop.id)}>
                          {shop.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {touched.to_shop && errors.to_shop && (
                  <p className="text-xs flex gap-1 items-center font-medium text-red-600">
                    <InfoIcon className="h-3 w-3" />
                    {errors.to_shop}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="e.g. Restocking branch"
                value={values.reason}
                onChange={handleChange}
              />
              {touched.reason && errors.reason && (
                <p className="text-xs flex gap-1 items-center font-medium text-red-600">
                  <InfoIcon className="h-3 w-3" />
                  {errors.reason}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={transferStock.isPending || exceedsStock}
              className="bg-orange-500 hover:bg-orange-600 text-white h-10">
              {transferStock.isPending ? (
                <PleaseWaitState variant="ghost" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Transfer Stock
                </>
              )}
            </Button>
          </div>
        </form>
      </BorderedLayout>
    </div>
  );
}
