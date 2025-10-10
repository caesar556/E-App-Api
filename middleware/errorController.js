import express from 'express';
import AppError from '../utils/appError.js';

const handleDuplicateValuesDB = (err) => {
  const value = Object.values(err.keyValue).join(", ");
  const message = `Sorry, the value "${value}" is duplicated. Please try again with a different value.`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    Status: err.status,
    Error: err,
    Message: err.message,
    Stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      Status: err.status,
      Message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      Status: "error",
      Message: "Something went wrong! Please try again later.",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateValuesDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);

    sendErrorProd(error , res);
  }
};

export default globalErrorHandler;