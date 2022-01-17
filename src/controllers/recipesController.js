const { getAllRecipesModel, deleteRecipeModel } = require('../models/recipeModel');
const { createRecipesService, 
  getRecipeByIdService, 
  updateRecipeService, insertImageRecipeService } = require('../services/recipesService');

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

const getRecipeByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipeById = await getRecipeByIdService(id);
    return res.status(200).json(recipeById); 
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const updateRecipeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const recipeUpdated = await updateRecipeService(id, req.body, _id);
    return res.status(200).json(recipeUpdated);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const deleteRecipeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteRecipeModel(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const insertImageRecipeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filename } = req.file;
    const recipe = await insertImageRecipeService(id, filename);
    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  createRecipeController,
  getAllRecipesController,
  getRecipeByIdController,
  updateRecipeController,
  deleteRecipeController,
  insertImageRecipeController,
};