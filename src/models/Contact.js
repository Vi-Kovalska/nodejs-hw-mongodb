import { Schema, model } from 'mongoose';
import { contactTypes, validPhone } from '../constants/contacts.js';
import { validEmail } from '../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, match: validPhone, required: true },
    email: { type: String, match: validEmail, required: false },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: contactTypes,
      required: true,
      default: 'personal',
    },
    photo: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);
contactsSchema.post('save', handleSaveError);
contactsSchema.pre('findOneAndUpdate', setUpdateSettings);
contactsSchema.post('findOneAndUpdate', handleSaveError);
export const ContactsModel = model('Contact', contactsSchema);
