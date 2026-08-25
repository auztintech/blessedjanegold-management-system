import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("size-5 rounded-full animate-spin", {
  variants: {
    variant: {
      primary: "border-primary-600 border-t-transparent",
      secondary: "border-secondary-600 border-t-transparent",
      accent: "border-accent-600 border-t-transparent",
      ghost: "border-white-100 border-t-transparent",
      dark: "border-black border-t-transparent",
    },
    size: {
      sm: "size-4 border",
      md: "size-5 border-2",
      lg: "size-6 border-4",
      xl: "size-7 border-6",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type SpinnerProps = VariantProps<typeof spinnerVariants> & {
  className?: string;
};

export const Spinner = ({ className, size, variant }: SpinnerProps) => {
  return <div className={cn(spinnerVariants({ size, variant }), className)} />;
};
