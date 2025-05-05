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

  const contactsQuery = ContactsCollection.find({ userId: filters.userId });

  if (filters.userId) {
    contactsQuery.where('userId').equals(filters.userId);
  }
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

  const countQuery = ContactsCollection.find({
    userId: filters.userId,
  });

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

export const getContactsById = async ({ contactId, userId }) => {
  try {
    return await ContactsCollection.findOne({ _id: contactId, userId });
  } catch (error) {
    throw new Error(error);
  }
};

export const addContacts = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContacts = async (
  { contactId, userId },
  payload,
  options = {},
) => {
  const { upsert = false } = options;
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      upsert,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactsById = async (_id, userId) => {
  return ContactsCollection.findOneAndDelete({ _id, userId });
};
