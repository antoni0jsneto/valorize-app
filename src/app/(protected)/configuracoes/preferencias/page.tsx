import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/page-container";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const PreferenciasPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Preferências</PageTitle>
          <PageDescription>Gerencie suas preferências</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-gray-500">
            Nenhuma preferência cadastrada
          </p>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default PreferenciasPage;
