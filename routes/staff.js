const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
/* http://localhost:3000/staff */
router.get('/', [passportJWT.isLogin], staffController.index);

/* GET users listing. */
/* http://localhost:3000/staff/604f2488fcea033b40a3ae6b */
router.get('/:id', [passportJWT.isLogin], staffController.show);

/* http://localhost:3000/staff */
router.post('/', [passportJWT.isLogin], staffController.insert);

/* http://localhost:3000/staff */
router.delete('/:id', [passportJWT.isLogin], staffController.destroy);

/* http://localhost:3000/staff */
router.put('/:id', [passportJWT.isLogin], staffController.update);

module.exports = router;
