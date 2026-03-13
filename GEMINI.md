# This is Dripfeed.
* Complete all tasks minimally as described.
* Always consult gemini/outline_detailed.md before starting any implementation task.
* Always consult files in gemini/ before starting any task.

# Product Description

## Basic Product Info
Name: Dripfeed
Description: A single page web app which combines various social media sources into a single feed. Dripfeed is made for healthy, and private usage.

## Key Features (Basic Descriptions)
* Dripfeed runs out. You view content in a chronological order, and when you’re caught up, you’re caught up. If you go too long without logging in, it’ll start you back with an intended couple hours worth of content.\
* Dripfeed shows you posts one at a time. Once you dismiss a post on Dripfeed, you won’t ever see it again (unless someone posts it again). This is to encourage you to look at each post with some intention, and not just scroll around looking for colorful neat-looking shit, which is what I usually do if I’m exposed to a bunch of posts at once.
* Dripfeed runs entirely in browser with local storage. This makes some features more awkward (i.e. I can’t provide cross-device sync out of the box), but it means that Dripfeed doesn’t have to have a business model, at all. There is nothing I or anyone else can do to take the software away from you, because I have nothing to pay for - there’s no backend cost. Maintenance is a separate issue, of course.
* Not sure if this counts as a feature, but Dripfeed doesn’t support interaction. This is because for me, interaction is always a gateway to increased usage. Dripfeed’s promise to you is that it will not attempt to consume your life. There are some places where interaction makes sense, but I think it also makes sense to have a read-only view. I typically carry dripfeed on my phone but then use only a desktop or laptop computer to interact, if I want or need to.

## Basic App Description
* The actual application is a single card, with a post. If you swipe the card away, the post is gone, and the next one comes up. When no posts remain, a message is displayed: “You have reached the end of the feed. What you do now is up to you.”
* The posts are displayed in chronological order, oldest at the top. You’re catching up to current time as you scroll down.
* At the side, there’s a gear icon, which brings up an interface where people can add sources of posts from the various options. These can be bluesky users, subreddits, and reddit users.

## Code Structure

### The Stack
* All code should be written in typescript.
* The app has no backend at all, it runs entirely in browser.

### On Page Load
* Load the subscribed sources out of local storage
* Fetch posts from all the subscribed sources, and get them ready to go.
* Display the first post in the feed.

### Post Sources
Posts are read from RSS feeds. Bluesky and reddit have their own RSS feed formats, that is why they are the default post providers.

### Code Style
* Wherever possible, code should be written in a functional style, using functions with no side-effects. These functions should be tested.
* In general, tests are written in a file called x_test.ts, if x.ts is the main source file.


### Code description
* Each source of posts has a "fetcher" class, which is in a file on its own.
* there is a Post class with a source (link address string), creation_time (timestamp), title (string, can be null) and description (string). It has a render() method which returns the html.
* load_page() calls get_all_posts(), then display_post(<first post>).
* get_all_posts() runs a loop, loading in all subscriptions from local storage.
* get_all_posts() calls get_posts(source) for all sources in the subscriptions.
* get_posts() looks at the type listed for the source, and either calls out to bluesky, or to reddit.
* get_all_posts() then sorts all of the posts chronologically, and puts them into local storage.