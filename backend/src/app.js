const express = require('express');
const cors = require('cors');
const apiRouter = require('./api/routes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./api/middlewares/error.handler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Skill Assessment API is running.' });
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler for routes not found
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;