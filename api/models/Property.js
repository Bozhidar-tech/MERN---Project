import mongoose from 'mongoose';

const PropertySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    furnished:{
        type: Boolean,
        required: true
    },
    parking:{
        type: Boolean,
        required: true
    },
    gas: {
        type: Boolean,
        required: true
    },
    electricity: {
        type: Boolean,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    images: {
        type : Array,
        required: true
    },
    userRef: {
        type: String,
        required: true
    },
}, 
{timestamps: true}
)

export default mongoose.model('Property', PropertySchema);