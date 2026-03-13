import { Post } from '../post';

export interface Fetcher {
  fetchPosts(since: Date): Promise<Post[]>;
}
