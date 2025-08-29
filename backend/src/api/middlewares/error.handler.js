const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    console.error('ERROR 💥', err);
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Optional: show stack in dev
    });
  };
  
  module.exports = globalErrorHandler;