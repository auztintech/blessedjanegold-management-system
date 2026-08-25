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

import { User } from "@/store/z-store/user";
import { RoleBadge } from "@/components/shared/role-badge";
import { StatusBadge } from "@/components/shared/status-badge";

interface GetUserColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export function getUserColumns({
  onEdit,
  onDelete,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: GetUserColumnsProps): ColumnDef<User, any>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) =>
        [row.original.first_name, row.original.last_name]
          .filter(Boolean)
          .join(" ") || "—",
    },

    {
      accessorKey: "username",
      header: "Username",
    },

    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },

    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_active ? "active" : "inactive"} />
      ),
    },

    {
      id: "actions",
      header: "Actions",
      enableHiding: false,

      cell: ({ row }) => {
        const user = row.original;

        return <UserActions user={user} onEdit={onEdit} onDelete={onDelete} />;
      },
    },
  ];
}

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

function UserActions({ user, onEdit, onDelete }: UserActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(user.id);
    setDialogOpen(false);
  };

  return (
    <>
      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span className="h-8 w-8 flex items-center justify-center cursor-pointer rounded-md hover:bg-gray-100">
            <MoreHorizontal size={16} />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(user)}>
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

      {/* Delete confirmation dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User?</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {user.first_name} {user.last_name}
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
