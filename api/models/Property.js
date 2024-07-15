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
    type:{
        type: String,
        required: true
    },
    images: {
        type : Array,
        required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
}, {
    timestamps: true,
})

export default mongoose.model('Property', PropertySchema);