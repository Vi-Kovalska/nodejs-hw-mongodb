export const calculatePaginationData = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const pages = totalPages - page;
  const hasNextPages = pages > 0 ? Boolean(pages) : false;
  const hasPreviousPage = page !== 1;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPages,
    hasPreviousPage,
  };
};
