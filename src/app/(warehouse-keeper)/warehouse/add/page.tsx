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
import { useAddStock, useProducts } from "@/hooks/use-inventory";
import { useWarehousesList } from "@/hooks/use-locations";
import { addStockSchema } from "@/lib/validations/warehouse-inventory";

export default function AddStockPage() {
  const { data: warehouses } = useWarehousesList();
  const { data: products = [] } = useProducts({ is_active: true });
  const addStock = useAddStock();

  const formik = useFormik({
    initialValues: {
      warehouse: "",
      product: "",
      quantity: 1,
      reason: "",
    },
    validationSchema: addStockSchema,
    onSubmit: async (values, { resetForm }) => {
      await addStock.mutateAsync({
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Stock</h1>
        <p className="text-gray-500 text-sm">
          Receive goods into your warehouse
        </p>
      </div>

      <BorderedLayout>
        <form onSubmit={handleSubmit} className="space-y-6 py-8 px-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Warehouse</Label>
              <Select
                value={values.warehouse}
                onValueChange={(value) => setFieldValue("warehouse", value)}>
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
                placeholder="e.g. Stock received from supplier"
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
              disabled={addStock.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white h-10">
              {addStock.isPending ? (
                <PleaseWaitState variant="ghost" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Add Stock
                </>
              )}
            </Button>
          </div>
        </form>
      </BorderedLayout>
    </div>
  );
}
