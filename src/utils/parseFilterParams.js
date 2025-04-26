import { contactTypes } from '../constants/contacts.js';

const parseContactType = type => {
  if (typeof type !== 'string') return;
  const cleanType = type.trim();
  if (contactTypes.includes(cleanType)) return cleanType;
  return;
};
const parseIsFavorite = boolean => {
  if (typeof boolean !== 'string') return;
  if (boolean === 'true') {
    return true;
  }
  if (boolean === 'false') {
    return false;
  }
  return;
};

export const parseFilterParams = query => {
  const { contactType, isFavorite } = query;
  const filter = {};
  const parsedContactType = parseContactType(contactType);
  if (parsedContactType !== undefined) filter.contactType = parsedContactType;
  const parsedIsFavorite = parseIsFavorite(isFavorite);
  if (parsedIsFavorite !== undefined) filter.isFavorite = parsedIsFavorite;
  return filter;
};
