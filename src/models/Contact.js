import { Schema, model } from 'mongoose';
import { contactTypes } from '../constants/contacts.js';
const contactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: false },
    isFavourite: { type: Boolean, default: false },
    type: {
      type: String,
      enum: contactTypes,
      required: true,
      default: 'personal',
    },
  },
  { versionKey: false, timestamps: true },
);

export const ContactsModel = model('Contact', contactsSchema);
