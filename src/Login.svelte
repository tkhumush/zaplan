<script>
  import { onMount } from 'svelte';
  import { eventsStore } from './utils/eventsStore';
  import { SimplePool } from 'nostr-tools';
  import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";
  import { navigate } from 'svelte-routing';

  let events = [];
  const RELAYS_URL = [
    'wss://relay.snort.social',
    'wss://relay.primal.net',
    'wss://relay.damus.io'
  ];

  const nip07signer = new NDKNip07Signer();
  let publicKey = {};

  async function extlogin() {
    try {
      if (publicKey.pubkey) {
        console.log("Permission granted to read their public key:", publicKey.pubkey);
      }

      publicKey = await nip07signer.user();

      const pool = new SimplePool();
      const subEvents = pool.sub(RELAYS_URL, [{
        kinds: [0],
        authors: [publicKey.pubkey]
      }]);

      subEvents.on('event', (event) => {
        events = [...events, event];
        eventsStore.set(events);
      });

      navigate('/todoPage');

    } catch (error) {
      console.error('Login failed:', error.message);
      alert(error.message);
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
