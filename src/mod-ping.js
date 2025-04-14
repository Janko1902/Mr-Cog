const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

const { isBlacklisted, addToBlacklist } = require("./blacklist.js");

const sendModPing = async (interaction) => {
  const user = interaction.user;

  if (isBlacklisted(user.id)) {
    await interaction.reply({
      content: "You are not allowed to use this command.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    const guild = interaction.guild;
    if (!guild) {
      console.error("Guild is undefined");
      return;
    }

    const channel = await guild.channels.fetch(process.env.CHANNEL_ID);
    const modUserIds = process.env.MOD_USER_IDS.split(", ");

    const userEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("**Mod Ping**")
      .setDescription(`Moderators are being notified, please be patient.`)
      .setFooter({ text: `Triggered by: ${user.tag}`, iconURL: user.displayAvatarURL() });

    const replyMessage = await interaction.reply({
      embeds: [userEmbed],
      fetchReply: true,
    });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("stopModPing")
        .setLabel("Stop Mod Ping")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("blacklistUser")
        .setLabel("Blacklist User")
        .setStyle(ButtonStyle.Secondary)
    );

    const modEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("**Mod Ping**")
      .setDescription(`A mod ping has been activated. Help is on the way!`)
      .setFooter({ text: `Triggered by: ${user.tag}`, iconURL: user.displayAvatarURL() });

    const pingMessage = await channel.send({
      content: modUserIds.map(userId => `<@${userId}>`).join(" "), 
      embeds: [modEmbed],
      components: [buttons],
    });

    const messageLink = replyMessage.url;

    const updatedModEmbed = EmbedBuilder.from(modEmbed).setDescription(
      `A mod ping has been activated. [Click here to view](${messageLink}).`
    );

    await pingMessage.edit({
      embeds: [updatedModEmbed],
      components: [buttons],
    });

    pingMessage.pingInterval = setInterval(async () => {
      await pingMods(channel, modUserIds, messageLink);
    }, 60000);

    const collector = pingMessage.createMessageComponentCollector({
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (!modUserIds.includes(i.user.id)) {
        if (!modUserIds.includes(i.user.id)) {
          return i.reply({
            content: "You are not authoized to use this button.",
            flags: MessageFlags.Ephemeral,
          })
        }
      }

      if (i.customId === "stopModPing") {
        clearInterval(pingMessage.pingInterval);

        const resolvedEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("**Mod Ping Resolved**")
          .setDescription("The issue has been resolved. Thank you for your patience!");

        await replyMessage.edit({
          embeds: [resolvedEmbed],
          components: [],
        });

        await pingMessage.edit({ components: [] });

        await i.update({ content: "Mod ping stopped.", components: [] });
      }

      if (i.customId === "blacklistUser") {
        addToBlacklist(user.id);
        await i.reply({
           content: `<@${user.id}> has been blacklisted from using /modping.`,
          });
      }
    });

    collector.on("end", () => {
      clearInterval(pingMessage.pingInterval);
    });

  } catch (error) {
    console.error("Error sending mod ping:", error);
  }
};

const pingMods = async (channel, modUserIds, messageLink) => {
  try {
    const modsToPing = modUserIds.map(userId => `<@${userId}>`).join(" ");
    if (modsToPing) {
      await channel.send(`${modsToPing}\n**Mod Ping in progress.**\n**Mod Ping Link:** ${messageLink}`);
    }
  } catch (error) {
    console.error("Error pinging mods:", error);
  }
};

module.exports = { sendModPing };
