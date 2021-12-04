const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const passportJWT = require("../middleware/passportJWT");
const { body } = require("express-validator");
const checkAdmin = require("../middleware/checkAdmin");

/* GET category listing. */
/* http://localhost:3000/category */
router.get("/", [passportJWT.isLogin], categoryController.index);

/* GET category listing. */
/* http://localhost:3000/category/604f2488fcea033b40a3ae6b */
router.get("/:id", [passportJWT.isLogin], categoryController.show);

/* GET category . */
/* http://localhost:3000/category/604f2488fcea033b40a3ae6b */
router.get("/title/:title", categoryController.title);

/* http://localhost:3000/category */
router.post(
  "/",
  [
    body("title").not().isEmpty().withMessage("กรุณากรอก Title"),
    body("title_th").not().isEmpty().withMessage("กรุณากรอก Title Th"),
    body("content").not().isEmpty().withMessage("กรุณากรอก Content"),
    body("content_th").not().isEmpty().withMessage("กรุณากรอก Content Th"),
    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  categoryController.insert
);

/* http://localhost:3000/category */
router.delete(
  "/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  categoryController.destroy
);

/* http://localhost:3000/category */
router.put(
  "/:id",
  [
    body("title").not().isEmpty().withMessage("กรุณากรอก Title"),
    body("title_th").not().isEmpty().withMessage("กรุณากรอก Title Th"),
    body("content").not().isEmpty().withMessage("กรุณากรอก Content"),
    body("content_th").not().isEmpty().withMessage("กรุณากรอก Content Th"),
    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  categoryController.update
);

module.exports = router;
