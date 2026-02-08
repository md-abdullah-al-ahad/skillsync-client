import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getRoleRedirectPath } from "@/lib/server-auth";

export default async function AdminLayout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
}) {
  const redirectPath = await getRoleRedirectPath("ADMIN");
  if (redirectPath) {
    redirect(redirectPath);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 px-4 backdrop-blur">
              <div className="flex h-16 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin-dashboard">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Admin</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto">
              {admin || children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
