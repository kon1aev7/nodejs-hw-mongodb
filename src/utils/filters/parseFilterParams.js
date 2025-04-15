import { typeList } from '../../constants/contacts.js';

const parseType = (contactType) => {
  const isString = typeof contactType === 'string';

  if (!isString) return;

  const isType = (contactType) => typeList.includes(contactType);

  if (isType(contactType)) return contactType;
};

const parseFavourite = (favourite) => {
  const isString = typeof favourite === 'string';

  if (!isString) return;

  return favourite;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseType(type);
  const parsedContactFavourite = parseFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedContactFavourite,
  };
};
