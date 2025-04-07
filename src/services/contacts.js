import { ContactsModel } from '../models/Contact.js';

export const getAllContacts = () => ContactsModel.find();
export const getContactById = id => ContactsModel.findOne({ _id: id });
