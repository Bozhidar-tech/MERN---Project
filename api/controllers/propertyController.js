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

export const getProperties = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true]};
        };

        let parking = req.query.parking;
        
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true]};
        };

        let type = req.query.type;
        
        if (type === undefined || type === 'house') {
            type = 'house';
        };

        let gas = req.query.gas;
        
        if (gas === undefined || gas === 'false') {
            gas = { $in: [false, true]};
        };

        let electricity = req.query.electricity;
        
        if (electricity === undefined || electricity === 'false') {
            electricity = { $in: [false, true]};
        };

        const searchTerm = req.query.searchTerm || "";

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const properties = await Property.find({
            title: {$regex: searchTerm, $options: 'i'},
            type,
            furnished,
            parking,
            gas,
            electricity,
            location: {$regex: searchTerm, $options: 'i'}
        }).sort(
            { [sort]: order }
        ).limit(limit).skip(startIndex);

        res.status(200).json(properties);

        
    } catch (error) {
        next(error);
    }
};