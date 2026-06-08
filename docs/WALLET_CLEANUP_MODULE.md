# Wallet Cleanup Module

## Overview
The Wallet Cleanup module is a comprehensive toolkit for organizing and managing your blockchain wallet assets. It uses AI-powered detection to identify spam tokens and NFTs, helping you maintain a clean and organized wallet.

## Key Features

### Token Management
- View all ERC-20 tokens in your wallet
- Sort by balance, value, and recently added
- Transfer or sell tokens in bulk
- Track token prices and values

### NFT Organization
- Browse and manage your NFT collection
- Identify and hide low-value or spam NFTs
- Organize by collection, rarity, and floor price
- Quick view of total NFT portfolio value

### Spam Detection
- AI-powered spam token detection
- Identify suspicious contracts
- One-click removal of spam assets
- Whitelist trusted tokens

### Bulk Actions
- Select multiple assets for batch operations
- Transfer groups of tokens simultaneously
- Hide or archive spam items
- Export wallet inventory

## How It Works

1. **Connect Wallet** - Link your wallet using supported providers (Slush, Glass, Martian, TokenPocket, OneKey)
2. **Scan Assets** - The module scans your wallet and categorizes assets
3. **Review Suggestions** - AI analyzes assets and marks potential spam
4. **Organize** - Manually hide, archive, or organize your portfolio
5. **Export** - Download a clean inventory of your assets

## Technical Details

- **Supported Networks**: Sui blockchain
- **Data Source**: On-chain smart contracts and NFT metadata
- **Processing**: Real-time analysis with caching for performance
- **Storage**: User preferences stored locally (no personal data retained)

## Best Practices

- Regularly review and organize your wallet
- Enable notifications for new asset transfers
- Keep your whitelist updated with trusted projects
- Export regular backups of your portfolio

## API Integration

The module integrates with:
- Blockchain RPC providers for wallet data
- NFT metadata services for collection information
- Price feeds for real-time valuations
- AI models for spam detection algorithms
