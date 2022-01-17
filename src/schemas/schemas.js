const Joi = require('joi');

const messageSchema = 'Invalid entries. Try again.';
const bodySchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': messageSchema,
  }),
  email: Joi.string().email().required().messages({
    'string.email': messageSchema,
    'any.required': messageSchema,
  }),
  password: Joi.string().required().messages({
    'any.required': messageSchema,
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'All fields must be filled',
  }),
  password: Joi.string().required().messages({
    'any.required': 'All fields must be filled',
  }),
});

const recipeSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': messageSchema,
  }),
  ingredients: Joi.string().required().messages({
    'any.required': messageSchema,
  }),
  preparation: Joi.string().required().messages({
    'any.required': messageSchema,
  }),
});

module.exports = {
  bodySchema,
  loginSchema,
  recipeSchema,
};