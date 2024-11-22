
import { AppSidebar } from "@/components/app-sidebar";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <div className="p-6">
          {children}
        </div>
     
      </main>
    </SidebarProvider>
  )
}