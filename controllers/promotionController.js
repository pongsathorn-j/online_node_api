const Promotion = require("../models/promotion");
const { validationResult } = require("express-validator");

/** Get All */
exports.index = async (req, res, next) => {
  try {
    const promotion = await Promotion.find();
    res.status(200).json({
      status: "Success",
      data: promotion,
    });
  } catch (error) {
    next(error);
  }
};

exports.insert = async (req, res, next) => {
  try {
    let promotion = new Promotion(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    await promotion.save();

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

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    /** update  */
    const promotion = await Promotion.updateOne({ _id: id }, req.body);

    if (promotion.nModified === 0) {
      throw new Error("อัพเดพไม่สำเร็จ");
    }

    res.status(200).json({
      status: "Success",
      message: "แก้ไขข้อมูลเรียบร้อย",
    });
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.deleteOne({ _id: id });

    if (promotion.deletedCount === 0) {
      const error = new Error("ไม่พบรหัสนี้ในระบบ");
      error.statusCode = 422;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      message: "ลบข้อมูลเรียบร้อย",
    });
  } catch (error) {
    next(error);
  }
};
