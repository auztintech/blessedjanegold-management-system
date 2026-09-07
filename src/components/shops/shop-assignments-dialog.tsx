"use client";

import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { UserPlus, Trash2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@/components/ui";
import { useShopAssignments, useAssignShop } from "@/hooks/use-assignments";
import { useUsersByRole } from "@/hooks/use-users";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { toast } from "sonner";
import { Shop } from "@/types/location";
import { ShopAssignment } from "@/hooks/use-assignments";

interface ShopAssignmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop: Shop | null;
}

function useRemoveShopAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(endpoints(id).user.shopAssignmentDetail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-assignments"] });
      toast.success("Assignment removed");
    },
    onError: () => toast.error("Failed to remove assignment"),
  });
}

export function ShopAssignmentsDialog({
  open,
  onOpenChange,
  shop,
}: ShopAssignmentsDialogProps) {
  const { data: assignmentsData, isLoading } = useShopAssignments();
  const { data: salesPersons } = useUsersByRole("SALES_PERSON");
  const assignShop = useAssignShop();
  const removeAssignment = useRemoveShopAssignment();

  const [pendingRemoval, setPendingRemoval] = useState<ShopAssignment | null>(
    null
  );

  const shopAssignments = useMemo(
    () => assignmentsData?.results.filter((a) => a.shop === shop?.id) ?? [],
    [assignmentsData, shop]
  );

  const availableUsers = useMemo(() => {
    const assignedUserIds = new Set(shopAssignments.map((a) => a.user));
    return salesPersons?.filter((u) => !assignedUserIds.has(u.id)) ?? [];
  }, [salesPersons, shopAssignments]);

  const formik = useFormik({
    initialValues: { user_id: "" },
    onSubmit: async (values, { resetForm }) => {
      if (!shop || !values.user_id) return;
      await assignShop.mutateAsync({
        user: Number(values.user_id),
        shop: shop.id,
      });
      resetForm();
    },
  });

  const handleConfirmRemove = () => {
    if (pendingRemoval) {
      removeAssignment.mutate(pendingRemoval.id);
      setPendingRemoval(null);
    }
  };

  if (!shop) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              Manage Assignments — {shop.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Assigned Sales Persons
              </p>
              {isLoading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : shopAssignments.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No one assigned to this shop yet.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-md">
                  {shopAssignments.map((assignment) => (
                    <li
                      key={assignment.id}
                      className="flex items-center justify-between px-3 py-2 text-sm">
                      <span className="text-gray-700">
                        {assignment.user_username}
                      </span>
                      <button
                        onClick={() => setPendingRemoval(assignment)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="space-y-2 pt-2 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700">
                Assign a Sales Person
              </p>
              <div className="flex gap-2">
                <Select
                  value={formik.values.user_id}
                  onValueChange={(val) => formik.setFieldValue("user_id", val)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a sales person">
                      {
                        availableUsers.find(
                          (u) => String(u.id) === formik.values.user_id
                        )?.username
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        No available Sales Persons
                      </div>
                    ) : (
                      availableUsers.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.username}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  disabled={!formik.values.user_id || assignShop.isPending}
                  className="bg-orange-500 hover:bg-orange-600 h-10 text-white">
                  <UserPlus size={16} />
                  Add
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingRemoval}
        onOpenChange={(open) => !open && setPendingRemoval(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unassign{" "}
              <span className="font-semibold text-gray-900">
                {pendingRemoval?.user_username}
              </span>{" "}
              from{" "}
              <span className="font-semibold text-gray-900">{shop.name}</span>?
              They will lose access to this shop&apos;s sales and inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingRemoval(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRemove}
              className="bg-red-500 hover:bg-red-600 text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
