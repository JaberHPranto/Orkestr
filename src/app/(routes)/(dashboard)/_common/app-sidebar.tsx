"use client";
import { Settings, Workflow } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface NavItem {
  icon: IconSvgElement;
  title: string;
  url: string;
}

const navItems: NavItem[] = [
  { title: "Workflow", url: "/workflow", icon: Workflow },
  { title: "Settings", url: "/settings", icon: Settings },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="flex flex-row items-center justify-between px-4">
        <Logo />

        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="px-2 pt-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="data-[active=true]:bg-primary/10"
                isActive={pathname === item.url}
                onClick={() => router.push(item.url)}
              >
                <Icon icon={item.icon} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
