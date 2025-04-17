import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  if (!contacts) {
    throw createHttpError();
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;

  const contactById = await getContactById(id);

  if (!contactById) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contactById,
  });
};

export const createContactController = async (req, res, next) => {
  const createdContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: createdContact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const result = await updateContact(id, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated the contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;
  const deletedContact = await deleteContact(id);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204, 'The contact was successfully delete');
};
