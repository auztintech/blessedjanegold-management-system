"use client";

import { useFormik } from "formik";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Input,
  Label,
  Textarea,
  Button,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import { productSchema } from "@/lib/validations/product";
import { Pencil, Package, InfoIcon, X, Plus, Check } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Product } from "@/types/inventory";
import { PleaseWaitState } from "@/components/shared/loading-button";

interface ProductFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormSheet({
  open,
  onOpenChange,
  product,
}: ProductFormSheetProps) {
  const isEditMode = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 1,
  });

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      category: product?.category ?? 0,
      description: product?.description ?? "",
      unit_price: product?.unit_price ?? "",
      low_stock_threshold: product?.low_stock_threshold ?? 0,
      is_active: product?.is_active ?? true,
    },

    enableReinitialize: true,

    validationSchema: productSchema,

    onSubmit: async (values, { resetForm }) => {
      if (isEditMode && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          payload: values,
        });
      } else {
        await createProduct.mutateAsync(values);
      }

      resetForm();
      onOpenChange(false);
    },
  });

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-md">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {isEditMode ? (
              <>
                <Pencil className="h-5 w-5 text-orange-500" />
                Edit Product
              </>
            ) : (
              <>
                <Package className="h-5 w-5 text-orange-500" />
                Create New Product
              </>
            )}
          </SheetTitle>

          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update this product's details."
              : "Add a new product to the catalog."}
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name</Label>

            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              value={values.name}
              onChange={handleChange}
            />

            {touched.name && errors.name && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* SKU */}
          <div className="space-y-1.5">
            <Label htmlFor="sku">SKU</Label>

            <Input
              id="sku"
              name="sku"
              placeholder="Enter product SKU"
              value={values.sku}
              onChange={handleChange}
            />

            {touched.sku && errors.sku && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.sku}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>

            <Select
              value={values.category ? String(values.category) : ""}
              onValueChange={(value) =>
                setFieldValue("category", Number(value))
              }
              disabled={categoriesLoading}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue>
                  {categoriesLoading
                    ? "Loading categories..."
                    : values.category
                    ? categoriesData?.results?.find(
                        (category) => category.id === Number(values.category)
                      )?.name
                    : "Select a category"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {categoriesData?.results?.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {touched.category && errors.category && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              name="description"
              placeholder="Enter category description"
              value={values.description}
              onChange={handleChange}
            />

            {touched.description && errors.description && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Unit Price */}
          <div className="space-y-1.5">
            <Label htmlFor="unit_price">Unit Price</Label>

            <Input
              id="unit_price"
              name="unit_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter unit price"
              value={values.unit_price}
              onChange={handleChange}
            />

            {touched.unit_price && errors.unit_price && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.unit_price}
              </p>
            )}
          </div>

          {/* Low Stock Threshold */}
          <div className="space-y-1.5">
            <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>

            <Input
              id="low_stock_threshold"
              name="low_stock_threshold"
              type="number"
              min="0"
              placeholder="Enter low stock threshold"
              value={values.low_stock_threshold}
              onChange={handleChange}
            />

            {touched.low_stock_threshold && errors.low_stock_threshold && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.low_stock_threshold}
              </p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="is_active">Active</Label>

            <Switch
              id="is_active"
              checked={values.is_active}
              onCheckedChange={(val) => setFieldValue("is_active", val)}
              className="
                bg-gray-300!
                data-checked:bg-emerald-500!
                data-unchecked:bg-gray-300!
              "
            />
          </div>

          <SheetFooter>
            <div className="flex justify-end gap-4 mt-2 sticky bottom-0 bg-white py-2">
              <Button
                size="sm"
                variant="outline"
                className="h-10"
                type="button"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white h-10">
                {isPending ? (
                  <PleaseWaitState variant="ghost" />
                ) : isEditMode ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
