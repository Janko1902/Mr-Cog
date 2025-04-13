const fs = require("fs");
const path = require("path");

const blacklistPath = path.join(__dirname, "blacklist.json");

const getBlacklist = () => {
  if (!fs.existsSync(blacklistPath)) return [];
  return JSON.parse(fs.readFileSync(blacklistPath, "utf-8"));
};

const addToBlacklist = (userId) => {
  const blacklist = getBlacklist();
  if (!blacklist.includes(userId)) {
    blacklist.push(userId);
    fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 2));
  }
};

const isBlacklisted = (userId) => {
  const blacklist = getBlacklist();
  return blacklist.includes(userId);
};

module.exports = { getBlacklist, addToBlacklist, isBlacklisted };
