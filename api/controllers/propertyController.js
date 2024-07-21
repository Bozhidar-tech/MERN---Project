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
      let parking = req.query.parking;
      let type = req.query.type;
      let gas = req.query.gas;
      let electricity = req.query.electricity;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true]};
      }
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true]};
      }
  
      if (type === undefined || type === 'all') {
        type = { $in: ['house', 'apartment'] };
      }
  
      if (gas === undefined || gas === 'false') {
        gas = { $in: [false, true]};
      }
  
      if (electricity === undefined || electricity === 'false') {
        electricity = { $in: [false, true]};
      }
  
      const searchTerm = req.query.searchTerm || '';
      const location = req.query.location || '';
  
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order || 'desc';
  
      const properties = await Property.find({
        $and: [
          searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {},
          location ? { location: { $regex: location, $options: 'i' } } : {},
          type ? { type } : {},
          furnished !== undefined ? { furnished } : {},
          parking !== undefined ? { parking } : {},
          gas !== undefined ? { gas } : {},
          electricity !== undefined ? { electricity } : {}
        ]
      })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
  
      return res.status(200).json(properties);
    } catch (error) {
      next(error);
    }
  };
