"use client";

import { useEffect } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { Plus, Trash2, Check } from "lucide-react";
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
import { createSaleSchema } from "@/lib/validations/sale";
import { useCreateSale } from "@/hooks/use-sales";
import { useShopStock, useProducts } from "@/hooks/use-inventory";
import { useShopsList } from "@/hooks/use-locations";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { formatMNumber } from "@/lib/currency";
import { PaymentMethod } from "@/types/sales";
import { PleaseWaitState } from "@/components/shared/loading-button";

const paymentMethods = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

export default function NewSalePage() {
  const { data: shops } = useShopsList();
  const { data: products } = useProducts({ is_active: true });
  const createSale = useCreateSale();

  const formik = useFormik({
    initialValues: {
      shop: "",
      payment_method: "",
      items: [{ product: "", quantity: 1, unit_price: "" }],
    },
    validationSchema: createSaleSchema,
    onSubmit: async (values, { resetForm }) => {
      await createSale.mutateAsync({
        shop: Number(values.shop),
        payment_method: values.payment_method as PaymentMethod,
        items: values.items.map((item) => ({
          product: Number(item.product),
          quantity: Number(item.quantity),
          unit_price: String(item.unit_price),
        })),
      });

      resetForm();
    },
  });

  const { handleSubmit, values, errors, touched, setFieldValue } = formik;

  // Auto-select the shop once available — most Sales Persons only have one
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
                          <Select
                            value={item.product}
                            onValueChange={(val) => {
                              if (!val) return;

                              setFieldValue(`items.${index}.product`, val);
                              setFieldValue(
                                `items.${index}.unit_price`,
                                getProductPrice(val)
                              );
                            }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select product">
                                {
                                  products?.find(
                                    (p) => String(p.id) === item.product
                                  )?.name
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {products?.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={String(product.id)}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      push({ product: "", quantity: 1, unit_price: "" })
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
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {formatMNumber(total)}
              </span>
            </div>

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
