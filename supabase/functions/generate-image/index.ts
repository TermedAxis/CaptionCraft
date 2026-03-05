import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateImageRequest {
  prompt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

function getDimensions(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "16:9": return { width: 1280, height: 720 };
    case "9:16": return { width: 720, height: 1280 };
    case "4:3":  return { width: 1024, height: 768 };
    case "3:4":  return { width: 768, height: 1024 };
    default:     return { width: 1024, height: 1024 };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("STABILITY_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { prompt, aspectRatio = "1:1" }: GenerateImageRequest = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = {
      text_prompts: [
        { text: prompt, weight: 1 },
      ],
      cfg_scale: 5,
      sampler: "K_DPM_2_ANCESTRAL",
      seed: 0,
      steps: 25,
    };

    const response = await fetch(
      "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA NIM error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Image generation failed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();

    const b64 = result?.artifacts?.[0]?.base64 ?? result?.image ?? result?.data?.[0]?.b64_json;
    if (!b64) {
      console.error("Unexpected response shape:", JSON.stringify(result));
      return new Response(
        JSON.stringify({ error: "No image data in response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const dataUrl = `data:image/png;base64,${b64}`;

    return new Response(
      JSON.stringify({ imageUrl: dataUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
