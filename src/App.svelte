<script>
  // Import the necessary components
  import { Router, Route } from 'svelte-routing';
  import TodoPage from './routes/TodoPage.svelte'


  // Define the Login component
  export let Login;
</script>

<Router>
  <!-- Wrap your entire application with the Router -->
  <main>
    <!-- Define your routes -->
    <Route path="/" component={Login} />
    <Route path="/todoPage" component={TodoPage} />
  </main>
</Router>

<style>
  /* Your styles here */
</style>
