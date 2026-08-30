"use client";

import { useFormik } from "formik";
import { Check, ChevronDown, InfoIcon } from "lucide-react";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { useState } from "react";

export default function AddStockPage() {
  const [openProductList, setOpenProductList] = useState(false);

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

              <Popover open={openProductList} onOpenChange={setOpenProductList}>
                <PopoverTrigger
                  type="button"
                  className="flex h-10 w-full items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white px-3 text-sm font-normal text-gray-700 outline-none transition-colors hover:bg-gray-50">
                  <span className="truncate">
                    {values.product
                      ? products.find(
                          (product) => String(product.id) === values.product
                        )?.name || "Select product"
                      : "Select product"}
                  </span>

                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-full min-w-100 p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Search product..." />

                    <CommandList className="w-full">
                      <CommandEmpty>No product found.</CommandEmpty>

                      <CommandGroup className="w-full">
                        {products.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={`${product.name} ${product.sku}`}
                            onSelect={() => {
                              setFieldValue("product", String(product.id));

                              setOpenProductList(false);
                            }}>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate font-medium">
                                {product.name}
                              </span>

                              <span className="text-xs text-gray-500">
                                {product.sku}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {touched.product && errors.product && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600">
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
