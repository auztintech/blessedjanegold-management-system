"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { CategoryFormSheet } from "@/components/categories/category-form-sheet";
import { getCategoryColumns } from "@/components/categories/category-columns";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Category } from "@/types/inventory";


export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [sheetOpen, setSheetOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data, isLoading } = useCategories({
    page,
    search,
  });

  const deleteCategory = useDeleteCategory();

  const columns = getCategoryColumns({
    onEdit: (category) => {
      setEditingCategory(category);
      setSheetOpen(true);
    },

    onDelete: (id) => deleteCategory.mutate(id),
  });

  const handleAddNew = () => {
    setEditingCategory(null);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

          <p className="text-gray-500 text-sm">
            Manage your product categories
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white h-10">
          <Plus size={16} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <BorderedLayout>
        <div className="p-4">
          {/* Search */}
          <div className="relative max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          <CustomDataTable
            data={data?.results ?? []}
            columns={columns}
            isFetching={isLoading}
            getRowId={(row: Category) => String(row.id)}
          />
        </div>
      </BorderedLayout>

      {/* Pagination */}
      {data && data.count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{data.count} total categories</span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.previous}
              onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Form */}
      <CategoryFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={editingCategory}
      />
    </div>
  );
}
