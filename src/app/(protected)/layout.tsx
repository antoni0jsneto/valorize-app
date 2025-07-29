import { AppSidebar } from "@/components/app-sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen pt-20 md:pt-2 gap-2">
      <AppSidebar />
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
