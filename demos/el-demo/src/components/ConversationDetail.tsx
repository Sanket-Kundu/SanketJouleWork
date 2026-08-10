import { Button } from '@sap-ui/fx-components';
import { ChatMessage } from './ChatMessage';
import { ThumbsUp, ThumbsDown, Copy, RefreshCw } from 'lucide-react';
import type { Conversation } from '@/types';

interface ConversationDetailProps {
  conversation: Conversation;
  onBack: () => void;
  onOpenSources?: (sourceCount: number) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Generate conversation messages based on conversation ID
function getConversationMessages(conversationId: string): ChatMessage[] {
  const topics: Record<string, ChatMessage[]> = {
    conv1: [
      { role: 'user', content: 'Can you analyze our Q4 sales performance?' },
      { role: 'assistant', content: `I'd be happy to help analyze your Q4 sales data. Let me pull together a comprehensive overview for you.

Looking at the numbers, revenue is up 23% year-over-year, which is excellent performance. Here are the key highlights:

<strong>Revenue Summary</strong>
• Total Q4 Revenue: €8.2M
• YoY Growth: +23%
• QoQ Growth: +12%
• Target Achievement: 108%

<strong>Top Performing Products</strong>
1. Enterprise Suite - €3.1M (+34%)
2. Cloud Services - €2.4M (+28%)
3. Professional Services - €1.8M (+15%)
4. Support & Maintenance - €0.9M (+8%)` },
      { role: 'user', content: 'What about regional breakdown?' },
      { role: 'assistant', content: `Here's the detailed regional breakdown for Q4:

<strong>EMEA Region</strong>
• <strong>DACH</strong>: €2.1M (+28%) - Germany leading with €1.4M
• <strong>Western Europe</strong>: €1.8M (+19%) - France and UK strong
• <strong>Nordics</strong>: €0.9M (+22%) - Sweden outperforming

<strong>Americas</strong>
• <strong>North America</strong>: €1.6M (+25%) - US enterprise deals
• <strong>Latin America</strong>: €0.4M (+31%) - Brazil expansion paying off

<strong>APJ</strong>
• <strong>ANZ</strong>: €0.5M (+18%)
• <strong>Southeast Asia</strong>: €0.2M (+45%) - Fastest growing region` },
    ],
    conv2: [
      { role: 'user', content: "What's the latest customer feedback telling us?" },
      { role: 'assistant', content: 'The January surveys show positive results. Your NPS score is 72, up 5 points from last quarter. Customer satisfaction remains high across most touchpoints.' },
      { role: 'user', content: 'Any areas of concern?' },
      { role: 'assistant', content: `A few areas need attention:

<strong>Documentation</strong> - Several customers mentioned outdated guides
<strong>Response Time</strong> - Support tickets taking longer than SLA
<strong>Mobile App</strong> - Feature parity requests increasing` },
      { role: 'user', content: 'Can you give me more details on the documentation issues?' },
      { role: 'assistant', content: `Here's a breakdown of the documentation feedback:

<strong>Most Mentioned Issues</strong>
• API reference is 2 versions behind (mentioned 34 times)
• Missing examples for new integrations (28 mentions)
• Broken links in the knowledge base (19 mentions)
• Outdated screenshots in tutorials (15 mentions)

<strong>Customer Quotes</strong>
"We spent 3 hours debugging because the docs showed the old endpoint format."
"The integration guide for Salesforce is completely missing the OAuth section."

<strong>Recommended Actions</strong>
1. Prioritize API docs update - highest impact
2. Audit all external links monthly
3. Create video tutorials for complex workflows` },
      { role: 'user', content: 'What about the support response times?' },
      { role: 'assistant', content: `Here's the support metrics analysis:

<strong>Current Performance vs SLA</strong>
• First Response: 4.2 hours (SLA: 4 hours) ⚠️
• Resolution Time: 18 hours (SLA: 24 hours) ✅
• Customer Satisfaction: 4.1/5 (Target: 4.0) ✅

<strong>Breakdown by Priority</strong>
• Critical (P1): 45 min avg - Within SLA ✅
• High (P2): 3.8 hours avg - Within SLA ✅
• Medium (P3): 6.2 hours avg - Over SLA ⚠️
• Low (P4): 12 hours avg - Over SLA ⚠️

<strong>Root Causes</strong>
1. Ticket volume up 40% since product launch
2. 2 team members on extended leave
3. New product features generating complex queries

<strong>Mitigation Plan</strong>
• Temporary contractor support (starting next week)
• Enhanced self-service knowledge base
• Chatbot for common P4 queries` },
    ],
    conv3: [
      { role: 'user', content: 'Help me plan the 2026 budget' },
      { role: 'assistant', content: `I'll help you draft the budget allocations based on strategic goals. Let me start by pulling last year's actuals and the approved growth targets.

<strong>2025 Actuals vs 2026 Proposed</strong>

• Personnel: €4.2M → €4.8M (+14%)
• Technology: €1.1M → €1.4M (+27%)
• Marketing: €800K → €950K (+19%)
• Operations: €600K → €650K (+8%)

Total: €6.7M → €7.8M (+16%)

The biggest increases are in Technology (cloud infrastructure) and Personnel (5 new hires planned). Want me to break down any category further?` },
    ],
    conv4: [
      { role: 'user', content: 'Show me the project timeline' },
      { role: 'assistant', content: `Here's the current project timeline:

<strong>Phase 1: Foundation</strong> (Jan-Feb)
✅ Requirements gathering - Complete
✅ Architecture design - Complete
🔄 Infrastructure setup - In Progress

<strong>Phase 2: Development</strong> (Mar-May)
⏳ Core module development
⏳ Integration layer
⏳ Testing framework

<strong>Phase 3: Launch</strong> (Jun)
⏳ UAT
⏳ Production deployment
⏳ Go-live support` },
      { role: 'user', content: 'Are we on track?' },
      { role: 'assistant', content: `Overall project health is <strong>Yellow</strong> - some risks to monitor.

<strong>What's Going Well</strong>
• Phase 1 completed on schedule
• Team velocity is 15% above estimate
• No critical blockers currently

<strong>Risks & Concerns</strong>
• Infrastructure vendor delayed by 1 week
• Security review pending (could impact Phase 2 start)
• Two key developers have PTO in April

<strong>Schedule Impact</strong>
If infrastructure delay extends, we may need to compress Phase 2 testing or push launch to mid-June.` },
      { role: 'user', content: 'What can we do to mitigate the infrastructure delay?' },
      { role: 'assistant', content: `Here are the mitigation options:

<strong>Option 1: Parallel Workstreams</strong>
Start development using mock services while waiting for infrastructure.
• Effort: Medium
• Risk: Some rework when real services available
• Time saved: ~5 days

<strong>Option 2: Alternative Vendor</strong>
Switch to backup cloud provider with faster provisioning.
• Effort: High (reconfiguration needed)
• Risk: Team unfamiliar with new platform
• Time saved: ~8 days

<strong>Option 3: Negotiate with Current Vendor</strong>
Escalate to their management for priority treatment.
• Effort: Low
• Risk: May not succeed
• Time saved: Unknown

<strong>Recommendation</strong>
Start with Option 1 immediately while pursuing Option 3. Keep Option 2 as fallback if delay exceeds 2 weeks.` },
      { role: 'user', content: 'Draft an escalation email for the vendor' },
      { role: 'assistant', content: `Here's a draft escalation email:

---

<strong>Subject:</strong> Urgent: Infrastructure Provisioning Delay - Project Impact

Dear [Vendor Contact],

I'm writing to escalate the current delay in our infrastructure provisioning order (#INF-2024-0892), originally scheduled for delivery on January 15th.

<strong>Current Situation:</strong>
• Order placed: January 3rd
• Original delivery: January 15th
• Current status: Delayed, new ETA unknown

<strong>Business Impact:</strong>
This delay is affecting our product launch timeline, with potential revenue impact of €200K if we miss our Q2 target date. We have 12 team members blocked pending this infrastructure.

<strong>Request:</strong>
1. Immediate status update with firm delivery date
2. Escalation to your infrastructure team lead
3. Daily progress updates until resolved

Please arrange a call today to discuss. I'm available between 2-5 PM CET.

Best regards,
[Your Name]

---

Would you like me to adjust the tone or add any specific details?` },
    ],
    conv5: [
      { role: 'user', content: 'What meetings do I have tomorrow?' },
      { role: 'assistant', content: `You have 4 meetings scheduled for tomorrow:

<strong>9:00 AM</strong> - Weekly Team Standup (30 min)
<strong>10:30 AM</strong> - Product Review with Sarah (1 hr)
<strong>2:00 PM</strong> - Customer Call: Hamburg Tech (45 min)
<strong>4:00 PM</strong> - 1:1 with Manager (30 min)

You have a 2-hour block free from 11:30 AM to 1:30 PM if you need focus time.` },
      { role: 'user', content: 'Can you prepare me for the Hamburg Tech call?' },
      { role: 'assistant', content: `Here's your briefing for the Hamburg Tech call:

<strong>Account Overview</strong>
• Customer since: 2019
• Annual contract value: €145K
• Health score: 85/100 (Good)
• Primary contact: Thomas Müller (CTO)

<strong>Recent Activity</strong>
• Upgraded to Enterprise tier in November
• 3 support tickets this month (all resolved)
• Attended our webinar on cloud migration

<strong>Suggested Talking Points</strong>
1. Thank them for the upgrade
2. Check on integration project progress
3. Introduce new features from our January release
4. Explore professional services opportunity` },
      { role: 'user', content: 'What were their support tickets about?' },
      { role: 'assistant', content: `Here are the 3 support tickets from Hamburg Tech this month:

<strong>Ticket #1 - Resolved Jan 8</strong>
Issue: SSO configuration failing after Azure AD update
Resolution: Updated SAML certificate, provided documentation
Time to resolve: 4 hours
Customer satisfaction: 5/5

<strong>Ticket #2 - Resolved Jan 12</strong>
Issue: Report exports timing out for large datasets
Resolution: Increased timeout limits, optimized query
Time to resolve: 2 days
Customer satisfaction: 4/5
Note: Customer requested async export feature

<strong>Ticket #3 - Resolved Jan 18</strong>
Issue: API rate limiting affecting their batch process
Resolution: Upgraded to higher rate limit tier (included in Enterprise)
Time to resolve: 1 hour
Customer satisfaction: 5/5

<strong>Pattern Analysis</strong>
All tickets related to scaling - they're growing fast and hitting limits. Good opportunity to discuss our Enterprise+ tier or professional services.` },
      { role: 'user', content: 'Reschedule my 1:1 to Thursday' },
      { role: 'assistant', content: `I've checked your Thursday calendar:

<strong>Thursday Availability</strong>
• 9:00-10:00 AM - Free ✅
• 10:00-11:30 AM - Sprint Planning
• 11:30-12:30 PM - Free ✅
• 12:30-1:30 PM - Lunch with design team
• 1:30-3:00 PM - Free ✅
• 3:00-4:00 PM - All-hands meeting
• 4:00-5:00 PM - Free ✅

<strong>Your manager's availability Thursday:</strong>
• 9:00-10:00 AM - Busy
• 11:30-12:30 PM - Free ✅
• 1:30-2:30 PM - Free ✅
• 4:00-5:00 PM - Free ✅

<strong>Best overlapping slots:</strong>
1. 11:30 AM - 12:00 PM
2. 1:30 PM - 2:00 PM
3. 4:00 PM - 4:30 PM

Would you like me to send a reschedule request for one of these times?` },
    ],
    conv6: [
      { role: 'user', content: 'Analyze our competitor landscape' },
      { role: 'assistant', content: `Here's an overview of your competitive landscape:

<strong>Direct Competitors</strong>

<strong>1. TechFlow Solutions</strong>
• Market share: 28%
• Strengths: Strong enterprise presence, robust API
• Weaknesses: Dated UI, slow innovation cycle
• Recent moves: Acquired a ML startup in December

<strong>2. CloudFirst Inc</strong>
• Market share: 22%
• Strengths: Best-in-class mobile app, aggressive pricing
• Weaknesses: Limited integrations, smaller support team
• Recent moves: Launched freemium tier, targeting SMB

<strong>3. DataPro Systems</strong>
• Market share: 15%
• Strengths: Compliance certifications, government contracts
• Weaknesses: Complex implementation, high TCO
• Recent moves: Expanding into healthcare vertical` },
      { role: 'user', content: 'How do we compare on pricing?' },
      { role: 'assistant', content: `Here's a pricing comparison for the Enterprise tier (100 users):

<strong>Monthly Pricing Comparison</strong>

| Vendor | Base Price | Per User | Total |
|--------|-----------|----------|-------|
| Us | €5,000 | €45 | €9,500 |
| TechFlow | €8,000 | €35 | €11,500 |
| CloudFirst | €3,000 | €55 | €8,500 |
| DataPro | €10,000 | €40 | €14,000 |

<strong>Key Observations</strong>
• We're mid-market on total cost
• CloudFirst undercuts on base but has highest per-user rate
• DataPro is 47% more expensive (but includes compliance features)

<strong>Hidden Costs to Mention</strong>
• TechFlow charges extra for API access (+€2K/mo)
• CloudFirst has data egress fees
• DataPro requires annual commitment

<strong>Our Advantages</strong>
• All-inclusive pricing (no hidden fees)
• Monthly billing available
• Free onboarding included` },
      { role: 'user', content: 'What features are they launching that we should watch?' },
      { role: 'assistant', content: `Here's competitive intelligence on upcoming features:

<strong>TechFlow Solutions - Q1 Roadmap (leaked)</strong>
• AI-powered anomaly detection - February
• Real-time collaboration - March
• Custom dashboard builder - April
⚠️ <strong>Threat level: High</strong> - Their AI feature could be a differentiator

<strong>CloudFirst Inc - Public Roadmap</strong>
• Slack integration - Live now
• Advanced permissions - February
• Workflow automation - Q2
⚠️ <strong>Threat level: Medium</strong> - Catching up on integrations

<strong>DataPro Systems - Analyst Reports</strong>
• SOC 2 Type II certification - Complete
• FedRAMP authorization - In progress
• Healthcare module - H2 2024
⚠️ <strong>Threat level: Low</strong> - Focused on compliance, not features

<strong>Recommended Response</strong>
1. Accelerate our AI roadmap - counter TechFlow
2. Ensure Slack integration parity with CloudFirst
3. Consider compliance certifications for enterprise deals` },
    ],
    conv8: [
      { role: 'user', content: 'Help me write a product announcement' },
      { role: 'assistant', content: `I'd be happy to help! Let me gather some details first:

<strong>Questions:</strong>
1. What product/feature are you announcing?
2. Who is the target audience?
3. What's the launch date?
4. What channel will this be published on? (Blog, email, social)

Or if you'd like, share the key points and I'll draft something for you to review.` },
      { role: 'user', content: 'New AI assistant feature, launching Feb 1st, for our blog targeting existing customers' },
      { role: 'assistant', content: `Here's a draft blog post:

---

<strong>Introducing Joule AI Assistant: Your New Productivity Partner</strong>

We're thrilled to announce the launch of Joule AI Assistant, available to all customers starting February 1st.

<strong>What is Joule AI Assistant?</strong>

Joule is an intelligent assistant built directly into your workspace. Ask questions in natural language, get instant insights from your data, and automate routine tasks - all without leaving your workflow.

<strong>Key Capabilities</strong>

🔍 <strong>Natural Language Queries</strong>
Ask "What were our top-selling products last quarter?" and get instant answers with visualizations.

📊 <strong>Smart Insights</strong>
Joule proactively surfaces trends, anomalies, and opportunities in your data.

⚡ <strong>Task Automation</strong>
"Schedule a report every Monday" - and it's done. No complex setup required.

<strong>Getting Started</strong>

Joule is included at no additional cost for all Pro and Enterprise customers. Simply click the ✨ icon in your navigation bar to start a conversation.

[CTA Button: Try Joule Now]

---

Would you like me to adjust the tone, add technical details, or create a shorter version for social media?` },
      { role: 'user', content: 'Make it more exciting and add a customer quote' },
      { role: 'assistant', content: `Here's the revised version:

---

<strong>🚀 The Future of Work is Here: Meet Joule AI Assistant</strong>

Get ready to transform how you work. Starting February 1st, every customer gets access to Joule - the AI assistant that's already saving our beta users 5+ hours per week.

<strong>Why Our Beta Users Are Raving</strong>

<em>"Joule has completely changed how I start my day. Instead of digging through dashboards, I just ask 'What needs my attention?' and get a prioritized list in seconds. It's like having a brilliant analyst on call 24/7."</em>
— Sarah Chen, VP of Operations at TechCorp Global

<strong>What Makes Joule Different?</strong>

🧠 <strong>It Actually Understands You</strong>
Forget rigid commands. Ask questions the way you'd ask a colleague. "Why did sales drop in Germany last week?" Joule gets it.

⚡ <strong>Insights That Find You</strong>
Don't wait for monthly reports. Joule spots trends the moment they emerge and alerts you before they become problems.

🔮 <strong>Predicts What You Need</strong>
Joule learns your patterns. Preparing for a board meeting? It'll have the slides ready before you ask.

<strong>The Best Part? It's Already Included.</strong>

No upgrade required. No setup wizard. Just click the ✨ icon and say hello to your new favorite coworker.

[CTA Button: Meet Joule →]

---

Shall I create a shorter teaser for social media or an email version?` },
      { role: 'user', content: 'Yes, create a LinkedIn post version' },
      { role: 'assistant', content: `Here's a LinkedIn post version:

---

🚀 <strong>Big news!</strong> We're launching Joule AI Assistant on February 1st.

After months of development and beta testing, I'm incredibly proud to share what our team has built.

Joule isn't just another chatbot. It's an AI that:
• Answers questions about YOUR data in plain English
• Spots trends before they hit your dashboard
• Automates the tedious stuff so you can focus on strategy

The beta results? Our users are saving 5+ hours per week. 🤯

<em>"Joule has completely changed how I start my day. It's like having a brilliant analyst on call 24/7."</em> — Sarah Chen, TechCorp Global

The best part? It's included for all Pro and Enterprise customers at no extra cost.

Ready to meet your new AI coworker? Link in comments 👇

#AI #ProductLaunch #FutureOfWork #SaaS #Productivity

---

<strong>Suggested image:</strong> Product screenshot showing Joule answering a question, or a short demo GIF

<strong>Engagement tip:</strong> Post between 8-10 AM on Tuesday or Wednesday for maximum reach. Consider tagging Sarah Chen (with permission) to boost visibility.

Want me to create versions for Twitter/X or an internal announcement?` },
    ],
  };

  return topics[conversationId] || [
    { role: 'user', content: 'Tell me more about this topic' },
    { role: 'assistant', content: "I'd be happy to discuss this further. What specific aspects would you like to explore?" },
  ];
}

export function ConversationDetail({ conversation, onOpenSources }: ConversationDetailProps) {
  const messages = getConversationMessages(conversation.id);
  const sourceCounts = [3, 6, 2, 5, 1, 4];
  let sourceIndex = 0;

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg, index) => {
          const sourceCount = msg.role === 'assistant' ? sourceCounts[sourceIndex++ % sourceCounts.length] : 0;
          return (
            <ChatMessage
              key={index}
              type={msg.role}
            >
              <div
                className="text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/50 opacity-70 hover:opacity-100 transition-opacity">
                  <Button design="Tertiary" iconOnly icon={<ThumbsUp className="h-3 w-3" />} tooltip="Good response" />
                  <Button design="Tertiary" iconOnly icon={<ThumbsDown className="h-3 w-3" />} tooltip="Bad response" />
                  <Button design="Tertiary" iconOnly icon={<Copy className="h-3 w-3" />} tooltip="Copy" />
                  <Button design="Tertiary" iconOnly icon={<RefreshCw className="h-3 w-3" />} tooltip="Regenerate" />
                  <Button
                    design="Tertiary"
                    onClick={() => onOpenSources?.(sourceCount)}
                    className="ml-auto text-xs"
                  >
                    Sources ({sourceCount})
                  </Button>
                </div>
              )}
            </ChatMessage>
          );
        })}
      </div>
    </div>
  );
}
