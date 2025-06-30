"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen pt-20 md:pt-0 gap-2">
      <AppSidebar />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, {session.user?.name || session.user?.email}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
