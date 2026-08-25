"use client";

import { useFormik } from "formik";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Input,
  Textarea,
  Label,
  Button,
} from "@/components/ui";

import { categorySchema } from "@/lib/validations/category";

import { Pencil, Folder, InfoIcon, X, Plus, Check } from "lucide-react";

import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";

import { Category } from "@/types/inventory";

import { PleaseWaitState } from "@/components/shared/loading-button";

interface CategoryFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryFormSheet({
  open,
  onOpenChange,
  category,
}: CategoryFormSheetProps) {
  const isEditMode = !!category;

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const { handleChange, handleSubmit, values, errors, touched, resetForm } =
    useFormik({
      initialValues: {
        name: category?.name ?? "",
        description: category?.description ?? "",
      },

      enableReinitialize: true,

      validationSchema: categorySchema,

      onSubmit: async (values, { resetForm }) => {
        if (isEditMode && category) {
          await updateCategory.mutateAsync({
            id: category.id,
            payload: values,
          });
        } else {
          await createCategory.mutateAsync(values);
        }

        resetForm();
        onOpenChange(false);
      },
    });

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {isEditMode ? (
              <>
                <Pencil className="h-5 w-5 text-orange-500" />
                Edit Category
              </>
            ) : (
              <>
                <Folder className="h-5 w-5 text-orange-500" />
                Create New Category
              </>
            )}
          </SheetTitle>

          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update this category's details."
              : "Add a new category to your catalog."}
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Category Name</Label>

            <Input
              id="name"
              name="name"
              placeholder="Enter category name"
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
                    Create Category
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
