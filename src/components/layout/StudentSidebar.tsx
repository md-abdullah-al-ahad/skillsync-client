"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftIcon } from "lucide-react";
import { studentRoutes } from "@/routes/studentRoutes";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function StudentSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div className="flex items-center justify-between px-2 py-1.5">
          <Link
            href="/dashboard"
            className="text-xs font-semibold uppercase tracking-[0.28em] text-sidebar-foreground/80"
          >
            SkillSync
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-sidebar-border/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/70 transition hover:text-sidebar-foreground",
              state === "collapsed" && "px-2.5",
            )}
            aria-label="Toggle sidebar"
          >
            <PanelLeftIcon className="h-3.5 w-3.5" />
            <span className={cn(state === "collapsed" && "hidden")}>
              {state === "expanded" ? "Collapse" : "Expand"}
            </span>
          </button>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {studentRoutes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon as any;
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
