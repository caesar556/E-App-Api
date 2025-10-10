import  express from 'express';

export const errorHandler = (fn) => {
  return async (req, res, next) => {
    fn(req, res, next).catch(next)
  };
};