import mongoose from 'mongoose';
import Property from './src/models/property.js';
import { config } from './src/config/config.js';

const checkDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    const count = await Property.countDocuments();
    const props = await Property.find({});
    console.log(`Total properties in DB: ${count}`);
    console.log('Full List:', JSON.stringify(props, null, 2));
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

checkDB();