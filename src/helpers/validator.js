import Joi from "joi"
import mongoose from "mongoose"

const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/
const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const idValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) return helpers.message("invalid id");
  return value;
};

const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .trim()
    .min(5)
    .regex(pattern)
    .required()
    .messages({
      'string.pattern.base': `password must contain at least one character upper case, lower case, number, and special character`,
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .trim()
    .required()
});

const courseSchema = Joi.object({
  subject: Joi.string()
    .trim()
    .required(),
  semester: Joi.number()
    .min(1)
    .max(8)
    .required(),
});

const referenceSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required(),
  channel: Joi.string()
    .trim()
    .required(),
  link: Joi.string()
    .trim()
    .required(),
  courseId: Joi.string()
    .trim()
    .custom(idValidation)
});

const idSchema = Joi.object({
  id: Joi.string()
    .trim()
    .custom(idValidation)
});

const idCourseSchema = Joi.object({
  courseId: Joi.string()
    .trim()
    .custom(idValidation),
  search: Joi.string()
    .trim(),
  skip: Joi.number(),
  limit: Joi.number(),
  page: Joi.number()
});

const validateRegister = validator(registerSchema)
const validateLogin = validator(loginSchema)
const validateCourse = validator(courseSchema)
const validateReference = validator(referenceSchema)
const validateId = validator(idSchema)
const validateIdCourse = validator(idCourseSchema)

export {
  validateRegister,
  validateLogin,
  validateCourse,
  validateReference,
  validateId,
  validateIdCourse
}