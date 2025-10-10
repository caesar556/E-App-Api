import AppError from '../utils/appError.js';
import { Model, Document } from "mongoose";
import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import { SUCCESS } from '../utils/httpStatus.js';
import ApiFeatures from '../utils/APIFeatures.js';

export const createDoc = (model) => errorHandler(
  async (req, res, next) => {
    const userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return next(new AppError("No data provided", 400));
    }
    const newUser = await model.create(userData);

    res.status(201).json({
      status: SUCCESS,
      data: newUser
    })
  }
);

export const getSingleDoc = (model) => errorHandler(
  async (req, res) => {
    const { id } = req.params;
    const singleDoc = await model.findById(id);
    res.status(200).json({
      status: SUCCESS,
      data: singleDoc
    })
  }
);

export const deleteDoc = (model) => errorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const doc = await model.deleteOne({ _id: id });
    if (!doc) return next(new AppError("No document found with this id", 404));
    res.status(200).json({
      status: SUCCESS,
      data: null
    })
  }
);

export const updateDoc = (model) => errorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const updatedDoc = await model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDoc) return next(new AppError("No document found with this id", 404));
    res.status(200).json({
      status: SUCCESS,
      data: updatedDoc
    })
  }
);

export const getAllDoc = (model) => errorHandler(
  async (req, res) => {
    const totalDocs = await model.countDocuments();
    
    const apiFeatures = await new ApiFeatures(req.query, model.find())
    .limitFields()
    .paginate()
    .filter()
    .sort()
    
    const docs = await apiFeatures.query;
    
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalDocs / limit);
    
    res.status(200).json({
      status: SUCCESS,
      pagination : {
        currentPage : page,
        limit,
        totalPages,
        totalResults : totalDocs,
        hasNextPage : page < totalPages,
        hasPervPage : page > 1
      },
      data: docs
    })
  }
);

export const getDocsByField = (model, fieldName, refModel = null, refField = "_id", paramName = fieldName) => errorHandler(
  async (req, res, next) => {
    const fieldValue = req.params[paramName];

    let filterValue = fieldValue;

    if (refModel) {
      const refDoc = await refModel.findOne({ slug: fieldValue });
      if (!refDoc) return next(new AppError(`${fieldName} not found`, 404));
      filterValue = refDoc[refField];
    }
    const docs = await new ApiFeatures(req.query, model.find({ [fieldName]: filterValue })).limitFields().query;
    
    res.status(200).json({
      status: SUCCESS,
      data: docs
    });
  }
);