import Property from '../models/Property.js';

export const addProperty = async (req, res, next) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json(property);
    } catch (error) {
        next(error);
    }
}