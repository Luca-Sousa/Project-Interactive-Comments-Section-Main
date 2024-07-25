import { ComponentProps, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  variants: {
    variant: {
      primary:
        "uppercase font-semibold text-colorWhite bg-colorModerateBlue hover:bg-colorLightGrayishBlue",
      secondary:
        "font-bold text-colorModerateBlue hover:text-colorModerateBlue/60 hover:scale-105",
      tertiary:
        "font-bold text-colorSoftRed hover:text-colorSoftRed/60 hover:scale-105",
    },

    size: {
      default: "w-24 py-3 rounded-xl",
      auto: "w-auto flex items-center gap-2",
      cancel: "w-auto",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({ children, variant, size, ...props }: ButtonProps) {
  return (
    <button {...props} className={buttonVariants({ variant, size })}>
      {children}
    </button>
  );
}
