import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/page-container";

const AtividadesPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Registro de atividades</PageTitle>
          <PageDescription>
            Veja aqui o registro de atividades no sistema dos últimos 90 dias
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-gray-500">Nenhum registro encontrado</p>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default AtividadesPage;
