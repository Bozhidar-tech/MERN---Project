import User from '../models/User.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';
import bcrypt from 'bcryptjs';


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
        return res.status(200).json(CreateSuccess(user));
    } catch (error) {
        return res.status(500).json(CreateError(error.message));
    }
};