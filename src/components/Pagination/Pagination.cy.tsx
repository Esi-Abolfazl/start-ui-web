import { Pagination, PaginationInfo } from '@/components/Pagination';

describe('Pagination', () => {
  it('should display pagination data during loading', () => {
    cy.mount(
      <Pagination
        isLoadingPage={true}
        setPage={() => undefined}
        page={1}
        pageSize={10}
      >
        <PaginationInfo flex="1" />
      </Pagination>
    );
  });

  it('should display pagination data when loaded', () => {
    cy.mount(
      <Pagination
        isLoadingPage={false}
        setPage={() => undefined}
        page={1}
        pageSize={10}
        totalItems={5}
      >
        <PaginationInfo flex="1" />
      </Pagination>
    );
  });
});
