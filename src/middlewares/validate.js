function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (!error) {
      req.body = value;
      return next();
    }

    const firstMessage = error.details[0].message;

    return res.status(400).json({
      message: firstMessage
    });
  };
}

export { validate };
export default validate;
