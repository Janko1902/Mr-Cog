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

  const hasPermission = interaction.member.roles.cache.some((role) =>
    ["Owner", "Founder", "Sendior Admin", "Admin", "Moderator", "Alpha Tester"].includes(role.name)
  );

  if (interaction.commandName === "ip") {
    const ip = interaction.options.get("server").value;

    if (ip === process.env.DDU_IP) {
      if (hasPermission) {
        const embed = new EmbedBuilder()
          .setColor("Random")
          .addFields({
            name: "Farwater: Deep Down Underground",
            value: `IP: ${ip}`,
          });

        return interaction.reply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      } else {
        return interaction.reply({
          content: "You don't have permission to access this IP!",
          flags: MessageFlags.Ephemeral,
        });
      }
    } else if (ip === process.env.BASICS_IP) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({ name: "Farwater: Create Basics", value: `IP: ${ip}` });

      return interaction.reply({ embeds: [embed] });
    } else if (ip === process.env.CAE_IP) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({ name: "Create: Arcane Engineering", value: `IP: ${ip}` });

      return interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.commandName === "servers") {
    const embed = new EmbedBuilder()
      .setTitle("Farwater Servers")
      .setColor("Random")
      .addFields(
        {
          name: "Farwater: Create Basics - <:fabric:1348353372012413000> Fabric",
          value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.BASICS_IP}\`\n<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/farwater-create-basic>)`,
        },
        {
          name: "Create: Arcane Engineering - <:forge:1348353401226006760> Forge",
          value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.CAE_IP}\`\n<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/create-arcane-engineering>)`,
        }
      );

    interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === "help" && hasPermission) {
    if (interaction.options.get("with").value === "Cracked Minecraft accounts") {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({
           name: "Cracked Minecraft accounts", 
           value: "Sorry, but this server does not support cracked Minecraft accounts. You’ll need a valid, official Minecraft account to join." 
        });
      
      interaction.reply({ embeds: [embed] });
    }
  }
});

client.login(process.env.TOKEN);
