const { connection } = require('./connection');

const createRecipesModel = async (recipe) => {
  const conn = await connection();
  const { insertedId } = await conn.collection('recipes').insertOne({ ...recipe });
  return { id: insertedId };
};

module.exports = {
  createRecipesModel,
};