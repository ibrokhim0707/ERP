const express = require('express');
const todoRoutes = require('./todos');
const userRoutes = require('./users')
const guideRoutes = require('./guides')
const authRoutes = require('./auth')

const router = express.Router();

router.use(todoRoutes);
router.use(userRoutes);
router.use(guideRoutes);
router.use(authRoutes)


module.exports = router