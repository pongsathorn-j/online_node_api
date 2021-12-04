const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const passportJWT = require("../middleware/passportJWT");

/* GET users listing. */
/* http://localhost:3000/user */
router.get("/", userController.index);

/* http://localhost:3000/user/login */
router.post("/login", userController.login);

/* http://localhost:3000/user/register */
router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อ-สกุลด้วย"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("กรุณากรอกอีเมลด้วย")
      .isEmail()
      .withMessage("กรุณากรอกรูปแบบอีเมลให้ถูกต้อง"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("กรุณากรอก Password ด้วย")
      .isLength({ min: 6 })
      .withMessage("รหัสผ่านต้องมากกว่า 6 ตัวอักษรขึ้นไป"),
  ],
  userController.register
);

/* http://localhost:3000/user/me */
router.get("/me", [passportJWT.isLogin], userController.me);

module.exports = router;
