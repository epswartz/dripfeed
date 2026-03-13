import { Post } from '../post';
import { Fetcher } from './fetcher';

/**
 * Pure function to parse Bluesky User RSS XML into Post objects.
 * @param xml The raw RSS XML string.
 * @param since Filter out posts older than or equal to this date.
 */
export function parseBlueskyUserRSS(xml: string, since: Date): Post[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item'));

  return items
    .map((item) => {
      const title = item.querySelector('title')?.textContent || null;
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDateText = item.querySelector('pubDate')?.textContent || '';
      const creation_time = new Date(pubDateText);

      return new Post(link, creation_time, title, description);
    })
    .filter((post) => post.creation_time > since);
}

export class BlueskyUserFetcher implements Fetcher {
  private readonly rssUrl: string;

  constructor(private readonly did: string) {
    this.rssUrl = `https://bsky.app/profile/${did}/rss`;
  }

  async fetchPosts(since: Date): Promise<Post[]> {
    try {
      const response = await fetch(this.rssUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch Bluesky RSS: ${response.statusText}`);
      }
      const xmlText = await response.text();
      return parseBlueskyUserRSS(xmlText, since);
    } catch (error) {
      console.error('Error fetching Bluesky posts:', error);
      return [];
    }
  }
}
