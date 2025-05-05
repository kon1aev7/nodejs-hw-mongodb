import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      next(
        createHttpError(400, 'Bad Request', {
          errors: error.details,
        }),
      );
    }
  };
  return func;
};
