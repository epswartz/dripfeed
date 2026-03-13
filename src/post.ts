export class Post {
  constructor(
    public source: string, // link address string
    public creation_time: Date, // Date object
    public title: string | null, // string, can be null
    public description: string // string
  ) {}

  render(): string {
    // Basic raw HTML display
    return `
      <div>
        <h3>${this.title || 'Untitled'}</h3>
        <p>${this.description}</p>
        <small>${this.creation_time.toLocaleString()} - <a href="${this.source}" target="_blank">Source</a></small>
      </div>
    `;
  }
}
