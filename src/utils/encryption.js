/**
 * NIP-44 Encryption Helper Functions
 *
 * Provides encryption/decryption utilities for private todos.
 * Falls back to public-only mode if NIP-44 is unavailable.
 */

export async function checkNIP44Support() {
  return window.nostr && window.nostr.nip44;
}

export async function encryptContent(pubKey, content) {
  if (await checkNIP44Support()) {
    try {
      return await window.nostr.nip44.encrypt(pubKey, content);
    } catch (e) {
      console.error("NIP-44 encryption failed:", e);
      return null;
    }
  }
  return null; // Return null if NIP-44 unavailable (public only)
}

export async function decryptContent(pubKey, content) {
  if (await checkNIP44Support()) {
    try {
      return await window.nostr.nip44.decrypt(pubKey, content);
    } catch (e) {
      console.error("NIP-44 decryption failed:", e);
      throw new Error("Failed to decrypt content");
    }
  }
  throw new Error("NIP-44 encryption not available");
}
