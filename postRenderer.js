function renderNativePost(post) {
    const { author, record, embed, repostBy } = post;
    const { text, createdAt, facets } = record;

    let repostHeader = "";
    if (repostBy) {
        repostHeader = `<div class="repost-header">Reposted by ${repostBy.displayName} (@${repostBy.handle})</div>`;
    }

    let embedHtml = "";
    if (embed) {
        if (embed.$type === "app.bsky.embed.images#view") {
            embedHtml = `<div class="post-images">
                ${embed.images.map(img => `<img src="${img.thumb}" alt="${img.alt}" class="post-image">`).join("")}
            </div>`;
        } else if (embed.$type === "app.bsky.embed.video#view") {
            embedHtml = `<div class="post-video-container">
                <video 
                    controls 
                    playsinline 
                    poster="${embed.thumbnail}" 
                    class="post-video"
                    data-playlist="${embed.playlist}"
                ></video>
            </div>`;
        } else if (embed.$type === "app.bsky.embed.external#view") {
            const { external } = embed;
            embedHtml = `
                <a href="${external.uri}" target="_blank" class="post-external">
                    ${external.thumb ? `<img src="${external.thumb}" alt="${external.title}" class="external-thumb">` : ""}
                    <div class="external-content">
                        <div class="external-title">${external.title}</div>
                        <div class="external-description">${external.description}</div>
                        <div class="external-uri">${new URL(external.uri).hostname}</div>
                    </div>
                </a>
            `;
        }
    }

    const renderedText = renderTextWithFacets(text, facets);
    const date = new Date(createdAt);
    const relativeTime = getRelativeTime(date);

    return `
        ${repostHeader}
        <div class="post-main">
            <div class="post-author">
                <img src="${author.avatar}" alt="${author.displayName}" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">${author.displayName}</span>
                    <span class="author-handle">@${author.handle}</span>
                    <span class="post-date">· ${relativeTime}</span>
                </div>
            </div>
            <div class="post-content">
                <p class="post-text">${renderedText}</p>
                ${embedHtml}
            </div>
        </div>
    `;
}

function renderTextWithFacets(text, facets) {
    if (!facets || facets.length === 0) {
        return escapeHtml(text).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    }

    // Sort facets by start index
    const sortedFacets = [...facets].sort((a, b) => a.index.byteStart - b.index.byteStart);

    // We need to work with UTF-8 byte offsets
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const bytes = encoder.encode(text);

    let result = "";
    let lastOffset = 0;

    for (const facet of sortedFacets) {
        const { byteStart, byteEnd } = facet.index;

        // Add text before the facet
        result += escapeHtml(decoder.decode(bytes.slice(lastOffset, byteStart)));

        // Add the facet itself
        const facetText = decoder.decode(bytes.slice(byteStart, byteEnd));
        const feature = facet.features[0]; // Usually one feature per facet

        if (feature.$type === "app.bsky.richtext.facet#link") {
            result += `<a href="${feature.uri}" target="_blank">${escapeHtml(facetText)}</a>`;
        } else if (feature.$type === "app.bsky.richtext.facet#mention") {
            result += `<a href="https://bsky.app/profile/${feature.did}" target="_blank">${escapeHtml(facetText)}</a>`;
        } else if (feature.$type === "app.bsky.richtext.facet#tag") {
            result += `<a href="https://bsky.app/search?q=%23${feature.tag}" target="_blank">${escapeHtml(facetText)}</a>`;
        } else {
            result += escapeHtml(facetText);
        }

        lastOffset = byteEnd;
    }

    // Add remaining text
    result += escapeHtml(decoder.decode(bytes.slice(lastOffset)));
    return result;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function initPostEnhancements() {
    // Initialize videos
    const videos = document.querySelectorAll('video[data-playlist]');
    videos.forEach(video => {
        const url = video.dataset.playlist;
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        }
    });
}

function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
}
