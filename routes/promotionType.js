const express = require("express");
const router = express.Router();
const promotionTypeController = require("../controllers/promotionTypeController");
const passportJWT = require("../middleware/passportJWT");
const { body } = require("express-validator");
const checkAdmin = require("../middleware/checkAdmin");

router.get(
  "/",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  promotionTypeController.index
);

/* http://localhost:3000/promotionType */
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อ"),
    body("status").not().isEmpty().withMessage("กรุณาเลือกสถานะ"),
    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  promotionTypeController.insert
);

/* http://localhost:3000/promotionType */
router.delete(
  "/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  promotionTypeController.destroy
);

/* http://localhost:3000/promotionType */
router.put(
  "/:id",
  [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อ"),
    body("status").not().isEmpty().withMessage("กรุณาเลือกสถานะ"),

    passportJWT.isLogin,
    checkAdmin.isAdmin,
  ],
  promotionTypeController.update
);

module.exports = router;
