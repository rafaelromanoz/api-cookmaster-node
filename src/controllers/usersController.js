const { createUserService } = require('../services/usersService');

const createUserController = async (req, res, next) => {
  try {
    const userCreated = await createUserService(req.body);
    return res.status(201).json(userCreated);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};
module.exports = {
  createUserController, 
};