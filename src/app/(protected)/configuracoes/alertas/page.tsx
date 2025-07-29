import {
  PageContainer,
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/page-container";

const AlertasPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Alertas</PageTitle>
          <PageDescription>
            Receba alertas de contas a pagar, receber e metas
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-gray-500">Nenhum alerta cadastrado</p>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default AlertasPage;
