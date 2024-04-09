# Development Plan
## Proof of concept versions (Alpha)

Version 0.5
- [ ] Allow for other nostr extensions to work. currently only Alby is supported.
- [ ] Pull profile data from kind 0 and update profile picture: This requires better event handling (retrieving more than 1 event, sorting events by date, and using the latest info for both profile and todo list json.
- [ ] Update checkbox icon to use app logo
- [ ] Better relay selection or keep for hard coded for now?

Version 0.6
- [ ] Create a second page for public todo list items not only encyrpted, this also means we need to add event verification.
- [ ] Add a search box to be able to search other npub todo lists
## Upgrade app for a more robust experience (Beta) - This stage requires serious help

Version 0.7
- [ ] Overhall the todo list experience completely, splitting todo list items to separate events, using tags to indicate if they are under todo, completed, or archived.
- [ ] Add zap button to separate todo list items for public todo lists with sats count (The idea here is for developers to share planned features and let users zap todo list items to indicate their priority and interest in features).
- [ ] Create a nostr nip pull request for the new todo list events + tags.
- [ ] Allow users to select which relay they would like to publish their events.

Version 0.8
- [ ] Create buckets for todo lists, where todo list items will basically be replies to the buckets. Allowing for a more Trello like UX.
- [ ] Update nip to reflect this feature.

Version 0.9
- [ ] Add more features to todo list events like Due Date + npub task assignment. (my guess is this is where replaceable events start to shine)
- [ ] Figure out a way to add Todo list collaborators! <- I have no idea how is this even possible

## Todo app becomes a serious Project Planning tool
Version 1.0
- [ ] Add Calendar View
- [ ] Add Progress Dashboard

# About Zaplan.work (Updated April 2023)
A nostr based to-do list app with huge potential.

**Caution: Do not sign in with your main nostr account. Use a burner if you would like to test and help build.**

# Main Functionality
This app helps users track a simple todo list within two categories:
- Todo
- Completed

The todo list is encrypted similar to how DMs are encrypted using NIP-07

# Event Kind
Currently the app is using events Kind 48636, that's why I highlight discourage using your main nostr keys to test the app. Unless you want to send JSON files as DMs to your self.

A new Kind will eventually needs to be created to accommodate for todo lists.
