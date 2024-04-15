// eventsStore.js

import { writable } from 'svelte/store';

// Define and export the eventsStore
export const eventsStore = writable([]);

// Export a function to access the events data
export function getEvents() {
    return eventsStore;
}
