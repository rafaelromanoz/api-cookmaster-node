const { ObjectID } = require('mongodb');
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
  if (!ObjectID.isValid(id)) throw createErrorMessage(404, 'recipe not found');
  const recipe = await getRecipeByIdModel(id);
  if (!recipe) throw createErrorMessage(404, 'recipe not found');
  return recipe;
};

const updateRecipeService = async (id, reqBody, userIdToken, role) => {
  if (!ObjectID.isValid(id)) throw createErrorMessage(400, 'id is not valid');
  const { error } = recipeSchema.validate(reqBody);
  if (error) throw createErrorMessage(400, error.message);
  const { userId } = await getRecipeByIdModel(id);
  const objIdFromToken = ObjectID(userIdToken);
  const objIdFromBd = ObjectID(userId);
  if (!objIdFromToken.equals(objIdFromBd) && role === 'user') {
    throw createErrorMessage(401, 'você precisa ser dono da receita ou precisa ser admin');
 }
 
  await updateRecipeModel(id, reqBody);
  return {
    _id: id,
    ...reqBody,
    userId: userIdToken,
  };
};

const insertImageRecipeService = async (id, image) => {
  const recipe = await getRecipeByIdModel(id);
  return {
    ...recipe,
    image: `localhost:3000/src/uploads/${image}`,
  };
};

module.exports = {
  createRecipesService,
  getRecipeByIdService,
  updateRecipeService,
  insertImageRecipeService,
};