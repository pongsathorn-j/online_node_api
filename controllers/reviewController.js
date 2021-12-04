const Review = require("../models/review");
const { validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectID;

/** Get Reviews By ProductID */
exports.byProductId = async (req, res, next) => {
  try {
    const PER_PAGE = 10;
    const { id, page } = req.params;
    let dataPage = !!parseInt(page) ? parseInt(page) : 1;
    let skipTotal = PER_PAGE * (dataPage - 1);
    const reviewProductTotalAll = await Review.count({
      productId: ObjectId(id),
    });
    const review = await Review.find({ productId: ObjectId(id) })
      .populate("productId", "title content price _id")
      .populate("userId", "_id name email role")
      .sort({ createdAt: 1 })
      .skip(skipTotal)
      .limit(PER_PAGE);

    res.status(200).json({
      status: "Success",
      message: "",
      data: review,
      pageLimit: PER_PAGE,
      page: page,
      totalCount: reviewProductTotalAll,
    });
  } catch (error) {
    next(error);
  }
};

exports.insert = async (req, res, next) => {
  try {
    let review = new Review(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    await review.save();

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
    const review = await Review.updateOne({ _id: id }, req.body);

    if (review.nModified === 0) {
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
    const review = await Review.deleteOne({ _id: id });

    if (review.deletedCount === 0) {
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
