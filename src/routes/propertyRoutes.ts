import { Router } from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Property from '../models/property.js';
import { aiService } from '../services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure disk storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET /properties
router.get('/', async (req: Request, res: Response) => {
    try {
        const properties = await Property.find();
        console.log(`--- Fetching All Properties ---`);
        console.log(`Count in DB: ${properties.length}`);
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error });
    }
});

// POST /properties
router.post('/', upload.array('images', 5), async (req: Request, res: Response): Promise<any> => {
    console.log('--- Property Creation Request Received ---');
    console.log('Body:', req.body);
    console.log('Files:', (req.files as any[])?.length || 0);
    try {
        const propertyData = req.body;
        
        // Handle coordinates if they come as strings (from FormData)
        if (typeof propertyData.location === 'string') {
            propertyData.location = JSON.parse(propertyData.location);
        } else if (propertyData['location.type']) {
            // Handle flat FormData fields if necessary
            propertyData.location = {
                type: propertyData['location.type'],
                coordinates: [Number(propertyData['location.lng']), Number(propertyData['location.lat'])]
            };
        }

        // Process uploaded files
        const imageUrls = (req.files as Express.Multer.File[])?.map(file => {
            // Return the path that the frontend can use
            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        }) || [];

        const newProperty = new Property({
            ...propertyData,
            images: imageUrls.length > 0 ? imageUrls : propertyData.images // Use uploaded or existing
        });

        const savedProperty = await newProperty.save();
        res.status(201).json(savedProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ message: 'Error creating property', error });
    }
});

// POST /properties/:id/analyze
router.post('/:id/analyze', multer({ storage: multer.memoryStorage() }).single('image'), async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const analysis = await aiService.analyzeRoom(req.file.buffer, req.file.mimetype);
        property.aiAnalysis = analysis;
        await property.save();

        res.json(analysis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error analyzing property', error });
    }
});

export default router;