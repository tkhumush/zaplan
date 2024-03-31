let pubKey = "";
export const pk = pubKey;

async function extlogin(relays) {
    //Save public Key from nostr extension
    pubKey = await window.nostr.getPublicKey();
    console.log(pubKey);
};

