# Outline - Dripfeed MK2

This document outlines the files to be created and their responsibilities for the Dripfeed MK2 project.

## Core Files

### `index.html`
The main entry point. Contains the basic HTML structure for the application, including the post container and the settings gear icon.

### `src/main.ts`
The application's entry point. Orchestrates the loading process, fetches posts, and manages the high-level application state.

### `src/post.ts`
Defines the `Post` class, which represents a single content item. Includes properties like `source`, `creation_time`, `title`, and `description`, along with a `render()` method to generate HTML.

### `src/storage.ts`
Handles all interactions with browser `localStorage`. Responsible for saving/loading subscriptions and tracking which posts have been dismissed.

### `src/ui.ts`
Manages UI interactions, including the post container (handling rendering and swiping) and the settings modal (managing subscriptions). It also handles the "end of feed" message.

## Fetchers

### `src/fetchers/fetcher.ts`
The base class/interface for all source fetchers, defining the contract for retrieving posts.

### `src/fetchers/bluesky.ts`
Implements the fetching logic for Bluesky users via their RSS feed.

### `src/fetchers/reddit.ts`
Implements the fetching logic for Subreddits and Reddit users via their RSS feeds.

## Testing

### `src/*_test.ts`
Unit tests for the corresponding source files, following the functional style where possible.
