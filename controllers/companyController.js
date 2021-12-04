const Company = require("../models/company");

exports.index = async (req, res, next) => {
  const company = await Company.find();

  res.status(200).json({
    status: "Success",
    message: "",
    data: company,
  });
};
