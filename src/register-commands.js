require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const guild_commands = [
  {
    name: "modping",
    description: "Ping an online Moderator.",
  },
];

const global_commands = [
  {
    name: "ip",
    description: "Shows the selected IP.",
    contexts: [0, 1, 2],
    options: [
      {
        name: "server",
        description: "Which server IP.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Farwater: Deep Down Underground",
            value: `${process.env.DDU_IP}`,
          },
          {
            name: "Farwater: Create Basics",
            value: `${process.env.BASICS_IP}`,
          },
          {
            name: "Homestead",
            value: `${process.env.HOMESTEAD_IP}`,
          },
          {
            name: "ATM 10",
            value: `${process.env.ATM_10_IP}`,
          }
        ],
        required: true,
      },
    ],
  },
  {
    name: "modpack",
    description: "Shows the selected modpack.",
    contexts: [0, 1, 2],
    options: [
      {
        name: "modpack",
        description: "Which modpack.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Farwater: Create Basics",
            value: `Basics`,
          },
          {
            name: "Homestead",
            value: `Homestead`,
          },
          {
            name: "ATM 10",
            value: `ATM`,
          }
        ],
        required: true,
      },
    ],
  },
  {
    name: "servers",
    description: "Shows server info.",
    contexts: [0, 1, 2],
    options: [
      {
        name: "server",
        description: "Which server.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Farwater: Create Basics",
            value: `Basics`,
          },
          {
            name: "ATM 10",
            value: `ATM`,
          }
        ],
      },
    ],
  },
  {
    name: "help",
    description: "Send help messages.",
    contexts: [0, 1, 2],
    options: [
      {
        name: "with",
        description: "Help with",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Cracked Minecraft accounts",
            value: "Cracked Minecraft accounts",
          },
          {
            name: "Whitelist",
            value: "Whitelist",
          },
          {
            name: "Joining Farwater",
            value: "Joining Farwater",
          }
        ],
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering guild commands...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: guild_commands }
    );
    console.log("Guild commands registered!");

    console.log("Registering global commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: global_commands }
    );
    console.log("Global commands registered!");
  } catch (error) {
    console.error("There was an error registering commands:", error);
  }
})();
