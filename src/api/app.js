const express = require('express');
const path = require('path');
const errorHandler = require('../middlewares/errorHandler');
const usersRoute = require('../routes/userRouter');

const app = express();

// Não remover esse end-point, ele é necessário para o avaliador
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/users', usersRoute);

app.get('/', (request, response) => {
  response.send();
});

app.use(errorHandler);
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
