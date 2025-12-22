"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { APP_CONFIG } from "../app"
import { getAllDataInCookies } from "@/utils/get-data-in-cookies"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Sufficius",
      plan: "Sufficius System",
      image: "/avatars/sufficius.png",
    },
  ],
}

// Simulação do papel do usuário (substitua pelo papel dinâmico do sistema)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userRole = getAllDataInCookies().userRole;
  return (
    <Sidebar collapsible="icon" {...props} className="max-w-[220px] bg-red-700 border-r-[#D4AF37]">
      <SidebarHeader className="bg-[#D4AF37] text-white">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-[#D4AF37] text-white " >
        <NavMain items={APP_CONFIG.ROUTES.MENU} userRole={userRole} />
      </SidebarContent>
      <SidebarFooter className="bg-[#D4AF37] text-white">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}