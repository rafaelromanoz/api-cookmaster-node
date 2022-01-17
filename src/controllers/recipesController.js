const { createRecipesService } = require('../services/recipesService');

const createRecipeController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const recipe = await createRecipesService(req.body, _id);
    return res.status(201).json(recipe);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  createRecipeController,
};