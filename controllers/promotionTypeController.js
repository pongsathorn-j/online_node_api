const PromotionType = require("../models/promotionType");
const { validationResult } = require("express-validator");

/** Get All */
exports.index = async (req, res, next) => {
  try {
    const promotionType = await PromotionType.find();
    res.status(200).json({
      status: "Success",
      message: "",
      data: promotionType,
    });
  } catch (error) {
    next(error);
  }
};

exports.insert = async (req, res, next) => {
  try {
    let promotionType = new PromotionType(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    await promotionType.save();

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
    const promotionType = await PromotionType.updateOne({ _id: id }, req.body);

    if (promotionType.nModified === 0) {
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
    const promotionType = await PromotionType.deleteOne({ _id: id });

    if (promotionType.deletedCount === 0) {
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
