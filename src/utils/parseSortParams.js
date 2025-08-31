import { SORT_ORDER } from '../constants/index.js';
import { keysOfContactDocument } from '../constants/contacts.js';
const parseSortOrder = sortOrder => {
  const exsitingSortOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(
    sortOrder,
  );
  if (exsitingSortOrder) return sortOrder;
  return SORT_ORDER.ASC;
};
const parseSortBy = sortBy => {
  if (keysOfContactDocument.includes(sortBy)) return sortBy;
  return '_id';
};

export const parseSortParams = query => {
  const { sortBy, sortOrder } = query;
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
