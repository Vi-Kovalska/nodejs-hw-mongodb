import { ContactsModel } from '../models/Contact.js';

export const getAllContacts = () => ContactsModel.find();
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
