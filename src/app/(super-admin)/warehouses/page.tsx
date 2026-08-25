"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useWarehouses, useDeleteWarehouse } from "@/hooks/use-warehouses";
import { WarehouseFormSheet } from "@/components/warehouses/warehouse-form-sheet";
import { getWarehouseColumns } from "@/components/warehouses/warehouse-columns";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Warehouse } from "@/types/location";

export default function WarehousesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );

  const { data, isLoading } = useWarehouses(page, search);
  const deleteWarehouse = useDeleteWarehouse();

  const columns = getWarehouseColumns({
    onEdit: (warehouse) => {
      setEditingWarehouse(warehouse);
      setSheetOpen(true);
    },
    onDelete: (id) => deleteWarehouse.mutate(id),
  });

  const handleAddNew = () => {
    setEditingWarehouse(null);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
          <p className="text-gray-500 text-sm">
            Manage all warehouse locations
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white h-10">
          <Plus size={16} className="mr-2" />
          Add Warehouse
        </Button>
      </div>

      <BorderedLayout>
        <div className="p-4">
          <div className="relative max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search warehouses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <CustomDataTable
            data={data?.results ?? []}
            columns={columns}
            isFetching={isLoading}
            getRowId={(row: Warehouse) => String(row.id)}
          />
        </div>
      </BorderedLayout>

      {data && data.count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{data.count} total warehouses</span>
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

      <WarehouseFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        warehouse={editingWarehouse}
      />
    </div>
  );
}
