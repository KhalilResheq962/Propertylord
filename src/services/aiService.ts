import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey || '');

export class AIService {
    private model;

    constructor() {
        this.model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    }

    async analyzeRoom(imageBuffer: Buffer, mimeType: string): Promise<any> {
        const prompt = `
            Analyze this room image for an interior design application.
            Identify the architectural style (e.g., Modern, Classic, Scandinavian).
            Suggest 3-5 furniture items that would fit this room, including their ideal relative position (x, y, z coordinates where x/z are floor plane, y is height) assuming the room center is 0,0,0.
            Estimate the room dimensions (width, length, height) in meters.

            Return ONLY a valid JSON object with this structure:
            {
                "style": "string",
                "furnitureSuggestions": [
                    { "item": "string", "confidence": number, "position": { "x": number, "y": number, "z": number } }
                ],
                "roomDimensions": { "width": number, "length": number, "height": number }
            }
        `;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType
            }
        };

        try {
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            
            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('AI Analysis failed:', error);
            throw new Error('Failed to analyze room image');
        }
    }

    async analyze3DScan(imageBuffer: Buffer, mimeType: string): Promise<any> {
        const prompt = `
            Analyze this panoramic or wide-angle image of an apartment space as a structural engineer and lighting expert.
            1. Describe the spatial layout and flow between zones (e.g., "Open concept connecting kitchen and living area").
            2. Analyze the natural lighting sources and coverage.
            3. Identify potential structural features (columns, beams, load-bearing walls).
            4. Detect any visible safety hazards or maintenance issues.

            Return ONLY a valid JSON object with this structure:
            {
                "layoutAnalysis": "string",
                "lightingAnalysis": "string",
                "structuralFeatures": ["string"],
                "safetyNotes": ["string"]
            }
        `;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType
            }
        };

        try {
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('3D Analysis failed:', error);
            throw new Error('Failed to analyze 3D scan');
        }
    }

    async parseRequirements(userInput: string): Promise<any> {
        try {
            // Use models/gemini-1.5-flash which is the standard stable text model
            const textModel = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
            const prompt = `
            You are a Jordan real estate AI expert. Convert the user request into strict search filters.
            
            REQUEST: "${userInput}"
            
            EXTRACTION RULES:
            - "family of 4" -> minBedrooms: 3 (Master + 2 bedrooms)
            - "family of 5" -> minBedrooms: 4
            - "villa" or "house" -> propertyType: "house"
            - "apartment" -> propertyType: "apartment"
            - If an area is mentioned (e.g. "Abdoun"), area: "Abdoun"
            
            Return ONLY valid JSON:
            {
                "area": string | null,
                "minPrice": number | null,
                "maxPrice": number | null,
                "minBedrooms": number | null,
                "propertyType": "apartment" | "house" | "condo" | null,
                "status": "for-sale" | "for-rent" | null,
                "explanation": "Briefly explain the logic (e.g. 'Since you have a family of 4, I searched for villas with at least 3 bedrooms in Abdoun.')"
            }
        `;

            const result = await textModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('Failed to parse requirements:', error);
            return { explanation: "I'll show you all properties based on your request." };
        }
    }
}

export const aiService = new AIService();