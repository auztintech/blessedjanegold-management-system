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
  useRemoveStock,
  useProducts,
  useWarehouseStock,
} from "@/hooks/use-inventory";
import { useWarehousesList } from "@/hooks/use-locations";
import { removeStockSchema } from "@/lib/validations/warehouse-inventory";

export default function RemoveStockPage() {
  const { data: warehouses } = useWarehousesList();
  const { data: products = [] } = useProducts({ is_active: true });
  const removeStock = useRemoveStock();

  const formik = useFormik({
    initialValues: {
      warehouse: "",
      product: "",
      quantity: 1,
      reason: "",
    },
    validationSchema: removeStockSchema,
    onSubmit: async (values, { resetForm }) => {
      await removeStock.mutateAsync({
        warehouse: Number(values.warehouse),
        product: Number(values.product),
        quantity: Number(values.quantity),
        reason: values.reason,
      });
      resetForm();
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik;

  const { data: stockData } = useWarehouseStock(
    values.warehouse ? Number(values.warehouse) : undefined
  );

  const currentStock =
    stockData?.results.find((stock) => String(stock.product) === values.product)
      ?.quantity ?? null;

  const exceedsStock =
    currentStock !== null && Number(values.quantity) > currentStock;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Remove Stock</h1>
        <p className="text-gray-500 text-sm">
          Remove goods from your warehouse
        </p>
      </div>

      <BorderedLayout>
        <form onSubmit={handleSubmit} className="space-y-6 py-8 px-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Warehouse</Label>
              <Select
                value={values.warehouse}
                onValueChange={(value) => {
                  setFieldValue("warehouse", value);
                  setFieldValue("product", "");
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select warehouse">
                    {
                      warehouses?.find(
                        (warehouse) => String(warehouse.id) === values.warehouse
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
              {touched.warehouse && errors.warehouse && (
                <p className="text-xs flex gap-1 items-center font-medium text-red-600">
                  <InfoIcon className="h-3 w-3" />
                  {errors.warehouse}
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
                  Current stock:{" "}
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
                  Cannot remove more than the available stock ({currentStock}).
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
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="e.g. Damaged goods"
                value={values.reason}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-400">
                A reason is required when removing stock.
              </p>
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
              disabled={removeStock.isPending || exceedsStock}
              className="bg-orange-500 hover:bg-orange-600 text-white h-10">
              {removeStock.isPending ? (
                <PleaseWaitState variant="ghost" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Remove Stock
                </>
              )}
            </Button>
          </div>
        </form>
      </BorderedLayout>
    </div>
  );
}
