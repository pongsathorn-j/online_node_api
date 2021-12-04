const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const passportJWT = require("../middleware/passportJWT");
const { body } = require("express-validator");
const checkAdmin = require("../middleware/checkAdmin");

/* GET product listing. */
/* http://localhost:3000/product */
router.get(
  "/",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  productController.index
);

/* GET product by id listing. */
/* http://localhost:3000/product/604f2488fcea033b40a3ae6b */
router.get("/:id", productController.show);

/* GET product limit total listing. */
router.get("/total/:total", [], productController.total);

/* GET product page listing. */
router.get("/page/:page", [], productController.page);

/* GET product by category id listing. */
/* http://localhost:3000/product/604f2488fcea033b40a3ae6b */
router.get("/category/:categoryId/:page", [], productController.categoryId);

/* GET product by discount id listing. */
/* http://localhost:3000/product/604f2488fcea033b40a3ae6b */
router.get("/discount/:page/:start/:end", [], productController.discount);

/* http://localhost:3000/product */
router.post(
  "/",
  [
    body("title").not().isEmpty().withMessage("กรุณากรอก Title"),
    body("content").not().isEmpty().withMessage("กรุณากรอก Title Th"),
    body("photo").not().isEmpty().withMessage("กรุณา Upload รูป"),
    body("price").not().isEmpty().withMessage("กรุณากรอก ราคา"),
    body("quantity").not().isEmpty().withMessage("กรุณากรอกจำนวน"),
    body("createdUserId").not().isEmpty().withMessage("กรุณาส่ง user"),
    body("categoryId").not().isEmpty().withMessage("กรุณาเลือก Category"),
    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  productController.insert
);

/* http://localhost:3000/product */
router.delete(
  "/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  productController.destroy
);

/* http://localhost:3000/product */
router.put(
  "/:id",
  [
    body("title").not().isEmpty().withMessage("กรุณากรอก Title"),
    body("content").not().isEmpty().withMessage("กรุณากรอก Title Th"),
    body("photo").not().isEmpty().withMessage("กรุณา Upload รูป"),
    body("price").not().isEmpty().withMessage("กรุณากรอก ราคา"),
    body("quantity").not().isEmpty().withMessage("กรุณากรอกจำนวน"),
    body("updatedUserId").not().isEmpty().withMessage("กรุณาส่ง user"),
    body("categoryId").not().isEmpty().withMessage("กรุณาเลือก Category"),

    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  productController.update
);

router.get("/search/:search", [], productController.search);

module.exports = router;
