import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ScriptRequest {
  platform: string;
  topic: string;
  targetAudience: string;
  tone: string;
  length: string;
  cta?: string;
  variations: number;
  inspirationUrls?: string[];
  existingScript?: string;
  cutDown?: boolean;
}

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchTranscript(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.youtube-transcript.io/api/transcripts?videoId=${videoId}`,
      { headers: { "Accept": "application/json" } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (data && Array.isArray(data.transcripts) && data.transcripts.length > 0) {
      const segments = data.transcripts[0].segments || [];
      return segments.map((s: { text: string }) => s.text).join(" ").trim();
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchTranscriptFallback(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://yt-transcript-api.vercel.app/api/transcript?videoId=${videoId}`,
      { headers: { "Accept": "application/json" } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data)) {
      return data.map((s: { text: string }) => s.text).join(" ").trim();
    }
    return null;
  } catch {
    return null;
  }
}

function getLengthDescription(length: string): string {
  switch (length) {
    case "very_short": return "very short (under 30 seconds when read aloud, roughly 75-100 words total)";
    case "short": return "short (30-60 seconds when read aloud, roughly 100-150 words total)";
    case "medium": return "medium length (5-10 minutes when read aloud, roughly 750-1500 words total)";
    case "long": return "long (10-15 minutes when read aloud, roughly 1500-2250 words total)";
    case "very_long": return "very long (20-25 minutes when read aloud, roughly 3000-3750 words total)";
    default: return "short (30-60 seconds)";
  }
}

function buildScriptPrompt(params: ScriptRequest, transcriptContext: string): string {
  const lengthDesc = getLengthDescription(params.length);
  const platformGuide: Record<string, string> = {
    youtube: "YouTube (long-form, structured, educational or entertaining, SEO-optimized)",
    instagram_reels: "Instagram Reels (fast-paced, visually driven, punchy, trend-aware)",
    tiktok: "TikTok (casual, energetic, fast hooks, on-trend slang if appropriate)",
    youtube_shorts: "YouTube Shorts (ultra-concise, hook-first, vertical format)",
  };

  const toneGuide: Record<string, string> = {
    educational: "educational and informative — teach the viewer something valuable",
    storytelling: "storytelling-driven — use narrative, personal anecdotes, and emotional arcs",
    entertaining: "entertaining and fun — keep energy high, use humor and personality",
    professional: "professional and authoritative — polished, credible, business-appropriate",
  };

  return `You are an expert video script writer specializing in ${platformGuide[params.platform] || params.platform}.

Write a ${lengthDesc} video script with a ${toneGuide[params.tone] || params.tone} style.

Topic: ${params.topic}
Target Audience: ${params.targetAudience}
${params.cta ? `Call to Action: ${params.cta}` : ""}
${transcriptContext}

CRITICAL REQUIREMENTS:
- The hook MUST be attention-grabbing, provocative, or curiosity-inducing — this is what stops the scroll
- The entire script must feel CONVERSATIONAL, like a real person speaking naturally
- Use short sentences and natural pauses
- Match the length requirement strictly: ${lengthDesc}
- Each main point should be concrete, specific, and actionable
- Maintain originality — do NOT copy content from inspiration sources
${params.cta ? `- End with a clear, compelling CTA: "${params.cta}"` : ""}

Return a JSON object with this exact structure:
{
  "hook": "The first 1-3 sentences. Must immediately grab attention.",
  "intro": "Brief intro, 2-4 sentences. Set up what the viewer will learn/experience.",
  "mainPoints": [
    {
      "title": "Point title",
      "content": "Full spoken content for this point"
    }
  ],
  "cta": "Closing call to action. Specific and compelling.",
  "estimatedDuration": "e.g. 45 seconds",
  "wordCount": 120
}

Include 3-6 main points appropriate for the script length. Make all content ready to read aloud verbatim.`;
}

function buildCutDownPrompt(existingScript: string, targetLength: string): string {
  const lengthDesc = getLengthDescription(targetLength);
  return `You are an expert video script editor.

Below is a video script. Cut it down to be ${lengthDesc}.
Preserve the HOOK and CTA. Remove or compress main points. Keep the most impactful content.
Maintain the conversational tone.

Original script (JSON):
${existingScript}

Return the shortened version using the SAME JSON structure:
{
  "hook": "...",
  "intro": "...",
  "mainPoints": [{"title": "...", "content": "..."}],
  "cta": "...",
  "estimatedDuration": "...",
  "wordCount": 0
}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error("Groq API key not configured");
    }

    const params: ScriptRequest = await req.json();

    if (params.cutDown && params.existingScript) {
      const prompt = buildCutDownPrompt(params.existingScript, params.length);
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are an expert script editor. Return valid JSON only, no markdown, no extra text." },
            { role: "user", content: prompt },
          ],
          temperature: 0.6,
          response_format: { type: "json_object" },
        }),
      });

      if (!groqResponse.ok) {
        const err = await groqResponse.text();
        throw new Error(`Groq API error: ${err}`);
      }

      const groqData = await groqResponse.json();
      const result = JSON.parse(groqData.choices[0].message.content);
      return new Response(JSON.stringify({ variations: [result] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let transcriptContext = "";
    if (params.inspirationUrls && params.inspirationUrls.length > 0) {
      const transcriptParts: string[] = [];
      for (let i = 0; i < Math.min(params.inspirationUrls.length, 5); i++) {
        const url = params.inspirationUrls[i];
        const videoId = extractVideoId(url);
        if (!videoId) continue;

        let transcript = await fetchTranscript(videoId);
        if (!transcript) {
          transcript = await fetchTranscriptFallback(videoId);
        }

        if (transcript) {
          const truncated = transcript.slice(0, 2000);
          transcriptParts.push(`Video ${i + 1} transcript:\n${truncated}`);
        }
      }

      if (transcriptParts.length > 0) {
        transcriptContext = `\nInspiration transcripts from similar videos:\n\n${transcriptParts.join("\n\n")}\n\nUse these as inspiration for style, pacing, and storytelling structure but DO NOT copy content directly.`;
      }
    }

    const variationCount = Math.min(Math.max(params.variations || 1, 1), 3);
    const variations: object[] = [];

    for (let i = 0; i < variationCount; i++) {
      const prompt = buildScriptPrompt(params, transcriptContext);

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are an expert video script writer. Return valid JSON only, no markdown, no extra text." },
            { role: "user", content: prompt },
          ],
          temperature: 0.75 + i * 0.05,
          response_format: { type: "json_object" },
        }),
      });

      if (!groqResponse.ok) {
        const err = await groqResponse.text();
        throw new Error(`Groq API error: ${err}`);
      }

      const groqData = await groqResponse.json();
      const result = JSON.parse(groqData.choices[0].message.content);
      variations.push(result);
    }

    return new Response(JSON.stringify({ variations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
