/**
 * NIP-XX Todo Events Publishing Functions
 *
 * Handles creation of:
 * - Kind 713: Todo items
 * - Kind 714: Status updates (DOING, DONE, BLOCKED)
 * - Kind 5: Deletion events (NIP-09)
 */

import { checkNIP44Support, encryptContent } from './encryption.js';

export async function publishTodoItem(pool, relays, pubKey, content, isPrivate = false) {
  let eventContent = content;
  let tags = [];

  if (isPrivate) {
    const encrypted = await encryptContent(pubKey, content);
    if (!encrypted) {
      throw new Error("Private todos require NIP-44 support");
    }
    eventContent = encrypted;
    tags.push(["encrypted", "NIP-44"]);
  }

  const event = {
    kind: 713,
    content: eventContent,
    tags: tags,
    created_at: Math.floor(Date.now() / 1000),
    pubkey: pubKey
  };

  const signedEvent = await window.nostr.signEvent(event);

  // Publish to all relays
  await Promise.all(
    relays.map(relay =>
      pool.publish([relay], signedEvent)
    )
  );

  return signedEvent.id;
}

export async function publishStatusUpdate(pool, relays, pubKey, todoEventId, status) {
  const event = {
    kind: 714,
    content: status, // "DOING", "DONE", or "BLOCKED"
    tags: [["e", todoEventId]],
    created_at: Math.floor(Date.now() / 1000),
    pubkey: pubKey
  };

  const signedEvent = await window.nostr.signEvent(event);

  // Publish to all relays
  await Promise.all(
    relays.map(relay =>
      pool.publish([relay], signedEvent)
    )
  );
}

export async function publishDeletion(pool, relays, pubKey, todoEventId) {
  const event = {
    kind: 5,
    content: "",
    tags: [
      ["e", todoEventId],
      ["k", "713"]
    ],
    created_at: Math.floor(Date.now() / 1000),
    pubkey: pubKey
  };

  const signedEvent = await window.nostr.signEvent(event);

  // Publish to all relays
  await Promise.all(
    relays.map(relay =>
      pool.publish([relay], signedEvent)
    )
  );
}
