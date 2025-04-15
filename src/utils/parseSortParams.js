import { sortList } from '../constants/index.js';

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [sortList[0], sortList[1]].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return sortList[0];
};

const parseSortBy = (sortBy) => {
  const keysOfContacts = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  if (keysOfContacts.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};
