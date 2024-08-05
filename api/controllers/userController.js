import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import Property from "../models/Property.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
import { StatusCodes } from 'http-status-codes';

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(StatusCodes.UNAUTHORIZED, "Можете да променяте единствено Вашият профил!"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          image: req.body.image,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(StatusCodes.OK).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(StatusCodes.UNAUTHORIZED, "Можете да изтриете единствено Вашият профил!"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(StatusCodes.OK).json({ message: "Профилът Ви бе изтрит успешно!" });
  } catch (error) {
    next(error);
  }
};

export const getUserProperties = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const properties = await Property.find({ userRef: req.params.id });
      res.status(StatusCodes.OK).json(properties);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(StatusCodes.UNAUTHORIZED, "Можете да преглеждате единствено собствените си обяви!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(StatusCodes.NOT_FOUND, "Потребителят не е намерен!"));

    const { password: pass, ...rest } = user._doc;
    res.status(StatusCodes.OK).json(rest);
  } catch (error) {
    next(error);
  }
};

export const sendContactForm = async (req, res, next) => {
  const { username, email, message } = req.body;

  if (!username || !email || !message) {
    return next(errorHandler(StatusCodes.BAD_REQUEST, "Всички полета са задължителни."));
  }

  try {
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailDetails = {
      from: email,
      to: "bozhidar.nunev@abv.bg",
      subject: `Contact Form Submission from ${username}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #2d3748;"> <!-- Background color set to gray-800 -->
        <div style="width: 100%; max-width: 700px; margin: 20px auto; background: #1a202c; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-top: 5px solid #38B2AC;"> <!-- Container background color set to gray-900 -->
            <h1 style="color: #38B2AC; margin-bottom: 20px; font-size: 28px; font-weight: bold; text-align: center;">Съобщение</h1>
            <p style="font-size: 16px; margin-bottom: 20px; color: #ddd;">Получено е съобщение чрез опцията за контакт в уебсайта</p>
            <div style="padding: 20px; background-color: #4a5568; border-radius: 5px; margin-bottom: 20px; border: 1px solid #2d3748;">
                <p style="margin: 10px 0; font-size: 16px; color: #e2e8f0;"><strong style="color: #38B2AC;">Име:</strong> ${username}</p>
                <p style="margin: 10px 0; font-size: 16px; color: #e2e8f0;"><strong style="color: #38B2AC;">Email:</strong> ${email}</p>
            </div>
            <div style="padding: 20px; background-color: #4a5568; border-radius: 5px; margin-bottom: 20px; border: 1px solid #2d3748;">
                <p style="margin: 10px 0; font-size: 16px; color: #e2e8f0;"><strong style="color: #38B2AC;">Съобщение:</strong></p>
                <p style="margin: 10px 0; font-size: 16px; color: #e2e8f0;">${message}</p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #a0aec0;">
                <p>Благодарим Ви, че се свързахте с нас. Ще се свържем с Вас възможно най-скоро.</p>
                <p>Ако имате въпроси или се нуждаете от допълнителна помощ, моля, отговорете на този имейл или се свържете с нас на <a href="mailto:${process.env.EMAIL_USER}" style="color: #38B2AC; text-decoration: none;">${process.env.EMAIL_USER}</a>.</p>
            </div>
        </div>
      </body>
      </html>
      `,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        return next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Неуспешно изпращане на съобщението"));
      }
      res.status(StatusCodes.OK).json({ message: "Съобщението е изпратено успешно!" });
    });
  } catch (error) {
    next(error);
  }
};