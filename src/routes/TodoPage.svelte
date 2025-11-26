<script>
 import { onMount, onDestroy } from 'svelte';
 import { navigate } from 'svelte-routing';
 import { getEvents } from '../utils/eventsStore';
 import { SimplePool } from 'nostr-tools';
 import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";

 const eventsStore = getEvents();
 const RELAY = "wss://relay.damus.io";
 const RELAYS_URL = [
   'wss://relay.snort.social',
   'wss://relay.primal.net',
   'wss://relay.damus.io'
 ];

 let profilePicture = '/css/zaplan_logo.png'; // Default fallback image
 let isLoading = true;
 let pubKey = "";
 let socket;
 let newTaskInput = "";
 let errorMessage = "";

 let todoItems = [];
 let completedItems = [];

 const removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';

 async function waitForNostr(maxAttempts = 5, delay = 500) {
   for (let i = 0; i < maxAttempts; i++) {
     if (window.nostr) {
       return true;
     }
     console.log(`Waiting for Nostr extension... attempt ${i + 1}/${maxAttempts}`);
     await new Promise(resolve => setTimeout(resolve, delay));
   }
   return false;
 }

 async function initializeApp() {
   try {
     // Wait for Nostr extension to be available
     const nostrAvailable = await waitForNostr();

     if (!nostrAvailable) {
       errorMessage = "Nostr extension not found. Please install a Nostr extension and refresh the page.";
       console.error(errorMessage);
       setTimeout(() => navigate('/'), 3000);
       return;
     }

     // Get public key from Nostr extension
     try {
       pubKey = await window.nostr.getPublicKey();
       console.log("Got public key:", pubKey);
     } catch (e) {
       console.error("Failed to get public key:", e);
       errorMessage = "Failed to get permission from Nostr extension. Redirecting to login...";
       setTimeout(() => navigate('/'), 2000);
       return;
     }

     if (!pubKey) {
       console.error("No pubKey received");
       navigate('/');
       return;
     }

     // Fetch profile if not in store
     let currentEvents = [];
     const unsubCheck = eventsStore.subscribe(value => currentEvents = value);
     unsubCheck(); // Unsubscribe immediately after getting the value
     console.log("Current events in store:", currentEvents.length);

     if (currentEvents.length === 0) {
       console.log("No profile in store, fetching from relays...");
       try {
         const nip07signer = new NDKNip07Signer();
         const publicKey = await nip07signer.user();

         const pool = new SimplePool();
         const subEvents = pool.sub(RELAYS_URL, [{
           kinds: [0],
           authors: [publicKey.pubkey]
         }]);

         subEvents.on('event', (event) => {
           console.log("Profile event received:", event);
           let events = [];
           const unsubGet = eventsStore.subscribe(value => events = value);
           unsubGet();
           events = [...events, event];
           eventsStore.set(events);
         });
       } catch (e) {
         console.error("Failed to fetch profile:", e);
         // Continue anyway, profile is not critical
       }
     } else {
       console.log("Profile already in store");
     }

     // Connect to Nostr relay for todos
     socket = new WebSocket(RELAY);

     socket.addEventListener('open', () => {
       console.log("Connected to " + RELAY);

       const subscription = ["REQ", pubKey, {
         "authors": [pubKey],
         "kinds": [48636],
         "limit": 1
       }];
       console.log("Sending subscription:", subscription);
       socket.send(JSON.stringify(subscription));

       // Mark as loaded after connection is established
       isLoading = false;
     });

     socket.addEventListener('message', async (message) => {
       const [type, subId, event] = JSON.parse(message.data);
       const { kind, content } = event || {};

       if (!event || event === true) return;

       console.log("Received event:", { type, kind });

       if (kind === 48636) {
         try {
           let decryptedContent = await window.nostr.nip04.decrypt(pubKey, content);
           const parsedContent = JSON.parse(decryptedContent);

           todoItems = parsedContent.todo || [];
           completedItems = parsedContent.completed || [];
           console.log("Loaded todos:", todoItems.length, "completed:", completedItems.length);
         } catch (e) {
           console.error("Failed to decrypt or parse content:", e);
         }
       }
     });

     socket.addEventListener('error', (error) => {
       console.error("WebSocket error:", error);
       errorMessage = "Failed to connect to Nostr relay";
     });

     socket.addEventListener('close', () => {
       console.log("WebSocket closed");
     });

   } catch (error) {
     console.error('Failed to initialize:', error);
     errorMessage = error.message || "Failed to initialize app";
     setTimeout(() => navigate('/'), 3000);
   }
 }

 async function saveTodoList() {
   try {
     const localData = {
       todo: todoItems,
       completed: completedItems
     };

     const encryptedTodo = await window.nostr.nip04.encrypt(pubKey, JSON.stringify(localData));

     const event = {
       content: encryptedTodo,
       created_at: Math.floor(Date.now() / 1000),
       kind: 48636,
       tags: [['p', pubKey]],
       pubkey: pubKey,
     };

     const signedEvent = await window.nostr.signEvent(event);

     if (socket && socket.readyState === WebSocket.OPEN) {
       socket.send(JSON.stringify(["EVENT", signedEvent]));
       console.log("Saved todo list");
     } else {
       console.error("WebSocket is not open");
     }
   } catch (error) {
     console.error("Failed to save to-do list:", error);
   }
 }

 function addItem() {
   if (newTaskInput.trim() !== '') {
     todoItems = [newTaskInput, ...todoItems];
     newTaskInput = '';
     saveTodoList();
   }
 }

 function handleKeyPress(e) {
   if (e.key === 'Enter') {
     addItem();
   }
 }

 function removeItem(item, isCompleted) {
   if (isCompleted) {
     completedItems = completedItems.filter(i => i !== item);
   } else {
     todoItems = todoItems.filter(i => i !== item);
   }
   saveTodoList();
 }

 function toggleComplete(item, isCompleted) {
   if (isCompleted) {
     completedItems = completedItems.filter(i => i !== item);
     todoItems = [item, ...todoItems];
   } else {
     todoItems = todoItems.filter(i => i !== item);
     completedItems = [item, ...completedItems];
   }
   saveTodoList();
 }

 let unsubscribe = eventsStore.subscribe(value => {
   if (value.length > 0) {
     try {
       const content = JSON.parse(value[0].content);
       if (content.picture) {
         profilePicture = content.picture;
         console.log("Profile picture loaded:", profilePicture);
       }
     } catch (e) {
       console.error("Failed to parse profile data:", e);
       // Keep using the default profile picture
     }
   }
 });

 onMount(() => {
   console.log("TodoPage mounted");
   initializeApp();
 });

 onDestroy(() => {
   console.log("TodoPage destroyed");
   if (socket) {
     socket.close();
   }
   unsubscribe();
 });

</script>

<svelte:head>
    <title>ZAPLAN - Todo List</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/css/reset.min.css">
    <link rel="stylesheet" type="text/css" href="/css/style.css">
</svelte:head>

<header>
    <div class="header">
        <div>
            <img class="js-profile-element" id="pPicture" src={profilePicture} alt="Profile Picture">
        </div>
        <div>
            <input
              type="text"
              placeholder="Enter an activity.."
              id="item"
              bind:value={newTaskInput}
              on:keypress={handleKeyPress}
              disabled={isLoading}
            >
        </div>
        <div>
            <button id="add" class="add-todo-button" on:click={addItem} disabled={isLoading}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve">
                    <g>
                        <path class="fill" d="M16,8c0,0.5-0.5,1-1,1H9v6c0,0.5-0.5,1-1,1s-1-0.5-1-1V9H1C0.5,9,0,8.5,0,8s0.5-1,1-1h6V1c0-0.5,0.5-1,1-1s1,0.5,1,1v6h6C15.5,7,16,7.5,16,8z"/>
                    </g>
                </svg>
            </button>
        </div>
    </div>
</header>

<div class="container">
    <!-- Uncompleted tasks -->
    <ul class="todo" id="todo">
        {#each todoItems as item (item)}
        <li>
            {item}
            <div class="buttons">
                <button class="remove" on:click={() => removeItem(item, false)}>
                    {@html removeSVG}
                </button>
                <button class="complete" on:click={() => toggleComplete(item, false)}>
                    <img src="/css/zaplan_logo_unchecked.png" alt="Complete" width="22" height="30" />
                </button>
            </div>
        </li>
        {/each}
    </ul>

    <!-- Completed tasks -->
    <ul class="todo" id="completed">
        {#each completedItems as item (item)}
        <li>
            {item}
            <div class="buttons">
                <button class="remove" on:click={() => removeItem(item, true)}>
                    {@html removeSVG}
                </button>
                <button class="complete" on:click={() => toggleComplete(item, true)}>
                    <img src="/css/zaplan_logo.png" alt="Uncomplete" width="22" height="30" />
                </button>
            </div>
        </li>
        {/each}
    </ul>
</div>

{#if isLoading}
<div class="loading-overlay">
    <div class="loading-content">
        {#if errorMessage}
        <div class="error-text">{errorMessage}</div>
        {:else}
        <div class="loading-text">Retrieving todos from the Matrix...</div>
        <div class="spinner"></div>
        {/if}
    </div>
</div>
{/if}

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Roboto', sans-serif;
}

.loading-content {
  text-align: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  border-radius: 20px;
  padding: 120px 80px 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(102, 126, 234, 0.4);
  animation: pulse 2s ease-in-out infinite;
  max-width: 600px;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px rgba(102, 126, 234, 0.6);
  }
}

.loading-text {
  margin-bottom: 40px;
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
  text-align: center;
}

.error-text {
  color: #ffffff;
  background: rgba(231, 76, 60, 0.95);
  padding: 20px 30px;
  border-radius: 15px;
  font-weight: 600;
  margin-bottom: 0;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.2);
  border-top: 6px solid #00ff00;
  border-right: 6px solid #00ff00;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.2);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
