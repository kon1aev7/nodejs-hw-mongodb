import createHttpError from 'http-errors';
import {
  addContacts,
  deleteContactsById,
  getContacts,
  getContactsById,
  updateContacts,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/filters/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  try {
    const paginationParams = parsePaginationParams(req.query);
    const sortParams = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    // console.log('Pagination Params:', paginationParams);
    // console.log('Sort Params:', sortParams);
    // console.log('Filter Params:', filter);

    const data = await getContacts({
      ...paginationParams,
      ...sortParams,
      filters: filter,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;

  const data = await getContactsById(contactId);

  if (!data) {
    throw createHttpError(404, `Contact not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id=${contactId}!`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const data = await addContacts(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactsController = async (req, res) => {
  const { contactId } = req.params;

  const data = await updateContacts(contactId, req.body);

  if (!data) {
    throw createHttpError(404, `Contact not found`);
  }
  res.status(200).json({
    status: 200,
    message: 'Sucessfully patched a contact!',
    data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { contactId } = req.params;

  const data = await deleteContactsById(contactId);

  if (!data) {
    throw createHttpError(404, `Contact not found`);
  }
  res.status(204).send();
};
