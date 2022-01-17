const { ObjectId } = require('mongodb');
const { createRecipesModel, 
  getRecipeByIdModel, 
  updateRecipeModel } = require('../models/recipeModel');
const { recipeSchema } = require('../schemas/schemas');
const { createErrorMessage } = require('../utils/functions');

const createRecipesService = async (recipe, idUser) => {
  const { error } = recipeSchema.validate(recipe);
  if (error) throw createErrorMessage(400, error.message);
  const createdRecipe = {
    ...recipe,
    userId: idUser,
  };
  const { id } = await createRecipesModel(createdRecipe);
  return {
    recipe: {
      _id: id,
      ...recipe,
      userId: idUser,
    },
  };
};

const getRecipeByIdService = async (id) => {
  if (!ObjectId.isValid(id)) throw createErrorMessage(404, 'recipe not found');
  const recipe = await getRecipeByIdModel(id);
  if (!recipe) throw createErrorMessage(404, 'recipe not found');
  return recipe;
};

const updateRecipeService = async (id, reqBody, userId) => {
  const { error } = recipeSchema.validate(reqBody);
  if (error) throw createErrorMessage(400, error.message);
  await updateRecipeModel(id, reqBody);
  return {
    _id: id,
    ...reqBody,
    userId,
  };
};

module.exports = {
  createRecipesService,
  getRecipeByIdService,
  updateRecipeService,
};