const express = require('express');
const path = require('path');
const errorHandler = require('../middlewares/errorHandler');
const loginRoute = require('../routes/loginRouter');
const recipeRoute = require('../routes/recipesRouter');
const usersRoute = require('../routes/userRouter');

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/users', usersRoute);
app.use('/login', loginRoute);
app.use('/recipes', recipeRoute);

app.get('/', (request, response) => {
  response.send();
});

app.use(errorHandler);

module.exports = app;
