"use client";

import { useState } from "react";
import { UserPlus, Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { UserFormSheet } from "@/components/users/user-form-sheet";
import { getUserColumns } from "@/components/users/user-columns";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { User } from "@/store/z-store/user";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data, isLoading } = useUsers(page);
  const deleteUser = useDeleteUser();

  const columns = getUserColumns({
    onEdit: (user) => {
      setEditingUser(user);
      setSheetOpen(true);
    },
    onDelete: (id) => deleteUser.mutate(id),
  });

  const handleAddNew = () => {
    setEditingUser(null);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">
            Manage staff accounts and role assignments
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white h-10">
          <UserPlus size={16} className="mr-2" />
          Add User
        </Button>
      </div>

      <BorderedLayout>
        <div className="p-4">
          <div className="relative max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <CustomDataTable
            data={data?.results ?? []}
            columns={columns}
            isFetching={isLoading}
            globalFilter={search}
            getRowId={(row: User) => String(row.id)}
          />
        </div>
      </BorderedLayout>

      {data && data.count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-5">
          <span className="text-xs">{data.count} total users</span>
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

      <UserFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={editingUser}
      />
    </div>
  );
}
