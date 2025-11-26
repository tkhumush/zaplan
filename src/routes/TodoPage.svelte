<script>
 import { onMount, onDestroy } from 'svelte';
 import { navigate } from 'svelte-routing';
 import { getEvents } from '../utils/eventsStore';
 import { SimplePool } from 'nostr-tools';
 import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";
 import { checkNIP44Support, decryptContent } from '../utils/encryption.js';
 import { publishTodoItem, publishStatusUpdate, publishDeletion } from '../utils/todoEvents.js';

 const eventsStore = getEvents();
 const RELAYS_URL = [
   'wss://relay.snort.social',
   'wss://relay.primal.net',
   'wss://relay.damus.io',
   'wss://purplepag.es'
 ];

 let profilePicture = '/css/zaplan_logo.png';
 let isLoading = true;
 let pubKey = "";
 let pool;
 let sub;
 let newTaskInput = "";
 let errorMessage = "";

 // New state structure for NIP-XX compliance
 let todos = new Map();
 let statuses = new Map();
 let deletedIds = new Set();
 let isPrivateMode = false;
 let nip44Available = false;

 async function waitForNostr(maxAttempts = 5, delay = 500) {
   for (let i = 0; i < maxAttempts; i++) {
     if (window.nostr) {
       return true;
     }
     await new Promise(resolve => setTimeout(resolve, delay));
   }
   return false;
 }

 async function handleEvent(event) {
   const { kind, id, content, tags, created_at } = event;

   if (kind === 713) {
     const encryptedTag = tags.find(t => t[0] === "encrypted");
     let todoContent = content;

     if (encryptedTag) {
       try {
         todoContent = await decryptContent(pubKey, content);
       } catch (e) {
         console.error("Failed to decrypt todo:", e);
         return;
       }
     }

     todos.set(id, {
       eventId: id,
       content: todoContent,
       created_at,
       encrypted: !!encryptedTag
     });
     todos = todos;

   } else if (kind === 714) {
     const todoId = tags.find(t => t[0] === "e")?.[1];
     if (todoId) {
       const existing = statuses.get(todoId);
       if (!existing || created_at > existing.created_at) {
         statuses.set(todoId, {
           status: content,
           created_at
         });
         statuses = statuses;
       }
     }

   } else if (kind === 5) {
     const eventIds = tags
       .filter(t => t[0] === "e")
       .map(t => t[1]);
     eventIds.forEach(id => deletedIds.add(id));
     deletedIds = deletedIds;
   }
 }

 async function initializeApp() {
   try {
     const nostrAvailable = await waitForNostr();

     if (!nostrAvailable) {
       errorMessage = "Nostr extension not found. Please install a Nostr extension and refresh the page.";
       setTimeout(() => navigate('/'), 3000);
       return;
     }

     nip44Available = await checkNIP44Support();

     try {
       pubKey = await window.nostr.getPublicKey();
     } catch (e) {
       errorMessage = "Failed to get permission from Nostr extension. Redirecting to login...";
       setTimeout(() => navigate('/'), 2000);
       return;
     }

     if (!pubKey) {
       navigate('/');
       return;
     }

     // Fetch profile - always fetch fresh to ensure we have latest profile data
     try {
       const profilePool = new SimplePool();
       const profileSub = profilePool.sub(RELAYS_URL, [{
         kinds: [0],
         authors: [pubKey]
       }]);

       profileSub.on('event', (event) => {
         let events = [];
         const unsubGet = eventsStore.subscribe(value => events = value);
         unsubGet();
         // Add event only if it's not already in the store
         if (!events.find(e => e.id === event.id)) {
           events = [...events, event];
           eventsStore.set(events);
         }
       });

       profileSub.on('eose', () => {
         setTimeout(() => {
           profilePool.close(RELAYS_URL);
         }, 1000);
       });
     } catch (e) {
       console.error("Failed to fetch profile:", e);
     }

     // Connect to relays for todos
     pool = new SimplePool();
     sub = pool.sub(RELAYS_URL, [
       {
         authors: [pubKey],
         kinds: [713]
       },
       {
         authors: [pubKey],
         kinds: [714]
       },
       {
         authors: [pubKey],
         kinds: [5],
         "#k": ["713"]
       }
     ]);

     sub.on('event', handleEvent);
     sub.on('eose', () => {
       isLoading = false;
     });

   } catch (error) {
     console.error('Failed to initialize:', error);
     errorMessage = error.message || "Failed to initialize app";
     setTimeout(() => navigate('/'), 3000);
   }
 }

 async function addItem() {
   if (newTaskInput.trim() === '') return;

   try {
     await publishTodoItem(pool, RELAYS_URL, pubKey, newTaskInput, isPrivateMode);
     newTaskInput = '';
   } catch (e) {
     console.error("Failed to create todo:", e);
     errorMessage = e.message;
     setTimeout(() => errorMessage = "", 3000);
   }
 }

 async function removeItem(eventId) {
   try {
     await publishDeletion(pool, RELAYS_URL, pubKey, eventId);
   } catch (e) {
     console.error("Failed to delete todo:", e);
   }
 }

 async function updateStatus(eventId, newStatus) {
   try {
     await publishStatusUpdate(pool, RELAYS_URL, pubKey, eventId, newStatus);
   } catch (e) {
     console.error("Failed to update status:", e);
   }
 }

 function handleKeyPress(e) {
   if (e.key === 'Enter') {
     addItem();
   }
 }

 function logout() {
   navigate('/');
 }

 // Computed properties
 $: activeTodos = Array.from(todos.entries())
   .filter(([id, todo]) => {
     if (deletedIds.has(id)) return false;
     const status = statuses.get(id)?.status;
     return !status || status === "DOING" || status === "BLOCKED";
   })
   .map(([id, todo]) => ({
     ...todo,
     status: statuses.get(id)?.status || "pending"
   }))
   .sort((a, b) => b.created_at - a.created_at);

 $: completedTodos = Array.from(todos.entries())
   .filter(([id, todo]) => {
     if (deletedIds.has(id)) return false;
     const status = statuses.get(id)?.status;
     return status === "DONE";
   })
   .map(([id, todo]) => ({
     ...todo,
     status: "DONE"
   }))
   .sort((a, b) => b.created_at - a.created_at);

 let unsubscribe = eventsStore.subscribe(value => {
   if (value.length > 0) {
     try {
       // Get the most recent profile event by created_at timestamp
       const profileEvent = value.reduce((latest, current) =>
         current.created_at > latest.created_at ? current : latest
       );
       const content = JSON.parse(profileEvent.content);
       if (content.picture) {
         profilePicture = content.picture;
       }
     } catch (e) {
       console.error("Failed to parse profile data:", e);
     }
   }
 });

 onMount(() => {
   initializeApp();
 });

 onDestroy(() => {
   if (sub) {
     sub.unsub();
   }
   if (pool) {
     pool.close(RELAYS_URL);
   }
   unsubscribe();
 });

</script>

<svelte:head>
    <title>Zaplan - My Tasks</title>
</svelte:head>

{#if isLoading}
<div class="loading-screen">
    <div class="loading-content">
        {#if errorMessage}
        <div class="error-box">{errorMessage}</div>
        {:else}
        <div class="spinner"></div>
        <p>Loading your tasks...</p>
        {/if}
    </div>
</div>
{:else}
<div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="/css/zaplan_logo.png" alt="Zaplan" class="logo">
            <h1>Zaplan</h1>
        </div>

        <nav class="sidebar-nav">
            <button class="nav-item active">
                <span class="icon">📋</span>
                <span>My Tasks</span>
            </button>
        </nav>

        <div class="sidebar-footer">
            <div class="user-profile">
                <img src={profilePicture} alt="Profile" class="profile-pic">
                <div class="user-info">
                    <span class="user-name">My Profile</span>
                </div>
            </div>
            <button class="logout-btn" on:click={logout}>
                <span class="icon">🚪</span>
                Logout
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <div class="content-wrapper">
            <!-- Header -->
            <header class="page-header">
                <div>
                    <h2>My Tasks</h2>
                    <p class="subtitle">{activeTodos.length} active, {completedTodos.length} completed</p>
                </div>
                <div class="header-actions">
                    <label class="privacy-switch">
                        <input
                          type="checkbox"
                          bind:checked={isPrivateMode}
                          disabled={!nip44Available}
                        />
                        <span class="switch-slider"></span>
                        <span class="switch-label">
                            {isPrivateMode ? '🔒 Private' : '🌐 Public'}
                        </span>
                    </label>
                    {#if !nip44Available}
                    <span class="warning-badge">NIP-44 unavailable</span>
                    {/if}
                </div>
            </header>

            <!-- Add Task Input -->
            <div class="add-task-container">
                <input
                  type="text"
                  class="add-task-input"
                  placeholder="What needs to be done?"
                  bind:value={newTaskInput}
                  on:keypress={handleKeyPress}
                />
                <button class="add-task-btn" on:click={addItem}>
                    Add Task
                </button>
            </div>

            <!-- Active Tasks -->
            {#if activeTodos.length > 0}
            <section class="tasks-section">
                <h3 class="section-title">Active Tasks</h3>
                <div class="tasks-list">
                    {#each activeTodos as todo (todo.eventId)}
                    <div class="task-card status-{todo.status}">
                        <div class="task-main">
                            <div class="task-content">
                                <p class="task-text">{todo.content}</p>
                                <div class="task-meta">
                                    <span class="status-pill status-{todo.status}">
                                        {#if todo.status === 'pending'}
                                        📌 Todo
                                        {:else if todo.status === 'DOING'}
                                        ⚡ In Progress
                                        {:else if todo.status === 'BLOCKED'}
                                        🚧 Blocked
                                        {/if}
                                    </span>
                                    {#if todo.encrypted}
                                    <span class="encrypted-pill">🔒 Private</span>
                                    {/if}
                                </div>
                            </div>

                            <div class="task-actions">
                                {#if todo.status === "pending"}
                                <button class="action-btn primary" on:click={() => updateStatus(todo.eventId, "DOING")}>
                                    Start
                                </button>
                                {:else if todo.status === "DOING"}
                                <button class="action-btn success" on:click={() => updateStatus(todo.eventId, "DONE")}>
                                    Complete
                                </button>
                                <button class="action-btn warning" on:click={() => updateStatus(todo.eventId, "BLOCKED")}>
                                    Block
                                </button>
                                {:else if todo.status === "BLOCKED"}
                                <button class="action-btn primary" on:click={() => updateStatus(todo.eventId, "DOING")}>
                                    Resume
                                </button>
                                {/if}
                                <button class="action-btn danger" on:click={() => removeItem(todo.eventId)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            </section>
            {/if}

            <!-- Completed Tasks -->
            {#if completedTodos.length > 0}
            <section class="tasks-section">
                <h3 class="section-title">Completed</h3>
                <div class="tasks-list">
                    {#each completedTodos as todo (todo.eventId)}
                    <div class="task-card completed">
                        <div class="task-main">
                            <div class="task-content">
                                <p class="task-text completed-text">{todo.content}</p>
                                <div class="task-meta">
                                    <span class="status-pill completed">
                                        ✅ Done
                                    </span>
                                    {#if todo.encrypted}
                                    <span class="encrypted-pill">🔒 Private</span>
                                    {/if}
                                </div>
                            </div>

                            <div class="task-actions">
                                <button class="action-btn secondary" on:click={() => updateStatus(todo.eventId, "DOING")}>
                                    Reopen
                                </button>
                                <button class="action-btn danger" on:click={() => removeItem(todo.eventId)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            </section>
            {/if}

            <!-- Empty State -->
            {#if activeTodos.length === 0 && completedTodos.length === 0}
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Add your first task to get started!</p>
            </div>
            {/if}
        </div>
    </main>
</div>
{/if}

{#if errorMessage && !isLoading}
<div class="toast error">{errorMessage}</div>
{/if}

<style>
* {
  box-sizing: border-box;
}

/* Loading Screen */
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-box {
  background: rgba(255, 255, 255, 0.2);
  padding: 20px 30px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* App Container */
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 32px;
  height: 32px;
}

.sidebar-header h1 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-item.active {
  background: #667eea;
  color: white;
}

.icon {
  font-size: 18px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  margin-bottom: 8px;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Privacy Switch */
.privacy-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.privacy-switch input {
  display: none;
}

.switch-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  transition: all 0.3s;
}

.switch-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s;
}

.privacy-switch input:checked + .switch-slider {
  background: #667eea;
}

.privacy-switch input:checked + .switch-slider::after {
  left: 22px;
}

.privacy-switch input:disabled + .switch-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.warning-badge {
  padding: 4px 8px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

/* Add Task */
.add-task-container {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.add-task-input {
  flex: 1;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s;
}

.add-task-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-task-btn {
  padding: 16px 32px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-task-btn:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

/* Tasks Section */
.tasks-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Task Card */
.task-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;
}

.task-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.task-card.completed {
  opacity: 0.7;
}

.task-main {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-text {
  font-size: 15px;
  color: #1f2937;
  margin: 0 0 12px 0;
  word-wrap: break-word;
}

.completed-text {
  text-decoration: line-through;
  color: #9ca3af;
}

.task-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-pill {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.status-pill.status-pending {
  background: #f3f4f6;
  color: #6b7280;
}

.status-pill.status-DOING {
  background: #dbeafe;
  color: #1e40af;
}

.status-pill.status-BLOCKED {
  background: #fed7aa;
  color: #c2410c;
}

.status-pill.completed {
  background: #d1fae5;
  color: #065f46;
}

.encrypted-pill {
  padding: 4px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5568d3;
}

.action-btn.success {
  background: #10b981;
  color: white;
}

.action-btn.success:hover {
  background: #059669;
}

.action-btn.warning {
  background: #f59e0b;
  color: white;
}

.action-btn.warning:hover {
  background: #d97706;
}

.action-btn.danger {
  background: #ef4444;
  color: white;
}

.action-btn.danger:hover {
  background: #dc2626;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .content-wrapper {
    padding: 20px 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .add-task-container {
    flex-direction: column;
  }

  .task-main {
    flex-direction: column;
    align-items: stretch;
  }

  .task-actions {
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
  }
}
</style>
