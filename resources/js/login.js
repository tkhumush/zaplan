import { SimplePool } from 'nostr-tools/pool'

const pool = new SimplePool()

let relays = ['wss://relay.damus.io']


async function login() {
    
    //Save public Key from nostr extension
    let pubKey = await window.nostr.getPublicKey();

    // Download latest user profile and latest todo list (currently under kind 48636 - 4: meaning encrypted and 4836 = todo)
    let appData = await pool.querySync(relays, [{ kinds: [0, 4] }])

    //Parse data correctly
    
    
    // Sanity check we recevied the information we need.
    console.log(pubKey);
    console.log(appData);

};





