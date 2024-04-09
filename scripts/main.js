import App from './App.svelte';
import LoginWithExtension from './Login.svelte';
import NoExtensionOptions from './Extension.svelte';

const app = new App({
    target: document.body,
    props: {
        LoginWithExtension,
        NoExtensionOptions
    }
});

export default app;
