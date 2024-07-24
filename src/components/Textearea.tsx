import { ComponentProps } from "react";

interface TextareaProps extends ComponentProps<"textarea"> {}

export function Textarea({ ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      className="w-full flex-1 h-24 resize-none rounded-lg border border-colorLightGray p-4 focus:outline outline-colorDarkBlue"
    ></textarea>
  );
}
