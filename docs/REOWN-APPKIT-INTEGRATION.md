# Reown AppKit Integration Guide

## Overview

Atlas Protocol now supports Reown AppKit (formerly WalletConnect v3), providing a searchable modal with 100+ wallet options including:
- **Native Sui Wallets**: Slush, Suiet, Martian Sui Wallet
- **Multi-chain Wallets**: Phantom, OKX, TokenPocket, MetaMask, Trust Wallet, Rainbow, Coinbase
- **Hardware Wallets**: Ledger Live, Keystone

## Features

✅ **Desktop**: Click to select wallets from searchable list  
✅ **Mobile**: QR code scanning for mobile wallets  
✅ **Sui-aware**: Marks wallets with/without Sui support  
✅ **Categorized**: Native, Multi-chain, and Hardware wallets separated  
✅ **Search**: Filter wallets by name or category  
✅ **Warnings**: Toast alerts for unsupported wallets  

## Implementation

### Components

- **ReownWalletModal**: Full wallet browser with search and categorization
- **ReownProvider**: Lazy-loads Reown AppKit when available
- **WalletConnectionModal**: Updated to show "More Wallets" button linking to Reown modal

### How to Use

1. **Native Wallets** (preferred): Click on installed wallet (Slush, Suiet, etc.)
2. **More Wallets**: Click "More Wallets (100+ Available)" button to open searchable Reown modal
3. **Desktop**: Select wallet from list → direct connection
4. **Mobile**: Select wallet → QR code scan prompt

### Wallet Support Status

| Wallet | Sui Support | Type |
|--------|------------|------|
| Slush | ✅ | Native |
| Suiet | ✅ | Native |
| Martian | ✅ | Native |
| Phantom | ✅ | Multi-chain |
| OKX | ✅ | Multi-chain |
| TokenPocket | ✅ | Multi-chain |
| Ledger | ✅ | Hardware |
| Keystone | ✅ | Hardware |
| MetaMask | ⚠️ | Multi-chain |
| Trust | ⚠️ | Multi-chain |
| Rainbow | ⚠️ | Multi-chain |
| Coinbase | ⚠️ | Multi-chain |

⚠️ = No Sui support (users get warning toast)

## Configuration

No additional environment variables needed. Uses existing `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` if available for QR support.

## Testing

1. Open wallet connection modal
2. Click "More Wallets (100+ Available)"
3. Search for a wallet (e.g., "Phantom")
4. Desktop: Click to connect directly
5. Mobile: Click → get QR scan prompt
6. Try unsupported wallet → should see warning toast
