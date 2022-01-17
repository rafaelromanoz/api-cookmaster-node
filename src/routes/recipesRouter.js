const express = require('express');
const { createRecipeController } = require('../controllers/recipesController');
const authMiddleware = require('../middlewares/authMiddleware');

const recipeRoute = express.Router();

recipeRoute.post('/', authMiddleware, createRecipeController);

module.exports = recipeRoute;