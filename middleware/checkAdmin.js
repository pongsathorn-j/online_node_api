module.exports.isAdmin = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') {
      const error = new Error('ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ Admin เท่านั้น');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
