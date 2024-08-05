import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import { StatusCodes } from 'http-status-codes';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(StatusCodes.UNAUTHORIZED, 'You are not authorized.'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(StatusCodes.FORBIDDEN, 'Token is not valid!'));
    }

    req.user = user;
    next();
  });
};