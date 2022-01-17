const { generateToken } = require('../auth/authConfig');
const { findUserByEmailModel, createUserModel } = require('../models/userModel');
const { bodySchema, loginSchema } = require('../schemas/schemas');
const { createErrorMessage } = require('../utils/functions');

const createUserService = async (body) => {
  const { error } = bodySchema.validate(body);
  if (error) throw createErrorMessage(400, error.message);
  const userFound = await findUserByEmailModel(body.email);
  if (userFound) throw createErrorMessage(409, 'Email already registered');
  const objToCreate = {
    ...body,
    role: 'user',
  };
  const { id } = await createUserModel(objToCreate);
  const { password, ...withOutPassword } = body;
  return {
    user: {
      ...withOutPassword,
      role: 'user',
      _id: id,
    },
  };
};

const loginService = async (body) => {
  const { error } = loginSchema.validate(body);
  if (error) throw createErrorMessage(401, error.message);
  const user = await findUserByEmailModel(body.email);
  if (!user || user.password !== body.password) {
    throw createErrorMessage(401, 'Incorrect username or password');
  }
  const { password, email, ...dataWithoutPassword } = user;
  const token = generateToken(dataWithoutPassword);
  return { token };
};

module.exports = {
  createUserService,
  loginService,
};