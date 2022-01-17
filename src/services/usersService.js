const { findUserByEmailModel, createUserModel } = require('../models/userModel');
const { bodySchema } = require('../schemas/schemas');
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

module.exports = {
  createUserService,
};