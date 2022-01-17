const { getAllRecipesModel } = require('../models/recipeModel');
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

const getAllRecipesController = async (_req, res, next) => {
  try {
    const allRecipes = await getAllRecipesModel();
    return res.status(200).json(allRecipes); 
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  createRecipeController,
  getAllRecipesController,
};