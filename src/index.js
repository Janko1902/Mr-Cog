require("./register-commands.js");
const { checkAllFeeds } = require("./feeds.js");
const { sendModPing } = require("./mod-ping.js");
require("dotenv").config();
const {
  Client,
  IntentsBitField,
  MessageFlags,
  EmbedBuilder,
  Events,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

module.exports = client;

require("./ghost-ping.js");

const statuses = [
  {
    activities: [{
      name: "Farwater players",
      type: 2
    }],
    status: "online",
  },
  {
    activities: [{ 
      name: "Minecraft", 
      type: 0 
    }],
    status: "online",
  },
  {
    activities: [{ 
      name: "Farwater", 
      type: 3 
    }],
    status: "online",
  },
  {
    activities: [{ 
      name: "Hytale", 
      type: 0 
    }],
    status: "online",
  }
]

function randomizeStatus() {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  client.user.setPresence(status);
}

client.once(Events.ClientReady, (c) => {
  console.log(`${c.user.tag} is online.`);

  randomizeStatus();
  setInterval(randomizeStatus, 600000); //10 Min
  //setInterval(() => checkAllFeeds(client), 60000); //1 Min 
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
            value: `IP: \`${ip}\``,
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
        .addFields({ name: "Farwater: Create Basics", value: `\`IP: ${ip}\`` });

      return interaction.reply({ embeds: [embed] });
    } else if (ip === process.env.HYTALE_IP) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({ name: "Farwater: Our Tale", value: `IP: \`${ip}\`` });

      return interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.commandName === "modpack") {
    const modpack = interaction.options.get("modpack").value;

    if (modpack === "Basics") {
      const embed = new EmbedBuilder().setColor("Random").addFields({
        name: "Farwater: Create Basics - <:neoforged:1404088666120257737> NeoForged",
        value: `<:modrinth:1348353426052091995> [Modrinth](<https://modrinth.com/modpack/farwater-create-basics>)`,
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
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields(
          {
            name: "Farwater: Create Basics - <:neoforged:1404088666120257737> NeoForged",
            value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.BASICS_IP}\`\n<:modrinth:1348353426052091995> [Modrinth](https://modrinth.com/modpack/farwater-create-basics)`,
          },
          {
            name: "",
            value: "-# <:yes:1357104035361984532> - Whitelist required\n-# <:no:1357104048595271954> - Whitelist not required",
          }
        );

      return interaction.reply({ embeds: [embed] });
    } else if (server === "Hytale") {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields(
          {
            name: "Farwater: Our Tale - <:hytale:1460609588083556458> Hytale",
            value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.HYTALE_IP}\``,
          },
          {
            name: "",
            value: "-# <:yes:1357104035361984532> - Whitelist required\n-# <:no:1357104048595271954> - Whitelist not required",
          }
        );

      return interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Farwater Servers")
        .setColor("Random")
        .addFields(
          {
            name: "Farwater: Create Basics - <:neoforged:1404088666120257737> NeoForged",
            value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.BASICS_IP}\`\n<:modrinth:1348353426052091995> [Modrinth](https://modrinth.com/modpack/farwater-create-basics)`,
          },
          {
            name: "Farwater: Our Tale - <:hytale:1460609588083556458> Hytale",
            value: `Whitelist: <:no:1357104048595271954>\nIP: \`${process.env.HYTALE_IP}\``,
          },
          {
            name: "",
            value: "-# <:yes:1357104035361984532> - Whitelist required\n-# <:no:1357104048595271954> - Whitelist not required",
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
    await sendModPing(interaction);
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
