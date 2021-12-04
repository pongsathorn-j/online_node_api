const Staff = require("../models/staff");

exports.index = async (req, res, next) => {
  const staff = await Staff.find().sort({ salary: -1 });

  res.status(200).json({
    status: "Success",
    message: "",
    data: staff,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);

    if (!staff) {
      throw new Error("ไม่พบข้อมูล");
    }

    res.status(200).json({
      status: "Success",
      message: "",
      data: staff,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.insert = async (req, res, next) => {
  // const staff = await Staff.find();
  const { name, salary } = req.body;
  let staff = new Staff(req.body);
  await staff.save();

  res.status(201).json({
    insert: {
      status: "Success",
      message: "",
    },
  });
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await Staff.deleteOne({ _id: id });
    console.log(staff);
    if (staff.deletedCount === 0) {
      throw new Error("ไม่พบรหัสนี้ในระบบ");
    }
    res.status(200).json({
      status: "Success",
      message: "ลบข้อมูลเรียบร้อย",
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, salary } = req.body;

    // const staff = await Staff.findById(id);
    // staff.name = name;
    // await staff.save();
    // const staff = await Staff.findByIdAndUpdate(id, req.body);

    const staff = await Staff.updateOne({ _id: id }, req.body);

    if (staff.nModified === 0) {
      throw new Error("อัพเดพไม่สำเร็จ");
    }

    res.status(200).json({
      status: "Success",
      message: "แก้ไขข้อมูลเรียบร้อย",
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
};
