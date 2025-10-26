const fs = require("fs");
const path = require("path");

const blacklistPath = path.join(__dirname, "..", "blacklist.json");

const readBlacklist = () => {
  try {
    if (!fs.existsSync(blacklistPath)) return [];
    const data = fs.readFileSync(blacklistPath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading blacklist:", err);
    return [];
  }
};

const writeBlacklist = (list) => {
  try {
    fs.writeFileSync(blacklistPath, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing blacklist:", err);
  }
};

const addToBlacklist = (userId) => {
  const blacklist = readBlacklist();
  if (!blacklist.includes(String(userId))) {
    blacklist.push(String(userId)); // Always store as string
    writeBlacklist(blacklist);
  }
};

const removeFromBlacklist = (userId) => {
  const blacklist = readBlacklist();
  const updated = blacklist.filter(id => id !== String(userId));
  writeBlacklist(updated);
};

const isBlacklisted = (userId) => {
  const blacklist = readBlacklist();
  return blacklist.includes(String(userId));
};

module.exports = { addToBlacklist, removeFromBlacklist, isBlacklisted, readBlacklist };
