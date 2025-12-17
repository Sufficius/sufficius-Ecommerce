import { ExpandableAppSidebar } from "@/app/layout/sidebarConfig/expandable-app-sidebar";
import { NavMain } from "@/app/layout/sidebarConfig/nav-main";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export const DashLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster position="top-right" richColors />
      <div className="hidden lg:block w-64">
        <ExpandableAppSidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between p-3 z-50">
          <NavMain items={[]} userRole="" />
          <button
            className="lg:hidden cursor-pointer text-black"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>

        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>

        <div
          className={`fixed inset-0 z-40 bg-[#00000091] bg-opacity-50 transition-opacity lg:hidden ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className={`relative h-full w-64 text-white transform transition-transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExpandableAppSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};
