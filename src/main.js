// Import Svelte components
import App from './App.svelte';
import Login from './Login.svelte';
import TodoPage from './routes/TodoPage.svelte'

// Create the Svelte app instance
const app = new App({
    target: document.body,
    props: {
        Login,
        TodoPage
          }
});
