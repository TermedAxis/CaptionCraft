import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CaptionRequest {
  platform: string;
  contentType: string;
  topic: string;
  hook?: string;
  targetAudience?: string;
  tone: string;
  cta?: string;
  emojiLevel: string;
  includeHashtags: boolean;
  customHashtags?: string[];
}

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

function buildPrompt(params: CaptionRequest): string {
  const platformGuidelines: Record<string, string> = {
    instagram: "Use line breaks for readability. Include 5-10 relevant hashtags at the end. Optimize for visual storytelling.",
    tiktok: "Keep it short, punchy, and viral. Use trending language. Maximum 150 characters for best results.",
    linkedin: "Professional yet engaging. Use storytelling and whitespace. Focus on value and insights.",
    twitter: "Concise and impactful. Maximum 280 characters. Use thread-style if needed.",
    youtube: "Engaging hook in first line. Describe the content value. Include relevant keywords."
  };

  const emojiGuidelines: Record<string, string> = {
    none: "Do not use any emojis.",
    light: "Use 1-2 emojis total, only where natural.",
    medium: "Use 3-5 emojis to highlight key points.",
    heavy: "Use emojis frequently (6-10) to create visual interest."
  };

  const hashtagInstructions = !params.includeHashtags
    ? 'Do NOT include any hashtags. Leave the hashtags field as an empty string.'
    : params.customHashtags && params.customHashtags.length > 0
    ? `MUST include these specific hashtags: ${params.customHashtags.map(t => `#${t}`).join(' ')}. You may add additional relevant hashtags alongside them.`
    : 'Include relevant hashtags appropriate for the platform.';

  return `You are an expert social media copywriter specializing in ${params.platform} content.

Create 3 variations of a ${params.platform} caption with these requirements:

Platform: ${params.platform}
Content Type: ${params.contentType}
Topic: ${params.topic}
${params.hook ? `Hook (use this as opening line): ${params.hook}` : ''}
${params.targetAudience ? `Target Audience: ${params.targetAudience}` : ''}
Tone: ${params.tone}
${params.cta ? `Call-to-Action: ${params.cta}` : ''}
Emoji Level: ${params.emojiLevel}

Platform Guidelines: ${platformGuidelines[params.platform.toLowerCase()] || 'Follow best practices for engagement.'}
Emoji Rules: ${emojiGuidelines[params.emojiLevel]}
Hashtag Rules: ${hashtagInstructions}

IMPORTANT RULES:
- Make each variation meaningfully different in style and approach
- Avoid cliché phrases and overused language
- Be authentic and human-sounding
- Match the platform's culture and best practices
- Respect character limits for ${params.platform}
- Format appropriately for ${params.platform} (line breaks, spacing, etc.)
- ${params.cta ? `Include the CTA naturally: ${params.cta}` : ''}

Return a JSON object with this exact structure:
{
  "variations": [
    {
      "version": "A",
      "caption": "caption text here",
      "hashtags": "hashtags here or empty string if disabled"
    },
    {
      "version": "B",
      "caption": "caption text here",
      "hashtags": "hashtags here or empty string if disabled"
    },
    {
      "version": "C",
      "caption": "caption text here",
      "hashtags": "hashtags here or empty string if disabled"
    }
  ]
}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const params: CaptionRequest = await req.json();

    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const prompt = buildPrompt(params);

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert social media caption writer. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices[0].message.content;
    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
