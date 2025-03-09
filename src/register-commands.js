require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "ip",
    description: "Shows the selected IP.",
    options: [
      {
        name: "server",
        description: "Which server IP.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Farwater: Create Basics",
            value: `IP for Farwater: Create Basics is \`${process.env.BASICS_IP}\``,
          },
          {
            name: "Create: Arcane Engineering",
            value: `IP for Create: Arcane Engineering is \`${process.env.CAE_IP}\``,
          },
          {
            name: "Farwater: Deep Down Underground",
            value: `IP for Farwater: Deep Down Underground is \`${process.env.DDU_IP}\``,
          },
        ],
        required: true,
      },
    ],
  },
  {
    name: "server",
    description: "Shows server info.",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Registered slash commands!");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
