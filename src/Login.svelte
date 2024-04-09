<script>
    // Import the necessary NDK modules
    import NDK, { NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";

    // Create an instance of NDKNip07Signer
    const nip07signer = new NDKNip07Signer();

    // Create an instance of NDK with the signer
    const ndk = new NDK();

    // Function to handle login with Nostr extension
    async function extlogin() {
        try {
            // Check if the Nostr extension is available
            if (!window.nostr) {
                throw new Error('Nostr extension not found. Please install the extension.');
            }

            // Perform login operation using NDK
            await ndk.connect();

            const publicKey = await window.nostr.getPublicKey();

						console.log(publicKey)

            // If successful, perform further actions (e.g., navigation)
            // For example, you can redirect the user to the dashboard page
            window.location.href = '/todoPage'; // Redirect to dashboard page after successful login

        } catch (error) {
            // Handle errors
            console.error('Login failed:', error.message);
            alert(error.message); // Display the error message to the user
        }
    }
</script>

<div class="wrapper">
    <button class="btn" on:click={extlogin}>Login With A Nostr Extension</button>
</div>
