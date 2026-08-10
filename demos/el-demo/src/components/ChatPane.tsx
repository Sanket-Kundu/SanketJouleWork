import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@sap-ui/fx-components';
import { Bot } from 'lucide-react';
import { conversations } from '../data';

interface ChatPaneProps {
  itemId?: string;
  initialMessage?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Conversation-specific messages (same as ConversationDetail)
const conversationMessages: Record<string, Array<{ role: 'user' | 'assistant'; content: string }>> = {
  conv1: [
    { role: 'user', content: 'Can you analyze our Q4 sales performance?' },
    { role: 'assistant', content: `I'd be happy to help analyze your Q4 sales data. Let me pull together a comprehensive overview for you.

Looking at the numbers, revenue is up 23% year-over-year, which is excellent performance. Here are the key highlights:

**Revenue Summary**
• Total Q4 Revenue: €8.2M
• YoY Growth: +23%
• QoQ Growth: +12%
• Target Achievement: 108%

**Top Performing Products**
1. Enterprise Suite - €3.1M (+34%)
2. Cloud Services - €2.4M (+28%)
3. Professional Services - €1.8M (+15%)
4. Support & Maintenance - €0.9M (+8%)` },
  ],
  conv2: [
    { role: 'user', content: "What's the latest customer feedback telling us?" },
    { role: 'assistant', content: 'The January surveys show positive results. Your NPS score is 72, up 5 points from last quarter. Customer satisfaction remains high across most touchpoints.' },
    { role: 'user', content: 'Any areas of concern?' },
    { role: 'assistant', content: `A few areas need attention:

**Documentation** - Several customers mentioned outdated guides
**Response Time** - Support tickets taking longer than SLA
**Mobile App** - Feature parity requests increasing` },
  ],
  conv3: [
    { role: 'user', content: 'Help me plan the 2026 budget' },
    { role: 'assistant', content: `I'll help you draft the budget allocations based on strategic goals.

**2025 Actuals vs 2026 Proposed**
• Personnel: €4.2M → €4.8M (+14%)
• Technology: €1.1M → €1.4M (+27%)
• Marketing: €800K → €950K (+19%)
• Operations: €600K → €650K (+8%)

Total: €6.7M → €7.8M (+16%)` },
  ],
  conv4: [
    { role: 'user', content: 'Show me the project timeline' },
    { role: 'assistant', content: `Here's the current project timeline:

**Phase 1: Foundation** (Jan-Feb)
✅ Requirements gathering - Complete
✅ Architecture design - Complete
🔄 Infrastructure setup - In Progress

**Phase 2: Development** (Mar-May)
⏳ Core module development
⏳ Integration layer
⏳ Testing framework

**Phase 3: Launch** (Jun)
⏳ UAT
⏳ Production deployment
⏳ Go-live support` },
  ],
  conv5: [
    { role: 'user', content: 'What meetings do I have tomorrow?' },
    { role: 'assistant', content: `You have 4 meetings scheduled for tomorrow:

**9:00 AM** - Weekly Team Standup (30 min)
**10:30 AM** - Product Review with Sarah (1 hr)
**2:00 PM** - Customer Call: Hamburg Tech (45 min)
**4:00 PM** - 1:1 with Manager (30 min)

You have a 2-hour block free from 11:30 AM to 1:30 PM if you need focus time.` },
  ],
  conv6: [
    { role: 'user', content: 'Analyze our competitor landscape' },
    { role: 'assistant', content: `Here's an overview of your competitive landscape:

**TechFlow Solutions** - Market share: 28%
• Strengths: Strong enterprise presence, robust API
• Weaknesses: Dated UI, slow innovation cycle

**CloudFirst Inc** - Market share: 22%
• Strengths: Best-in-class mobile app, aggressive pricing
• Weaknesses: Limited integrations, smaller support team

**DataPro Systems** - Market share: 15%
• Strengths: Compliance certifications, government contracts
• Weaknesses: Complex implementation, high TCO` },
  ],
};

export function ChatPane({ itemId, initialMessage }: ChatPaneProps) {
  const [messages] = useState<Message[]>(() => {
    // Check if itemId matches a conversation
    const conversationId = itemId;
    const conversation = conversations.find(c => c.id === conversationId);

    if (conversation && conversationMessages[conversationId]) {
      // Load conversation-specific messages
      const convMessages = conversationMessages[conversationId];
      return convMessages.map((msg, idx) => ({
        id: String(idx + 1),
        role: msg.role,
        content: msg.content,
        timestamp: new Date(Date.now() - (convMessages.length - idx) * 60000),
      }));
    }
    const initial: Message[] = [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m Joule, your AI assistant. How can I help you today?',
        timestamp: new Date(Date.now() - 3600000 * 4), // 4 hours ago
      },
      {
        id: '2',
        role: 'user',
        content: 'Can you give me an overview of our Q4 sales performance?',
        timestamp: new Date(Date.now() - 3600000 * 4 + 60000),
      },
      {
        id: '3',
        role: 'assistant',
        content: 'Based on the latest data, Q4 sales are up 23% year-over-year. The DACH region has been the top performer, and the new product line has exceeded targets by 15%. Would you like me to break down the numbers by region or product category?',
        timestamp: new Date(Date.now() - 3600000 * 4 + 120000),
      },
      {
        id: '4',
        role: 'user',
        content: 'Yes, please show me the regional breakdown.',
        timestamp: new Date(Date.now() - 3600000 * 3),
      },
      {
        id: '5',
        role: 'assistant',
        content: 'Here\'s the regional breakdown for Q4:\n\n• EMEA: €12.4M (+28% YoY)\n  - Germany: €4.2M (top performer)\n  - UK: €3.1M\n  - France: €2.8M\n  - Other: €2.3M\n\n• Americas: €9.8M (+19% YoY)\n  - US: €7.2M\n  - Canada: €1.4M\n  - LATAM: €1.2M\n\n• APAC: €7.2M (+31% YoY)\n  - Australia: €2.8M\n  - Japan: €2.1M\n  - Singapore: €1.3M\n  - Other: €1.0M\n\nWould you like me to analyze any specific region in more detail?',
        timestamp: new Date(Date.now() - 3600000 * 3 + 60000),
      },
      {
        id: '6',
        role: 'user',
        content: 'What about customer satisfaction metrics? How are we doing there?',
        timestamp: new Date(Date.now() - 3600000 * 2),
      },
      {
        id: '7',
        role: 'assistant',
        content: 'Customer satisfaction metrics are looking positive! Here\'s the summary:\n\n• NPS Score: 72 (up 5 points from last quarter)\n• Customer Satisfaction: 94% would recommend\n• Support Rating: 4.8/5 stars\n• First Response Time: 15 minutes average\n• Resolution Time: 2.4 hours average\n\nTop feature requests from customers:\n1. Mobile app improvements\n2. Faster report generation\n3. More third-party integrations\n4. Enhanced collaboration features\n\nShall I dive deeper into any of these areas?',
        timestamp: new Date(Date.now() - 3600000 * 2 + 60000),
      },
      {
        id: '8',
        role: 'user',
        content: 'How is our team performing this quarter?',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '9',
        role: 'assistant',
        content: 'Team performance has been strong this quarter. Here are the key metrics:\n\n**Sprint Performance**\n• Velocity: Up 15% from last quarter\n• Story points completed: 42 average per sprint\n• Sprint completion rate: 94%\n• Bug carry-over: Reduced by 35%\n\n**Quality Metrics**\n• Code coverage: 87% (+8% improvement)\n• Critical bugs: 2 (down from 8 last quarter)\n• Documentation score: 4.2/5\n• Code review turnaround: 4 hours average\n\n**Team Recognition**\n• Sarah Chen: Architecture lead award\n• James Wilson: Customer champion\n• Anna Schmidt: Innovation award\n• Tom Mueller: Mentorship recognition\n\nThe team has successfully shipped 3 major features ahead of schedule. Would you like details on any specific area?',
        timestamp: new Date(Date.now() - 3600000 + 60000),
      },
      {
        id: '10',
        role: 'user',
        content: 'What are the action items I should focus on this week?',
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: '11',
        role: 'assistant',
        content: 'Based on your current priorities and upcoming deadlines, here are your recommended action items for this week:\n\n**High Priority**\n1. Review Q4 Budget Proposal (2h overdue - Finance Team)\n2. Approve Travel Request for John Smith (due today)\n3. Follow up with Hamburg Tech on contract renewal\n\n**Medium Priority**\n4. Complete Compliance Training (due tomorrow - HR Required)\n5. Schedule QBR meetings with top 5 accounts\n6. Review and approve the Q1 marketing campaign plan\n\n**Lower Priority**\n7. Submit Timesheet for Week 8 (due Friday)\n8. Review team performance documentation\n9. Update project roadmap for Q2\n\n**Meetings This Week**\n• Design Session - Mar 10, 8:00 AM\n• Working with ADHD Workshop - Mar 11, 12:00 PM\n• Team Retrospective - Mar 12, 2:00 PM\n\nWould you like me to help you prioritize or provide more details on any of these items?',
        timestamp: new Date(Date.now() - 1800000 + 60000),
      },
      {
        id: '12',
        role: 'user',
        content: 'Can you summarize the key insights from all the data we discussed?',
        timestamp: new Date(Date.now() - 600000),
      },
      {
        id: '13',
        role: 'assistant',
        content: 'Here\'s a comprehensive summary of the key insights:\n\n**Financial Performance**\n• Q4 revenue up 23% YoY across all regions\n• DACH region leading with 28% growth\n• New product line exceeded targets by 15%\n• Total Q4 revenue: €29.4M across all regions\n\n**Customer Health**\n• NPS improved to 72 (+5 points)\n• 94% customer recommendation rate\n• Support rated 4.8/5 stars\n• 127 at-risk customers identified for proactive outreach\n\n**Operational Excellence**\n• Sprint velocity increased 15%\n• Code coverage at 87%\n• Critical bugs reduced from 8 to 2\n• Team morale high with multiple recognitions\n\n**Key Risks & Actions**\n• 3 deals closing soon worth €700K need attention\n• Hamburg Tech renewal discussion pending\n• 2h overdue on budget proposal review\n• Compliance training due tomorrow\n\n**Strategic Opportunities**\n• APAC showing fastest growth (+31%)\n• AI/ML features highly requested by customers\n• Mobile app improvements as top priority\n• Strong pipeline for Q1: €4.8M total value\n\nWould you like me to prepare a report or presentation with these insights?',
        timestamp: new Date(Date.now() - 600000 + 60000),
      },
    ];

    // If there's an initial message, add it as user message with AI response
    if (initialMessage) {
      initial.push({
        id: String(initial.length + 1),
        role: 'user',
        content: initialMessage,
        timestamp: new Date(),
      });
      initial.push({
        id: String(initial.length + 2),
        role: 'assistant',
        content: getAIResponse(initialMessage),
        timestamp: new Date(),
      });
    }

    return initial;
  });
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Scroll within the fx-pane-content container only, not the entire viewport
    const container = messagesEndRef.current?.closest('.fx-pane-content');
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Expose addMessage for parent to call when layout input submits
  useEffect(() => {
    // This could be enhanced with a ref-based API if needed
  }, []);

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className="shrink-0">
              {message.role === 'assistant' ? (
                <div className="p-2 rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <Avatar size="S" initials="U" colorScheme="Accent1" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input is provided by FxLayout's input slot - it moves here when end pane is open */}
    </div>
  );
}

function getAIResponse(input: string): string {
  const lowered = input.toLowerCase();

  if (lowered.includes('hello') || lowered.includes('hi')) {
    return 'Hello! How can I assist you with your work today?';
  }

  if (lowered.includes('sales') || lowered.includes('revenue')) {
    return 'Based on the latest data, Q4 sales are up 23% year-over-year. The DACH region has been the top performer, and the new product line has exceeded targets by 15%. Would you like me to break down the numbers by region or product category?';
  }

  if (lowered.includes('budget') || lowered.includes('cost')) {
    return 'I can help you with budget planning. The current proposed allocations show Engineering at €2.4M (+15%), Sales at €1.8M (+10%), and Marketing at €900K (+5%). Would you like me to analyze any specific department or suggest optimizations?';
  }

  if (lowered.includes('customer') || lowered.includes('feedback')) {
    return 'Customer satisfaction metrics are looking positive! The NPS score is 72 (up 5 points from last quarter), 94% of customers would recommend our products, and support is rated 4.8/5. The top feature requests are mobile app improvements, faster report generation, and more integrations.';
  }

  if (lowered.includes('team') || lowered.includes('performance')) {
    return 'Team performance has been strong this quarter. Sprint velocity is up 15%, customer tickets are down 20%, and the team NPS improved to 4.6. The team has successfully shipped 3 major features ahead of schedule.';
  }

  if (lowered.includes('help')) {
    return 'I can help you with:\n• Analyzing sales and revenue data\n• Budget planning and cost analysis\n• Customer feedback insights\n• Team performance metrics\n• Market research summaries\n• Contract analysis\n\nJust ask me about any of these topics!';
  }

  return 'I understand you\'re asking about "' + input + '". Let me analyze the relevant data and provide insights. Is there a specific aspect you\'d like me to focus on?';
}
