import { describe, it, expect } from 'vitest';
import { parseBlueskyUserRSS } from './bluesky';

describe('parseBlueskyUserRSS', () => {
  const mockXml = `
    <rss version="2.0">
      <channel>
        <item>
          <title>Latest Post</title>
          <description>This is the newest content.</description>
          <link>https://bsky.app/profile/did/post/new</link>
          <pubDate>Wed, 12 Mar 2026 12:00:00 GMT</pubDate>
        </item>
        <item>
          <title>Old Post</title>
          <description>This is older content.</description>
          <link>https://bsky.app/profile/did/post/old</link>
          <pubDate>Mon, 10 Mar 2026 12:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>
  `;

  it('should parse all posts when "since" is very old', () => {
    const since = new Date('2000-01-01');
    const posts = parseBlueskyUserRSS(mockXml, since);

    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe('Latest Post');
    expect(posts[1].title).toBe('Old Post');
    expect(posts[0].creation_time).toBeInstanceOf(Date);
  });

  it('should filter out posts older than the "since" date', () => {
    const since = new Date('2026-03-11T00:00:00Z');
    const posts = parseBlueskyUserRSS(mockXml, since);

    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Latest Post');
  });

  it('should handle missing titles by returning null', () => {
    const xmlNoTitle = `
      <rss><channel><item>
        <description>No title here</description>
        <pubDate>Wed, 12 Mar 2026 12:00:00 GMT</pubDate>
      </item></channel></rss>
    `;
    const posts = parseBlueskyUserRSS(xmlNoTitle, new Date(0));
    
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBeNull();
    expect(posts[0].description).toBe('No title here');
  });

  it('should return an empty array for invalid XML', () => {
    const posts = parseBlueskyUserRSS('invalid xml', new Date(0));
    expect(posts).toHaveLength(0);
  });
});
