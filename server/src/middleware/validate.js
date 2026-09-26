// server/src/middleware/validate.js
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid Request Payload',
      details: error.errors || error.message
    });
  }
};
