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
  Button,
  Switch,
} from "@/components/ui";
import { locationSchema } from "@/lib/validations/location";
import { Pencil, ShoppingBag, InfoIcon, X, Plus, Check  } from "lucide-react";
import { useCreateShop, useUpdateShop } from "@/hooks/use-shops";
import { Shop } from "@/types/location";
import { PleaseWaitState } from "@/components/shared/loading-button";

interface ShopFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop?: Shop | null;
}

export function ShopFormSheet({
  open,
  onOpenChange,
  shop,
}: ShopFormSheetProps) {
  const isEditMode = !!shop;
  const createShop = useCreateShop();
  const updateShop = useUpdateShop();

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
      name: shop?.name ?? "",
      location: shop?.location ?? "",
      is_active: shop?.is_active ?? true,
    },
    enableReinitialize: true,
    validationSchema: locationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode && shop) {
        await updateShop.mutateAsync({ id: shop.id, payload: values });
      } else {
        await createShop.mutateAsync(values);
      }
      resetForm();
      onOpenChange(false);
    },
  });

  const isPending = createShop.isPending || updateShop.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {isEditMode ? (
              <>
                <Pencil className="h-5 w-5 text-orange-500" />
                Edit Shop
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                Create New Shop
              </>
            )}
          </SheetTitle>

          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update this shop's details."
              : "Add a new shop to the system."}
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="name">Shop Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter shop name"
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

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter address / location"
              value={values.location}
              onChange={handleChange}
            />
            {touched.location && errors.location && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.location}
              </p>
            )}
          </div>

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
                    Create Shop
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
