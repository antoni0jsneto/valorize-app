"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { PageContainer } from "@/components/page-container";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen pt-10 md:pt-0 gap-2">
      <AppSidebar />
      <PageContainer>{children}</PageContainer>
    </div>
  );
}
