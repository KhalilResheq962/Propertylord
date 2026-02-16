import mongoose from 'mongoose';
import Property from './src/models/property.js';
import { config } from './src/config/config.js';
const sampleProperties = [
    {
        title: 'Luxury Penthouse with Skyline View',
        description: 'A stunning penthouse featuring floor-to-ceiling windows, a private terrace, and high-end finishes throughout.',
        price: 1250000,
        location: 'Upper West Side, Manhattan',
        type: 'Apartment',
        bedrooms: 3,
        bathrooms: 3,
        images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=2070']
    },
    {
        title: 'Cozy Scandinavian Cottage',
        description: 'Experience minimalist living in this bright and airy cottage surrounded by nature. Perfect for a weekend getaway.',
        price: 620000,
        location: 'Portland, OR',
        type: 'House',
        bedrooms: 2,
        bathrooms: 1,
        images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=2070']
    },
    {
        title: 'Modern Industrial Loft',
        description: 'Authentic loft living with exposed brick, concrete floors, and soaring ceilings. Located in the heart of the arts district.',
        price: 890000,
        location: 'Downtown Los Angeles, CA',
        type: 'Loft',
        bedrooms: 1,
        bathrooms: 2,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=2070']
    },
    {
        title: 'Family Home with Spacious Backyard',
        description: 'Beautifully maintained family home with a large garden, modern kitchen, and open-plan living areas.',
        price: 750000,
        location: 'Austin, TX',
        type: 'House',
        bedrooms: 4,
        bathrooms: 2.5,
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070']
    }
];
const seedDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB for seeding...');
        await Property.deleteMany({});
        console.log('Cleared existing properties.');
        await Property.insertMany(sampleProperties);
        console.log('Successfully seeded database with sample properties.');
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDB();
//# sourceMappingURL=seed.js.map