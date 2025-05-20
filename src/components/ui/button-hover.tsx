import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white text-black",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonHoverProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ButtonHover = React.forwardRef<HTMLButtonElement, ButtonHoverProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "group relative overflow-hidden transition-colors duration-300 ease-in-out",
          buttonVariants({ variant, size }),
          className
        )}
        {...props}
      >
        <span className="relative z-20 w-full text-black transition-colors duration-300 ease-in-out group-hover:text-white">
          {props.children}
        </span>

        <span
          aria-hidden="true"
          className="absolute inset-0 -left-1/4 w-[150%] z-10
            before:absolute before:inset-0
            before:bg-[#F1B48B]
            before:skew-x-[-20deg]
            before:origin-left
            before:transition-transform
            before:duration-500
            before:ease-out
            before:scale-x-0
            group-hover:before:scale-x-100"
        />
      </Comp>
    );
  }
);

ButtonHover.displayName = "ButtonHover";

export { ButtonHover, buttonVariants };
