<script>
  import { eventsStore } from './utils/eventsStore';
  import { SimplePool } from 'nostr-tools';
  import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";
  import { navigate } from 'svelte-routing';

  let events = [];
  const RELAYS_URL = [
    'wss://relay.snort.social',
    'wss://relay.primal.net',
    'wss://relay.damus.io',
    'wss://purplepag.es'
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

<div class="landing-container">
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-content">
      <div class="logo-container">
        <img class="logo" src="./css/zaplan_logo.png" alt="Zaplan Logo">
        <h1 class="brand-name">Zaplan</h1>
      </div>
      <h2 class="tagline">Your Decentralized To-Do List</h2>
      <p class="hero-description">
        Built on Nostr protocol - Own your data, sync across devices, and stay organized without centralized servers.
      </p>

      <button class="cta-button" on:click={extlogin}>
        <span class="button-icon">🔐</span>
        Login with Nostr Extension
      </button>
    </div>

    <!-- Features Grid -->
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">✅</div>
        <h3>Task Management</h3>
        <p>Create, organize, and track your tasks with an intuitive interface</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Encrypted & Private</h3>
        <p>Your tasks are encrypted end-to-end, only you can read them</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🌐</div>
        <h3>Decentralized</h3>
        <p>No central server - your data lives on the Nostr network</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Sync Instantly</h3>
        <p>Access your tasks from any device with your Nostr identity</p>
      </div>
    </div>
  </div>

  <!-- Getting Started Section -->
  <div class="getting-started">
    <h3 class="section-title">Getting Started with Nostr</h3>
    <p class="section-description">
      New to Nostr? No problem! Install a Nostr extension to get started. It's like a digital key that lets you securely access Zaplan and other Nostr apps.
    </p>

    <div class="extension-cards">
      <div class="extension-card">
        <div class="browser-icon chrome-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h4>Chrome / Edge / Brave</h4>
        <p>Install Nostr Connect extension</p>
        <a href="https://chromewebstore.google.com/detail/ampjiinddmggbhpebhaegmjkbbeofoaj" target="_blank" rel="noopener noreferrer" class="extension-link">
          Get Extension →
        </a>
      </div>

      <div class="extension-card">
        <div class="browser-icon firefox-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h4>Firefox</h4>
        <p>Install Nostr Connect extension</p>
        <a href="https://addons.mozilla.org/en-US/firefox/addon/nostr-connect/" target="_blank" rel="noopener noreferrer" class="extension-link">
          Get Extension →
        </a>
      </div>

      <div class="extension-card">
        <div class="browser-icon safari-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h4>Safari (iOS)</h4>
        <p>Install Nostore app</p>
        <a href="https://apps.apple.com/us/app/nostore/id1666553677" target="_blank" rel="noopener noreferrer" class="extension-link">
          Get App →
        </a>
      </div>
    </div>

    <div class="help-section">
      <h4>After installing the extension:</h4>
      <ol class="setup-steps">
        <li>Click on the extension icon in your browser</li>
        <li>Create a new Nostr identity (or import an existing one)</li>
        <li>Return to this page and click "Login with Nostr Extension"</li>
        <li>Approve the connection request</li>
        <li>Start organizing your tasks! 🎉</li>
      </ol>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Powered by <a href="https://nostr.com" target="_blank" rel="noopener noreferrer">Nostr Protocol</a></p>
  </div>
</div>
