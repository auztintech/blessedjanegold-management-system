"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { ProductFormSheet } from "@/components/products/product-form-sheet";
import { getProductColumns } from "@/components/products/product-columns";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Product } from "@/types/inventory";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useProducts({
    is_active: true,
  });

  const deleteProduct = useDeleteProduct();

  const columns = getProductColumns({
    onEdit: (product) => {
      setEditingProduct(product);
      setSheetOpen(true);
    },
    onDelete: (id) => deleteProduct.mutate(id),
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    setSheetOpen(true);
  };

  const filteredProducts =
    products?.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">Manage your product catalog</p>
        </div>

        <Button
          onClick={handleAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white h-10">
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </div>

      <BorderedLayout>
        <div className="p-4">
          <div className="relative max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <CustomDataTable
            data={filteredProducts}
            columns={columns}
            isFetching={isLoading}
            getRowId={(row: Product) => String(row.id)}
          />
        </div>
      </BorderedLayout>

      <ProductFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editingProduct}
      />
    </div>
  );
}
