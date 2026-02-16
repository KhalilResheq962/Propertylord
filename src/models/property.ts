import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
    address: string;
    price: number;
    description: string;
    type: 'house' | 'apartment' | 'condo';
    status: 'for-sale' | 'for-rent';
    bedrooms: number;
    bathrooms: number;
    virtualTourUrl?: string;
    images: string[];
    aiAnalysis?: {
        style?: string;
        furnitureSuggestions?: Array<{
            item: string;
            confidence: number;
            position?: { x: number; y: number; z: number };
        }>;
        roomDimensions?: {
            width: number;
            length: number;
            height: number;
        };
    };
    location?: {
        type: string;
        coordinates: number[]; // [longitude, latitude]
    };
    createdAt: Date;
}

const PropertySchema: Schema = new Schema({
    address: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['house', 'apartment', 'condo'], 
        required: true 
    },
    status: {
        type: String,
        enum: ['for-sale', 'for-rent'],
        default: 'for-sale'
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    virtualTourUrl: { type: String },
    images: [{ type: String }], // URLs to images
    aiAnalysis: {
        style: String,
        furnitureSuggestions: [{
            item: String,
            confidence: Number,
            position: { x: Number, y: Number, z: Number }
        }],
        roomDimensions: {
            width: Number,
            length: Number,
            height: Number
        }
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    }
}, {
    timestamps: true
});

export default mongoose.model<IProperty>('Property', PropertySchema);
