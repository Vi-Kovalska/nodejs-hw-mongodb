export const calculatePaginationData = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPages = Boolean(totalPages - page);
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
