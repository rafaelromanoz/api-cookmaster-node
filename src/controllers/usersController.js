const { createUserService, loginService } = require('../services/usersService');

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

module.exports = {
  createUserController, 
  loginController,
};