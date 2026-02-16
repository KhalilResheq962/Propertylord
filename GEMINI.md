# Project: Property Finder AI
## Core Goals
- Build a real estate app using Node.js (ESM) and JavaScript.
- **Feature: AI Interior Designer**: Allow users to upload room photos for instant AI-driven furniture suggestions (chairs, tables, beds) based on selected styles (Modern, Classic, etc.).
- **Feature: 3D Analysis**: Integrate 3D apartment scan analysis using Gemini 3 Vision.
- **Feature: Maps Integration**: Use Google Maps API for distance and location features.

## AI Interior Design Guidelines (Vision Tasks)
- **Spatial Reasoning**: The agent must analyze room photos to identify walls, windows, and existing traffic flow before suggesting furniture.
- **Style Customization**: Support distinct design aesthetics including Modern, Classic, Scandinavian, and Industrial.
- **Multimodal Prompting**: When processing images, use clear anchors like "Scandinavian living room with oak flooring" to guide the AI's output.
- **Accuracy**: Provide approximate spatial relationships; do not claim 100% measurement accuracy from 2D photos.

## Coding Standards
- **Stack**: Modern JavaScript (ESM). No `require()`.
- **Security**: DO NOT modify or open `.env` files. Always use `process.env` for API keys.
- **Architecture**: Plan file structures in a separate "Thought" block before writing code.

### Aditional Coding Preferences
- Keep project dependencies minimal.