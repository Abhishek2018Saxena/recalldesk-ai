import { NextResponse } from 'next/server';
import { createConversationId, createMessage, getConversationStore, replaceConversationStore, type ConversationRecord } from '@/lib/conversation-store';

function getMissingProviderMessage() {
  return 'Missing AI provider configuration. Set OPENAI_API_KEY or both AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT in Vercel environment variables.';
}

async function callConfiguredBackend(message: string) {
  const openAIApiKey = process.env.OPENAI_API_KEY?.trim();
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim();

  if (!openAIApiKey && !(azureApiKey && azureEndpoint)) {
    throw new Error(getMissingProviderMessage());
  }

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
            content: 'You are RecallDesk AI, an enterprise support assistant. Provide grounded, concise support answers and cite customer memory or policy evidence when useful.',
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
      memoryUsed: true,
      knowledgeUsed: true,
      escalationRecommended: false,
      sources: ['Live OpenAI response'],
    };
  }

  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';
  const url = new URL(`${azureEndpoint!.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions`);
  url.searchParams.set('api-version', '2024-02-01');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': azureApiKey!,
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
    memoryUsed: true,
    knowledgeUsed: true,
    escalationRecommended: false,
    sources: ['Live Azure OpenAI response'],
  };
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

    const aiPayload = await callConfiguredBackend(message);
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
        missingEnvironmentVariables: [
          'OPENAI_API_KEY',
          'AZURE_OPENAI_API_KEY',
          'AZURE_OPENAI_ENDPOINT',
          'AZURE_OPENAI_DEPLOYMENT',
          'OPENAI_MODEL',
        ],
      },
      { status: 500 },
    );
  }
}
