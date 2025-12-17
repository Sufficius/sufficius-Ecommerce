import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { APP_CONFIG } from "./app";

type IItem = {
  item: (typeof APP_CONFIG.ROUTES.MENU)[number];
  activeSegment: string;
  onClick?: () => void;
};

export default function Item({ item, activeSegment , onClick}: IItem) {
  const thisPath = item.path.split("/akin/")[1];
  const isActive = thisPath === activeSegment;
  const isLogout = item.path === "/logout";

  return (
    <li role="menuitem" onClick={onClick}>
      <Link
        to={item.path}
        aria-current={isActive ? "page" : undefined}
        aria-label={item.label}
        data-isActive={isActive}
        data-isLogout={isLogout}
        className={cn(
          "flex items-center w-[175px] gap-x-2 font-bold rounded-lg p-2 transition ease-out group",
          {
            "bg-akin-yellow-light/20 text-sky-400": isActive,
            "hover:bg-akin-yellow-light/20": !isLogout && !isActive,
            "hover:text-[#ff5e5e] hover:bg-[#ffeeed]/70": isLogout,
          }
        )}
      >
        <item.icon
          size={25}
          data-isLogout={isLogout}
          className={cn(
            "p-1 rounded-lg transition ease-in-out ",
            {
              "bg-sky-400 text-akin-white-smoke": isActive,
              "group-hover:bg-sky-400 group-hover:text-akin-white-smoke":
                !isLogout && !isActive,
              "bg-akin-yellow-light/40": !isActive && !isLogout,
            }
          )}
        />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}
