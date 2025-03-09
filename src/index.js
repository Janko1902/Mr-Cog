require("dotenv").config();
const {
  Client,
  IntentsBitField,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online.`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ip") {
    const ip = interaction.options.get("server").value;

    interaction.reply({ content: `${ip}` });
  }

  if (interaction.commandName === "server") {

    const embed = new EmbedBuilder()
      .setTitle("Farwater Servers")
      .setColor("Random")
      .addFields(
        {
          name: "Farwater: Create Basics - <:fabric:1348353372012413000> Fabric",
          value: `IP: \`${process.env.BASICS_IP}\`\n <:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/farwater-create-basic>)`,
        },
        {
          name: "Create: Arcane Engineering - <:forge:1348353401226006760> Forge",
          value: `IP: \`${process.env.CAE_IP}\`\n <:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/create-arcane-engineering>)`,
        }
      );

    interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
