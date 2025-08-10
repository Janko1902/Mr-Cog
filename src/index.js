require("./register-commands.js");
const { sendModPing } = require("./mod-ping.js");
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.inGuild()) {
    const hasPermission = interaction.member.roles.cache.some((role) =>
      [
        "Owner",
        "Founder",
        "Sendior Admin",
        "Admin",
        "Moderator",
        "Alpha Tester",
      ].includes(role.name)
    );
  }

  if (interaction.commandName === "ip") {
    const ip = interaction.options.get("server").value;

    if (ip === process.env.DDU_IP) {
      if (!interaction.inGuild() || interaction.guildId !== process.env.GUILD_ID) {
        return interaction.reply({
          content: "This command only works in the Farwater server if you have required permissions!",
          flags: MessageFlags.Ephemeral,
        });
      } else if (hasPermission) {
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
    } else if (ip === process.env.HOMESTEAD_IP) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({ name: "Homestead", value: `IP: ${ip}` });

      return interaction.reply({ embeds: [embed] });
    } else if (ip === process.env.ATM_10_IP) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({ name: "All the Mods 10", value: `IP: ${ip}` });

      return interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.commandName === "modpack") {
    const modpack = interaction.options.get("modpack").value;

    if (modpack === "Basics") {
      const embed = new EmbedBuilder().setColor("Random").addFields({
        name: "Farwater: Create Basics modpack",
        value: `<:modrinth:1348353426052091995> [Modrinth](<https://modrinth.com/modpack/farwater-create-basics>)`,
      });

      return interaction.reply({ embeds: [embed] });
    } else if (modpack === "Homestead") {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({
          name: "Homestead modpack",
          value: `<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/homestead-cozy>)\n<:modrinth:1348353426052091995> [Modrinth](<https://modrinth.com/modpack/homestead>)`,
        });

      return interaction.reply({ embeds: [embed] });
    } else if (modpack === "ATM") {
      const embed = new EmbedBuilder().setColor("Random").addFields({
        name: "All the Mods 10 modpack",
        value: `<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/all-the-mods-10>)`,
      });

      return interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.commandName === "servers") {
    const serverOption = interaction.options.get("server");
    let server;
    if (serverOption) {
      server = serverOption.value;
    } else {
      server = null;
    }

    if (server === "Basics") {
      const embed = new EmbedBuilder().setColor("Random").addFields({
        name: "Farwater: Create Basics - <:fabric:1348353372012413000> Fabric",
        value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.BASICS_IP}\`\n<:modrinth:1348353426052091995> [Modrinth](https://modrinth.com/modpack/farwater-create-basics)`,
      });

      return interaction.reply({ embeds: [embed] });
    } else if (server === "Homestead") {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({
          name: "Homestead - <:fabric:1348353372012413000> Fabric",
          value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.HOMESTEAD_IP}\`\n<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/homestead-cozy>)\n<:modrinth:1348353426052091995> [Modrinth](<https://modrinth.com/modpack/homestead>)`,
        });

      return interaction.reply({ embeds: [embed] });
    } else if (server === "ATM") {
      const embed = new EmbedBuilder().setColor("Random").addFields({
        name: "All the Mods 10 - <:neoforged:1404088666120257737> NeoForged",
        value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.ATM_10_IP}\`\n<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/all-the-mods-10>)`,
      });

      return interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Farwater Servers")
        .setColor("Random")
        .addFields(
          {
            name: "Farwater: Create Basics - <:fabric:1348353372012413000> Fabric",
            value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.BASICS_IP}\`\n<:modrinth:1348353426052091995> [Modrinth](https://modrinth.com/modpack/farwater-create-basics)`,
          },
          {
            name: "Homestead - <:fabric:1348353372012413000> Fabric",
            value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.HOMESTEAD_IP}\`\n<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/homestead-cozy>)\n<:modrinth:1348353426052091995> [Modrinth](<https://modrinth.com/modpack/homestead>)`,
          },
          {
            name: "All the Mods 10 - <:neoforged:1404088666120257737> NeoForged",
            value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.ATM_10_IP}\`\n<:curseforge:1348353413221453997> [Curseforge](<https://www.curseforge.com/minecraft/modpacks/all-the-mods-10>)`,
          }
        );
      
      interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.commandName === "help") {
    if (interaction.options.get("with").value === "Cracked Minecraft accounts") {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({
           name: "Cracked Minecraft accounts", 
           value: "Sorry, but this server does not support cracked Minecraft accounts. You’ll need a valid, official Minecraft account to join." 
        });
      
      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.get("with").value === "Whitelist") {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({
           name: "Whitelist", 
           value: "Whitelist will reopen once Farwater: Deep Down Underground (season 11) releases. You do not need to get whitelisted to play on any of our current servers. If a server requires whitelist it will state that on `/servers`." 
        });
      
      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.get("with").value === "Joining Farwater") {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({
           name: "To join Farwater, follow these steps:", 
           value: "**Choose a server:** First, decide which server you want to play on. We have multiple servers available.\n**Download the modpack:** Once you've chosen a server, download the corresponding modpack.\n**Join the server:** After installing the modpack, join the server using its IP.\n\n**Helpful commands:**\n`/servers` - Displays all Farwater servers along with details like IP and modpacks.\n`/modpack` - Provides the download link for selected modpack.\n`/ip` - Shows the IP for the selected server." 
        });
      
      interaction.reply({ embeds: [embed] });
    }
  }
  
  if (interaction.isCommand() && interaction.commandName === "modping") {
    if (!interaction.inGuild() || interaction.guildId !== process.env.GUILD_ID) {
      return interaction.reply({
        content: "This command only works in the Farwater server!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await sendModPing(interaction);
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "stopModPing") {
      if (hasPermission) {
        clearInterval(interaction.message.pingInterval);
        await interaction.update({
          content: "The mod ping has been stopped.",
          components: [],
        });
        interaction.reply({
          content: "Mod ping stopped successfully!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        interaction.reply({
          content: "You do not have permission to stop the mod ping.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
});

client.login(process.env.TOKEN);
