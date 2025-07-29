import {
  PageContainer,
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/page-container";

const TagsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Tags</PageTitle>
          <PageDescription>Gerencie suas tags</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-gray-500">Nenhuma tag cadastrada</p>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default TagsPage;
