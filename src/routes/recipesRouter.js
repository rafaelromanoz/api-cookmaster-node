const express = require('express');
const { createRecipeController, 
  getAllRecipesController, 
  getRecipeByIdController } = require('../controllers/recipesController');
const authMiddleware = require('../middlewares/authMiddleware');

const recipeRoute = express.Router();

recipeRoute.post('/', authMiddleware, createRecipeController);
recipeRoute.get('/', getAllRecipesController);
recipeRoute.get('/:id', getRecipeByIdController);

module.exports = recipeRoute;