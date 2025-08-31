import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  filter.userId = req.user._id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
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
  const userId = req.user._id;

  const contactById = await getContactById({ _id: id, userId });

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
  const { _id: userId } = req.user;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = '';
  }
  const createdContact = await createContact({
    userId,
    ...req.body,
    photo: photoUrl,
  });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: createdContact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const result = await updateContact(
    { _id: id, userId },
    { ...req.body, photo: photoUrl },
    {
      new: true,
    },
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated the contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  const deletedContact = await deleteContact({
    _id: id,
    userId,
  });
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
