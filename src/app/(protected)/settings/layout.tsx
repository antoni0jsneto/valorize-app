"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Loading from "@/components/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen pt-20 md:pt-2 gap-2">
      <AppSidebar />
      <div className="flex-1 w-full">
        <Tabs value={activeTab} className="space-y-4 w-full">
          <TabsList className="w-full flex">
            <Link className="flex-1 w-full" href="/settings/accounts">
              <TabsTrigger className="w-full" value="/settings/accounts">
                Contas
              </TabsTrigger>
            </Link>
            <Link className="flex-1 w-full" href="/settings/credit-cards">
              <TabsTrigger className="w-full" value="/settings/credit-cards">
                Cartões de Crédito
              </TabsTrigger>
            </Link>
            <Link className="flex-1 w-full" href="/settings/categories">
              <TabsTrigger className="w-full" value="/settings/categories">
                Categorias
              </TabsTrigger>
            </Link>
          </TabsList>
          <TabsContent value={activeTab}>{children}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
