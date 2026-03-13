# dripfeed

This is a site which enables healthier, more deliberate browsing of social media.

Visit https://epswartz.github.io/dripfeed to use the app.

## Key Features
* **Dripfeed runs out.** You view content in a chronological order, and when you’re caught up, you’re caught up. If you go too long without logging in, it’ll start you back with an intended couple hours worth of content.
* **Dripfeed shows you posts one at a time.** Once you dismiss a post on Dripfeed, you won’t ever see it again (unless someone posts it again). This is to encourage you to look at each post with some intention, and not just scroll around looking for colorful neat-looking shit, which is what I usually do if I’m exposed to a bunch of posts at once.
* **Dripfeed runs entirely in browser with local storage.** This makes some features more awkward (i.e. I can’t provide cross-device sync out of the box), but it means that Dripfeed doesn’t have to have a business model, at all. If you download the repo, there is nothing I or anyone else can do to take the software away from you, because I have nothing to pay for - there’s no backend cost. Maintenance is a separate issue, but I've deliberately kept dripfeed pretty low-dep, so that if I lose interest in it, it at least won't break due to breaking changes in dependencies.
* **Dripfeed doesn’t support interaction, such as comments or likes.** Not sure if this counts as a feature, but this is because for me, interaction is always a gateway to increased usage. Dripfeed’s promise to you is that it will not attempt to consume your life. There are some places where interaction makes sense, but I think it also makes sense to have a read-only view. I typically carry dripfeed on my phone but then use only a desktop or laptop computer to interact, if I want or need to.

## Development

### Prerequisites

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/) installed.

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/epswartz/dripfeed.git
cd dripfeed
npm install
```

### Development

Most development actions are through npm commands:

```bash
npm run dev # Start local dev server
npm run test # Run tests w/ Vitest
npm run lint # Run eslint
npm run format # Run prettier
npm run build # Bundle/minify the project for prod
```

## AI Usage
I'm a professional software developer, but not a frontend dev, so I use AI heavily in creating this project - it's as much an experiment in what it's like to use those tools as it is anything else, for me.

This doesn't mean I have any particular stance on the use of AI in software development - I perceive many clear drawbacks and advantages to using it. This project is part of my attempt to make those decisions more informed.