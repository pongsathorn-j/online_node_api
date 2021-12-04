const Category = require("../models/category");
const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const category = await Category.find().sort({ title: -1 });

  res.status(200).json({
    status: "Success",
    message: "",
    data: category,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      message: "",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.title = async (req, res, next) => {
  try {
    const { title } = req.params;
    const category = await Category.find({ title: title });

    if (!category) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      message: "",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.insert = async (req, res, next) => {
  try {
    let category = new Category(req.body);
    const { title } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const exitsCategory = await Category.findOne({ title: title });

    if (exitsCategory) {
      const error = new Error("Category ซ้ำ");
      error.statusCode = 400;
      throw error;
    }

    await category.save();

    res.status(201).json({
      insert: {
        status: "Success",
        message: "",
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.deleteOne({ _id: id });

    if (category.deletedCount === 0) {
      const error = new Error("ไม่พบรหัสนี้ในระบบ");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({
      message: "ลบข้อมูลเรียบร้อย",
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const exitsCategory = await Category.findOne({ title: title });
    if (exitsCategory) {
      const error = new Error("Category ซ้ำ");
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.updateOne({ _id: id }, req.body);

    if (category.nModified === 0) {
      throw new Error("อัพเดพไม่สำเร็จ");
    }

    res.status(200).json({
      message: "แก้ไขข้อมูลเรียบร้อย",
    });
  } catch (error) {
    next(error);
  }
};
