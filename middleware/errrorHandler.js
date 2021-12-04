module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: "Unsuccess",
    error: {
      statusCode: statusCode,
      message: err.message,
      validation: err.validation,
    },
  });
};
