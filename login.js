let relays = ['wss://relay.example.com']


async function extlogin(relays) {
    
    //Save public Key from nostr extension
    let pubKey = await window.nostr.getPublicKey();
    console.log(pubKey);

    //Connect to Relay
    const relay = await window.NostrTools.Relay.connect('wss://relay.damus.io')
    console.log(`connected to ${relay.url}`)

    // Download latest user profile and latest todo list (currently under kind 48636 - 4: meaning encrypted and 8636: todo)
    // This isn't working
    let appData = await window.NostrTools.querySync(relays, [{ kinds: [48636] }])
    console.log(appData);
   
};