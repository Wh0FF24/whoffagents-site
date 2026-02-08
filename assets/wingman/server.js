const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const usageTracker = require('./usage-tracker');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve HTML files

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.GITHUB_COPILOT_API_KEY
});

// Rate limiting: track requests per IP
const rateLimits = new Map();
const RATE_LIMIT = 10; // Max 10 requests per hour per IP
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimits.get(ip) || [];
    const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
    
    if (recentRequests.length >= RATE_LIMIT) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimits.set(ip, recentRequests);
    return true;
}

app.post('/api/analyze', async (req, res) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || '';
        
        // Check rate limit
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
        }
        
        const { scenario, context, school } = req.body;
        
        if (!scenario) {
            return res.status(400).json({ error: 'Scenario required' });
        }
        
        // Check if user can use the service
        const userKey = usageTracker.getUserKey(ip, userAgent);
        const hasUsedFree = usageTracker.hasUsedFree(userKey);
        const hasCredits = usageTracker.hasCredits(userKey);
        
        if (hasUsedFree && !hasCredits) {
            return res.status(402).json({ 
                error: 'Free use already claimed. Buy credits to continue ($1 = 5 analyses)',
                requiresPayment: true,
                stripeLink: 'https://buy.stripe.com/8x25kD0LCeUJ57n2lHcs803'
            });
        }
        
        // Build prompt based on scenario
        const prompts = {
            'first-message': `You're a dating coach for college students${school ? ` at ${school}` : ''}. A guy just matched with a girl and needs a first message.

Context: ${context || 'No additional context provided'}

CRITICAL RULES:
- NEVER suggest coffee dates (coffee is boring and low-effort)
- Suggest activities: froyo, ice cream, dessert, mini golf, arcade, walk, hiking, etc.

Return your advice in this exact format:

MESSAGE:
[The exact first message he should send - 1-2 sentences]

WHY:
[Brief explanation of the strategy - 1 sentence]

NEXT:
[What to do after she responds - 1 sentence]

Keep it genuine, confident, not cringe. ${school === 'BYU' ? 'Keep it Mormon-culture appropriate.' : ''}`,
            
            'keep-going': `You're a dating coach. Analyze this conversation and suggest what to say next.

Conversation: ${context}

CRITICAL RULES:
- NEVER suggest coffee dates (coffee is boring and low-effort)
- Suggest activities: froyo, ice cream, dessert, mini golf, arcade, walk, hiking, etc.

Return your advice in this exact format:

MESSAGE:
[The next message he should send]

VIBE CHECK:
[How the conversation is going - 1 sentence]

TIP:
[One actionable tip - 1 sentence]`,
            
            'ask-out': `You're a dating coach. This guy needs to ask this girl out.

Context: ${context}

CRITICAL RULES:
- NEVER suggest coffee dates (coffee is boring and low-effort)
- Suggest fun, low-pressure activities: froyo, ice cream, dessert bar, mini golf, arcade, scenic walk, hiking
- Be specific with activity and timing

Return your advice in this exact format:

MESSAGE:
[The exact message to ask her out]

DATE IDEA:
[Specific activity, location suggestion, time - NO COFFEE]

BACKUP PLAN:
[What to do if she says maybe or needs to reschedule - 1 sentence]

Be direct and confident. Make it fun, not boring.`,
            
            'follow-up': `You're a dating coach. She said yes to the date, now what?

Context: ${context}

Return your advice in this exact format:

MESSAGE:
[Message to confirm plans]

KEEP IT WARM:
[Light conversation topic before the date - 1 sentence]

DAY-OF:
[One key tip for the actual date - 1 sentence]`
        };
        
        const prompt = prompts[scenario] || prompts['first-message'];
        
        // Call Claude API
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 400,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });
        
        const advice = response.content[0].text;
        
        // Record usage
        const totalUses = usageTracker.recordUsage(userKey, req.body.paid || false);
        
        res.json({
            advice,
            totalUses
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Analysis failed. Try again.' });
    }
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
    const stats = usageTracker.getStats();
    res.json(stats);
});

// Add credits endpoint (call this after successful Stripe payment)
app.post('/api/add-credits', (req, res) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || '';
        const userKey = usageTracker.getUserKey(ip, userAgent);
        
        const credits = usageTracker.addCredits(userKey, 5);
        res.json({ 
            success: true, 
            creditsAdded: 5, 
            totalCredits: credits 
        });
    } catch (error) {
        console.error('Error adding credits:', error);
        res.status(500).json({ error: 'Failed to add credits' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🤝 Wingman API running on port ${PORT}`);
});
