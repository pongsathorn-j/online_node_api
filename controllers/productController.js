const Product = require("../models/product");
const { validationResult } = require("express-validator");
const config = require("../config/index");
const path = require("path");
const uuidv4 = require("uuid");
const stream = require("stream");
const { Storage } = require("@google-cloud/storage");
const { lookup } = require("dns");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const rePathPhoto = (product) => {
  const pathPhoto = config.DOMAIN_GOOGLE_STORAGE;
  if (!!product) {
    product.map((item, i) => {
      return item.photo.map((data, j) => {
        return (product[i].photo[j] = pathPhoto + "/product/" + data);
      });
    });
  }
};

/** Get Product All */
exports.index = async (req, res, next) => {
  const product = await Product.find()
    .sort({ title: -1 })
    .populate("categoryId", "title content title_th content_th");
  /** Url Photo */
  rePathPhoto(product);
  res.status(200).json({
    status: "Success",
    message: "",
    data: product,
  });
};

/** Get Product By Id */
exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.aggregate([
      {
        $addFields: {
          discount_percentage: {
            $multiply: [{ $divide: ["$discount", "$price"] }, 100],
          },
        },
      },
      {
        $match: {
          $and: [{ _id: ObjectId(id) }, { published: true }],
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
    ]);

    if (!product) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 400;
      throw error;
    }
    /** Url Photo */
    rePathPhoto(product);
    res.status(200).json({
      status: "Success",
      message: "",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/** Get Product By Total */
exports.total = async (req, res, next) => {
  try {
    const { total } = req.params;
    let dataTotal = !!parseInt(total) ? parseInt(total) : 0;
    const productTotalAll = await Product.count({ published: true });
    const product = await Product.aggregate([
      {
        $addFields: {
          discount_percentage: {
            $multiply: [{ $divide: ["$discount", "$price"] }, 100],
          },
        },
      },
      {
        $match: {
          $and: [{ published: true }],
        },
      },
      {
        $sort: {
          title: -1,
        },
      },
      { $limit: parseInt(dataTotal) },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
    ]);

    if (!product) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 400;
      throw error;
    }
    /** Url Photo */
    rePathPhoto(product);
    res.status(200).json({
      status: "Success",
      message: "",
      data: product,
      totalCount: productTotalAll,
      dataLimit: dataTotal,
    });
  } catch (error) {
    next(error);
  }
};

/** Get Product By page */
exports.page = async (req, res, next) => {
  try {
    const { page } = req.params;
    const PER_PAGE = 12;
    let dataPage = !!parseInt(page) ? parseInt(page) : 1;
    let skipTotal = PER_PAGE * (dataPage - 1);
    const productTotalAll = await Product.count({ published: true });
    const product = await Product.aggregate([
      {
        $addFields: {
          discount_percentage: {
            $multiply: [{ $divide: ["$discount", "$price"] }, 100],
          },
        },
      },
      {
        $match: {
          $and: [{ published: true }],
        },
      },
      {
        $sort: {
          title: -1,
        },
      },
      { $skip: parseInt(skipTotal) },
      { $limit: parseInt(PER_PAGE) },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
    ]);

    if (!product) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 400;
      throw error;
    }

    /** Url Photo */
    rePathPhoto(product);

    res.status(200).json({
      status: "Success",
      message: "",
      data: product,
      pageLimit: PER_PAGE,
      page: page,
      totalCount: productTotalAll,
    });
  } catch (error) {
    next(error);
  }
};

/** Get Product By CategoryId and page */
exports.categoryId = async (req, res, next) => {
  try {
    const PER_PAGE = 12;
    const { categoryId, page } = req.params;
    let dataPage = !!parseInt(page) ? parseInt(page) : 1;
    let skipTotal = PER_PAGE * (dataPage - 1);
    const productTotalAll = await Product.count({
      published: true,
      categoryId: categoryId,
    });

    // const product = await Product.find({
    //   published: true,
    //   categoryId: categoryId,
    // })
    //   .populate("categoryId", "title content title_th content_th")
    //   .sort({ title: -1 })
    //   .skip(skipTotal)
    //   .limit(PER_PAGE);

    const product = await Product.aggregate([
      {
        $addFields: {
          discount_percentage: {
            $multiply: [{ $divide: ["$discount", "$price"] }, 100],
          },
        },
      },
      {
        $match: {
          $and: [{ published: true }, { categoryId: ObjectId(categoryId) }],
        },
      },
      {
        $sort: {
          title: -1,
        },
      },
      { $skip: parseInt(skipTotal) },
      { $limit: parseInt(PER_PAGE) },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
    ]);

    if (!product) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 400;
      throw error;
    }

    /** Url Photo */
    rePathPhoto(product);

    res.status(200).json({
      status: "Success",
      message: "",
      data: product,
      pageLimit: PER_PAGE,
      page: page,
      totalCount: productTotalAll,
    });
  } catch (error) {
    next(error);
  }
};

exports.insert = async (req, res, next) => {
  try {
    await req.body.photo.map(async (photo, index) => {
      return (req.body.photo[index] = await saveImageToGoogle(photo));
    });

    let product = new Product(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    await product.save();

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

    /** Delete Image In Cloud */
    const productSearch = await Product.findById(id);
    productSearch.photo.map(async (photos) => {
      return await deleteImageInGoogle(photos).catch(console.error);
    });

    /** Upload Image To Cloud */
    await req.body.photo.map(async (photo, index) => {
      return (req.body.photo[index] = await saveImageToGoogle(photo));
    });

    /** update  */
    const product = await Product.updateOne({ _id: id }, req.body);

    if (product.nModified === 0) {
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

    const productSearch = await Product.findById(id);
    productSearch.photo.map(async (photos) => {
      return await deleteImageInGoogle(photos).catch(console.error);
    });

    const product = await Product.deleteOne({ _id: id });

    if (product.deletedCount === 0) {
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

exports.search = async (req, res, next) => {
  try {
    const { search } = req.params;

    const product = await Product.aggregate([
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      // convert array of category to object
      {
        $unwind: "$category",
      },
      // filter
      {
        $match: {
          $and: [{ published: true }],
          $or: [
            { "category.title": { $regex: new RegExp(search, "gi") } },
            { "category.title_th": { $regex: new RegExp(search, "gi") } },
            {
              title: { $regex: new RegExp(search, "gi") },
            },
          ],
        },
      },
    ]).sort({ title: 1 });

    res.status(200).json({
      status: "Success",
      message: "",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.discount = async (req, res, next) => {
  try {
    const { page, start, end } = req.params;
    const PER_PAGE = 12;
    let dataPage = !!parseInt(page) ? parseInt(page) : 1;
    let skipTotal = PER_PAGE * (dataPage - 1);

    let productTotalAll = await Product.aggregate([
      {
        $addFields: {
          discount_percentage: {
            $multiply: [{ $divide: ["$discount", "$price"] }, 100],
          },
        },
      },
      {
        $match: {
          $and: [
            {
              discount_percentage: { $gt: parseInt(start), $lt: parseInt(end) },
            },
            { published: true },
          ],
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
      { $count: "count" },
    ]);

    productTotalAll = productTotalAll[0].count;

    let product = null;
    if (page == 0) {
      product = await Product.aggregate([
        {
          $addFields: {
            discount_percentage: {
              $multiply: [{ $divide: ["$discount", "$price"] }, 100],
            },
          },
        },
        {
          $match: {
            $and: [
              {
                discount_percentage: {
                  $gt: parseInt(start),
                  $lt: parseInt(end),
                },
              },
              { published: true },
            ],
          },
        },
        {
          $sort: {
            title: 1,
          },
        },
        {
          $lookup: {
            from: "category",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryId",
          },
        },
      ]);
    } else {
      product = await Product.aggregate([
        {
          $addFields: {
            discount_percentage: {
              $multiply: [{ $divide: ["$discount", "$price"] }, 100],
            },
          },
        },
        {
          $match: {
            $and: [
              {
                discount_percentage: {
                  $gt: parseInt(start),
                  $lt: parseInt(end),
                },
              },
              { published: true },
            ],
          },
        },
        {
          $sort: {
            title: 1,
          },
        },
        { $skip: parseInt(skipTotal) },
        { $limit: parseInt(PER_PAGE) },
        {
          $lookup: {
            from: "category",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryId",
          },
        },
      ]);
    }

    if (!product) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 400;
      throw error;
    }

    /** Url Photo */
    rePathPhoto(product);

    res.status(200).json({
      status: "Success",
      message: "",
      data: product,
      pageLimit: PER_PAGE,
      page: page,
      totalCount: productTotalAll,
    });
  } catch (error) {
    next(error);
  }
};

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}

const saveImageToGoogle = async (baseImage) => {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );
  // console.log(ext);

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(image.data, "base64"));

  // Creates a client and upload to storage
  const storage = new Storage({
    projectId: "nodepos",
    keyFilename: `${projectPath}/google_key.json`,
  });

  const myBucket = storage.bucket("apinode-course");
  let newFilename = myBucket.file("product/" + filename);
  bufferStream.pipe(
    newFilename
      .createWriteStream({
        gzip: true,
        contentType: image.type,
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: "public, max-age=31536000",
        },
        public: true,
        validation: "md5",
      })
      .on("error", (err) => {
        console.log(err);
      })
      .on("finish", () => {
        // console.log("upload successfully...");
      })
  );

  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
};

const deleteImageInGoogle = async (fileName) => {
  const projectPath = path.resolve("./");
  const storage = new Storage({
    projectId: "nodepos",
    keyFilename: `${projectPath}/google_key.json`,
  });
  const bucketName = "apinode-course";
  const myBucket = storage.bucket(bucketName);
  await myBucket.file("product/" + fileName.toString()).delete();
};
