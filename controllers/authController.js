import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import { SUCCESS } from '../utils/httpStatus.js';
import AppError from '../utils/appError.js';
import { User } from '../models/userModel.js';
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from '../utils/tokensGenerators.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false
}

const sendResponse = async (res, user, code, next) => {
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const accessTokenOptions = {
    ...cookieOptions,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000
  }
  const refreshTokenOptions = {
    ...cookieOptions,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }


  const userUpdated = await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { new: true }
  );
  if (!userUpdated) {
    return next(new AppError("Refresh Token Error", 500));
  }
  user.password = undefined;

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("jwt", refreshToken, refreshTokenOptions);
  res.cookie("role", user.role, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000
  });

  res.status(code).json({
    Status: SUCCESS,
    Data: { user }
  })

}

export const login = errorHandler(
  async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError("Please provide your Email and password", 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return next(new AppError("Your Email or password incorrect", 401));

    sendResponse(res, user, 200, next);
  }
);

export const signUp = errorHandler(
  async (req, res, next) => {
    const newUser = await User.create({ ...req.body });

    sendResponse(res, newUser, 201, next);
  }
);

export const checkIfAdmin = errorHandler(
  async (req, res, next) => {
    const { user } = req;
    if (user.role !== "admin") {
      return next(new AppError("You are not an admin", 403));
    } else next();
  }
);



export const refresh = errorHandler(
  async (req, res, next) => {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return next(new AppError("Sorry you are not logged in, log in and try again", 401));

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
      if (err) return next(new AppError("Your token is not valid", 403));

      const existingUser = await User.findOne({ _id: decoded.id, refreshToken });

      if (!existingUser) return next(new AppError("Not found the user", 404));

      const newAccessToken = generateToken(existingUser._id);

      const newTokenOptions = {
        ...cookieOptions,
        maxAge: 10 * 60 * 1000
      }

      res.cookie("accessToken", newAccessToken, newTokenOptions);


      return res.status(200).json({
        Status: SUCCESS,
        Data: { existingUser }
      })
    });
  }
);

export const logout = errorHandler(
  async (req, res, next) => {
    if (!req.cookies.jwt) {
      res.clearCookie('jwt', cookieOptions);
      res.clearCookie('accessToken', cookieOptions);
      return res.status(204).json({ Status: SUCCESS });
    }

    const refreshToken = req.cookies.jwt;

    const existUser = await User.findOne({ refreshToken });

    if (!existUser) {
      res.clearCookie('jwt', cookieOptions);
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie("role", cookieOptions);
      
      return res.status(204).json({ Status: SUCCESS });
    }

    await User.findByIdAndUpdate(existUser._id, { refreshToken: "" }, { new: true });

    res.status(200).json({ Status: SUCCESS })
  }
);


export const protect = errorHandler(
  async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return next(new AppError("You're not logged in, login to get access", 401));

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) return next(new AppError("Token expired please login again.", 401));
      return next(new AppError("Invalid token please log in again.", 401));
    }

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) return next(new AppError("The user belonging to this token does no longer exist", 401));

    req.user = currentUser;

    next();
  }
);
