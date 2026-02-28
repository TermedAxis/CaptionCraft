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
  seed?: number;
}

async function fetchWithRetry(url: string, retries = 3, delayMs = 1500): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) return response;
      if (response.status === 530 || response.status === 503 || response.status === 502) {
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
          continue;
        }
        throw new Error(`Image service unavailable (${response.status}). Please try again.`);
      }
      throw new Error(`Image service error: ${response.status}`);
    } catch (err) {
      clearTimeout(timeout);
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Image generation failed after retries. Please try again.");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { prompt, width = 1024, height = 1024, seed }: GenerateImageRequest = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const seedValue = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);

    const urls = [
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true&seed=${seedValue}&model=flux`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seedValue}`,
    ];

    let imageResponse: Response | null = null;
    let lastError: Error | null = null;

    for (const url of urls) {
      try {
        imageResponse = await fetchWithRetry(url, 2, 1000);
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        continue;
      }
    }

    if (!imageResponse) {
      throw lastError ?? new Error("Image generation failed. Please try again.");
    }

    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await imageResponse.arrayBuffer();
    const bytes = new Uint8Array(imageBuffer);

    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    const dataUrl = `data:${contentType};base64,${base64}`;

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
