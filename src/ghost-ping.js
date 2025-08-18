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
        "{author} said soup to {user}",
        "{author} said <:soup:1406663240280445019> to {user}",
        "{author} un-souped {user}",
        "{author} hooted at {user}",
        "{author} gave a hoot to {user}",
        "{author} whispered a ping to {user}",
        "{author}'s message haunted {user}",
        "{user} received a mysterious signal from {author}",
        "{author} whispered something to {user}",
        "{author} booped {user} and ran!",
        "{author} summoned {user}",
    ]

    let chosenEmbed = descriptions[Math.floor(Math.random() * descriptions.length)]

    chosenEmbed = chosenEmbed.replaceAll("{author}", `<@${cached.author}>`);
    chosenEmbed = chosenEmbed.replaceAll("{user}", user);

    const embed = new EmbedBuilder()
        .setColor("#ff4949")
        .setTitle("<:warning:1406652017165996062> Ghost Ping Detected!")
        .setDescription(chosenEmbed)
        .setTimestamp();

    await channel.send({ embeds: [embed] });
    ghostPing.delete(msg.id);
});
