require("./register-commands.js");
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
    
    if (interaction.options.get("server").value === process.env.BASICS_IP) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields(
          {
            name: "Farwater: Create Basics",
            value: `IP: ${ip}`
          }
        );
      
      interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields(
          {
            name: "Create: Arcane Engineering",
            value: `IP: ${ip}`
          }
        );

      interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.commandName === "servers") {

    const embed = new EmbedBuilder()
      .setTitle("Farwater Servers")
      .setColor("Random")
      .addFields(
        {
          name: "Farwater: Create Basics - <:fabric:1348353372012413000> Fabric",
          value: `<:grassblock:1348651744686641234> Version: 1.20.1\nIP: \`${process.env.BASICS_IP}\`\n <:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/farwater-create-basic>)`,
        },
        {
          name: "Create: Arcane Engineering - <:forge:1348353401226006760> Forge",
          value: `<:grassblock:1348651744686641234> Version: 1.18.2\nIP: \`${process.env.CAE_IP}\`\n <:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/create-arcane-engineering>)`,
        }
      );

    interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
