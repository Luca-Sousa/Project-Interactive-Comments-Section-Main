import { ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className="w-28 py-3 text-colorWhite bg-colorModerateBlue rounded-xl hover:bg-colorLightGrayishBlue"
    >
      {children}
    </button>
  );
}
