import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const register = async (req,res) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password:  hashedPassword
        });
        await user.save();
        return res.status(200).json({ message: "User registered successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(errorHandler(404, 'User not found!'));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return next(errorHandler(401, 'Wrong password!'));
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);
        const { password: pass, ...rest} = user._doc;
        res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);
    } catch (error) {
        next(error);
    }
};

export const googleLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const { password: pass,...rest} = user._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }else{
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 12);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                image: req.body.image
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const { password: pass,...rest} = newUser._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie('access_token').status(200).json({ message: "Logged out successfully!" });
} 

export const forgotPassword = async (req,res,next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) return next(errorHandler(404, 'User not found!'));

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '5m'});

        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "bozhidar.nunev@gmail.com",
                pass: "rernyyia crsladhh"
            }
        });

        let mailDetails = {
            from: "bozhidar.nunev@gmail.com",
            to: email,
            subject: "Reset Password",
            text: `http://localhost:5173/reset-password/${token}`
        };

        mailTransporter.sendMail(mailDetails, function(err, data) {
            if(err) {
                return next(errorHandler(500, 'Failed to send email!'));
            }
            res.status(200).json({message: "Email sent successfully!"});
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

        res.status(200).json({ message: 'Password has been reset successfully!' });
    } catch (error) {
        next(error);
    }
};