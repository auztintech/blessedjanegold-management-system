"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { Eye, EyeOff, Check, KeyRound, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Input,
  Label,
  Button,
} from "@/components/ui";
import { changePasswordSchema } from "@/lib/validations/change-password";
import { useChangePassword } from "@/hooks/use-change-password";
import { PleaseWaitState } from "./loading-button";

interface ChangePasswordSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordSheet({
  open,
  onOpenChange,
}: ChangePasswordSheetProps) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const changePassword = useChangePassword();

  const { handleChange, handleSubmit, values, errors, touched, resetForm } =
    useFormik({
      initialValues: {
        old_password: "",
        new_password: "",
        confirm_password: "",
      },
      validationSchema: changePasswordSchema,
      onSubmit: async (values, { resetForm: reset }) => {
        await changePassword.mutateAsync({
          old_password: values.old_password,
          new_password: values.new_password,
        });
        reset();
        onOpenChange(false);
      },
    });

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <KeyRound className="h-5 w-5 text-orange-500" />
            Change Password
          </SheetTitle>
          <p className="text-sm text-gray-500">
            Update the password for your account.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-6">
          <div className="space-y-1.5">
            <Label htmlFor="old_password">Current Password</Label>
            <div className="relative">
              <Input
                id="old_password"
                name="old_password"
                type={showOld ? "text" : "password"}
                value={values.old_password}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOld((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                tabIndex={-1}>
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.old_password && errors.old_password && (
              <p className="text-xs text-red-500">{errors.old_password}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Input
                id="new_password"
                name="new_password"
                type={showNew ? "text" : "password"}
                value={values.new_password}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                tabIndex={-1}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.new_password && errors.new_password && (
              <p className="text-xs text-red-500">{errors.new_password}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                value={values.confirm_password}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                tabIndex={-1}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.confirm_password && errors.confirm_password && (
              <p className="text-xs text-red-500">{errors.confirm_password}</p>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Note: this won&apos;t sign you out of other devices — only affects
            future logins.
          </p>

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
                disabled={changePassword.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white h-10">
                {changePassword.isPending ? (
                  <PleaseWaitState variant="ghost" />
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Update Password
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
