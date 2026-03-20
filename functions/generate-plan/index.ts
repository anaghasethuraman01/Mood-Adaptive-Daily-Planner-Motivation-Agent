import { createClient } from 'npm:@insforge/sdk@latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default async function (req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { mood, energy, time, goals } = await req.json();

    const insforge = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL') || '',
      anonKey: Deno.env.get('ANON_KEY') || '',
    });

    const prompt = `
You are a friendly productivity assistant.

User info:
Mood: ${mood}
Energy level (1-5): ${energy}
Time available: ${time} minutes
Goals: ${goals || 'general productivity'}

Task requirements:
1. Short mood-appropriate motivational message.
2. Prioritized, time-aware daily plan (tasks + durations) that TOTAL ≤ ${time} minutes.
3. One micro-activity (1–5 min): breathing, stretching, or journaling.

Return ONLY valid JSON with keys:
- motivation_message
- daily_plan (list of tasks with 'task', 'duration_min', 'priority')
- micro_activity
`;

    const completion = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o-mini', // Using a reliable model
      messages: [
        { role: 'system', content: 'You are a mood-adaptive daily planner agent.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const rawContent = completion.choices[0].message.content || '';
    // Clean up potential code blocks
    const cleanedContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(cleanedContent);
    } catch (e) {
      console.error('Failed to parse AI response:', cleanedContent);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
