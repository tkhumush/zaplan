# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zaplan is a Nostr-based to-do list application built with Svelte. It implements the NIP-XX (draft) specification for decentralized task management, storing todos as individual events on Nostr relays.

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
- `src/routes/TodoPage.svelte`: The main to-do page with complete NIP-XX todo functionality
- `src/App.svelte`: Router setup with svelte-routing
- `src/utils/eventsStore.js`: Svelte writable store for Nostr profile events
- `src/utils/encryption.js`: NIP-44 encryption helpers
- `src/utils/todoEvents.js`: Event publishing functions for kinds 713, 714, and 5

**Routing**: Uses `svelte-routing` with two routes:
- `/` - Login page
- `/todoPage` - To-do list interface

**IMPORTANT**: The server uses the `--single` flag for SPA routing. This is critical to prevent the white screen crash when refreshing on `/todoPage`.

### Nostr Integration (NIP-XX Specification)

**Event Kinds**:
- **Kind 713**: Individual todo items (public or NIP-44 encrypted)
- **Kind 714**: Status updates (DOING, DONE, BLOCKED)
- **Kind 5**: Deletion events (NIP-09)

**Relays**: Uses multiple relays for redundancy:
- wss://relay.snort.social
- wss://relay.primal.net
- wss://relay.damus.io
- wss://purplepag.es

**Authentication**:
- Uses browser Nostr extensions (NIP-07) via `window.nostr` API
- Login flow: NDKNip07Signer → fetch profile (kind 0) → navigate to todo page
- The app fetches user profile data (kind 0 events) to display profile pictures

**Data Flow**:
1. Login retrieves public key and profile data using NDK + SimplePool
2. Profile events stored in `eventsStore` (Svelte writable store)
3. TodoPage subscribes to three event types (713, 714, 5) using SimplePool
4. Events are reconstructed into todo state with status tracking
5. All CRUD operations publish appropriate event kinds to relays

**Encryption**:
- Uses NIP-44 encryption for private todos
- Falls back to public-only mode if NIP-44 unavailable
- Each todo can be individually encrypted or public
- Encrypted todos marked with `["encrypted", "NIP-44"]` tag

### State Management

- **eventsStore** (`src/utils/eventsStore.js`): Svelte writable store for profile data (kind 0 events)
- **todos Map**: `Map<eventId, todoObject>` - stores all todo items by event ID
- **statuses Map**: `Map<eventId, {status, created_at}>` - tracks most recent status per todo
- **deletedIds Set**: `Set<eventId>` - tracks deleted todo IDs
- State reconstruction from event stream on page load

### Todo Lifecycle

1. **Creation**: User creates todo → publishes kind 713 event
2. **Status Changes** (optional):
   - Start work: publishes kind 714 with "DOING"
   - Block: publishes kind 714 with "BLOCKED"
   - Complete: publishes kind 714 with "DONE"
3. **Deletion** (optional): publishes kind 5 deletion event
4. **State Reconstruction**: On page load, app:
   - Fetches all kind 713 events (todos)
   - Fetches all kind 714 events (statuses)
   - Fetches all kind 5 events (deletions)
   - Builds current state by correlating events

### Status System

Todos support four states:
- **pending**: Default state (no status event published)
- **DOING**: Work in progress
- **BLOCKED**: Blocked/waiting on something
- **DONE**: Completed

UI separates active todos (pending, DOING, BLOCKED) from completed todos (DONE).

## Recent Changes (NIP-XX Migration)

### November 2025 - Migrated to NIP-XX Specification

**Breaking Changes**:
- Replaced custom kind 48636 with standard kinds 713, 714, 5
- Changed from single encrypted blob to individual events per todo
- Upgraded from NIP-04 to NIP-44 encryption
- Added multi-relay support (previously single relay)
- Implemented four-state status system (previously binary)

**New Features**:
- Privacy toggle for public/private todos
- Status buttons (Start, Complete, Block, Unblock, Reopen)
- Status badges showing current state
- Encrypted todo indicator (🔒)
- Multi-relay publishing for redundancy
- NIP-09 deletion support

**Files Changed**:
- `package.json`: Added nostr-tools dependency
- `src/utils/encryption.js`: NEW - NIP-44 encryption helpers
- `src/utils/todoEvents.js`: NEW - Event publishing functions
- `src/routes/TodoPage.svelte`: Complete rewrite for NIP-XX compliance
- `public/css/style.css`: Added status badge and button styles

**Migration Notes**:
- Old kind 48636 todos are NOT migrated automatically
- Users will see empty todo list after update (clean slate)
- NIP-44 unavailability falls back to public todos only
- All relays used for both reading and writing

## Deployment

### Local Development
The app runs at http://localhost:8080 with live reload enabled.

### GitHub Pages
- Static files served from `/docs` folder
- Custom 404.html handles SPA routing
- CNAME points to zaplan.work
- Build files must be copied to docs/ folder before push

## Important Implementation Details

**NIP-44 Encryption**:
- Check availability with `window.nostr.nip44`
- Use `window.nostr.nip44.encrypt(pubKey, content)` for encryption
- Use `window.nostr.nip44.decrypt(pubKey, content)` for decryption
- Always add `["encrypted", "NIP-44"]` tag to encrypted events

**Event Correlation**:
- Kind 714 events reference parent todo via `["e", todoEventId]` tag
- Keep only most recent status per todo (by created_at)
- Kind 5 deletion events may reference multiple event IDs

**WebSocket Management**:
- Uses SimplePool from nostr-tools for multi-relay connections
- Subscribes to three filters simultaneously
- Automatically handles reconnection
- Properly cleans up on component destroy

## Troubleshooting

**White screen on refresh**: Ensure `--single` flag is present in package.json start script

**NIP-44 not available**: Check browser extension supports NIP-44, fallback to public todos

**Todos not syncing**: Check browser console for relay connection errors

**Old todos missing**: This is expected after NIP-XX migration (kind 48636 → 713)
