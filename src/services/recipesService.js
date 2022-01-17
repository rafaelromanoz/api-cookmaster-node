const { createRecipesModel } = require('../models/recipeModel');
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

module.exports = {
  createRecipesService,
};