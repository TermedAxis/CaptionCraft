import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContentPlanRequest {
  contentType: "post" | "carousel" | "video";
  platform: string;
  topic: string;
  tone: string;
  targetAudience?: string;
  goal?: string;
  extraContext?: string;
}

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

function buildPostPrompt(params: ContentPlanRequest): string {
  return `You are an expert social media content strategist. Create a detailed social media post plan for ${params.platform}.

Topic: ${params.topic}
Tone: ${params.tone}
${params.targetAudience ? `Target Audience: ${params.targetAudience}` : ""}
${params.goal ? `Goal: ${params.goal}` : ""}
${params.extraContext ? `Extra Context: ${params.extraContext}` : ""}

Return a JSON object with this exact structure:
{
  "title": "Short descriptive title for this post",
  "hook": "Attention-grabbing opening line",
  "body": "Main post body content (2-4 paragraphs appropriate for ${params.platform})",
  "cta": "Call-to-action text",
  "hashtags": "5-10 relevant hashtags",
  "bestTimeToPost": "Best time/day to post for maximum reach",
  "contentTips": ["tip1", "tip2", "tip3"]
}`;
}

function buildCarouselPrompt(params: ContentPlanRequest): string {
  return `You are an expert social media content strategist. Create a detailed carousel post plan for ${params.platform}.

Topic: ${params.topic}
Tone: ${params.tone}
${params.targetAudience ? `Target Audience: ${params.targetAudience}` : ""}
${params.goal ? `Goal: ${params.goal}` : ""}
${params.extraContext ? `Extra Context: ${params.extraContext}` : ""}

Create a 5-7 slide carousel. Return a JSON object with this exact structure:
{
  "title": "Carousel title/theme",
  "coverSlide": {
    "headline": "Bold attention-grabbing headline for cover",
    "subtext": "Supporting text under headline"
  },
  "slides": [
    {
      "slideNumber": 2,
      "heading": "Slide heading",
      "bulletPoints": ["point 1", "point 2", "point 3"],
      "visualNote": "Brief description of what image/graphic would work well here"
    }
  ],
  "closingSlide": {
    "message": "Closing message or summary",
    "cta": "Call to action"
  },
  "caption": "Post caption to accompany the carousel",
  "hashtags": "8-12 relevant hashtags",
  "designTips": ["tip1", "tip2", "tip3"]
}

Include 4-6 content slides in the slides array.`;
}

function buildVideoPrompt(params: ContentPlanRequest): string {
  return `You are an expert short-form video content strategist. Create a detailed short video script and plan for ${params.platform}.

Topic: ${params.topic}
Tone: ${params.tone}
${params.targetAudience ? `Target Audience: ${params.targetAudience}` : ""}
${params.goal ? `Goal: ${params.goal}` : ""}
${params.extraContext ? `Extra Context: ${params.extraContext}` : ""}

Return a JSON object with this exact structure:
{
  "title": "Video title",
  "duration": "Recommended duration (e.g. 30s, 45s, 60s)",
  "hook": "First 3 seconds hook - what to say/show to stop the scroll",
  "script": [
    {
      "timestamp": "0-5s",
      "action": "What to do/show on screen",
      "voiceover": "What to say"
    }
  ],
  "bRollSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "textOverlays": ["overlay1", "overlay2", "overlay3"],
  "music": "Music vibe/genre recommendation",
  "caption": "Post caption for the video",
  "hashtags": "8-12 relevant hashtags",
  "productionTips": ["tip1", "tip2", "tip3"]
}

Include 4-8 script segments covering the full video.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const params: ContentPlanRequest = await req.json();

    if (!GROQ_API_KEY) {
      throw new Error("Groq API key not configured");
    }

    let prompt: string;
    if (params.contentType === "post") {
      prompt = buildPostPrompt(params);
    } else if (params.contentType === "carousel") {
      prompt = buildCarouselPrompt(params);
    } else {
      prompt = buildVideoPrompt(params);
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert social media content strategist. Always return valid JSON only, no markdown, no extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.75,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices[0].message.content;
    const result = JSON.parse(content);

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
