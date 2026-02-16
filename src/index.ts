import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';
import { connectDB } from './config/database.js';
import { logger } from './middleware/logger.js';
import propertyRoutes from './routes/propertyRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(logger);

// Connect to Database
connectDB();

// Routes
app.use('/properties', propertyRoutes);
app.use('/ai', aiRoutes);
app.use('/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Property App API is running');
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});