import {
  PageContainer,
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/page-container";

const PlanoPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Meu plano</PageTitle>
          <PageDescription>Gerencie seu plano</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-gray-500">Nenhum plano cadastrado</p>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default PlanoPage;
