# Detailed Outline - Dripfeed MK2

This document provides a detailed breakdown of the classes and functions for each file, including the intended call flows.

---

## `src/main.ts`
The central orchestrator of the application.

### Functions
- `load_page()`: The entry point function called on window load.
- `get_all_posts()`: Iterates through subscriptions, triggers fetching, and sorts the results.
- `get_posts(source: Subscription)`: Factory-like function that selects the correct fetcher and retrieves posts.
- `display_post(post: Post)`: Takes a post and sends it to the UI for rendering.

### Call Flow
- `window.onload` -> `load_page()`
- `load_page()` -> `get_all_posts()`
- `load_page()` -> `display_post()`
- `get_all_posts()` -> `get_posts()`
- `get_all_posts()` -> `storage.savePosts()`

---

## `src/post.ts`
The data model for a single feed item.

### Classes
- `Post`:
    - **Properties**: `source` (string), `creation_time` (Date), `title` (string | null), `description` (string).
    - **Methods**: `render()`: Returns a string of HTML or a DOM element representing the post card.

---

## `src/storage.ts`
Pure functions for interacting with `localStorage`.

### Functions
- `loadSubscriptions()`: Retrieves the list of user-subscribed RSS feeds.
- `saveSubscriptions(subs: Subscription[])`: Persists the subscription list.
- `savePosts(posts: Post[])`: Saves the current sorted queue of posts.
- `loadPosts()`: Retrieves the saved queue of posts.
- `getNextPost()`: Pops the next post from the queue.
- `markAsSeen(postId: string)`: Records that a post has been dismissed.

---

## `src/ui.ts`
Manages the DOM and user interactions.

### Functions
- `initUI()`: Sets up global event listeners (e.g., settings button).
- `renderPost(post: Post)`: Injects the post HTML into the card container.
- `handleSwipe(direction: string)`: Logic for the swipe-away animation and triggering the next post.
- `showSettings()`: Displays the subscription management modal.
- `hideSettings()`: Closes the modal.
- `showEndMessage()`: Displays the "You have reached the end" state.

### Call Flow
- `initUI()` -> `handleSwipe()`
- `handleSwipe()` -> `storage.getNextPost()`
- `handleSwipe()` -> `renderPost()`
- `handleSwipe()` -> `showEndMessage()` (if no posts remain)

---

## `src/fetchers/fetcher.ts`
The contract for all post sources.

### Classes/Interfaces
- `Fetcher` (Interface):
    - `fetchPosts(since: Date)`: Asynchronous method returning an array of `Post` objects newer than the provided timestamp.

---

## `src/fetchers/bluesky.ts`
Bluesky-specific implementation using RSS feeds.

### Classes
- `BlueskyUserFetcher` (implements `Fetcher`):
    - **Constructor**: `constructor(did: string)`: Initializes with the user's Decentralized Identifier (DID).
    - `fetchPosts(since: Date)`: Fetches the RSS feed (URL: `https://bsky.app/profile/<did>/rss`), parses the XML, and returns `Post` instances newer than `since`.
    - `parseBlueskyUserRSS(xml: string, since: Date)`: Private helper to map RSS items to the `Post` model, filtering by date.

### Call Flow
- `main.get_posts()` -> `BlueskyUserFetcher.fetchPosts()`
- `fetchPosts()` -> `fetch()`
- `fetchPosts()` -> `parseBlueskyUserRSS()`
- `parseBlueskyUserRSS()` -> `new Post()`

---

## `src/fetchers/reddit.ts`
**TODO**: Implement Reddit-specific fetching logic. Currently a stub.

---
