const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const config = require("../config/index");

const Shop = require("../models/shop");
const Menu = require("../models/menu");

exports.index = async (req, res, next) => {
  const shops = await Shop.find()
    .select("name photo location")
    .sort({ _id: -1 });

  const shopWithPhotoDomain = await shops.map((shop, index) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: config.DOMAIN_GOOGLE_STORAGE + "/" + shop.photo,
      location: shop.location,
    };
  });

  res.status(200).json({
    status: "Success",
    message: "",
    data: shopWithPhotoDomain,
  });
};

//Get Menu
exports.menu = async (req, res, next) => {
  //   const menus = await Menu.find().select('-price');
  //   const menus = await Menu.find().where('price').gte(150).sort('-_id');
  //   const menus = await Menu.find({ price: { $gte: 150 } }).sort({ _id: -1 });
  const menus = await Menu.find().populate("shop", "name location -_id");
  res.status(200).json({
    status: "Success",
    message: "",
    data: menus,
  });
};

//Get Shop Id with Menu
exports.getShopWithMenu = async (req, res, next) => {
  const { id } = req.params;
  const shopMenu = await Shop.findById(id)
    .populate("menus", "_id name price -shop price_vat")
    .select("-createdAt -updatedAt -__v");

  res.status(200).json({
    status: "Success",
    message: "",
    data: shopMenu,
  });
};

//Get Shop Id with Menu
exports.insert = async (req, res, next) => {
  const { name, location, photo } = req.body;
  let shops = new Shop({
    name: name,
    location: location,
    // photo: await saveImageToDisk(photo),
    photo: await saveImageToGoogle(photo),
  });
  await shops.save((err) => {
    if (err) {
      if (err.name === "ValidationError")
        return handleValidationError(err, res); // here
      return res.status(500).json({ message: "Error while creating new user" });
    }
    return res.status(201).json({
      insert: {
        status: "Success",
        message: "",
      },
    });
  });
};

function handleValidationError(err, res) {
  let message = "";
  let title = "Validation Error";
  let code = 400;
  let requiredFields = [];
  for (let field in err.errors) {
    let subMsg = "";
    if (err.errors[field].kind === "required") {
      requiredFields.push(field);
    }
  }
  if (requiredFields.length > 0) {
    message = "Following fields are required: " + requiredFields.join(", ");
  } else {
    message = err.message;
  }
  res.status(code).json({
    status: code,
    message: message,
    title: title,
  });
}

async function saveImageToDisk(baseImage) {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");
  //โฟลเดอร์และ path ของการอัปโหลด
  const uploadPath = `${projectPath}/public/images/`;

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  //เขียนไฟล์ไปไว้ที่ path
  await writeFileAsync(uploadPath + filename, image.data, "base64");
  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
}

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

async function saveImageToGoogle(baseImage) {
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
  var newFilename = myBucket.file(filename);
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
        console.log("upload successfully...");
      })
  );

  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
}
