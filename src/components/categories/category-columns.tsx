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
import { Category } from "@/types/inventory";

interface GetCategoryColumnsProps {
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function getCategoryColumns({
  onEdit,
  onDelete,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
GetCategoryColumnsProps): ColumnDef<Category, any>[] {
  return [
    {
      accessorKey: "name",
      header: "Category Name",
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;

        return description || "—";
      },
    },

    {
      accessorKey: "product_count",
      header: "Products",
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
        const category = row.original;

        return (
          <CategoryActions
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      },
    },
  ];
}

interface CategoryActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

function CategoryActions({ category, onEdit, onDelete }: CategoryActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(category.id);
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
          <DropdownMenuItem onClick={() => onEdit(category)}>
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
            <DialogTitle>Delete Category?</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {category.name}
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
