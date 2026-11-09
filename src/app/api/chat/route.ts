import { NextResponse } from 'next/server';
import { customers, knowledgeBase, memoryItems } from '@/lib/mock-data';

const customer = customers[0];

function buildDemoAnswer(message: string) {
  const text = message.toLowerCase();

  if (text.includes('delay') || text.includes('shipment') || text.includes('eta')) {
    return {
      answer:
        'I’m seeing the earlier delayed-order issue for Priya Nair. The customer previously reported a missed shipment and asked for a concise email summary after resolution. The delivery policy supports an ETA review and possible replacement when the order is delayed beyond the standard fulfillment window. I recommend confirming carrier status and sending a follow-up summary once the latest update is verified.',
      mode: 'demo',
      confidence: 0.94,
      memoryUsed: true,
      knowledgeUsed: true,
      escalationRecommended: text.includes('urgent') || text.includes('frustrated') || text.includes('escalate'),
      sources: ['Hindsight memory: delayed order issue', 'Knowledge base: delivery exceptions and replacement policy'],
    };
  }

  if (text.includes('refund') || text.includes('billing')) {
    return {
      answer:
        'I can help with the billing review. I would confirm the payment method, review any refund eligibility, and avoid making a promise until the billing exception policy is checked.',
      mode: 'demo',
      confidence: 0.9,
      memoryUsed: false,
      knowledgeUsed: true,
      escalationRecommended: false,
      sources: ['Knowledge base: refund eligibility and billing exceptions'],
    };
  }

  if (text.includes('password') || text.includes('login') || text.includes('mfa')) {
    return {
      answer:
        'This appears to be an account access issue. I would verify the user’s identity, reset the authentication challenge, and confirm the session is refreshed before making any configuration changes.',
      mode: 'demo',
      confidence: 0.89,
      memoryUsed: false,
      knowledgeUsed: true,
      escalationRecommended: false,
      sources: ['Knowledge base: identity verification and account access'],
    };
  }

  return {
    answer:
      'I’ve reviewed the available memory and the trusted support knowledge. I would summarize the issue, confirm the relevant policy, and keep the answer grounded in the customer’s prior context before escalating if the case remains unresolved.',
    mode: 'demo',
    confidence: 0.88,
    memoryUsed: true,
    knowledgeUsed: true,
    escalationRecommended: false,
    sources: ['Hindsight memory: previous customer history', 'Knowledge base: support playbook'],
  };
}

async function callConfiguredBackend(message: string) {
  const openAIApiKey = process.env.OPENAI_API_KEY;
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

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
            content:
              'You are RecallDesk AI, an enterprise support assistant. Use customer memory and knowledge when available and clearly cite sources when relevant.',
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
      memoryUsed: Boolean(memoryItems.length),
      knowledgeUsed: Boolean(knowledgeBase.length),
      escalationRecommended: false,
      sources: ['Live model response', 'Knowledge retrieval is enabled when configured'],
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
      memoryUsed: Boolean(memoryItems.length),
      knowledgeUsed: Boolean(knowledgeBase.length),
      escalationRecommended: false,
      sources: ['Azure OpenAI response', 'Retrieved support knowledge if configured'],
    };
  }

  return buildDemoAnswer(message);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message : '';

    if (!message.trim()) {
      return NextResponse.json({ error: 'A customer message is required.' }, { status: 400 });
    }

    const payload = await callConfiguredBackend(message);
    return NextResponse.json({
      ...payload,
      customer: customer.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown backend error';
    return NextResponse.json(
      {
        error: `AI request failed: ${message}`,
        fallback: 'The app has been configured in demo mode. Check the environment variables for the live provider credentials.',
      },
      { status: 500 },
    );
  }
}
