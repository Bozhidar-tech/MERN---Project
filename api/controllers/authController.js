import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

