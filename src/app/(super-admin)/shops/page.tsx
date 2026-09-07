"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useShops, useDeleteShop } from "@/hooks/use-shops";
import { ShopFormSheet } from "@/components/shops/shop-form-sheet";
import { ShopAssignmentsDialog } from "@/components/shops/shop-assignments-dialog";
import { getShopColumns } from "@/components/shops/shop-columns";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Shop } from "@/types/location";

export default function ShopsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [assignmentsShop, setAssignmentsShop] = useState<Shop | null>(null);

  const { data, isLoading } = useShops(page, search);
  const deleteShop = useDeleteShop();

  const columns = getShopColumns({
    onEdit: (shop) => {
      setEditingShop(shop);
      setSheetOpen(true);
    },
    onDelete: (id) => deleteShop.mutate(id),
    onManageAssignments: (shop) => setAssignmentsShop(shop),
  });

  const handleAddNew = () => {
    setEditingShop(null);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
          <p className="text-gray-500 text-sm">Manage all shop locations</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white h-10">
          <Plus size={16} className="mr-2" />
          Add Shop
        </Button>
      </div>

      <BorderedLayout>
        <div className="p-4">
          <div className="relative max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search shops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <CustomDataTable
            data={data?.results ?? []}
            columns={columns}
            isFetching={isLoading}
            getRowId={(row: Shop) => String(row.id)}
          />
        </div>
      </BorderedLayout>

      {data && data.count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{data.count} total shops</span>
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

      <ShopFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        shop={editingShop}
      />

      <ShopAssignmentsDialog
        open={!!assignmentsShop}
        onOpenChange={(open) => !open && setAssignmentsShop(null)}
        shop={assignmentsShop}
      />
    </div>
  );
}
