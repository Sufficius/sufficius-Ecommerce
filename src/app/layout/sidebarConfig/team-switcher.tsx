import * as React from "react"
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { getAllDataInCookies } from "@/utils/get-data-in-cookies";
import { useQuery } from "@tanstack/react-query";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo?: React.ElementType
    plan?: string
    image?: string
  }[]
}) {
  // const unit_health = getAllDataInCookies().userdata.health_unit_ref;
  const akinRole = getAllDataInCookies().userRole;
  const { data: allDataUsers } = useQuery({
      queryKey: ["all-users"],
      queryFn: async () => {
        // return await _axios.get(`/auth/me`);
      },
    });
  
  const [activeTeam, ] = React.useState(teams[0])
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild> */}
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-gradient-to-r from-akin-turquoise to-black border  text-sidebar-primary-foreground">
              {activeTeam.logo && <activeTeam.logo className="size-4" />}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{allDataUsers ?? "Mister AL"}</span>
              <span className="truncate text-xs">{akinRole ?? "Admin"}</span>
            </div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

