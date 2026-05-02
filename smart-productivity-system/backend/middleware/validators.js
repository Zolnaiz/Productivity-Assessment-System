const { body } = require("express-validator");

exports.loginValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password required"),
];

exports.taskValidator = [
  body("title").optional().trim().notEmpty().withMessage("Title is required"),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"]).withMessage("Invalid status"),
];

exports.commentValidator = [body("text").trim().notEmpty().withMessage("Comment text is required")];
