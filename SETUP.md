# CaptionCraft Setup Guide

## Prerequisites

Before using CaptionCraft, you need to configure the OpenAI API key for caption generation.

## OpenAI API Key Setup

1. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)

2. Add the API key as a secret to your Supabase Edge Function:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

## Local Development

For local development, you can also set the environment variable in your shell:

```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

## Stripe Integration (Optional)

To enable paid subscriptions:

1. Visit [bolt.new/setup/stripe](https://bolt.new/setup/stripe)
2. Follow the instructions to integrate Stripe
3. Configure your webhook endpoints
4. Update the subscription logic in the app

## Features

- **Free Tier**: 5 captions per day
- **Pro Tier**: Unlimited captions (requires Stripe setup)

## Database

The database schema is automatically created with:
- `profiles` - User profiles and subscription data
- `captions` - Saved captions
- `usage_tracking` - Daily usage limits for free tier

## Edge Functions

The app uses one Supabase Edge Function:
- `generate-caption` - Handles AI caption generation using OpenAI

This function is already deployed and ready to use once you configure the OpenAI API key.
