const Parser = require("rss-parser");
const parser = new Parser();
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'last-links.json');

const FEEDS = {
  youtube: process.env.YT_RSS,
  twitter: process.env.TWITTER_RSS,
  instagram: process.env.INSTAGRAM_RSS,
};

let lastLinks = {};
try {
  lastLinks = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (err) {
  console.warn('Could not load lastLinks.json, initializing default:', err.message);
  lastLinks = { youtube: null, twitter: null, instagram: null };
}

function saveLastLinks() {
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(lastLinks, null, 2));
    console.log('lastLinks saved:', lastLinks);
  } catch (err) {
    console.error('Failed to save lastLinks:', err);
  }
}

async function checkFeed(client, name, url) {
  try {
    const feed = await parser.parseURL(url);
    if (feed.items && feed.items.length > 0) {
      const latest = feed.items[0];

      if (latest.link !== lastLinks[name]) {
        lastLinks[name] = latest.link;
        saveLastLinks();

        const noEmbedTitle = (title) => title.replace(/(https?:\/\/[^\s]+)/g, '<$1>');
        const channel = await client.channels.fetch(process.env.CONTENT_CHANNEL_ID);
        await channel.send(
          `New ${name} post!\n**${noEmbedTitle(latest.title || "Post")}**\n${latest.link}`
        );
      }
    }
  } catch (err) {
    console.error(`Error fetching ${name} feed:`, err.message);
  }
}

async function checkAllFeeds(client) {
  for (const [name, url] of Object.entries(FEEDS)) {
    if (url) await checkFeed(client, name, url);
  }
}

module.exports = { checkAllFeeds };
