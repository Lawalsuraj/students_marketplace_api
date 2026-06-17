import AppError from '../utils/AppError.js';

const validate = (schema) => {
  return (req, res, next) => {
    console.log(req.body)
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map(e => e.message)
        .join(', ');
      throw new AppError(message, 400);
    }

    next();
  };
};

export default validate;