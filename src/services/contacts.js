import { SORT_ORDER } from '../constants/index.js';
import { ContactsModel } from '../models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsModel.find();

  if (filter.userId) contactsQuery.where('userId').equals(filter.userId);

  if (filter.contactType)
    contactsQuery.where('contactType').equals(filter.contactType);

  if (typeof filter.isFavourite === 'boolean')
    contactsQuery.where('isFavourite').equals(filter.isFavourite);

  const contactsCount = await ContactsModel.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(page, perPage, contactsCount);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = filter => ContactsModel.findOne(filter);

export const createContact = async payload => {
  const createdContact = await ContactsModel.create(payload);

  return createdContact;
};
export const updateContact = async (filter, payload, options = {}) => {
  const result = await ContactsModel.findOneAndUpdate(filter, payload, options);
  return result;
};

export const deleteContact = async filter => {
  const removedContact = await ContactsModel.findOneAndDelete(filter);

  return removedContact;
};
