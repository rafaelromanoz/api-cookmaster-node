const { createUserService, loginService, createAdminService } = require('../services/usersService');

const createUserController = async (req, res, next) => {
  try {
    const userCreated = await createUserService(req.body);
    return res.status(201).json(userCreated);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const token = await loginService(req.body);
    return res.status(200).json(token);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const createAdminController = async (req, res, next) => {
  try {
    const { role } = req;
    const user = await createAdminService(role, req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  createUserController, 
  loginController,
  createAdminController,
};