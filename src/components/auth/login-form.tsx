"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, InfoIcon } from "lucide-react";
import { Input, Label, Checkbox, Button } from "@/components/ui";
import { loginSchema } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/use-login";
import { useFormik } from "formik";
import { PleaseWaitState } from "@/components/shared/loading-button";
import Image from "next/image";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const initialValues = { username: "", password: "", remember: false };

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login.mutate({ username: values.username, password: values.password });
    },
  });

  return (
    <div className="w-full max-w-105 mx-auto">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Image
          src="/images/logo.PNG"
          alt="Blesssed Jane Gold"
          width={100}
          height={100}
          className="h-16.25 w-auto"
        />
      </div>

      <h1 className="text-2xl font-bold text-center text-orange-500! mb-2">
        Welcome Back
      </h1>
      <p className="text-sm mb-8 text-center font-medium">
        Please, sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="font-medium">
            Username
          </Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              type="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.username && errors.username && (
            <p className="text-xs flex gap-1 items-center font-medium text-red-600!">
              <InfoIcon className="h-3 w-3" />
              {errors.username}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              tabIndex={-1}>
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

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={values.remember}
              onCheckedChange={(checked) => setFieldValue("remember", checked)}
            />
            <Label
              htmlFor="remember"
              className="text-xs font-medium text-gray-600 cursor-pointer">
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs text-orange-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10">
          {login.isPending ? <PleaseWaitState variant="ghost" /> : "Sign In"}
        </Button>
      </form>
    </div>
  );
}