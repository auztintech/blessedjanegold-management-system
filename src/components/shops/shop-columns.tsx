"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
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
import { Shop } from "@/types/location";

interface GetShopColumnsProps {
  onEdit: (shop: Shop) => void;
  onDelete: (id: number) => void;
  onManageAssignments: (shop: Shop) => void;
}

export function getShopColumns({
  onEdit,
  onDelete,
  onManageAssignments,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: GetShopColumnsProps): ColumnDef<Shop, any>[] {
  return [
    { accessorKey: "name", header: "Shop Name" },
    { accessorKey: "location", header: "Location" },
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
        const shop = row.original;
        return (
          <ShopActions
            shop={shop}
            onEdit={onEdit}
            onDelete={onDelete}
            onManageAssignments={onManageAssignments}
          />
        );
      },
    },
  ];
}

interface ShopActionsProps {
  shop: Shop;
  onEdit: (shop: Shop) => void;
  onDelete: (id: number) => void;
  onManageAssignments: (shop: Shop) => void;
}

function ShopActions({
  shop,
  onEdit,
  onDelete,
  onManageAssignments,
}: ShopActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(shop.id);
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

        <DropdownMenuContent align="end" className="w-auto whitespace-nowrap">
          <DropdownMenuItem onClick={() => onManageAssignments(shop)}>
            <Users className="w-4 h-4 mr-2" />
            Manage Assignments
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onEdit(shop)}>
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
            <DialogTitle>Delete Shop?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{shop.name}</span>?
              This action cannot be undone.
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
