import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 border-[1.5px] border-border rounded-xl text-sm bg-white text-text-base placeholder:text-text-light outline-none transition-colors focus:border-primary",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
