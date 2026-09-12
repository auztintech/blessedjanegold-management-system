"use client";

import { useEffect, useState } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { Plus, Trash2, Check, ChevronDown } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";

import { createSaleSchema } from "@/lib/validations/sale";
import { useCreateSale } from "@/hooks/use-sales";
import { useShopStock, useProducts } from "@/hooks/use-inventory";
import { useShopsList } from "@/hooks/use-locations";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { formatMNumber } from "@/lib/currency";
import { PaymentMethod } from "@/types/sales";
import { PleaseWaitState } from "@/components/shared/loading-button";
import { useRouter } from "next/navigation";

const paymentMethods = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

export default function NewSalePage() {
  const router = useRouter();
  const [openProductList, setOpenProductList] = useState<number | null>(null);

  const { data: shops } = useShopsList();
  const { data: products } = useProducts({
    is_active: true,
  });

  const createSale = useCreateSale();

  const formik = useFormik({
    initialValues: {
      shop: "",
      payment_method: "",
      customer_name: "",
      customer_phone: "",
      items: [
        {
          product: "",
          quantity: 1,
          unit_price: "",
        },
      ],
    },

    validationSchema: createSaleSchema,

    onSubmit: async (values, { resetForm }) => {
      await createSale.mutateAsync({
        shop: Number(values.shop),
        payment_method: values.payment_method as PaymentMethod,
        customer_name: values.customer_name.trim(),
        customer_phone: values.customer_phone.trim(),

        items: values.items.map((item) => ({
          product: Number(item.product),
          quantity: Number(item.quantity),
          unit_price: String(item.unit_price),
        })),
      });

      resetForm();

      router.push("/sales/history");
    },
  });

  const { handleSubmit, values, errors, touched, setFieldValue } = formik;

  useEffect(() => {
    if (shops && shops.length === 1 && !values.shop) {
      setFieldValue("shop", String(shops[0].id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops]);

  const { data: shopStock } = useShopStock(
    values.shop ? Number(values.shop) : undefined
  );

  const getAvailableQty = (productId: string) =>
    shopStock?.find((s) => String(s.product) === productId)?.quantity ?? null;

  const getProductPrice = (productId: string) =>
    products?.find((p) => String(p.id) === productId)?.unit_price ?? "";

  const total = values.items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unit_price) || 0;

    return sum + qty * price;
  }, 0);

  return (
    <div className="space-y-4 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>

        <p className="text-gray-500 text-sm">Record a sale for your shop</p>
      </div>

      <BorderedLayout>
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit} className="space-y-6 py-10 px-6">
            {/* Shop / Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Shop</Label>

                <Select
                  value={values.shop}
                  onValueChange={(val) => setFieldValue("shop", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select shop">
                      {shops?.find((s) => String(s.id) === values.shop)?.name}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {shops?.map((shop) => (
                      <SelectItem key={shop.id} value={String(shop.id)}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {touched.shop && errors.shop && (
                  <p className="text-xs text-red-500">
                    {errors.shop as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Payment Method</Label>

                <Select
                  value={values.payment_method}
                  onValueChange={(val) => setFieldValue("payment_method", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method">
                      {
                        paymentMethods.find(
                          (p) => p.value === values.payment_method
                        )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {paymentMethods.map((pm) => (
                      <SelectItem key={pm.value} value={pm.value}>
                        {pm.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {touched.payment_method && errors.payment_method && (
                  <p className="text-xs text-red-500">
                    {errors.payment_method as string}
                  </p>
                )}
              </div>
            </div>

            {/* Customer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Customer Name</Label>

                <Input
                  placeholder="Enter customer name"
                  value={values.customer_name}
                  onChange={(e) =>
                    setFieldValue("customer_name", e.target.value)
                  }
                />

                {touched.customer_name && errors.customer_name && (
                  <p className="text-xs text-red-500">
                    {errors.customer_name as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Customer Phone</Label>

                <Input
                  type="tel"
                  placeholder="Enter customer phone"
                  value={values.customer_phone}
                  onChange={(e) =>
                    setFieldValue("customer_phone", e.target.value)
                  }
                />

                {touched.customer_phone && errors.customer_phone && (
                  <p className="text-xs text-red-500">
                    {errors.customer_phone as string}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <FieldArray name="items">
              {({ push, remove }) => (
                <div className="space-y-3">
                  <Label>Items</Label>

                  {values.items.map((item, index) => {
                    const availableQty = getAvailableQty(item.product);

                    const overStock =
                      availableQty !== null &&
                      Number(item.quantity) > availableQty;

                    return (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row gap-3 justify-start sm:items-center border border-gray-100 rounded-lg p-3">
                        <div className="flex-1 w-full space-y-1.5">
                          <Label className="text-xs">Product</Label>

                          <Popover
                            open={openProductList === index}
                            onOpenChange={(open) => {
                              setOpenProductList(open ? index : null);
                            }}>
                            <PopoverTrigger
                              type="button"
                              className="flex h-10 w-full items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white px-3 text-sm font-normal text-gray-700 outline-none transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-1">
                              <span className="truncate">
                                {item.product
                                  ? products?.find(
                                      (product) =>
                                        String(product.id) === item.product
                                    )?.name || "Select product"
                                  : "Select product"}
                              </span>

                              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                            </PopoverTrigger>

                            <PopoverContent align="start" className="w-full">
                              <Command className="w-full">
                                <CommandInput placeholder="Search product..." />

                                <CommandList className="w-full">
                                  <CommandEmpty>No product found.</CommandEmpty>

                                  <CommandGroup className="w-full">
                                    {products?.map((product) => {
                                      const productStock =
                                        shopStock?.find(
                                          (stock) =>
                                            String(stock.product) ===
                                            String(product.id)
                                        )?.quantity ?? 0;

                                      return (
                                        <CommandItem
                                          key={product.id}
                                          value={`${product.name} ${product.sku}`}
                                          onSelect={() => {
                                            const value = String(product.id);

                                            setFieldValue(
                                              `items.${index}.product`,
                                              value
                                            );

                                            setFieldValue(
                                              `items.${index}.unit_price`,
                                              getProductPrice(value)
                                            );

                                            setOpenProductList(null);
                                          }}>
                                          <div className="flex min-w-0 flex-col">
                                            <span className="truncate font-medium">
                                              {product.name}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                              In Stock: {productStock}
                                            </span>
                                          </div>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {availableQty !== null && (
                            <p className="text-xs text-gray-400">
                              {availableQty} in stock
                            </p>
                          )}
                        </div>

                        <div className="w-full sm:w-32 space-y-1.5">
                          <Label className="text-xs">Qty</Label>

                          <Input
                            type="number"
                            min={1}
                            max={availableQty ?? undefined}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = Number(e.target.value);

                              if (
                                availableQty !== null &&
                                value > availableQty
                              ) {
                                setFieldValue(
                                  `items.${index}.quantity`,
                                  availableQty
                                );

                                return;
                              }

                              setFieldValue(
                                `items.${index}.quantity`,
                                e.target.value
                              );
                            }}
                          />

                          {overStock && (
                            <p className="text-xs text-red-500">
                              Exceeds stock
                            </p>
                          )}
                        </div>

                        <div className="w-full sm:w-40 space-y-1.5">
                          <Label className="text-xs">Unit Price</Label>

                          <Input
                            value={item.unit_price}
                            onChange={(e) =>
                              setFieldValue(
                                `items.${index}.unit_price`,
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={values.items.length === 1}
                          className="text-red-500 hover:bg-red-50 mt-1">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10"
                    onClick={() =>
                      push({
                        product: "",
                        quantity: 1,
                        unit_price: "",
                      })
                    }>
                    <Plus size={14} className="mr-1" />
                    Add Item
                  </Button>

                  {typeof errors.items === "string" && (
                    <p className="text-xs text-red-500">{errors.items}</p>
                  )}
                </div>
              )}
            </FieldArray>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-gray-600 font-medium">Total</span>

              <span className="text-xl font-bold text-gray-900">
                {formatMNumber(total)}
              </span>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                type="submit"
                disabled={createSale.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white h-10">
                {createSale.isPending ? (
                  <PleaseWaitState variant="ghost" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Sale
                  </>
                )}
              </Button>
            </div>
          </form>
        </FormikProvider>
      </BorderedLayout>
    </div>
  );
}
