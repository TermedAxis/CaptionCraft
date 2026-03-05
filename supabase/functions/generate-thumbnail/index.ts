import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ThumbnailRequest {
  topic: string;
  style: string;
  emotion: string;
  colorTheme: string;
  textOverlay?: string;
  inspirationUrls?: string[];
  inspirationImages?: string[];
}

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");

function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

async function analyzeImageWithGroq(imageUrl: string, isDataUrl: boolean): Promise<string | null> {
  if (!GROQ_API_KEY) return null;

  try {
    const imageContent = isDataUrl
      ? { type: "image_url", image_url: { url: imageUrl } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              imageContent,
              {
                type: "text",
                text: "Analyze this thumbnail image and describe: 1) Color scheme (dominant colors, contrast level), 2) Composition (layout, focal points), 3) Emotional tone, 4) Text style if any (font weight, color, position), 5) Lighting style, 6) Overall visual impact. Be concise and specific.",
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

async function buildInspirationContext(
  inspirationUrls: string[],
  inspirationImages: string[]
): Promise<string> {
  const analyses: string[] = [];

  for (const url of inspirationUrls.slice(0, 5)) {
    const videoId = extractVideoId(url);
    if (!videoId) continue;
    const thumbUrl = getYoutubeThumbnailUrl(videoId);
    const analysis = await analyzeImageWithGroq(thumbUrl, false);
    if (analysis) {
      analyses.push(`YouTube thumbnail analysis: ${analysis}`);
    }
  }

  for (const imgData of inspirationImages.slice(0, 5)) {
    const analysis = await analyzeImageWithGroq(imgData, true);
    if (analysis) {
      analyses.push(`Uploaded image analysis: ${analysis}`);
    }
  }

  if (analyses.length === 0) return "";

  return `\n\nInspiration thumbnail analyses:\n${analyses.join("\n\n")}\n\nExtract the most effective visual elements from these analyses and incorporate them into the thumbnail design.`;
}

async function generatePromptWithGroq(
  params: ThumbnailRequest,
  inspirationContext: string
): Promise<string> {
  const styleGuide: Record<string, string> = {
    bold_youtube: "bold, high-contrast YouTube style with dramatic lighting, vibrant colors, and eye-catching composition typical of top YouTube creators",
    bright_creator: "bright, colorful, and energetic creator style with warm tones, friendly atmosphere, and engaging visual elements",
    minimal: "clean, minimal design with strong negative space, simple color palette, and elegant typography-focused composition",
    dramatic: "dramatic, cinematic style with dark shadows, intense lighting, strong contrast, and powerful emotional impact",
  };

  const emotionGuide: Record<string, string> = {
    excited: "excited, enthusiastic expression or imagery conveying high energy and positivity",
    shock: "shocked, surprised expression or imagery that creates intrigue and curiosity",
    curiosity: "curious, mysterious atmosphere that makes viewers want to click to find out more",
  };

  const systemPrompt = `You are an expert YouTube thumbnail designer. Generate a single detailed image generation prompt for a thumbnail.
Return ONLY a JSON object: {"imagePrompt": "your detailed prompt here"}
The prompt must be specific, visual, and optimized for the Stable Diffusion XL model.`;

  const userPrompt = `Create a YouTube thumbnail image generation prompt for:
Topic: ${params.topic}
Style: ${styleGuide[params.style] || params.style}
Emotion: ${emotionGuide[params.emotion] || params.emotion}
Color theme: ${params.colorTheme || "vibrant, high contrast"}
${params.textOverlay ? `Text overlay: "${params.textOverlay}" (bold, readable text in the thumbnail)` : ""}
${inspirationContext}

The prompt should describe a high-quality, professional YouTube thumbnail that would get high click-through rates.
Include specific details about: composition, lighting, colors, any human elements, background, text placement if applicable.
Start with "High contrast professional YouTube thumbnail," and make it compelling and specific.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate image prompt");
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  return result.imagePrompt || `High contrast professional YouTube thumbnail for "${params.topic}", ${params.emotion} emotion, ${params.style} style, ${params.colorTheme} colors`;
}

async function generateSingleImage(prompt: string, seed: number): Promise<string | null> {
  if (!STABILITY_API_KEY) return null;

  const response = await fetch(
    "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt, weight: 1 }],
        cfg_scale: 7,
        sampler: "K_DPM_2_ANCESTRAL",
        seed,
        steps: 25,
      }),
    }
  );

  if (!response.ok) {
    console.error("Image generation failed:", response.status, await response.text());
    return null;
  }

  const result = await response.json();
  const b64 = result?.artifacts?.[0]?.base64 ?? result?.image ?? result?.data?.[0]?.b64_json;
  if (!b64) return null;
  return `data:image/png;base64,${b64}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!GROQ_API_KEY) throw new Error("Groq API key not configured");
    if (!STABILITY_API_KEY) throw new Error("Image generation API key not configured");

    const params: ThumbnailRequest = await req.json();

    const inspirationContext = await buildInspirationContext(
      params.inspirationUrls || [],
      params.inspirationImages || []
    );

    const imagePrompt = await generatePromptWithGroq(params, inspirationContext);

    const seeds = [42, 1337, 99999];
    const imagePromises = seeds.map((seed) => generateSingleImage(imagePrompt, seed));
    const imageResults = await Promise.all(imagePromises);
    const imageUrls = imageResults.filter((url): url is string => url !== null);

    if (imageUrls.length === 0) {
      throw new Error("Failed to generate any thumbnail images");
    }

    return new Response(
      JSON.stringify({ imageUrls, imagePrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
