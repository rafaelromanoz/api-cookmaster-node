const express = require('express');
const { createUserController, createAdminController } = require('../controllers/usersController');
const authMiddlewareAdmin = require('../middlewares/authMiddlewareAdmin');

const usersRoute = express.Router();

usersRoute.post('/', createUserController);
usersRoute.post('/admin', authMiddlewareAdmin, createAdminController);

module.exports = usersRoute;