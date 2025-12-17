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

interface SubItem {
  label: string;
  path: string;
  access: string[];
}

interface NavItem {
  label: string;
  icon?: LucideIcon;
  path: string;
  access: string[];
  subItems?: SubItem[];
}

interface NavMainProps {
  items: NavItem[];
  userRole: string;
}

export function NavMain({ items, userRole }: NavMainProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const filteredItems = items.filter((item) => item.access.includes(userRole));

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const filteredSubItems = item.subItems?.filter((subItem) => 
            subItem.access.includes(userRole)
          ) || [];

          return (
            <Collapsible
              key={item.label}
              asChild
              defaultOpen={isActive && hasSubItems}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild disabled={!hasSubItems}>
                  <SidebarMenuButton 
                    tooltip={item.label}
                    className={cn(
                      "w-full justify-between transition-colors",
                      isActive && !hasSubItems && "bg-sidebar-accent text-sidebar-accent-foreground",
                      hasSubItems && "cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {item.icon && (
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </div>
                    
                    {hasSubItems && (
                      <ChevronRight 
                        className="ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" 
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                
                {hasSubItems && filteredSubItems.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredSubItems.map((subItem) => {
                        const isSubActive = pathname.startsWith(subItem.path);
                        return (
                          <SidebarMenuSubItem key={subItem.label}>
                            <SidebarMenuSubButton 
                              asChild
                              className={cn(
                                "w-full justify-start pl-8",
                                isSubActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                            >
                              <Link to={subItem.path}>
                                <span className="truncate">{subItem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
                
                {!hasSubItems && (
                  <Link 
                    to={item.path} 
                    className="absolute inset-0"
                    aria-label={item.label}
                  />
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}