const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    req.body = data;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation error",
      error: error.errors || error.issues || error.message,
    });
  }
};

export default validate;
