import { NextResponse } from 'next/server';
import { customers, knowledgeBase, memoryItems } from '@/lib/mock-data';
import { createConversationId, createMessage, getConversationStore, replaceConversationStore, type ConversationRecord } from '@/lib/conversation-store';

function getMissingProviderMessage() {
  return 'No paid AI provider is configured. The app is using the local demo engine based on the customer memory and knowledge base.';
}

function buildLocalDemoAnswer(message: string, customerId?: string, conversation?: ConversationRecord) {
  const normalized = message.toLowerCase();
  const customer = customers.find((entry) => entry.id === customerId) ?? null;
  const customerMemory = customerId ? memoryItems.filter((entry) => entry.customerId === customerId) : [];
  const conversationHistory = conversation?.messages ?? [];

  const relevantKnowledge = knowledgeBase.filter((article) => {
    const haystack = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
    return (
      /delay|shipment|eta|delivery|carrier|replacement/.test(normalized) && /delay|shipment|eta|delivery|carrier|replacement/.test(haystack)
    ) || (
      /refund|billing|invoice|payment|credit/.test(normalized) && /refund|billing|invoice|payment|credit/.test(haystack)
    ) || (
      /password|login|mfa|access|identity/.test(normalized) && /password|login|mfa|access|identity/.test(haystack)
    );
  }).slice(0, 2);

  const relevantMemory = customerMemory.slice(0, 2).map((entry) => entry.summary);
  const recentContext = conversationHistory.slice(-3).map((entry) => `${entry.author}: ${entry.text}`).join(' | ');

  if (/delay|shipment|eta|delivery|carrier|replacement/.test(normalized)) {
    const policy = relevantKnowledge.find((entry) => entry.category === 'Delivery') ?? knowledgeBase[0];
    const memorySummary = relevantMemory[0] ?? 'The customer has prior delivery concerns and wants an update before the case closes.';
    const answer = [
      `Based on the delivery policy and prior customer context, I would review the carrier ETA and shipment status before making any final promise.`,
      policy ? `The support policy states: ${policy.summary}` : 'The support policy requires confirming the carrier status and fulfillment timeline.',
      `The customer record also notes: ${memorySummary}`,
      customer ? `For ${customer.name}, I would keep the response grounded in the prior order details and follow-up preference.` : 'I would keep the response grounded in the customer’s previous issue history.',
    ].join(' ');

    return {
      answer,
      mode: 'demo-local',
      confidence: 0.86,
      memoryUsed: relevantMemory.length > 0,
      knowledgeUsed: relevantKnowledge.length > 0,
      escalationRecommended: /urgent|frustrated|cancel|escalate/.test(normalized),
      sources: [
        ...(relevantKnowledge.map((entry) => `Knowledge: ${entry.title}`)),
        ...(relevantMemory.length ? [`Memory: ${relevantMemory[0]}`] : []),
        ...(recentContext ? [`Conversation: ${recentContext}`] : []),
      ],
    };
  }

  if (/refund|billing|invoice|payment|credit/.test(normalized)) {
    const policy = relevantKnowledge.find((entry) => entry.category === 'Billing') ?? knowledgeBase[2];
    const answer = [
      `I would review the billing exception policy and payment history before confirming a refund or credit.`,
      policy ? `The support reference states: ${policy.summary}` : 'Refunds require payment verification and a review of the original transaction.',
      customer ? `The current customer record for ${customer.name} should be checked before finalizing any credit promise.` : 'The customer record should be reviewed before finalizing any credit promise.',
    ].join(' ');

    return {
      answer,
      mode: 'demo-local',
      confidence: 0.84,
      memoryUsed: relevantMemory.length > 0,
      knowledgeUsed: relevantKnowledge.length > 0,
      escalationRecommended: false,
      sources: [
        ...(policy ? [`Knowledge: ${policy.title}`] : []),
        ...(relevantMemory.length ? [`Memory: ${relevantMemory[0]}`] : []),
      ],
    };
  }

  if (/password|login|mfa|access|identity/.test(normalized)) {
    const policy = relevantKnowledge.find((entry) => entry.category === 'Policy') ?? knowledgeBase[3];
    const answer = [
      `This appears to be an account access issue, so I would validate the customer identity and MFA status before any resets or configuration changes.`,
      policy ? `The security policy states: ${policy.summary}` : 'The account access workflow requires a verified email and MFA challenge before changing configuration.',
      customer ? `I would also confirm any recent access events for ${customer.name}.` : 'I would review recent access events before the next step.',
    ].join(' ');

    return {
      answer,
      mode: 'demo-local',
      confidence: 0.84,
      memoryUsed: relevantMemory.length > 0,
      knowledgeUsed: relevantKnowledge.length > 0,
      escalationRecommended: false,
      sources: [
        ...(policy ? [`Knowledge: ${policy.title}`] : []),
        ...(relevantMemory.length ? [`Memory: ${relevantMemory[0]}`] : []),
      ],
    };
  }

  const policy = relevantKnowledge[0] ?? knowledgeBase[0];
  const summary = customer ? `The customer record for ${customer.name} includes prior context and preference history.` : 'The customer record contains prior context and preference history.';
  const answer = [
    `I reviewed the customer context and the support knowledge for this case.`,
    policy ? `The most relevant policy is: ${policy.summary}` : 'I would anchor the response to the policy and the customer’s recent interactions.',
    summary,
    recentContext ? `Recent conversation context: ${recentContext}` : 'There is no recent conversation context for this customer yet.',
  ].join(' ');

  return {
    answer,
    mode: 'demo-local',
    confidence: 0.8,
    memoryUsed: relevantMemory.length > 0 || Boolean(recentContext),
    knowledgeUsed: Boolean(policy),
    escalationRecommended: /urgent|frustrated|cancel|escalate/.test(normalized),
    sources: [
      ...(policy ? [`Knowledge: ${policy.title}`] : []),
      ...(relevantMemory.length ? [`Memory: ${relevantMemory[0]}`] : []),
      ...(recentContext ? [`Conversation: ${recentContext}`] : []),
    ],
  };
}

async function callConfiguredBackend(message: string, customerId?: string, conversation?: ConversationRecord) {
  const openAIApiKey = process.env.OPENAI_API_KEY?.trim();
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim();

  if (openAIApiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are RecallDesk AI, an enterprise support assistant. Answer using support policy, memory, and customer context only.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI backend rejected the request: ${text}`);
    }

    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content;
    if (!answer) {
      throw new Error('OpenAI returned an empty response.');
    }

    return {
      answer,
      mode: 'live',
      confidence: 0.96,
      memoryUsed: Boolean(customerId && memoryItems.some((entry) => entry.customerId === customerId)),
      knowledgeUsed: true,
      escalationRecommended: false,
      sources: ['Live OpenAI response'],
    };
  }

  if (azureApiKey && azureEndpoint) {
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';
    const url = new URL(`${azureEndpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions`);
    url.searchParams.set('api-version', '2024-02-01');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Respond as an enterprise support agent grounded in customer memory and policy evidence.' },
          { role: 'user', content: message },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Azure OpenAI backend rejected the request: ${text}`);
    }

    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content;
    if (!answer) {
      throw new Error('Azure OpenAI returned an empty response.');
    }

    return {
      answer,
      mode: 'live',
      confidence: 0.95,
      memoryUsed: Boolean(customerId && memoryItems.some((entry) => entry.customerId === customerId)),
      knowledgeUsed: true,
      escalationRecommended: false,
      sources: ['Live Azure OpenAI response'],
    };
  }

  return buildLocalDemoAnswer(message, customerId, conversation);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return NextResponse.json({ error: 'A customer message is required.' }, { status: 400 });
    }

    const conversationId = typeof body?.conversationId === 'string' && body.conversationId.trim() ? body.conversationId.trim() : null;
    const customerName = typeof body?.customerName === 'string' && body.customerName.trim() ? body.customerName.trim() : 'New Customer';
    const customerId = typeof body?.customerId === 'string' && body.customerId.trim() ? body.customerId.trim() : 'C-9999';

    const store = [...getConversationStore()];
    let conversation: ConversationRecord | null = conversationId ? store.find((entry) => entry.id === conversationId) ?? null : null;

    if (!conversation) {
      conversation = {
        id: conversationId ?? createConversationId(),
        customerId,
        customerName,
        title: `${customerName} follow-up`,
        status: 'Open',
        sentiment: 'Neutral',
        lastUpdated: new Date().toISOString(),
        summary: message,
        memoryUsed: false,
        knowledgeUsed: false,
        messages: [createMessage('customer', customerName, message)],
      };

      store.unshift(conversation);
      replaceConversationStore(store);
    } else {
      const activeConversation = conversation;
      const userMessage = createMessage('customer', activeConversation.customerName, message);
      const updatedConversation = {
        ...activeConversation,
        summary: message,
        lastUpdated: new Date().toISOString(),
        messages: [...activeConversation.messages, userMessage],
      };

      const index = store.findIndex((entry) => entry.id === activeConversation.id);
      if (index >= 0) {
        store[index] = updatedConversation;
      } else {
        store.unshift(updatedConversation);
      }

      conversation = updatedConversation;
      replaceConversationStore(store);
    }

    if (!conversation) {
      throw new Error('Conversation could not be created before the AI request.');
    }

    const aiPayload = await callConfiguredBackend(message, customerId, conversation);
    const agentMessage = createMessage('agent', 'AI Agent', aiPayload.answer);
    const finalConversation: ConversationRecord = {
      ...conversation,
      memoryUsed: aiPayload.memoryUsed,
      knowledgeUsed: aiPayload.knowledgeUsed,
      lastUpdated: new Date().toISOString(),
      summary: aiPayload.answer,
      messages: [...conversation.messages, agentMessage],
    };

    const finalStore = [...getConversationStore()];
    const finalIndex = finalStore.findIndex((entry) => entry.id === finalConversation.id);
    if (finalIndex >= 0) {
      finalStore[finalIndex] = finalConversation;
    } else {
      finalStore.unshift(finalConversation);
    }
    replaceConversationStore(finalStore);

    return NextResponse.json({
      ...aiPayload,
      conversationId: finalConversation.id,
      conversation: finalConversation,
      customer: finalConversation.customerName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown backend error';
    return NextResponse.json(
      {
        error: `AI request failed: ${message}`,
        fallback: getMissingProviderMessage(),
      },
      { status: 500 },
    );
  }
}
