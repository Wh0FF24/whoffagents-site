# Wingman Deployment Instructions

## Option 1: Vercel (Recommended - FREE)

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login` (use your email)
3. Deploy: `vercel --prod`
4. Set environment variable: `vercel env add ANTHROPIC_API_KEY`
   - Value: Your Claude API key
5. Done! You'll get a URL like: wingman-xxx.vercel.app

## Option 2: AWS Lambda (Manual)

1. Run: `npm install`
2. Zip everything: `zip -r wingman.zip .`
3. Go to AWS Lambda Console
4. Create function → Upload zip
5. Set ANTHROPIC_API_KEY environment variable
6. Create API Gateway trigger
7. Done!

## Option 3: Railway (Also FREE)

1. Go to railway.app
2. New Project → Deploy from GitHub
3. Connect this repo
4. Set ANTHROPIC_API_KEY env variable
5. Deploy!

## After Deployment

1. Update frontend URLs to point to your API
2. Test with: `curl -X POST https://your-url/api/analyze -d '{"scenario":"first-message"}'`
3. Add domain: whoffagents.com/wingman
