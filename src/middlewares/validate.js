export function validate(schema) {
  return (req, res, next) => {
    const isBodyMethod = ['POST','PUT','PATCH'].includes(req.method.toUpperCase());
    const data = isBodyMethod ? req.body : req.query;

    const { value, error } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map(d => d.message).join(', ')
      });
    }

    if (isBodyMethod) req.body = value;
    else req.query = value;

    next();
  };
}
