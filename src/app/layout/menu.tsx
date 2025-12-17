import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Item from "./item";
import { filterRoutesByAccess } from "@/config/filteredAcessRoutes";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function Menu() {
  const location = useLocation();
  const activeSegment = location.pathname.split('/').pop() || '';
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const role = "ADMIN";
  const routes = role ? filterRoutesByAccess(role) : [];

  return (
    <>
      {/* Menu em tela pequena (com Sheet) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 bg-akin-turquoise text-akin-white-smoke">
          {/* Logo */}
          <img
            width={108}
            height={40}
            src=""
            alt="Akin logo"
            fetchPriority="high"
          />
          {/* Botão para abrir o Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger>
              <MenuIcon className="w-6 h-6 cursor-pointer" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-akin-turquoise text-akin-white-smoke"
            >
              <SheetHeader>
                <img
                  width={108}
                  height={40}
                  src=""
                  alt="Akin logo"
                />
              </SheetHeader>
              <nav className="transition-opacity duration-300 opacity-100">
                <ul className="space-y-2 mt-4" role="menu">
                  {routes.map((item, index) => (
                    <Item
                      item={item}
                      key={index}
                      activeSegment={activeSegment}
                      onClick={() => setIsSheetOpen(false)}
                    />
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Menu em telas maiores */}
      <aside
        className="hidden md:block bg-akin-turquoise p-4 text-akin-white-smoke w-full min-h-52 h-max md:w-52 md:h-screen fixed space-y-5 md:space-y-0"
        aria-label="Menu lateral de navegação"
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img width={108} height={40} src="" alt="Akin logo" />
        </div>

        {/* Navegação */}
        <nav className="transition-opacity duration-300 opacity-100">
          <ul
            className="space-y-1.5 mt-10 gap-2 flex flex-col items-start"
            role="menu"
          >
            {routes.map((item, index) => (
              <Item item={item} key={index} activeSegment={activeSegment} />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}