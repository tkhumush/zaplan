// events.js

import { SimplePool } from 'nostr-tools';
import { eventsStore } from './utils/eventsStore';

// Define the RELAYS_URL constant
const RELAYS_URL = [
    'wss://relay.snort.social',
    'wss://relay.primal.net',
    'wss://relay.damus.io'
];

// Define the component logic
let pool;
let events = [];

// Subscribe to events
export function subscribeToEvents() {
    // Create a SimplePool instance
    pool = new SimplePool();

    // Subscribe to events
    const subEvents = pool.sub(RELAYS_URL, [{
        kinds: [1], // Filter events by kind (assuming image events have kind 1)
        limit: 100
    }]);

    // Handle received events
    subEvents.on('event', (event) => {
        // Push the event object to the events array
        events.push(event);
        // Update the events store
        eventsStore.set(events);
    });
}

// Function to get the fetched events
export function getEvents() {
    return events;
}
