const express = require('express');
const { upload } = require('../config/uploadConfig');
const { createRecipeController, 
  getAllRecipesController, 
  getRecipeByIdController, 
  updateRecipeController, 
  deleteRecipeController, 
  insertImageRecipeController } = require('../controllers/recipesController');
const authMiddleware = require('../middlewares/authMiddleware');

const recipeRoute = express.Router();

recipeRoute.post('/', authMiddleware, createRecipeController);
recipeRoute.get('/', getAllRecipesController);
recipeRoute.get('/:id', getRecipeByIdController);

recipeRoute.put('/:id', authMiddleware, updateRecipeController);
recipeRoute.delete('/:id', authMiddleware, deleteRecipeController);
recipeRoute.put('/:id/image', authMiddleware, upload.single('image'), insertImageRecipeController);

module.exports = recipeRoute;