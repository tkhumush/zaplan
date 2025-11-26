# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zaplan is a Nostr-based to-do list application built with Svelte. It allows users to create encrypted to-do lists that are stored on Nostr relays, providing a decentralized task management solution.

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (with live reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The dev server runs on `http://0.0.0.0:8080` (configurable in sirv-cli options).

## Architecture

### Build System
- **Bundler**: Rollup with ES module output
- **Entry point**: `src/main.js` → builds to `public/build/bundle.js`
- **CSS**: Extracted to `public/build/bundle.css`
- The build watches for changes and uses livereload in development

### Application Structure

**Pure Svelte Architecture**: The app uses Svelte components throughout:
- `src/Login.svelte`: Handles Nostr extension authentication using NDK and NIP-07 signer
- `src/routes/TodoPage.svelte`: The main to-do page with complete todo functionality in Svelte
- `src/App.svelte`: Router setup with svelte-routing
- `src/utils/eventsStore.js`: Svelte writable store for Nostr profile events

**Routing**: Uses `svelte-routing` with two routes:
- `/` - Login page
- `/todoPage` - To-do list interface

**IMPORTANT**: The server uses the `--single` flag for SPA routing. This is critical to prevent the white screen crash when refreshing on `/todoPage`.

### Nostr Integration

**Event Kind**: Currently uses custom event kind `48636` (experimental - not a standard NIP)

**Relays**: Default relays configured:
- relay.snort.social
- relay.primal.net
- relay.damus.io

**Authentication**:
- Uses browser Nostr extensions (NIP-07) via `window.nostr` API
- Login flow: NDKNip07Signer → fetch profile (kind 0) → navigate to todo page
- The app fetches user profile data (kind 0 events) to display profile pictures

**Data Flow**:
1. Login retrieves public key and profile data using NDK + SimplePool
2. Profile events stored in `eventsStore` (Svelte writable store)
3. To-do list data encrypted with NIP-04 and saved to relay as kind 48636
4. WebSocket subscribes to user's kind 48636 events and decrypts on receive

**Encryption**: To-do lists are encrypted using `window.nostr.nip04.encrypt()` before publishing to relays

### State Management

- **eventsStore** (`src/utils/eventsStore.js`): Svelte writable store for Nostr events (primarily profile data)
- **TodoPage reactive state**: todoItems and completedItems arrays managed with Svelte reactivity
- Data syncs to Nostr relay on every change (add, remove, complete/uncomplete)

### Important Implementation Details

**Pure Svelte Architecture**: All todo list functionality is implemented in Svelte:
- TodoPage.svelte contains all logic for add/remove/complete items
- WebSocket connection management handled in TodoPage component
- Profile data flows through Svelte stores

**WebSocket Management**: The app maintains a persistent WebSocket connection to relay.damus.io. The connection:
- Waits for Nostr extension to load with retry mechanism (up to 5 attempts)
- Subscribes to user's events (kind 48636) on open
- Decrypts and updates local state when events received
- Publishes encrypted events when user modifies the to-do list

**Loading State**: Beautiful cypherpunk loading overlay with:
- "Retrieving todos from the Matrix..." message in monospace font
- Matrix-green spinning loader with neon glow effect
- Pulsing purple gradient card
- Dark blurred background overlay

**Refresh Bug Fix**: The `--single` flag in package.json is CRITICAL. Without it, refreshing on `/todoPage` causes a 404 and white screen crash.

## Current Development Status

See README.md for the full development roadmap. The app is currently at v0.5 (proof of concept), with plans to:
- Create public (non-encrypted) to-do lists (v0.6)
- Separate to-do items into individual events with tags (v0.7)
- Add zap functionality and create a new NIP for to-do events

## Recent Changes

- **Svelte 4 Upgrade**: Upgraded from Svelte 3.55.0 to 4.2.20 for security fixes
- **SPA Routing Fix**: Added `--single` flag to sirv to fix refresh crash bug
- **Landing Page Redesign**: Modern gradient design with feature cards and extension installation instructions
- **Loading Overlay**: Cypherpunk-themed loading screen with Matrix aesthetics
- **Pure Svelte TodoPage**: Removed dependency on vanilla JS, all functionality in Svelte

## Security Notes

- The app warns users not to use their main Nostr account because kind 48636 is experimental and could interfere with DM functionality (uses same encryption scheme as DMs)
- All 4 npm audit vulnerabilities have been fixed
- Dependencies are kept up to date for security
