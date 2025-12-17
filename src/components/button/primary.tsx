import { Button, ButtonProps } from "primereact/button";
import { twMerge } from "tailwind-merge";

interface IPrimary extends ButtonProps {}

export default function Primary({ className, ...rest }: IPrimary) {
  return <Button className={twMerge("bg-[#D4AF37] text-white py-2 px-4", className)} {...rest} />;
}
