const { connection } = require('./connection');

const findUserByEmailModel = async (email) => {
  const conn = await connection();
  const userWithEmailFound = await conn.collection('users').findOne({ email });
  return userWithEmailFound;
};

const createUserModel = async (user) => {
  const conn = await connection();
  const { insertedId } = await conn.collection('users').insertOne({ ...user });
  return { id: insertedId };
};

module.exports = {
  findUserByEmailModel,
  createUserModel,
};