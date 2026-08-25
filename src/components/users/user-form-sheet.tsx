"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Input,
  Label,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  Eye,
  EyeOff,
  InfoIcon,
  Pencil,
  UserPlus,
  X,
  Plus,
  Check,
} from "lucide-react";
import { createUserSchema } from "@/lib/validations/user";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { useShopsList, useWarehousesList } from "@/hooks/use-locations";
import { useAssignShop, useAssignWarehouse } from "@/hooks/use-assignments";
import { Role, User } from "@/store/z-store/user";
import { PleaseWaitState } from "@/components/shared/loading-button";

interface UserFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  SALES_PERSON: "Sales Person",
  WAREHOUSE_KEEPER: "Warehouse Keeper",
};

export function UserFormSheet({
  open,
  onOpenChange,
  user,
}: UserFormSheetProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const assignShop = useAssignShop();
  const assignWarehouse = useAssignWarehouse();
  const { data: shops } = useShopsList();
  const { data: warehouses } = useWarehousesList();

  const initialValues = {
    username: user?.username ?? "",
    email: user?.email ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    phone_number: user?.phone_number ?? "",
    password: "",
    role: (user?.role ?? "") as Role | "",
    shop_id: "",
    warehouse_id: "",
  };

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createUserSchema(isEditMode),
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode && user) {
        await updateUser.mutateAsync({
          id: user.id,
          payload: {
            username: values.username,
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
            role: values.role as Role,
          },
        });
      } else {
        const newUser = await createUser.mutateAsync({
          username: values.username,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          password: values.password,
          role: values.role as Role,
        });

        if (values.role === "SALES_PERSON" && values.shop_id) {
          await assignShop.mutateAsync({
            user: newUser.id,
            shop: Number(values.shop_id),
          });
        }
        if (values.role === "WAREHOUSE_KEEPER" && values.warehouse_id) {
          await assignWarehouse.mutateAsync({
            user: newUser.id,
            warehouse: Number(values.warehouse_id),
          });
        }
      }

      resetForm();
      onOpenChange(false);
    },
  });

  const isPending =
    createUser.isPending ||
    updateUser.isPending ||
    assignShop.isPending ||
    assignWarehouse.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-md">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {isEditMode ? (
              <>
                <Pencil className="h-5 w-5 text-orange-500" />
                Edit User
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-orange-500" />
                Create New User
              </>
            )}
          </SheetTitle>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update this user's profile details and role."
              : "Add a new staff member and assign their role."}
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="Enter First Name"
              value={values.first_name}
              onChange={handleChange}
            />
            {touched.first_name && errors.first_name && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.first_name}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Enter Last Name"
              value={values.last_name}
              onChange={handleChange}
            />
            {touched.last_name && errors.last_name && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.last_name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter Username"
              value={values.username}
              onChange={handleChange}
            />
            {touched.username && errors.username && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
              value={values.email}
              onChange={handleChange}
            />
            {touched.email && errors.email && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              placeholder="Enter Phone Number"
              value={values.phone_number}
              onChange={handleChange}
            />
            {touched.phone_number && errors.phone_number && (
              <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                <InfoIcon className="h-3 w-3" />
                {errors.phone_number}
              </p>
            )}
          </div>
          {!isEditMode && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {touched.password && errors.password && (
                <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
                  <InfoIcon className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Role</Label>

            <Select
              value={values.role}
              onValueChange={(val) => setFieldValue("role", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role">
                  {values.role ? roleLabels[values.role] : "Select a role"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="SALES_PERSON">Sales Person</SelectItem>
                <SelectItem value="WAREHOUSE_KEEPER">
                  Warehouse Keeper
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isEditMode && values.role === "SALES_PERSON" && (
            <div className="space-y-1.5">
              <Label>Assign Shop</Label>
              <Select
                value={values.shop_id}
                onValueChange={(val) => setFieldValue("shop_id", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a shop">
                    {shops?.find((s) => String(s.id) === values.shop_id)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {shops?.map((shop) => (
                    <SelectItem key={shop.id} value={String(shop.id)}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isEditMode && values.role === "WAREHOUSE_KEEPER" && (
            <div className="space-y-1.5">
              <Label>Assign Warehouse</Label>
              <Select
                value={values.warehouse_id}
                onValueChange={(val) => setFieldValue("warehouse_id", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a warehouse">
                    {
                      warehouses?.find(
                        (w) => String(w.id) === values.warehouse_id
                      )?.name
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {warehouses?.map((wh) => (
                    <SelectItem key={wh.id} value={String(wh.id)}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <SheetFooter>
            <div className="flex justify-end gap-4 mt-2 sticky bottom-0 bg-white py-2">
              <Button
                size="sm"
                variant="outline"
                className="h-10"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white h-10">
                {isPending ? (
                  <PleaseWaitState variant="ghost" />
                ) : isEditMode ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
