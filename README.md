# Atlas Protocol — The Hub for Sui

![Next.js](https://img.shields.io/badge/Next.js-16-000000) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4) ![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E)

> The discovery layer for the Sui ecosystem — a curated directory of protocols and infrastructure providers, with a provider-listing portal and admin moderation, and the marketing front for the Atlas toolkit.

**Status:** Landing & portal — builds and runs locally.

## Screens

<p align="center">
  <img src="screenshots/04.png" width="240" />
  <img src="screenshots/05.png" width="240" />
  <img src="screenshots/06.png" width="240" />
</p>

## What It Is

A single, designed entry point to Sui: discover protocols across ~19 categories, browse and apply as an infrastructure provider, and explore the tools — then jump into the interactive app. Built as the public face that sits in front of the Atlas dApp.

## Features

- **Protocol ecosystem directory** — protocols across ~19 categories (wallets, DEX, bridges, perps, lending, liquid staking, oracles, NFT, RWA, gaming, SocialFi, DePIN, storage, identity, launchpads, prediction markets, AI agents, BTC primitives, hardware wallets).
- **Infrastructure provider portal** — listings, provider applications, ratings, and a full admin moderation dashboard (approve / reject / feature / delete).
- **Tool showcase** — overview pages for swap, bridge, stake, oracle feeds, explorer, wallet cleanup, and the AI transaction explainer.
- **Support** — partner tiers, docs hub, contact, and legal pages.

## Engineering Highlights

- **Provider moderation workflow** — application intake, ratings, logo upload, and admin actions backed by Supabase.
- **Keyless builds** — Supabase calls fall back to a mock client when env vars are absent, so the site builds and runs with zero secrets.
- **Strict design system** — a 5-color palette (`#070D1A` / `#F0F4FF` / `#2B7FFF` / `#0F1629`), Space Grotesk + Inter typography.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Supabase (Postgres) — optional, with mock fallback |
| Hosting | Vercel |

## Getting Started

```bash
npm install --legacy-peer-deps
cp .env.example .env.local     # optional — runs with a mock client if omitted
npm run dev                    # http://localhost:3000
```

## Notes

The interactive dApp is a separate application. Shared as a portfolio artifact demonstrating product and system design.

## The Atlas Ecosystem

Part of the Atlas ecosystem on Sui:

| Repository | Role |
|---|---|
| **atlas-website** (this repo) | Landing site & provider portal |
| [atlas-app](https://github.com/plinkdev1/atlas-app) | dApp + Sui Move contracts |
| [airpoints](https://github.com/plinkdev1/airpoints) | Loyalty & rewards engine — the $ATLAS flywheel |
