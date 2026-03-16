# AI Automation Setup Guide
### How to Automate Your First 5 Business Workflows in a Weekend
**From Whoff Agents · whoffagents.com**

---

## Who This Guide Is For

You're a small business owner, freelancer, or solo operator. You've heard AI can save you hours every week. You've maybe tried ChatGPT a few times. But you haven't actually *automated* anything — it's still manual, still you typing the same things over and over.

This guide changes that.

By the end, you'll have five real automations running in your business. Not demos. Not experiments. Actual systems that work while you sleep.

**What you need:**
- A free Make.com account (we'll use the free tier — no credit card)
- A free Zapier account (optional — same concepts apply)
- An OpenAI or Anthropic Claude API key (under $5/month at your volume)
- 4-6 hours on a weekend

**What you'll build:**
1. Email triage and routing (saves ~1 hour/day)
2. Lead capture and follow-up (never lose a warm lead again)
3. Social media post drafting (batch a week's content in 20 minutes)
4. Customer FAQ auto-responder (handle 80% of support without you)
5. Weekly business review digest (know your numbers without manual pulling)

---

## PART 1: Foundation — Setting Up Your AI Stack

### Step 1: Create Your API Key

**For Claude (Anthropic) — Recommended:**
1. Go to console.anthropic.com
2. Create a free account
3. Navigate to API Keys → Create Key
4. Copy your key — store it in a password manager, never share it
5. Add $10 credit to start (will last months at small business volume)

**For OpenAI (GPT-4):**
1. Go to platform.openai.com
2. Create account → API Keys → Create new key
3. Add $10 credit

**Which to use?** Claude is better for writing tasks (emails, content). GPT-4 is better for structured data extraction. This guide uses Claude for writing workflows.

### Step 2: Create Your Make.com Account

1. Go to make.com and create a free account
2. Free tier includes: 1,000 operations/month, 2 active scenarios
3. For most small businesses, the $9/month Starter plan (10,000 ops) is plenty

### Step 3: Create Your AI "System Prompt" Library

Before building automations, write a system prompt that defines your brand voice. Every AI call will use this.

**Your Brand Voice System Prompt Template:**
```
You are a helpful assistant for [BUSINESS NAME], a [TYPE OF BUSINESS] that helps [TARGET CUSTOMER] with [WHAT YOU DO].

Brand voice: [describe in 2-3 sentences — casual/formal, friendly/direct, etc.]

Always:
- Write in first person ("I" and "we")
- Keep responses under [150/300/500] words unless asked otherwise
- End emails with [YOUR SIGN-OFF]
- Never make promises about [ANYTHING YOU CANNOT GUARANTEE]

Business details:
- Website: [URL]
- Email: [YOUR EMAIL]
- Main services: [LIST]
- Pricing starts at: [$AMOUNT]
```

Save this. You'll paste it into every automation.

---

## PART 2: The Five Automations

---

### Automation 1: Email Triage and Auto-Labeling
**Time to build: 45 minutes**
**Time saved: 45-60 minutes/day**

**What it does:**
When an email arrives in Gmail, AI reads it, classifies it (urgent/normal/low/spam), and applies a label. You open your inbox to a pre-sorted list.

**The Build:**

1. **Trigger**: Gmail → Watch Emails (set to check every 15 minutes)

2. **Filter**: Add a filter so it only processes emails from non-subscribed senders (skip newsletters)

3. **AI Module**: HTTP → Make an API Request
   - URL: `https://api.anthropic.com/v1/messages`
   - Method: POST
   - Headers:
     - `x-api-key`: your Claude API key
     - `anthropic-version`: `2023-06-01`
     - `content-type`: `application/json`
   - Body:
     ```json
     {
       "model": "claude-3-haiku-20240307",
       "max_tokens": 100,
       "system": "You are an email classifier. Respond with ONLY one word: URGENT, NORMAL, LOW, or SPAM.",
       "messages": [{"role": "user", "content": "Classify this email:\n\nFrom: {{sender}}\nSubject: {{subject}}\nBody: {{snippet}}"}]
     }
     ```
   *Note: Use claude-3-haiku (cheapest) — classification doesn't need a powerful model.*

4. **Router**: Add a Router module with 4 paths based on the AI response

5. **Action per path**: Gmail → Add Label
   - URGENT → label "!Urgent"
   - NORMAL → label "Normal"
   - LOW → label "Low Priority"
   - SPAM → Gmail → Move to Spam (or just label "Possible Spam" — safer)

**Cost estimate:** ~$0.002 per 100 emails. Essentially free.

**Pro tip:** Add a Slack notification for URGENT emails so you catch them instantly even when not in Gmail.

---

### Automation 2: Lead Capture to CRM + Instant Follow-Up
**Time to build: 60 minutes**
**Time saved: 1-2 hours/week + never drop a lead**

**What it does:**
When someone fills out your contact form (Typeform, Tally, Google Forms — all work), AI drafts a personalized follow-up email, adds them to your CRM (Notion, Airtable, or Google Sheets), and sends the email automatically within 5 minutes.

**The Build:**

1. **Trigger**: Typeform → Watch Responses (or your form tool)
   *Free alternative: Google Forms → Google Sheets → Make watches the Sheet*

2. **AI Draft**: HTTP → Claude API
   ```json
   {
     "model": "claude-3-5-sonnet-20241022",
     "max_tokens": 400,
     "system": "[YOUR BRAND VOICE SYSTEM PROMPT]",
     "messages": [{
       "role": "user",
       "content": "Write a warm follow-up email to this new lead. Name: {{name}}. They said: {{message}}. They're interested in: {{service_interest}}. Goal: confirm receipt, set expectations for response time (24 hours), ask one clarifying question. Max 150 words."
     }]
   }
   ```

3. **Add to CRM**: Airtable → Create Record (or Google Sheets → Append Row)
   - Fields: Name, Email, Message, Date, Status = "New Lead"

4. **Send Email**: Gmail → Send Email
   - To: {{lead_email}}
   - Subject: "Got your message, {{first_name}} — here's what happens next"
   - Body: {{ai_draft_output}}

5. **Notify Yourself**: Slack/SMS → Send message: "New lead from {{name}}: {{brief_summary}}"

**Critical**: Review the first 10 AI-drafted emails before enabling auto-send. Tune your system prompt based on what you see.

---

### Automation 3: Weekly Social Content Batch
**Time to build: 30 minutes**
**Time saved: 2-3 hours/week**

**What it does:**
Every Monday morning at 8am, AI generates 5 LinkedIn post drafts based on your content pillars. They land in a Google Sheet. You review, pick the best 3, and post throughout the week.

**The Build:**

1. **Trigger**: Schedule → Every week (Monday, 8:00 AM)

2. **Get Your Content Pillars**: Google Sheets → Get Rows
   - Create a sheet with columns: Pillar, Example Topic, Tone
   - Example rows:
     - "Client wins | Story about how a client automated their invoicing | Storytelling"
     - "AI tips | One practical AI tip for [your industry] | Educational"
     - "Behind the scenes | What I worked on this week | Personal"

3. **Loop**: Iterator → loop through 5 pillars (or repeat the scenario 5 times with different pillar IDs)

4. **AI Generate**: Claude API
   ```json
   {
     "model": "claude-3-5-sonnet-20241022",
     "max_tokens": 500,
     "system": "[YOUR BRAND VOICE SYSTEM PROMPT]",
     "messages": [{
       "role": "user",
       "content": "Write a LinkedIn post. Pillar: {{pillar}}. Topic direction: {{example_topic}}. Tone: {{tone}}. Format: hook line, 3-5 substance lines, one takeaway, optional CTA. No hashtag spam. No emojis unless they add meaning."
     }]
   }
   ```

5. **Save to Sheet**: Google Sheets → Add Row
   - Columns: Date Generated, Pillar, Draft, Status (empty — you fill in "Posted" or "Skip")

**Time commitment after setup:** 15 minutes Monday morning to pick and edit your 3 posts for the week.

---

### Automation 4: Customer FAQ Auto-Responder
**Time to build: 90 minutes**
**Time saved: 1-2 hours/day (if you get support volume)**

**What it does:**
When a customer emails you a question, AI checks if it matches one of your common questions. If yes, it drafts (or auto-sends) a response. If no, it flags for your personal reply.

**The Build:**

1. **Trigger**: Gmail → Watch Emails (filter for your support address)

2. **AI Classification + Response**:
   ```json
   {
     "model": "claude-3-5-sonnet-20241022",
     "max_tokens": 500,
     "system": "You are a customer service assistant for [BUSINESS]. Your job is to answer common questions. If the question is NOT in your knowledge base, respond with exactly: NEEDS_HUMAN\n\nKnowledge base:\n[PASTE YOUR 10-15 FAQ ANSWERS HERE]",
     "messages": [{
       "role": "user",
       "content": "Customer email:\n\nFrom: {{sender_name}}\nSubject: {{subject}}\nMessage: {{body}}\n\nEither answer this question based on your knowledge base, or respond NEEDS_HUMAN."
     }]
   }
   ```

3. **Router**: Check if response contains "NEEDS_HUMAN"
   - If yes → Gmail label "Needs Reply" + Slack alert to you
   - If no → proceed to send

4. **Human Review Buffer** (highly recommended for first 30 days):
   Instead of auto-sending, create a draft:
   - Gmail → Create Draft
   - Subject: "Re: {{subject}}"
   - Body: {{ai_response}}
   Then you just hit send after a 5-second review.

5. **After 30 days**: Once you trust the quality, switch to auto-send for low-stakes question types only (hours, pricing, basic how-to).

**Building your FAQ knowledge base:**
Export your last 90 days of support emails. Paste them into Claude and ask: "What are the 15 most common questions in these emails? For each, write the ideal response in my brand voice."

---

### Automation 5: Weekly Business Review Digest
**Time to build: 60-90 minutes**
**Time saved: 1-2 hours/week**

**What it does:**
Every Friday at 4pm, the automation pulls your key metrics from Google Sheets (revenue, leads, tasks), has AI write a 1-page business review summary, and emails it to you.

**The Build:**

1. **Trigger**: Schedule → Every Friday, 4:00 PM

2. **Pull Data**: Google Sheets → Get Range
   - You maintain a simple tracking sheet with:
     - Weekly revenue (you update this once/week — 2 minutes)
     - New leads this week
     - Proposals sent
     - Tasks completed vs planned
     - Any notes you logged throughout the week

3. **AI Digest**:
   ```json
   {
     "model": "claude-3-5-sonnet-20241022",
     "max_tokens": 800,
     "system": "You are a business analyst helping a small business owner review their week. Be honest, specific, and constructive. Identify patterns. Keep the tone direct and encouraging.",
     "messages": [{
       "role": "user",
       "content": "Write a weekly business review digest. Data:\n\nWeek ending: {{date}}\nRevenue: {{revenue}}\nNew leads: {{leads}}\nProposals sent: {{proposals}}\nTasks completed: {{tasks_done}} of {{tasks_planned}}\nNotes: {{weekly_notes}}\n\nInclude: (1) key wins, (2) what fell short, (3) one specific recommendation for next week, (4) one thing to watch. Max 400 words."
     }]
   }
   ```

4. **Email to Self**: Gmail → Send Email
   - To: your email
   - Subject: "Weekly Review — Week of {{monday_date}}"
   - Body: {{ai_digest}}

**Upgrade path**: Connect your actual payment processor (Stripe, PayPal) and CRM directly — eliminate the manual data entry entirely.

---

## PART 3: What Comes Next

You now have five automations. In a week or two, you'll notice:

- **Email feels manageable again** — pre-sorted, prioritized
- **No more dropped leads** — every inquiry gets a fast, personal-feeling response
- **Content is done on Monday** — no more staring at a blank screen on Wednesday
- **Support load is lighter** — common questions handled without you
- **Friday review is ritual** — you actually know your numbers

**The natural next step:**

These five automations are the foundation. Once they're stable, the high-leverage moves are:

1. **Connect your actual data sources** (Stripe, Calendly, your CRM) instead of manual sheets
2. **Build a client-facing chatbot** that handles intake, scheduling, and basic Q&A
3. **Create a proposal generation automation** — input a client name, output a ready-to-send proposal
4. **Automate your invoicing** — trigger invoice creation from a form or calendar event

Each of these can be built in a weekend. The skills you've gained here — API calls, routing, system prompts — apply to all of them.

---

## Quick Troubleshooting

**AI response isn't quite right:**
First fix: improve your system prompt. Add specific examples of good outputs. Add explicit "don't do X" rules.

**Automation runs but emails look wrong:**
Check your variable mapping in Make. Common issue: body text includes HTML tags — use "Text" not "HTML" for Claude input.

**API errors:**
- 401: check your API key
- 429: rate limit hit — add a sleep module (2-3 seconds) between API calls
- 500: Claude is occasionally down — add error handling and retry logic

**Make scenario won't activate:**
Check that the scenario is toggled ON (blue, not grey). Free accounts limit active scenarios — upgrade or deactivate an unused one.

---

## Resources

- **Make.com docs**: make.com/en/help/tutorials
- **Claude API docs**: docs.anthropic.com
- **Prompt engineering guide**: docs.anthropic.com/en/docs/build-with-claude/prompt-engineering
- **Tally (free forms)**: tally.so
- **Airtable free CRM**: airtable.com

---

**Want this built for you instead of by you?**

Every automation in this guide can be custom-built for your specific business, tools, and workflows. Starting at $497.

→ whoffagents.com · will@whoffagents.com

*Whoff Agents — AI Automation for Small Business*
