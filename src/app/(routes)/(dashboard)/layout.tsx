import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_common/app-sidebar";
import { Header } from "./_common/header";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => (
  <div>
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full flex-1">
        <Header />

        <div className="mx-auto w-full max-w-6xl px-4 lg:px-0">{children}</div>
      </main>
    </SidebarProvider>
  </div>
);

export default DashboardLayout;
