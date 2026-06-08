# WalletConnect Integration Guide

## Overview

Atlas Protocol now supports **WalletConnect** for QR code connections, enabling:
- Mobile wallet connections (via QR scan)
- Hardware wallet support (Ledger, Keystone)
- Cross-chain wallet connections
- All existing native Sui wallets remain fully functional

## Setup

### 1. Get WalletConnect Project ID

1. Visit [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Name it "Atlas Protocol"
5. Copy the **Project ID**

### 2. Add Environment Variable

Add to `.env.local`:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

### 3. Install Dependencies

```bash
npm install @web3modal/sui @walletconnect/modal
```

## Usage

### For Users

1. Open the wallet connection modal
2. Click "WalletConnect (QR Code)" at the top
3. Scan the QR code with your mobile wallet or hardware device
4. Approve the connection
5. Sign transactions as normal

### For Developers

The WalletConnect integration is automatically available in:
- Wallet Cleanup module
- Transaction Explainer module
- Any component using `WalletConnectionModal`

## Dual Wallet System

**Native Sui Wallets** (fast, browser extensions):
- Slush, Suiet, Phantom, GlassWallet, Martian, Nightly, OKX, OneKey, Surf, TokenPocket

**WalletConnect** (QR code, mobile/hardware):
- All WalletConnect-compatible wallets via mobile app or hardware device

Both systems work simultaneously and seamlessly.

## Troubleshooting

### "WalletConnect not configured"
- Ensure `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set in `.env.local`
- Restart dev server after adding env var

### QR code not appearing
- Check browser console for errors
- Verify Project ID is correct and active on walletconnect.com

### Connection timeout
- Ensure your mobile wallet app is up to date
- Check network connectivity
- Try again with a different wallet

## References

- [WalletConnect Sui Docs](https://docs.walletconnect.com/web3modal/javascript/sui)
- [Web3Modal Sui Integration](https://docs.walletconnect.com/web3modal/javascript/sui/about)
