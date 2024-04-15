<script>
    import { onMount } from 'svelte';
    import { eventsStore } from './utils/eventsStore';
    import { SimplePool } from 'nostr-tools';
    import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";
    import { navigate } from 'svelte-routing';

    const RELAYS_URL = [
        'wss://relay.snort.social',
        'wss://relay.primal.net',
        'wss://relay.damus.io'
    ];

    let pool;
    let events = [];

    onMount(async () => {
        pool = new SimplePool();


        return () => {
            pool.unsub();
        };
    });

    async function extlogin() {
        try {
            if (!window.nostr) {
                throw new Error('Nostr extension not found. Please install the extension.');
            }


            const publicKey = await window.nostr.getPublicKey();

            // Create a subscription to listen for events related to the user's profile
            const subEvents = pool.sub(RELAYS_URL, [{
                kinds: [0], // Filter events by kind (assuming profile events have kind 0)
                limit: 1,
                authors: [publicKey]
            }]);

            subEvents.on('event', (event) => {
                events = [...events, event];
                eventsStore.set(events);
            });


            // Navigate to the TodoPage component
            navigate('/todoPage');

        } catch (error) {
            console.error('Login failed:', error.message);
            alert(error.message); // Display the error message to the user
        }
    }
</script>

<div class="wrapper">
    <button class="btn" on:click={extlogin}>Login With A Nostr Extension</button>
</div>

<div class="wrapper">
    <div class="register-link">
        <p>Don't have a nostr extension?</p>
        <p>Check out these nostr extension options:</p>
        <ul>
            <li>
                Chrome: <a href="https://chromewebstore.google.com/detail/ampjiinddmggbhpebhaegmjkbbeofoaj">Nostr Connect</a>
            </li>
            <li>
                FireFox: <a href="https://addons.mozilla.org/en-US/firefox/addon/nostr-connect/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search">Nostr Connect</a>
            </li>
            <li>
                Safari (iOS): <a href="https://apps.apple.com/us/app/nostore/id1666553677">Nostore__</a>
            </li>
        </ul>
    </div>
</div>
