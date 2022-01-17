const express = require('express');
const { createRecipeController, 
  getAllRecipesController, 
  getRecipeByIdController, 
  updateRecipeController, 
  deleteRecipeController } = require('../controllers/recipesController');
const authMiddleware = require('../middlewares/authMiddleware');

const recipeRoute = express.Router();

recipeRoute.post('/', authMiddleware, createRecipeController);
recipeRoute.get('/', getAllRecipesController);
recipeRoute.get('/:id', getRecipeByIdController);
recipeRoute.put('/:id', authMiddleware, updateRecipeController);
recipeRoute.delete('/:id', authMiddleware, deleteRecipeController);

module.exports = recipeRoute;