const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const passportJWT = require("../middleware/passportJWT");
const { body, param } = require("express-validator");
const checkAdmin = require("../middleware/checkAdmin");
const ObjectID = require("mongodb").ObjectID;

/**Get Reviews By Product Id */
router.get("/product/:id/:page", [], reviewController.byProductId);

/* http://localhost:3000/promotion */
router.post(
  "/",
  [
    body("content").not().isEmpty().withMessage("กรุณากรอกรายละเอียด"),
    body("rating")
      .not()
      .isEmpty()
      .withMessage("กรุณาให้คะแนน")
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be a number between 0 and 5"),
    body("userId").not().isEmpty().withMessage("กรุณาส่ง User"),
    body("productId").not().isEmpty().withMessage("กรุณาส่ง Product"),
    passportJWT.isLogin,
  ],
  reviewController.insert
);

/* http://localhost:3000/promotion */
router.delete(
  "/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  reviewController.destroy
);

/* http://localhost:3000/promotion */
router.put(
  "/:id",
  [
    body("content").not().isEmpty().withMessage("กรุณากรอกรายละเอียด"),
    body("rating")
      .not()
      .isEmpty()
      .withMessage("กรุณาให้คะแนน")
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be a number between 0 and 5"),
    body("userId").not().isEmpty().withMessage("กรุณาส่ง User"),
    body("productId").not().isEmpty().withMessage("กรุณาส่ง Product"),
    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  reviewController.update
);

module.exports = router;
