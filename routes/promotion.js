const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");
const passportJWT = require("../middleware/passportJWT");
const { body } = require("express-validator");
const checkAdmin = require("../middleware/checkAdmin");

router.get(
  "/",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  promotionController.index
);

/* http://localhost:3000/promotion */
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อ"),
    body("promotionTypeId").not().isEmpty().withMessage("กรุณาเลือกประเภท"),
    body("startAt")
      .not()
      .isEmpty()
      .withMessage("กรุณากรอกวันที่เริ่มต้น")
      .toDate()
      .isISO8601({ strict: true })
      .withMessage("start must be in correct format yyyy-mm-dd hh:mm:ss")
      .custom(
        (startAt, { req }) =>
          new Date(startAt).getTime() < new Date(req.body.endAt).getTime()
      )
      .withMessage("Is Before End"),

    body("endAt")
      .not()
      .isEmpty()
      .withMessage("กรุณากรอกวันที่สินสุด")
      .isISO8601({ strict: true })
      .withMessage("End must be in correct format yyyy-mm-dd hh:mm:ss")
      .custom(
        (endAt, { req }) =>
          new Date(endAt).getTime() > new Date(req.body.startAt).getTime()
      )
      .withMessage("Is After Start"),
    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  promotionController.insert
);

/* http://localhost:3000/promotion */
router.delete(
  "/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  promotionController.destroy
);

/* http://localhost:3000/promotion */
router.put(
  "/:id",
  [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อ"),
    body("promotionTypeId").not().isEmpty().withMessage("กรุณาเลือกประเภท"),
    body("startAt")
      .not()
      .isEmpty()
      .withMessage("กรุณากรอกวันที่เริ่มต้น")
      .toDate()
      .isISO8601({ strict: true })
      .withMessage("start must be in correct format yyyy-mm-dd hh:mm:ss")
      .custom(
        (startAt, { req }) =>
          new Date(startAt).getTime() < new Date(req.body.endAt).getTime()
      )
      .withMessage("Is Before End"),

    body("endAt")
      .not()
      .isEmpty()
      .withMessage("กรุณากรอกวันที่สินสุด")
      .isISO8601({ strict: true })
      .withMessage("End must be in correct format yyyy-mm-dd hh:mm:ss")
      .custom(
        (endAt, { req }) =>
          new Date(endAt).getTime() > new Date(req.body.startAt).getTime()
      )
      .withMessage("Is After Start"),

    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  promotionController.update
);

module.exports = router;
