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

  if (filter.type) contactsQuery.where('type').equals(filter.type);

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

export const getContactById = id => ContactsModel.findOne({ _id: id });

export const createContact = async payload => {
  const createdContact = await ContactsModel.create(payload);
  return createdContact;
};
export const updateContact = async (contactId, payload, options = {}) => {
  const result = await ContactsModel.findOneAndUpdate(
    { _id: contactId },
    payload,
    options,
  );
  return result;
};

export const deleteContact = async contactId => {
  const removedContact = await ContactsModel.findOneAndDelete({
    _id: contactId,
  });

  return removedContact;
};
