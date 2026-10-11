# ChinaProHub Deployment Guide

## Prerequisites

1. **Supabase Project** — Create at https://supabase.com/dashboard
   - Run `supabase/schema.sql` in SQL Editor
   - Copy Project URL and anon key to `.env.local`

2. **Meilisearch Cloud** (optional, for production search) — https://www.meilisearch.com/cloud
   - Create an index named `enterprises`
   - Copy URL and API key to `.env.local`

3. **Vercel Account** — https://vercel.com

## Environment Variables

Set these in Vercel Project Settings > Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_MEILISEARCH_URL` | No | Meilisearch instance URL |
| `MEILISEARCH_API_KEY` | No | Meilisearch API key |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | No | Plausible domain |
| `NEXT_PUBLIC_ANALYTICS_API` | No | Plausible API host |

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## Cloudflare Setup

1. Add domain to Cloudflare
2. Set nameservers
3. In DNS settings, add CNAME record:
   - Name: `@` → Value: `cname.vercel-dns.com`
   - Name: `www` → Value: `cname.vercel-dns.com`
4. Enable "Always Use HTTPS"
5. Enable "Automatic HTTPS Rewrites"
6. Set SSL/TLS mode to "Full"

## Post-Deployment

1. Submit sitemap to Google Search Console: `https://chinaprohub.com/sitemap.xml`
2. Verify hreflang tags are correct
3. Test all 6 locale versions
4. Set up Supabase database backups
