"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@/components/ui";
import { StatusBadge } from "@/components/shared/status-badge";
import { Product } from "@/types/inventory";

interface GetProductColumnsProps {
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function getProductColumns({
  onEdit,
  onDelete,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
GetProductColumnsProps): ColumnDef<Product, any>[] {
  return [
    {
      accessorKey: "name",
      header: "Product Name",
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "category_name",
      header: "Category",
    },
    {
      accessorKey: "unit_price",
      header: "Unit Price",
      cell: ({ row }) => {
        const price = Number(row.original.unit_price);

        return new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(price);
      },
    },
    {
      accessorKey: "low_stock_threshold",
      header: "Low Stock",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_active ? "active" : "inactive"} />
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created On",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <ProductActions
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      },
    },
  ];
}

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

function ProductActions({ product, onEdit, onDelete }: ProductActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(product.id);
    setDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span className="h-8 w-8 flex items-center justify-center cursor-pointer rounded-md hover:bg-gray-100">
            <MoreHorizontal size={16} />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(product)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDialogOpen(true)}
            className="text-red-500 focus:text-red-500">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {product.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
