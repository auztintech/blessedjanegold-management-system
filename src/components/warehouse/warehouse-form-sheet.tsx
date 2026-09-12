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
import { Pencil, HomeIcon, InfoIcon, X, Plus, Check } from "lucide-react";
import { useCreateWarehouse, useUpdateWarehouse } from "@/hooks/use-warehouses";
import { Warehouse } from "@/types/location";
import { PleaseWaitState } from "@/components/shared/loading-button";

interface WarehouseFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse?: Warehouse | null;
}

export function WarehouseFormSheet({
  open,
  onOpenChange,
  warehouse,
}: WarehouseFormSheetProps) {
  const isEditMode = !!warehouse;
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();

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
      name: warehouse?.name ?? "",
      location: warehouse?.location ?? "",
      is_active: warehouse?.is_active ?? true,
    },
    enableReinitialize: true,
    validationSchema: locationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode && warehouse) {
        await updateWarehouse.mutateAsync({
          id: warehouse.id,
          payload: values,
        });
      } else {
        await createWarehouse.mutateAsync(values);
      }
      resetForm();
      onOpenChange(false);
    },
  });

  const isPending = createWarehouse.isPending || updateWarehouse.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {isEditMode ? (
              <>
                <Pencil className="h-5 w-5 text-orange-500" />
                Edit Warehouse
              </>
            ) : (
              <>
                <HomeIcon className="h-5 w-5 text-orange-500" />
                Create New Warehouse
              </>
            )}
          </SheetTitle>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update this warehouse's details."
              : "Add a new warehouse to the system."}
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="name">Warehouse Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter warehouse name"
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
                    Create Warehouse
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
