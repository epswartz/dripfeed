// TODO we need a concept of lastDismissed PER FOLLOW. If you're at time T and add a new follow with posts from before, what happens?
// We don't want to show all of the follows old posts again by resetting the time.

// TODO split these into multiple JS files.
let followedAccounts = JSON.parse(localStorage.getItem("followedAccounts")) || [];

function toggleMenu() {
    document.getElementById("menu").classList.toggle("open");
    document.getElementById("menu-button").classList.toggle("open");
}

// TODO make this throw, returning null is dumb.
// TODO strictly speaking, I think only people's DIDs are unchanging.
// On page load, something should call this and refresh all the handles and
// avatars based on the DIDs, which are the actual follows.
async function getFollowProfile(handle) {
    try {
        const url = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Cannot fetch profile.")
        }
        const data = await response.json();
        return {
            did: data.did,
            avatar: data.avatar,
            displayName: data.displayName,
            handle: data.handle
        };
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

async function addFollow() {
    const input = document.getElementById("follow-input");
    let handle = input.value.trim();
    if (handle.startsWith("@")) {
        handle = handle.substr(1);
    }

    if (handle && !followedAccounts.some(acc => acc.handle === handle)) {
        const profile = await getFollowProfile(handle);
        if (profile) {
            followedAccounts.push(profile);
            localStorage.setItem("followedAccounts", JSON.stringify(followedAccounts));
            renderFollowedList();
            input.value = "";
        }
    }
    // Reload the posts, with new follows.
    await loadPosts();
    // TODO this currentIndex setting can be factored out into something that reloads the post list and sets your index correctly.
    currentIndex = posts.findIndex(post => post.createdAt > lastDismissed);
}

function removeFollow(index) {
    followedAccounts.splice(index, 1);
    localStorage.setItem("followedAccounts", JSON.stringify(followedAccounts));
    renderFollowedList();
}

function renderFollowedList() {
    const list = document.getElementById("followed-list");
    list.innerHTML = "";
    followedAccounts.forEach((acc, index) => {
        const li = document.createElement("li");
        li.className = "followed-item";
        li.innerHTML = `
        <button class="remove-button" onclick="removeFollow(${index})">−</button>
        <img src="${acc.avatar}" alt="${acc.displayName}">
        <span>${acc.displayName}<br><a href="https://bsky.app/profile/${acc.handle}" target="_blank">@${acc.handle}</a></span>`;
        list.appendChild(li);
    });
}

const postContainer = document.getElementById("post-container");
const nextButton = document.getElementById("next-button");

let lastDismissed = parseInt(localStorage.getItem("lastDismissedTimestamp") || "0", 10);
if (!lastDismissed) {
    lastDismissed = 0;
}
if (new Date(lastDismissed) > new Date()) {
    localStorage.setItem("lastDismissedTimestamp", 0);
    lastDismissed = 0;
}


let posts;

let currentIndex;

async function loadPosts() {
    // Fetch posts and sort ascending.
    let fetchedPosts = [];
    for (const follow of followedAccounts) {
        let followPosts = await getPostsByAuthor(follow.did);
        fetchedPosts = fetchedPosts.concat(followPosts);
    }
    fetchedPosts.sort((a, b) => a.createdAt - b.createdAt);

    posts = fetchedPosts;
    currentIndex = posts.findIndex(post => post.createdAt > lastDismissed);
}

async function getDIDFromHandle(handle) {
    try {
        const url = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.did;
    } catch (error) {
        console.error(`Could not retrieve DID for handle: ${handle}. Error was:`, error)
        throw new Error('Cannot retrieve DID.');
    }
}

async function getPostsByAuthor(authorDid) {
    try {
        const authorFeedUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${authorDid}`
        const response = await fetch(authorFeedUrl);
        const data = await response.json();
        let feed = data.feed.filter((item) => !('reply' in item)); // Do not include replies.


        feed = feed.map((item) => {
            let result = {
                "uri": item.post.uri,
                "createdAt": Date.parse(item.post.record.createdAt),
            }
            if ("reason" in item && item.reason.$type === "app.bsky.feed.defs#reasonRepost") {
                result.repost = {
                    "displayName": item.reason.by.displayName,
                    "handle": item.reason.by.handle
                };
            }
            return result;
        });

        // TODO pagination going back to the last ack or some MAX, maybe a week back or so.
        // Right now this doesn't page, so if they have a bunch of posts we may not even make it back a week.
        // Maybe that's okay?
        let oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 3);

        feed = feed.filter((item) => item.createdAt > oneWeekAgo);

        return feed;
    } catch (error) {
        console.error(`Could not retrieve posts for DID: ${authorDid}. Error was:`, error)
        throw new Error('Cannot retrieve posts.');
    }
}

async function fetchEmbedHTML(postUri) {
    return `\u003cblockquote class=\"bluesky-embed\" data-bluesky-uri=\"${postUri}\" data-bluesky-cid=\"bafyreibtmixj2ggu3jej45vxzfis3futvhxyfwwxej5x76bjz7knw7xbhu\"\u003eLOADING POST...\u003c/blockquote\u003e\u003cscript async src=\"https://embed.bsky.app/static/embed.js\" charset=\"utf-8\"\u003e\u003c/script\u003e`
}

// TODO this is dumb, it should take the post object
async function displayPost(index) {
    postContainer.innerHTML = "";

    if (index >= 0 && index < posts.length) {
        const post = posts[index];
        const embedHTML = await fetchEmbedHTML(post.uri);
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.classList.add("post-enter");
        postElement.id = "post";

        let postHeaderText = "";
        if ("repost" in post) {
            postHeaderText = `Reposted By ${post.repost.displayName} (@${post.repost.handle})`
        }
        postElement.innerHTML = ` <p class="postHeader">${postHeaderText}</p>${embedHTML}`;

        postContainer.appendChild(postElement);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            postElement.classList.remove("post-enter");
        });
        // Ensure the embed script is loaded
        const script = document.createElement("script");
        script.src = "https://embed.bsky.app/static/embed.js";
        script.async = true;
        document.body.appendChild(script);
    } else {
        postContainer.innerHTML = `<div class="caught-up">You've reached the end of the feed. What you do now is your decision.</div>`;
    }
}

window.addEventListener('keyup', function (event) {
    if (event.target.id === 'follow-input' && event.key === 'Enter') {
        addFollow();
    }
});


loadPosts().then(() => {
    displayPost(currentIndex);
});
renderFollowedList();

function goToNextPost() {
    const postElement = document.getElementById("post");
    if (postElement) {
        postElement.classList.add("swoosh");

        setTimeout(() => {
            if (currentIndex >= 0 && currentIndex < posts.length) {
                localStorage.setItem("lastDismissedTimestamp", posts[currentIndex].createdAt);
                currentIndex++;
                displayPost(currentIndex);
            }
        }, 400);
    } else if (currentIndex >= posts.length) {
        // Already at the end, do nothing or show message
    } else {
        // If there's no post element (e.g. caught up), but we somehow trigger next
        displayPost(currentIndex);
    }
}

nextButton.addEventListener("click", goToNextPost);

// Navigation support (Scroll to bottom for next)
let isTransitioning = false;

window.addEventListener('wheel', (e) => {
    if (isTransitioning) return;

    // Check if user is at the bottom and scrolling down
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        if (e.deltaY > 50) { // Significant scroll down attempt
            triggerNext();
        }
    }
}, { passive: true });

window.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown') {
        goToNextPost();
    }
});

// Touch support for "swipe up at bottom"
let touchStartY = 0;
window.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

window.addEventListener('touchend', e => {
    if (isTransitioning) return;

    const touchEndY = e.changedTouches[0].screenY;
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

    if (isAtBottom && (touchStartY - touchEndY > 100)) {
        triggerNext();
    }
}, { passive: true });

function triggerNext() {
    isTransitioning = true;
    goToNextPost();
    // Reset transition flag after the animation completes
    // TODO I don't love this, could be better if we explicitly ended this
    // when the transition was done.
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}
