export type Role = 'Admin' | 'Support Agent' | 'Viewer';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Enterprise' | 'Business' | 'Pro';
  region: string;
  status: 'Active' | 'At Risk' | 'VIP';
  sentiment: 'Positive' | 'Neutral' | 'Frustrated';
  value: string;
  lastSeen: string;
  preference: string;
  company: string;
};

export type MemoryItem = {
  id: string;
  customerId: string;
  title: string;
  category: 'Preference' | 'Issue' | 'Resolution' | 'Risk';
  source: 'Hindsight' | 'Demo fallback';
  summary: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'needs review';
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  category: 'Policy' | 'Delivery' | 'Product' | 'Billing';
  source: string;
  updatedAt: string;
  summary: string;
};

export type Ticket = {
  id: string;
  customerId: string;
  subject: string;
  category: 'Order delay' | 'Billing' | 'Access' | 'Product issue';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Pending' | 'Escalated' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
};

export type Escalation = {
  id: string;
  customerId: string;
  reason: string;
  priority: 'High' | 'Urgent';
  sentiment: 'Frustrated' | 'Neutral';
  status: 'Pending' | 'Accepted' | 'Resolved';
  createdAt: string;
};

export type Conversation = {
  id: string;
  customerId: string;
  title: string;
  status: 'Open' | 'Resolved' | 'Escalated';
  sentiment: 'Positive' | 'Neutral' | 'Frustrated';
  lastUpdated: string;
  summary: string;
  memoryUsed: boolean;
  knowledgeUsed: boolean;
};

export type IntegrationStatus = {
  name: string;
  status: 'Connected' | 'Demo mode' | 'Configuration required' | 'Connection error';
  detail: string;
};

export const demoUser = {
  name: 'Alicia Diaz',
  email: 'alicia@recalldesk.ai',
  role: 'Administrator' as Role,
};

export const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'AI Support Chat', href: '/dashboard/chat' },
  { name: 'Customers', href: '/dashboard/customers' },
  { name: 'Conversation History', href: '/dashboard/conversations' },
  { name: 'AI Memory Centre', href: '/dashboard/memory' },
  { name: 'Knowledge Base', href: '/dashboard/knowledge' },
  { name: 'Ticket Management', href: '/dashboard/tickets' },
  { name: 'Human Escalations', href: '/dashboard/escalations' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'AI Evaluation', href: '/dashboard/evaluation' },
  { name: 'Integrations', href: '/dashboard/integrations' },
  { name: 'Settings', href: '/dashboard/settings' },
];

export const overviewStats = [
  { label: 'Total Conversations', value: '14.8K', change: '+18.2%', tone: 'blue' },
  { label: 'Active Tickets', value: '236', change: '+7.1%', tone: 'green' },
  { label: 'Resolution Rate', value: '92.4%', change: '+4.7%', tone: 'amber' },
  { label: 'Average Response Time', value: '3.1m', change: '-22s', tone: 'purple' },
  { label: 'Escalation Rate', value: '7.6%', change: '-1.3%', tone: 'rose' },
  { label: 'Customer Satisfaction', value: '94.8%', change: '+2.4%', tone: 'cyan' },
];

export const customers: Customer[] = [
  {
    id: 'C-1048',
    name: 'Priya Nair',
    email: 'priya@northstarlabs.com',
    phone: '+1 (415) 555-0134',
    tier: 'Enterprise',
    region: 'US West',
    status: 'VIP',
    sentiment: 'Positive',
    value: '$235K ARR',
    lastSeen: '2 min ago',
    preference: 'Prefers email follow-up after resolution',
    company: 'Northstar Labs',
  },
  {
    id: 'C-2067',
    name: 'Marcus Lee',
    email: 'marcus@silverline.io',
    phone: '+44 20 5555 0182',
    tier: 'Business',
    region: 'EMEA',
    status: 'At Risk',
    sentiment: 'Frustrated',
    value: '$68K ARR',
    lastSeen: '17 min ago',
    preference: 'Wants shipment updates before case closure',
    company: 'Silverline',
  },
  {
    id: 'C-4401',
    name: 'Alicia Gomez',
    email: 'alicia@harborhq.ai',
    phone: '+61 2 5550 7421',
    tier: 'Pro',
    region: 'APAC',
    status: 'Active',
    sentiment: 'Neutral',
    value: '$44K ARR',
    lastSeen: '1 hour ago',
    preference: 'Prefers concise answers and direct next steps',
    company: 'HarborHQ',
  },
];

export const memoryItems: MemoryItem[] = [
  {
    id: 'M-201',
    customerId: 'C-1048',
    title: 'Delayed order context',
    category: 'Issue',
    source: 'Hindsight',
    summary: 'Customer reported a delayed order in April. The support workflow retained the shipment problem, shipping carrier issue, and urgency level for future follow-up.',
    createdAt: '2026-10-17T14:40:00Z',
    updatedAt: '2026-10-17T14:40:00Z',
    status: 'active',
  },
  {
    id: 'M-202',
    customerId: 'C-1048',
    title: 'Preference: email follow-up',
    category: 'Preference',
    source: 'Hindsight',
    summary: 'Prefers email summary after resolution and no redundant questions during follow-up conversations.',
    createdAt: '2026-10-18T09:10:00Z',
    updatedAt: '2026-10-18T09:10:00Z',
    status: 'active',
  },
  {
    id: 'M-203',
    customerId: 'C-2067',
    title: 'Order status concern',
    category: 'Risk',
    source: 'Demo fallback',
    summary: 'Customer is highly responsive to delivery updates and may escalate if shipping ETA slips again.',
    createdAt: '2026-11-03T08:00:00Z',
    updatedAt: '2026-11-05T12:30:00Z',
    status: 'needs review',
  },
];

export const knowledgeBase: KnowledgeArticle[] = [
  {
    id: 'KB-101',
    title: 'Delivery exceptions and replacement policy',
    category: 'Delivery',
    source: 'Operations Manual',
    updatedAt: '2026-11-01',
    summary: 'Orders delayed beyond 7 business days may qualify for a replacement shipment or account credit after review.',
  },
  {
    id: 'KB-102',
    title: 'Order status troubleshooting',
    category: 'Product',
    source: 'Support Playbook',
    updatedAt: '2026-10-29',
    summary: 'Check carrier status, confirm address, and verify order lock status before escalating to fulfillment.',
  },
  {
    id: 'KB-103',
    title: 'Refund eligibility and billing exceptions',
    category: 'Billing',
    source: 'Finance Guide',
    updatedAt: '2026-11-04',
    summary: 'Refunds require original payment verification and may take 5-7 business days for processing.',
  },
  {
    id: 'KB-104',
    title: 'Identity verification and account access',
    category: 'Policy',
    source: 'Security Handbook',
    updatedAt: '2026-11-06',
    summary: 'Account access must be validated through a verified email and MFA challenge before configuration changes are completed.',
  },
];

export const tickets: Ticket[] = [
  {
    id: 'TCK-1001',
    customerId: 'C-1048',
    subject: 'Delayed order on enterprise license bundle',
    category: 'Order delay',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'A. Patel',
    createdAt: '2026-11-05T15:40:00Z',
    updatedAt: '2026-11-08T09:15:00Z',
    summary: 'Customer had a delayed shipment; replacement shipment was arranged after AI identified a fulfillment delay.',
  },
  {
    id: 'TCK-1002',
    customerId: 'C-2067',
    subject: 'Shipping ETA missed for Q4 update',
    category: 'Order delay',
    priority: 'Urgent',
    status: 'Escalated',
    assignedTo: 'L. Chen',
    createdAt: '2026-11-06T10:10:00Z',
    updatedAt: '2026-11-08T11:50:00Z',
    summary: 'Customer escalated due to repeated delays and frustration with missing status updates.',
  },
  {
    id: 'TCK-1003',
    customerId: 'C-4401',
    subject: 'Access issue after password reset',
    category: 'Access',
    priority: 'Medium',
    status: 'Resolved',
    assignedTo: 'J. Lopez',
    createdAt: '2026-11-01T12:20:00Z',
    updatedAt: '2026-11-02T18:00:00Z',
    summary: 'Resolved with MFA reset and session refresh.',
  },
];

export const escalations: Escalation[] = [
  {
    id: 'ESC-001',
    customerId: 'C-2067',
    reason: 'Customer explicitly requested a human agent after repeated delivery delays.',
    priority: 'Urgent',
    sentiment: 'Frustrated',
    status: 'Accepted',
    createdAt: '2026-11-08T10:45:00Z',
  },
  {
    id: 'ESC-002',
    customerId: 'C-1048',
    reason: 'High-value enterprise customer requested a billing and logistics review for shipment exceptions.',
    priority: 'High',
    sentiment: 'Neutral',
    status: 'Pending',
    createdAt: '2026-11-07T16:10:00Z',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'CV-101',
    customerId: 'C-1048',
    title: 'Delayed order follow-up',
    status: 'Resolved',
    sentiment: 'Positive',
    lastUpdated: '2026-11-08T09:42:00Z',
    summary: 'The AI remembered the prior delay and provided the final shipping summary with an email follow-up preference.',
    memoryUsed: true,
    knowledgeUsed: true,
  },
  {
    id: 'CV-102',
    customerId: 'C-2067',
    title: 'Human escalation review',
    status: 'Escalated',
    sentiment: 'Frustrated',
    lastUpdated: '2026-11-08T11:58:00Z',
    summary: 'Customer requested a human support review after repeated ETA misses and delayed updates.',
    memoryUsed: true,
    knowledgeUsed: false,
  },
  {
    id: 'CV-103',
    customerId: 'C-4401',
    title: 'Password reset recovery',
    status: 'Open',
    sentiment: 'Neutral',
    lastUpdated: '2026-11-07T13:00:00Z',
    summary: 'Customer needed a MFA reset and session refresh after a password reset did not apply correctly.',
    memoryUsed: false,
    knowledgeUsed: true,
  },
];

export const analyticsTrend = [
  { day: 'Mon', conversations: 820, resolved: 610, escalations: 82 },
  { day: 'Tue', conversations: 930, resolved: 710, escalations: 90 },
  { day: 'Wed', conversations: 980, resolved: 760, escalations: 101 },
  { day: 'Thu', conversations: 1180, resolved: 930, escalations: 124 },
  { day: 'Fri', conversations: 1210, resolved: 980, escalations: 132 },
  { day: 'Sat', conversations: 850, resolved: 640, escalations: 81 },
  { day: 'Sun', conversations: 790, resolved: 620, escalations: 77 },
];

export const categoryMix = [
  { name: 'Order Delay', value: 36 },
  { name: 'Billing', value: 23 },
  { name: 'Access', value: 18 },
  { name: 'Product', value: 15 },
  { name: 'Other', value: 8 },
];

export const sentimentBreakdown = [
  { name: 'Positive', value: 52 },
  { name: 'Neutral', value: 31 },
  { name: 'Frustrated', value: 17 },
];

export const integrationStatus: IntegrationStatus[] = [
  { name: 'Microsoft Teams', status: 'Connected', detail: 'Escalations push to the support channel with case summaries and next actions.' },
  { name: 'Microsoft 365', status: 'Connected', detail: 'Email workflows and case summaries are available through the M365 tenant.' },
  { name: 'Microsoft Outlook', status: 'Demo mode', detail: 'Template-based follow-ups are staged in demo mode until production credentials are configured.' },
  { name: 'Microsoft Entra ID', status: 'Configuration required', detail: 'SSO is ready to enable when app roles and tenant settings are approved.' },
  { name: 'Azure OpenAI', status: 'Connected', detail: 'Grounded response workflow is active with the configured deployment endpoint.' },
  { name: 'Supabase', status: 'Demo mode', detail: 'Persistent storage layer is prepared with schema and demo data isolation rules.' },
  { name: 'Hindsight', status: 'Demo mode', detail: 'Long-term memory retention is simulated with a clearly labeled adapter when the API is not live.' },
  { name: 'OpenAI', status: 'Connected', detail: 'The assistant uses the configured provider for triage, summarization, and retrieval workflows.' },
];

export const evaluationScenarios = [
  {
    name: 'Delayed order memory recall',
    expected: 'AI recognizes the prior order delay and references the issue without repetition.',
    actual: 'Memory matched the prior shipment delay and preferred email summary preferences.',
    status: 'Pass',
  },
  {
    name: 'Knowledge grounding check',
    expected: 'Reply includes policy guidance for delayed shipments and replacement eligibility.',
    actual: 'Support policy and carrier check steps were cited as evidence.',
    status: 'Pass',
  },
  {
    name: 'Escalation correctness',
    expected: 'Customer frustration and repeat issue escalate to a human agent.',
    actual: 'Escalation route triggered with summary, sentiment, and recommended next action.',
    status: 'Pass',
  },
];

export const settings = {
  workspace: 'Northstar Labs Support',
  organization: 'RecallDesk AI',
  environment: 'Demo mode',
  role: 'Administrator',
  dataRetentionDays: 180,
  timezone: 'UTC-08:00',
};

export const alertItems = [
  'Hindsight memory sync is in demo mode until live credentials are configured.',
  'Two tickets need assignment review in the escalation queue.',
  'The delivery policy knowledge article was last updated 3 days ago.',
];

export const aiSignals = [
  { label: 'Memory recall', value: '94%', color: 'bg-emerald-400' },
  { label: 'Grounded answer rate', value: '91%', color: 'bg-blue-400' },
  { label: 'Escalation confidence', value: '88%', color: 'bg-violet-400' },
];

export const demoTimeline = [
  { title: 'Delayed order reported', detail: 'Customer identifies a missing shipment and high urgency.', time: '2 days ago' },
  { title: 'AI retained memory', detail: 'Hindsight stores order delay and follow-up preference for re-entry.', time: '1 day ago' },
  { title: 'Repeat contact detected', detail: 'Customer returns with a new conversation and previous issue is recalled.', time: '7 hours ago' },
  { title: 'Escalation packet sent', detail: 'Support agent receives summary and recommended next steps.', time: '45 min ago' },
];

export const conversationThreadData = [
  { customer: 'Priya Nair', preview: 'The delayed order is resolved—can you send the updated ETA?', status: 'Resolved' },
  { customer: 'Marcus Lee', preview: 'I need a human agent to review the shipment delay.', status: 'Escalated' },
  { customer: 'Alicia Gomez', preview: 'I still cannot reset my multi-factor authentication.', status: 'Open' },
];

export const pageMeta = {
  title: 'RecallDesk AI',
  subtitle: 'Customer Support That Remembers. Understands. Resolves.',
};

export const productHighlights = [
  { title: 'Persistent customer memory', description: 'Long-term context moves with the customer across sessions, tickets, and support channels.' },
  { title: 'Grounded AI answers', description: 'Every response is tied to trusted knowledge and customer history before it is sent.' },
  { title: 'Escalation intelligence', description: 'Low-confidence or high-risk interactions route to humans with rationale and full case summaries.' },
  { title: 'Enterprise security', description: 'Customer isolation, role checks, audit logging, and secure defaults support trusted operations.' },
];

export const workflowSteps = [
  'Detect intent and urgency across customer messages',
  'Retrieve customer memory, issue history, and preferences',
  'Search the knowledge base for the most relevant support policy',
  'Draft a grounded answer or escalate to a human agent if needed',
];
