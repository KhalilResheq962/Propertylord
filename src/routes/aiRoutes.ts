import { Router } from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import { aiService } from '../services/aiService.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /ai/design
router.post('/design', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
    // ... existing logic ...
});

// POST /ai/analyze-3d
router.post('/analyze-3d', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const analysis = await aiService.analyze3DScan(req.file.buffer, req.file.mimetype);
        res.json(analysis);
    } catch (error) {
        console.error('Error in 3D analysis endpoint:', error);
        res.status(500).json({ message: 'Error analyzing 3D scan', error });
    }
});

// POST /ai/recommend
router.post('/recommend', async (req: Request, res: Response) => {
    try {
        const { requirements } = req.body;
        console.log('--- AI Recommendation Request ---');
        console.log('User Input:', requirements);
        const filters = await aiService.parseRequirements(requirements);
        console.log('AI Parsed Filters:', filters);
        res.json(filters);
    } catch (error) {
        res.status(500).json({ message: 'Error generating recommendations', error });
    }
});

export default router;
