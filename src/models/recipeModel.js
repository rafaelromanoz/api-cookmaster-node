const { connection } = require('./connection');

const createRecipesModel = async (recipe) => {
  const conn = await connection();
  const { insertedId } = await conn.collection('recipes').insertOne({ ...recipe });
  return { id: insertedId };
};

const getAllRecipesModel = async () => {
  const conn = await connection();
  const allRecipes = await conn.collection('recipes').find({}).toArray();
  return allRecipes;
};

module.exports = {
  createRecipesModel,
  getAllRecipesModel,
};