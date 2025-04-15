import ContactsCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { sortList } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filters.contactType) {
    contactsQuery.where('contactType').equals(filters.contactType);
  }

  if (filters.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const contacts = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const countQuery = ContactsCollection.find();

  if (filters.contactType) {
    countQuery.where('contactType').equals(filters.contactType);
  }

  if (filters.isFavourite !== undefined) {
    countQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const totalItems = await countQuery.countDocuments();

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (id) => {
  try {
    return await ContactsCollection.findOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
};

export const addContacts = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContacts = async (_id, payload) => {
  return ContactsCollection.findOneAndUpdate({ _id }, payload, { new: true });
};

export const deleteContactsById = async (_id) => {
  return ContactsCollection.findOneAndDelete({ _id });
};
