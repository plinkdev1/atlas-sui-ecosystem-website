# Blockberry API Setup Guide

## Overview
The Wallet Cleanup tool uses Blockberry API for enhanced security scanning of tokens and NFTs on the Sui blockchain. This provides real-time scam detection, security risk assessment, and metadata enrichment.

## Manual Setup Required

### 1. Get Blockberry API Key

1. Visit [Blockberry API Portal](https://blockberry.one) (or appropriate Blockberry developer portal)
2. Sign up for an account
3. Create a new API project
4. Copy your API key

### 2. Add Environment Variable

Add the following environment variable to your Vercel project:

```
BLOCKBERRY_API_KEY=your_api_key_here
```

**In Vercel Dashboard:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add new variable: `BLOCKBERRY_API_KEY`
4. Set value to your API key
5. Select environments: Production, Preview, Development
6. Save changes

**In Local Development (.env.local):**
```bash
BLOCKBERRY_API_KEY=your_api_key_here
```

### 3. Verify Integration

The Wallet Cleanup tool will automatically:
- Check for API key availability
- Show API status indicator in the UI
- Fall back to basic blockchain scanning if API is unavailable
- Display enhanced security badges when API is active

## Features Enabled by Blockberry API

- **Token Security Scanning**: Real-time scam detection for tokens
- **NFT Security Assessment**: Risk analysis for NFT collections
- **Metadata Enrichment**: Additional token/NFT information
- **Community Reports**: Access to scam database and community reports
- **Floor Price Data**: NFT collection floor prices
- **Security Confidence Scores**: AI-powered risk assessment

## API Endpoints Used

The integration uses the following Blockberry API endpoints via `/api/blockberry`:

- `POST /api/blockberry` - Token security check (`type: "coin-security"`)
- `POST /api/blockberry` - NFT security check (`type: "nft-security"`)
- `POST /api/blockberry` - Token metadata (`type: "coin-metadata"`)
- `POST /api/blockberry` - NFT metadata (`type: "nft-metadata"`)
- `POST /api/blockberry` - Transaction security (`type: "tx-security"`)

## Fallback Behavior

If `BLOCKBERRY_API_KEY` is not set:
- Tool continues to work with basic Sui RPC scanning
- Security checks use local classification database
- Enhanced features are disabled gracefully
- User sees "API unavailable" notice in UI

## Rate Limits

Check your Blockberry API plan for rate limits. The integration includes:
- Automatic retry logic for failed requests
- Graceful degradation if API limits are reached
- Local caching to reduce API calls

## Troubleshooting

**Error: "Security check unavailable"**
- Verify `BLOCKBERRY_API_KEY` is set in environment variables
- Check API key is valid and active
- Verify network connectivity to Blockberry API

**Error: "Enhanced data unavailable"**
- API may be temporarily down
- Rate limit may be exceeded
- Check Vercel logs for detailed error messages

## Support

For Blockberry API support:
- Documentation: [Blockberry Docs](https://docs.blockberry.one)
- Support: support@blockberry.one
- Status: [Blockberry Status Page](https://status.blockberry.one)
