import { Router } from 'express';
import {
  getContactsController,
  getContactsByIdController,
  addContactsController,
  // upsertContactsController,
  patchContactsController,
  deleteContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validations/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactsByIdController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(addContactsController),
);

// contactsRouter.put('/:contactId', isValidId, upload.single('photo'), validateBody(contactAddSchema), ctrlWrapper(upsertContactsController));

contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactsController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactsController),
);

export default contactsRouter;
