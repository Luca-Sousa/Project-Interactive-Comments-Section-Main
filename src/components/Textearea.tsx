import { useRef, useEffect, ComponentProps } from "react";

interface TextareaProps extends ComponentProps<"textarea"> {}

export function Textarea({ ...rest }: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight(); // Ajusta a altura quando o componente é montado
  }, []);

  return (
    <textarea
      {...rest}
      ref={textareaRef}
      className="w-full flex-1 resize-none rounded-lg border border-colorLightGray p-4 overflow-hidden focus:outline outline-colorDarkBlue"
      onInput={adjustHeight}
    ></textarea>
  );
}
