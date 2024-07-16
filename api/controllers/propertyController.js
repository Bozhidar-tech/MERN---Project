import Property from '../models/Property.js';
import { errorHandler } from '../utils/error.js';

export const addProperty = async (req, res, next) => {
    try {
        const property = await Property.create(req.body);
        return res.status(201).json(property);
    } catch (error) {
        next(error);
    }
};

export const deleteProperty = async (req, res, next) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        return next(errorHandler(404, 'Property not found!'));
    };

    if(req.user.id !== property.userRef){
        return next(errorHandler(403, 'Unauthorized to delete this property!'));
    };

    try {
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Property deleted successfully!' });
    } catch (error) {
        next(error);
    }
};

export const editProperty = async (req, res, next) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        return next(errorHandler(404, 'Property not found!'));
    };

    if(req.user.id !== property.userRef){
        return next(errorHandler(403, 'Unauthorized to edit this property!'));
    };

    try {
        const editedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(editedProperty);
    } catch (error) {
        next(error);
    }
};

export const getProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if(!property) {
            return next(errorHandler(404, 'Property not found!'));
        }
        res.status(200).json(property);
    } catch (error) {
        next(error);
    }
};