# Wallet System Verification Tests

## Manual Test Checklist

### Test 1: Sui Wallet Connection (Native)
**Objective**: Verify Sui wallet connects and persists across pages

**Steps**:
1. Open Atlas Protocol app in browser with Sui wallet installed (Phantom, Slush, etc.)
2. Click "Connect Wallet" in header
3. ✓ Modal opens showing installed Sui wallets
4. Select a wallet (e.g., Phantom)
5. ✓ Wallet popup appears for approval
6. Approve connection in wallet
7. ✓ Modal closes, header shows connected address
8. Navigate to different page (My Hub, Wallet Cleanup, Infra Discovery)
9. ✓ Still connected - no reconnection needed
10. Reload page
11. ✓ Still connected - localStorage restored connection

**Expected Results**:
- ✓ Wallet detected on first load
- ✓ No re-connect prompts when navigating
- ✓ Connection persists after page reload
- ✓ Browser console has no errors
- ✓ Wallet name and logo display correctly

---

### Test 2: ReOwn Wallet Connection (Fallback)
**Objective**: Verify 100+ wallet support via ReOwn modal

**Steps**:
1. Click "Connect Wallet" in header
2. Click "Connect with WalletConnect (100+ Wallets)" button
3. ✓ ReOwn modal opens with wallet browser
4. Search for "MetaMask" or other multi-chain wallet
5. ✓ Wallet appears in list
6. Select wallet
7. ✓ Wallet selection interface appears (QR for mobile, connection for desktop)
8. Complete connection (follow wallet prompts)
9. ✓ Modal closes, connection reflects in header

**Expected Results**:
- ✓ Modal shows 100+ wallets categorized
- ✓ Search filters wallets by name/category
- ✓ Non-Sui wallets show warning but still connectable
- ✓ Connection integrates with global state
- ✓ No disabled buttons or grayed-out UI

---

### Test 3: Wallet Disconnect
**Objective**: Verify disconnect clears all state properly

**Steps**:
1. Connect a wallet (any type)
2. Click wallet address in header
3. Select "Disconnect"
4. ✓ Disconnection toast appears
5. ✓ Header shows "Connect Wallet" button again
6. Navigate to any page
7. ✓ Still disconnected, no auto-reconnect
8. Reload page
9. ✓ Still disconnected, localStorage cleared

**Expected Results**:
- ✓ Disconnect removes global state
- ✓ No wallet info persists
- ✓ localStorage cleared (check DevTools → Application → Storage)
- ✓ No errors in browser console

---

### Test 4: Logo Rendering
**Objective**: Verify wallet logos display correctly

**Steps**:
1. Open "Connect Wallet" modal
2. Check installed wallets list
3. ✓ Each wallet shows correct logo/icon
4. Hover over wallet logos
5. ✓ No broken image icons
6. If logo fails to load, ✓ fallback initials display
7. Navigate to Infra Discovery page
8. Check partner/infrastructure modals
9. ✓ Brand logos render (Blockvision, Shinami, etc.)

**Expected Results**:
- ✓ All wallet logos load (Phantom, Slush, etc.)
- ✓ All brand logos load (AllThatNode, Blockvision, etc.)
- ✓ Initials fallback works if image fails
- ✓ No console image errors

---

### Test 5: Multi-Page Persistence
**Objective**: Verify wallet state persists across all pages

**Pages to Test**:
- [ ] Homepage (/)
- [ ] My Hub (/my-hub)
- [ ] Wallet Cleanup (/wallet-cleanup)
- [ ] Infra Discovery (/infra-discovery)
- [ ] Cleanup Analysis (internal page)

**Steps for Each Page**:
1. Connect wallet on page A
2. Navigate to page B
3. ✓ Wallet still connected (check header)
4. Navigate to page C
5. ✓ Wallet still connected
6. Check browser console → ✓ no errors
7. Check React DevTools → ✓ provider hierarchy intact

**Expected Results**:
- ✓ No "useUnifiedWallet must be used within..." errors
- ✓ Wallet persists across all pages
- ✓ No provider nesting issues
- ✓ No duplicate providers in DevTools

---

### Test 6: Network Switching
**Objective**: Verify wallet state handles network changes

**Steps**:
1. Connect wallet on Mainnet
2. Open network switcher
3. Switch to Testnet
4. ✓ Wallet disconnects (Sui requirement)
5. Connect wallet on Testnet
6. ✓ Header shows "Sui Testnet" badge
7. Navigate pages
8. ✓ Testnet connection persists

**Expected Results**:
- ✓ Network badge displays correctly
- ✓ Switching networks reconnects properly
- ✓ No state corruption

---

### Test 7: Browser Console Verification
**Steps**:
1. Open DevTools (F12)
2. Go to Console tab
3. Connect wallet
4. Watch console output
5. ✓ No red errors
6. ✓ No yellow warnings (except external scripts)
7. Disconnect wallet
8. ✓ No errors
9. Navigate pages
10. ✓ No provider nesting errors

**Expected Errors**: None (or only warnings from external libraries)

---

### Test 8: Mobile Responsiveness
**Steps (use DevTools responsive mode or actual device)**:
1. Set viewport to mobile (375px width)
2. Open Connect Wallet modal
3. ✓ Modal fits on screen
4. ✓ Wallet list scrolls properly
5. Open ReOwn modal
6. ✓ Shows QR code for mobile wallets
7. Scroll through wallet list
8. ✓ No layout issues

**Expected Results**:
- ✓ All modals responsive
- ✓ Text readable at mobile size
- ✓ Touch targets adequate (>44px)

---

## Automated Test Commands

### Check Build
```bash
npm run build
# ✓ Build succeeds with no errors
```

### Lint Check
```bash
npm run lint
# ✓ No linting errors (warnings okay)
```

### Type Check
```bash
npx tsc --noEmit
# ✓ No TypeScript errors
```

---

## Browser DevTools Checks

### LocalStorage Verification
```javascript
// In Browser Console:
JSON.parse(localStorage.getItem('atlas-wallet-storage'))

// Expected output when connected:
{
  state: {
    currentAccount: "0x...",
    walletName: "Phantom",
    isConnected: true,
    // ... other fields
  },
  version: 0
}
```

### React DevTools Provider Check
1. Open React DevTools
2. Look for component tree
3. ✓ No duplicate SuiProvider
4. ✓ No duplicate UnifiedWalletProvider
5. ✓ WalletProvider between SuiClientProvider and UnifiedWalletProvider

**Expected Hierarchy**:
```
<ProProvider>
  <NetworkProvider>
    <SuiProvider>
      <QueryClientProvider>
        <SuiClientProvider>
          <WalletProvider>
            <UnifiedWalletProvider>
              <ThemeProvider>
                <PostHogProvider>
                  <ClientLayout>
```

---

## Issue Resolution

### Issue: "useUnifiedWallet must be used within UnifiedWalletProvider"
**Fix**:
- Check component is not using hook in Server Component
- Ensure `"use client"` at top of file
- Verify component is inside SuiProvider

### Issue: Wallet Not Detected
**Fix**:
- Ensure wallet extension is installed and enabled
- Reload browser
- Check extension permissions

### Issue: Connection Doesn't Persist
**Fix**:
- Check localStorage is enabled
- Verify localStorage doesn't have quota issues
- Clear and retry: `localStorage.clear()`

### Issue: ReOwn Modal Disabled
**Fix**:
- Set `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- Get from https://cloud.walletconnect.com
- Restart dev server

---

## Summary
All tests should pass with:
- ✓ No console errors
- ✓ Wallet persists across pages
- ✓ Connection/disconnect works
- ✓ Logos render properly
- ✓ Mobile responsive
- ✓ No provider nesting issues
