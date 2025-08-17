const { EmbedBuilder } = require("discord.js");
const client = require("./index.js");

const ghostPing = new Map();

client.on("messageCreate", (msg) => {
const userMentions = msg.mentions.users.filter(user => user.id !== msg.author.id);

if (userMentions.size > 0) {
    ghostPing.set(msg.id, {
    author: msg.author.id,
    mentions: [...userMentions.keys()],
    channel: msg.channel.id,
    });
    setTimeout(() => ghostPing.delete(msg.id), 600000);
}
});

client.on("messageDelete", async (msg) => {
    const cached = ghostPing.get(msg.id);
    if (!cached) return;

    const user = cached.mentions.map(uid => `<@${uid}>`).join(", ");
    const channel = await client.channels.fetch(cached.channel);

    const descriptions = [
        "{author} pinged {user}",
        "{user} was pinged by {author}",
        "{author} gave {user} a ghost ping!",
        "{user} got ghost pinged by {author}",
        "{author} sent a ping to {user}, but it vanished",
        "{user} wad poked by Lord {author}",
        "{author} woke {user} up",
        "{user} was kicked by the wandering {author}",
        "{author} demonstrated boop on {user}",
        "Crazy? {author} was crazy once. They locked {author} in a room. A rubber room with {user}. And {user} made {author} crazy",
        "{author} said soup to {user}",
        "{author} said <:soup:1406663240280445019> to {user}",
        "{author} un-souped {user}",
        "{author} hooted at {user}",
        "{author} gave a hoot to {user}",
    ]

    let chosenEmbed = descriptions[Math.floor(Math.random() * descriptions.length)]

    chosenEmbed = chosenEmbed.replace("{author}", `<@${cached.author}>`);
    chosenEmbed = chosenEmbed.replace("{user}", user);

    const embed = new EmbedBuilder()
        .setColor("#ff4949")
        .setTitle("<:warning:1406652017165996062> Ghost Ping Detected!")
        .setDescription(chosenEmbed)
        .setTimestamp();

    await channel.send({ embeds: [embed] });
    ghostPing.delete(msg.id);
});
