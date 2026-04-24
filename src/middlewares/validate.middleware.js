const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    req.body = data;
    next();
  } catch (error) {
    res.status(400).json({
      message: "validation Error",
      error: error.error,
    });
  }
};

export default validate;
