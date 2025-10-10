import jwt from "jsonwebtoken";


const JWT_EXPIRES = "20m";

const REFRESH_TOKEN_EXPIRES = "3d";


export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES
  });
}

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRES
  });
}