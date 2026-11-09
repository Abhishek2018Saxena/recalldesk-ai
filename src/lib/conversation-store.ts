export type ConversationMessage = {
  id: string;
  type: 'customer' | 'agent' | 'system';
  author: string;
  text: string;
  createdAt: string;
};

export type ConversationRecord = {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  status: 'Open' | 'Resolved' | 'Escalated';
  sentiment: 'Positive' | 'Neutral' | 'Frustrated';
  lastUpdated: string;
  summary: string;
  memoryUsed: boolean;
  knowledgeUsed: boolean;
  messages: ConversationMessage[];
};

export function createConversationId() {
  return `CV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function createMessage(type: ConversationMessage['type'], author: string, text: string): ConversationMessage {
  return {
    id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    author,
    text,
    createdAt: new Date().toISOString(),
  };
}

export const baseConversationRecords: ConversationRecord[] = [
  {
    id: 'CV-101',
    customerId: 'C-1048',
    customerName: 'Priya Nair',
    title: 'Delayed order follow-up',
    status: 'Resolved',
    sentiment: 'Positive',
    lastUpdated: '2026-11-08T09:42:00Z',
    summary: 'The AI remembered the prior delay and provided the final shipping summary with an email follow-up preference.',
    memoryUsed: true,
    knowledgeUsed: true,
    messages: [
      createMessage('customer', 'Priya Nair', 'I’m still waiting on the delayed order update. The previous issue was not resolved clearly.'),
      createMessage('agent', 'AI Agent', 'I have the earlier delivery issue and your email follow-up preference in memory. I’m checking the shipment policy and ETA next.'),
      createMessage('customer', 'Priya Nair', 'Please include the latest status and send a brief summary by email when resolved.'),
      createMessage('agent', 'AI Agent', 'Understood. I’ll keep the response grounded in the delivery policy and the prior order context.'),
    ],
  },
  {
    id: 'CV-102',
    customerId: 'C-2067',
    customerName: 'Marcus Lee',
    title: 'Human escalation review',
    status: 'Escalated',
    sentiment: 'Frustrated',
    lastUpdated: '2026-11-08T11:58:00Z',
    summary: 'The customer requested a human review after repeated ETA misses and delayed updates.',
    memoryUsed: true,
    knowledgeUsed: false,
    messages: [
      createMessage('customer', 'Marcus Lee', 'I need a human agent to review the shipment delay before I cancel the order.'),
      createMessage('agent', 'AI Agent', 'I’ve flagged the repeated carrier delay and the escalation path to a human support specialist.'),
      createMessage('system', 'System', 'Escalation created with the customer’s sentiment, shipping facts, and recommended action summary.'),
    ],
  },
  {
    id: 'CV-103',
    customerId: 'C-4401',
    customerName: 'Alicia Gomez',
    title: 'Password reset recovery',
    status: 'Open',
    sentiment: 'Neutral',
    lastUpdated: '2026-11-07T13:00:00Z',
    summary: 'The customer needed a MFA reset and session refresh after a password reset did not apply correctly.',
    memoryUsed: false,
    knowledgeUsed: true,
    messages: [
      createMessage('customer', 'Alicia Gomez', 'I still cannot reset my multi-factor authentication after the password reset.'),
      createMessage('agent', 'AI Agent', 'I’ll check the access policy and confirm the reset flow before asking for any more information.'),
    ],
  },
];

export function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export function searchConversations(records: ConversationRecord[], query: string) {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return records;
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);

  return records.filter((conversation) => {
    const searchableText = [
      conversation.customerName,
      conversation.customerId,
      conversation.title,
      conversation.summary,
      conversation.status,
      conversation.sentiment,
      conversation.messages.map((message) => `${message.author} ${message.text}`).join(' '),
      conversation.messages.map((message) => message.text).join(' '),
    ]
      .join(' ')
      .toLowerCase();

    return tokens.every((token) => searchableText.includes(token));
  });
}

export function getConversationStore() {
  if (typeof globalThis === 'undefined') {
    return [...baseConversationRecords];
  }

  const store = (globalThis as typeof globalThis & { __recalldeskConversationStore?: ConversationRecord[] }).__recalldeskConversationStore;
  if (!store) {
    const seeded = JSON.parse(JSON.stringify(baseConversationRecords)) as ConversationRecord[];
    (globalThis as typeof globalThis & { __recalldeskConversationStore?: ConversationRecord[] }).__recalldeskConversationStore = seeded;
    return seeded;
  }

  return store;
}

export function replaceConversationStore(nextRecords: ConversationRecord[]) {
  (globalThis as typeof globalThis & { __recalldeskConversationStore?: ConversationRecord[] }).__recalldeskConversationStore = nextRecords;
  return nextRecords;
}
