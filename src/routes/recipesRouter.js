const express = require('express');
const { createRecipeController, 
  getAllRecipesController } = require('../controllers/recipesController');
const authMiddleware = require('../middlewares/authMiddleware');

const recipeRoute = express.Router();

recipeRoute.post('/', authMiddleware, createRecipeController);
recipeRoute.get('/', getAllRecipesController);

module.exports = recipeRoute;