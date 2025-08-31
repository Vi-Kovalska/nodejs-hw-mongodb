import { contactTypes } from '../constants/contacts.js';

const parseContactType = type => {
  if (typeof type !== 'string') return;
  const cleanType = type.trim();
  if (contactTypes.includes(cleanType)) return cleanType;
};
const parseIsFavorite = boolean => {
  if (typeof boolean !== 'string') return;
  if (boolean === 'true') {
    return true;
  }
  if (boolean === 'false') {
    return false;
  }
};

export const parseFilterParams = query => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavorite = parseIsFavorite(isFavourite);
  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavorite,
  };
};
