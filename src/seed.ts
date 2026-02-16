import mongoose from 'mongoose';
import Property from './models/property.js';
import { config } from './config/config.js';

const sampleProperties = [
  {
    _id: new mongoose.Types.ObjectId('65c8f8f8f8f8f8f8f8f8f8f1'),
    address: 'The Ritz-Carlton Residences, Amman, Jordan',
    description: 'Experience unparalleled luxury in the heart of Amman. This residence offers world-class amenities, breathtaking city views, and sophisticated interior design. Fully serviced by the Ritz-Carlton staff.',
    price: 1500000,
    type: 'apartment',
    status: 'for-sale',
    bedrooms: 4,
    bathrooms: 5,
    virtualTourUrl: 'https://my.matterport.com/show/?m=9S6nKxWfW5n',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070'],
    location: { type: 'Point', coordinates: [35.885, 31.955] }
  },
  {
    _id: new mongoose.Types.ObjectId('65c8f8f8f8f8f8f8f8f8f8f2'),
    address: 'Luxury Villa, Abdoun, Amman',
    description: 'Modern villa with a private pool and spacious garden. High-end finishes and smart home features.',
    price: 850000,
    type: 'house',
    status: 'for-sale',
    bedrooms: 5,
    bathrooms: 4,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2071'],
    location: { type: 'Point', coordinates: [35.885, 31.935] }
  },
  {
    _id: new mongoose.Types.ObjectId('65c8f8f8f8f8f8f8f8f8f8f3'),
    address: 'Dabouq Modern Loft, Amman',
    description: 'Elegant apartment with city views. Minimalist design and great location.',
    price: 250000,
    type: 'apartment',
    status: 'for-sale',
    bedrooms: 3,
    bathrooms: 3,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070'],
    location: { type: 'Point', coordinates: [35.825, 31.985] }
  },
  {
    _id: new mongoose.Types.ObjectId('65c8f8f8f8f8f8f8f8f8f8f4'),
    address: 'Traditional House, Jabal Al-Weibdeh',
    description: 'Charming renovated house in Amman\'s art district. Perfect for artistic souls.',
    price: 1200,
    type: 'house',
    status: 'for-rent',
    bedrooms: 2,
    bathrooms: 1,
    images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=2070'],
    location: { type: 'Point', coordinates: [35.918, 31.958] }
  },
  {
    _id: new mongoose.Types.ObjectId('65c8f8f8f8f8f8f8f8f8f8f5'),
    address: 'Family Apartment, 7th Circle',
    description: 'Spacious 3-bedroom apartment near all amenities. Ideal for families.',
    price: 800,
    type: 'apartment',
    status: 'for-rent',
    bedrooms: 3,
    bathrooms: 2,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=2070'],
    location: { type: 'Point', coordinates: [35.865, 31.952] }
  },
  {
    _id: new mongoose.Types.ObjectId('65c8f8f8f8f8f8f8f8f8f8f6'),
    address: 'Jabal Amman, منطقة المدينة, Amman, Jordan',
    price: 90000,
    description: 'Quiet area, 2nd floor, modern finishes.',
    type: 'apartment',
    status: 'for-sale',
    bedrooms: 3,
    bathrooms: 2,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d988?auto=format&fit=crop&q=80&w=2070'],
    location: { type: 'Point', coordinates: [35.928, 31.946] }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB for seeding...');
    await Property.deleteMany({});
    console.log('Cleared existing properties.');
    await Property.insertMany(sampleProperties);
    console.log('Successfully seeded database with 6 stable properties.');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();