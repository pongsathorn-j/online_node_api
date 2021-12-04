const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

exports.index = (req, res, next) => {
  res.status(200).json({ message: "respond with a resources" });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    // check email ซ้ำ
    const exitsEmail = await User.findOne({ email: email });
    if (exitsEmail) {
      const error = new Error("อีเมลซ้ำ มีผู้ใช้งานแล้ว");
      error.statusCode = 400;
      throw error;
    }

    let user = new User();
    user.name = name;
    user.email = email;
    user.password = await user.encryptPassword(password);

    await user.save();

    res.status(200).json({ status: "Success", message: req.body });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check email
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("ไม่พบผู้ใช้งานในระบบ");
      error.statusCode = 400;
      throw error;
    }

    //ตรวจสอบ Password
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("ไม่พบผู้ใช้งานในระบบหรือ Password ไม่ถูกต้อง");
      error.statusCode = 401;
      throw error;
    }

    // สร้าง Token
    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // decode expriesIn
    const expire = jwt.decode(token);

    res.status(200).json({
      status: "Success",
      message: "ล๊อคอินสำเร็จ",
      accessToken: token,
      expiredIn: expire.exp,
      tokenType: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { _id, name, email, role } = req.user;
    res.status(200).json({
      status: "Success",
      id: _id,
      name: name,
      email: email,
      role: role,
    });
  } catch (error) {
    next(error);
  }
};
