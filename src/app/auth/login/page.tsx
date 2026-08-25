import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In | Inventory Management System",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Image side — hidden below 992px (lg breakpoint = 1024px, close enough, or use custom below) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/login-hero2.jpg"
          alt="Warehouse and shop management"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}
