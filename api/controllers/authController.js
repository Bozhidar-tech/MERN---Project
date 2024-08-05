import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const register = [
  body('username').isLength({ min: 3 }).withMessage('Потребителското име трябва да е поне 3 символа дълго.'),
  body('email').isEmail().withMessage('Невалиден имейл адрес.'),
  body('password').isLength({ min: 6 }).withMessage('Паролата трябва да е поне 6 символа дълга.'),

  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    
    try {
      const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }]
      });

      if (existingUser) {
        if (existingUser.username === req.body.username) {
          return res.status(StatusCodes.BAD_REQUEST).json({ errors: [{ msg: 'Потребителското име вече е заето.' }] });
        }
        if (existingUser.email === req.body.email) {
          return res.status(StatusCodes.BAD_REQUEST).json({ errors: [{ msg: 'Имейл адресът вече е зает.' }] });
        }
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      await user.save();
      return res.status(StatusCodes.OK).json({ message: "Регистрацията е успешна!" });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Възникна грешка, моля опитайте отново." });
    }
  }
];

export const login = [
  body('email').isEmail().withMessage('Невалиден имейл адрес.'),
  body('password').isLength({ min: 6 }).withMessage('Паролата трябва да е поне 6 символа дълга.'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return next(errorHandler(StatusCodes.NOT_FOUND, "Грешно име или парола!"));
      }

      const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordCorrect) {
        return next(errorHandler(StatusCodes.UNAUTHORIZED, "Грешно име или парола!"));
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password, ...userDetails } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(StatusCodes.OK)
        .json(userDetails);
    } catch (error) {
      next(error);
    }
  }
];

export const googleLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(StatusCodes.OK)
        .json(rest);
    } else {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        image: req.body.image,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(StatusCodes.OK)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token")
    .status(StatusCodes.OK)
    .json({ message: "Успешно излизане от акаунта!" });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(StatusCodes.NOT_FOUND, "Потребителят не е намерен!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailDetails = {
      from: "bozhidar.nunev@gmail.com",
      to: email,
      subject: "Смяна на парола",
      text: `http://localhost:5173/reset-password/${token}`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        return next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Неуспешно изпращане на съобщение!"));
      }
      res.status(StatusCodes.OK).json({ message: "Съобщението е изпратено успешно!" });
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(StatusCodes.OK).json({ message: "Паролата Ви бе променена успешно!" });
  } catch (error) {
    next(error);
  }
};

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Вече сте влезнали в акаунтът си." });
  } catch (err) {
    next();
  }
};
