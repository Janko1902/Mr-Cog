require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const client = require("./index.js");


const chaosDesc = [
    "{author} summoned {user}",
    "{user} was summoned by {author}",
    "{user} has been pinged by the elusive {author}",
];

const danDesc = [

];

const jankoDesc = [
    "{author} said kaboom to {user}",
    "{author} demonstrated boop on {user}",
    "{author} said soup to {user}",
    "{author} said <:soup:1406663240280445019> to {user}",
    "{author} un-souped {user}",
    "{user} might ban {author}",
    "{user} will ban {author}",
    "{user} banned {author}",
];

const greenDesc = [
];


const spudDesc = [
    "{author} deep fried {user} for to long",
];

const owlDesc = [
    "{author} hooted at {user}",
    "{author} gave a hoot to {user}",
];

const latteDesc = [

];

const descriptions = [
    "{author} pinged {user}",
    "{user} was pinged by {author}",
    "{author} gave {user} a ghost ping!",
    "{user} got ghost pinged by {author}",
    "{author} sent a ping to {user}, but it vanished",
    "{user} was poked by Lord {author}",
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
    "{author} summoned {user}",
    "{user} was summoned by {author}",
    "{author} booped {user} and ran!",
    "{user} has been pinged by the elusive {author}",
];

const userDescMap = {
    [process.env.CHAOS_ID]: chaosDesc,
    [process.env.DAN_ID]: danDesc,
    [process.env.JANKO_ID]: jankoDesc,
    [process.env.GREEN_ID]: greenDesc,
    [process.env.SPUD_ID]: spudDesc,
    [process.env.OWL_ID]: owlDesc,
    [process.env.LATTE_ID]: latteDesc
};

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

    const pingedUser = cached.mentions;
    const channel = await client.channels.fetch(cached.channel);

    const descArr =
        userDescMap[pingedUser[0]] && userDescMap[pingedUser].length > 0
        ? userDescMap[pingedUser]
        : descriptions;

    const userMentions = pingedUser.map(uid => `<@${uid}>`).join(", ");

    let chosenDesc = descArr[Math.floor(Math.random() * descArr.length)];
    chosenDesc = chosenDesc.replaceAll("{author}", `<@${cached.author}>`).replaceAll("{user}", userMentions);

    const embed = new EmbedBuilder()
        .setColor("#ff4949")
        .setTitle("<:warning:1406652017165996062> Ghost Ping Detected!")
        .setDescription(chosenDesc)
        .setTimestamp();

    await channel.send({ embeds: [embed] });
    ghostPing.delete(msg.id);
});
