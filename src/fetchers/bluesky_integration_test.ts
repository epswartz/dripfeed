import { describe, it, expect } from 'vitest';
import { BlueskyUserFetcher } from './bluesky';

describe('BlueskyUserFetcher Integration', () => {
  it('should fetch real posts from hankgreen.bsky.social', async () => {
    // We can use handles directly in the URL for Bluesky RSS
    const fetcher = new BlueskyUserFetcher('hankgreen.bsky.social');
    
    // Fetch posts since 1 week ago to ensure we get results
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const posts = await fetcher.fetchPosts(oneWeekAgo);
    
    console.log(`\n--- Integration Test Results ---`);
    console.log(`Fetched ${posts.length} posts from @hankgreen.bsky.social`);
    
    if (posts.length > 0) {
      const latest = posts[0];
      console.log(`Latest Title: ${latest.title || 'No Title'}`);
      console.log(`Latest Date:  ${latest.creation_time.toLocaleString()}`);
      console.log(`Source Link:  ${latest.source}`);
    }
    console.log(`--------------------------------\n`);

    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].source).toContain('bsky.app');
  });
});
