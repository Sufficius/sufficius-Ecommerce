import { ChevronRight, type LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavMainProps {
  items: {
    label: string;
    icon?: LucideIcon;
    path: string;
    access: string[];
    subItems?: { label: string; path: string; access: string[] }[];
  }[];
  userRole: string;
}

export function NavMain({ items, userRole }: NavMainProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter((item) => item.access.includes(userRole))
          .map((item) => {
            const isActive = pathname.startsWith(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <SidebarMenuItem key={item.label}>
                {hasSubItems ? (
                  <Collapsible asChild defaultOpen={isActive}>
                    <div>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full justify-between hover:bg-accent",
                            isActive && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && (
                              <item.icon className="h-4 w-4" />
                            )}
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems
                            .filter((subItem) => subItem.access.includes(userRole))
                            .map((subItem) => {
                              const isSubActive = pathname === subItem.path;
                              return (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={cn(
                                      "pl-8 hover:bg-accent",
                                      isSubActive && "bg-accent text-accent-foreground"
                                    )}
                                  >
                                    <Link to={subItem.path}>
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "w-full justify-start hover:bg-accent",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Link to={item.path}>
                      {item.icon && (
                        <item.icon className="h-4 w-4 mr-2" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  );
}