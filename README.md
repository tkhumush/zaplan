# To-do
A nostr based to-do list app.

**Caution: Do not sign in with your main nostr account. Use a burner if you would like to test and help build.**

# Main Functionality
This app helps users track a simple todo list within two categories:
- Todo
- Completed

The todo list is encrypted similar to how DMs are encrypted using NIP-07

# Event Kind
Currently the app is using events Kind 48636, thats why I highlight discourage using your main nostr keys to test the app. Unless you want to send JSON files as DMs to your self.

A new Kind will eventually needs to be created to accommodate for todo lists.

# The Vision
Once the app core functionality is complete and users can track their own todo lists privately.

The app will be upgraded to allow for public todo lists with zappable todo list items. 

Why?

The scenario the app wishes to accomplish is for example, nostr developers creating a wish list of features, sharing it with the nostr community, and users zapping features they would like to see in a nostr app.

Finally, enhance the todo list JSON to accept:
- npub tagging on todo list items. 
- Start dates
- Due dates
- Trello like buckets.
The hope is to build a collaborative project management nostr app.