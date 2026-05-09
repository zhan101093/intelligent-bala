import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "hit" | "new";
  className?: string;
}

export function Badge({ children, variant = "primary", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
        variant === "primary" && "bg-primary-light text-primary",
        variant === "hit" && "bg-primary text-white",
        variant === "new" && "bg-green-100 text-green-700",
        className
      )}
    >
      {children}
    </span>
  );
}
