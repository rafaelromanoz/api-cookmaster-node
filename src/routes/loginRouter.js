const express = require('express');
const { loginController } = require('../controllers/usersController');

const loginRoute = express.Router();

loginRoute.post('/', loginController);

module.exports = loginRoute;