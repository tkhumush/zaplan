NIP-XX
======

Todo Lists
----------

`draft` `optional`

This NIP defines a standard for creating and managing todo lists on Nostr, enabling interoperability between different todo list applications.

## Abstract

This specification introduces two new event kinds for managing todo items: kind `713` for creating todos and kind `714` for updating todo status. It supports both public and encrypted private todos, with a simple status system for tracking progress.

## Specification

### Event Kind 713: Todo Item

A new todo item is represented by an event with kind `713`.

The content field contains the todo description. For private todos, the content should be encrypted according to [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md).

```json
{
  "kind": 713,
  "content": "<todo description>",
  "tags": [],
  ...
}
```

For encrypted todos, an `encrypted` tag should be added to indicate the encryption method:

```json
{
  "kind": 713,
  "content": "<encrypted todo description>",
  "tags": [["encrypted", "NIP-44"]],
  ...
}
```

### Event Kind 714: Todo Status Update

Todo status updates are represented by events with kind `714`. The status is stored in the content field and references the todo event using an `e` tag.

Supported statuses:
- `DOING` - Todo is in progress
- `DONE` - Todo is completed
- `BLOCKED` - Todo is blocked/waiting on something

By default, todos have no status marker and are considered "pending" or "to do". Status events should only be created when the status changes.

```json
{
  "kind": 714,
  "content": "<status>",
  "tags": [["e", "<todo-event-id>"]],
  ...
}
```

### Deleting Todos

To delete a todo, use the deletion event as specified in [NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md).

## Todo Lifecycle

1. **Creation**: A todo is created with kind `713` event
2. **In Progress** (optional): A kind `714` event with content `DOING` marks the todo as in progress
3. **Completion**: A kind `714` event with content `DONE` marks the todo as completed
4. **Deletion** (optional): A deletion event per NIP-09 removes the todo

## Client Behavior

Clients SHOULD:
- Display todos without status events as "pending" or "to do"
- Only show the most recent status for each todo
- Support both encrypted and unencrypted todos
- Respect deletion events and hide deleted todos

## Security Considerations

- Private todos SHOULD use NIP-44 encryption
- Clients MUST clearly indicate which todos are encrypted vs public
- Users should be aware that todo metadata (event kind, timestamp) remains public even for encrypted todos

## Examples

### Creating a Public Todo

```json
{
  "kind": 713,
  "content": "Write documentation for the new feature",
  ...
}
```

### Creating an Encrypted Todo

```json
{
  "kind": 713,
  "tags": [["encrypted", "NIP-44"]],
  "content": "<base64-encoded encrypted content>",
  ...
}
```

### Marking a Todo as In Progress

```json
{
  "kind": 714,
  "tags": [["e", "<todo-event-id>"]],
  "content": "DOING",
  ...
}
```

### Marking a Todo as Completed

```json
{
  "kind": 714,
  "tags": [["e", "<todo-event-id>"]],
  "content": "DONE",
  ...
}
```

### Marking a Todo as Blocked

```json
{
  "kind": 714,
  "tags": [["e", "<todo-event-id>"]],
  "content": "BLOCKED",
  ...
}
```