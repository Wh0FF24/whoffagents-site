const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Rate limiting via DynamoDB or in-memory (simplified for Lambda)
const rateLimits = new Map();

app.post('/api/analyze', async (req, res) => {
    // Same logic as server.js but Lambda-optimized
    // ... (keeping it simple for now)
    res.json({ message: "Lambda endpoint working" });
});

module.exports.handler = serverless(app);
