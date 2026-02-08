"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PanelLeftIcon } from "lucide-react";
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
import { tutorRoutes } from "@/routes/tutorRoutes";
import { cn } from "@/lib/utils";

export default function TutorSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div className="flex items-center justify-between px-2 py-1.5">
          <Link
            href="/tutor-dashboard"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-sidebar-foreground/80"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-sidebar-border/60 bg-sidebar/80 p-1 overflow-hidden">
              <Image
                src="/skillsync-logo.png"
                alt="SkillSync"
                width={24}
                height={24}
                className="h-5 w-5 object-contain rounded-full"
              />
            </span>
            <span className={cn(state === "collapsed" && "hidden")}>
              SkillSync
            </span>
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
        {tutorRoutes.map((route) => (
          <SidebarGroup key={route.title}>
            <SidebarGroupLabel>{route.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {route.items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          {item.icon && <item.icon className="h-4 w-4" />}
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
