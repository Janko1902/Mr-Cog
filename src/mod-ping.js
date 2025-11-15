const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { isBlacklisted, addToBlacklist, removeFromBlacklist } = require("./blacklist.js");

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
      .setDescription("Moderators are being notified, please be patient.")
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
        .setLabel("Stop and Blacklist User")
        .setStyle(ButtonStyle.Secondary)
    );

    const messageLink = replyMessage.url;

    const modEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("**Mod Ping**")
      .setDescription(`A mod ping has been activated. [Click here to view](${messageLink}).`)
      .setFooter({ text: `Triggered by: ${user.tag}`, iconURL: user.displayAvatarURL() });

    let lastPingMessage = await channel.send({
      content: modUserIds.map((id) => `<@${id}>`).join(" "),
      embeds: [modEmbed],
      components: [buttons],
    });

    await lastPingMessage.edit({
      embeds: [modEmbed],
      components: [buttons],
    });

    pingInterval = setInterval(async () => {
      try {
        if (!lastPingMessage.deleted) {
          await lastPingMessage.edit({ 
            content: "",
            components: [] 
          });
        }
  
        const newMessage = await pingMods(channel, modUserIds, messageLink);
        lastPingMessage = newMessage;
        attachCollector(newMessage, user, modUserIds, replyMessage);
  
      } catch (error) {
        console.error("Error in ping interval:", error);
      }
    }, 60000);

    attachCollector(lastPingMessage, user, modUserIds, replyMessage);

  } catch (error) {
    console.error("Error sending mod ping:", error);
  }
};

const attachCollector = (message, user, modUserIds, replyMessage) => {
  const blacklistUserButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("blacklistUser")
      .setLabel("Blacklist User")
      .setStyle(ButtonStyle.Secondary)
  );

  const removeBlacklistedUserButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("removeBlacklistedUser")
      .setLabel("Remove User from Blacklist")
      .setStyle(ButtonStyle.Secondary)
  );

  const collector = message.createMessageComponentCollector({
    time: 60000,
  });

  collector.on("collect", async (i) => {
    if (!modUserIds.includes(i.user.id)) {
      return i.reply({
        content: "You are not authorized to use this button.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const resolvedEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("**Mod Ping Resolved**")
      .setDescription("The issue has been resolved. Thank you for your patience!");

    if (i.customId === "stopModPing") {
      clearInterval(pingInterval);

      await replyMessage.edit({
        embeds: [resolvedEmbed],
        components: [],
      });

      await message.edit({ components: [] });

      await i.deferUpdate();
      await i.message.edit({
        content: "",
        components: [blacklistUserButton],
      });
    }

    if (i.customId === "blacklistUser") {
      clearInterval(pingInterval);
      addToBlacklist(user.id);

      const blacklistedEmbed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("User blacklisted")
        .setDescription(`<@${user.id}> has been blacklisted from using /modping.`);

      await replyMessage.edit({ embeds: [resolvedEmbed], components: [] });

      await i.deferUpdate();
      await i.message.edit({
        content: "",
        embeds: [blacklistedEmbed],
        components: [removeBlacklistedUserButton],
      });
    }

    if (i.customId === "removeBlacklistedUser") {
      removeFromBlacklist(user.id);

      const removedEmbed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("User removed from Blacklist")
        .setDescription(`<@${user.id}> has been removed from the blacklist.`);

      await i.deferUpdate();
      await i.message.edit({
        content: "",
        embeds: [removedEmbed],
        components: [],
      });
    }
  });
};

const pingMods = async (channel, modUserIds, messageLink) => {
  try {
    const modsToPing = modUserIds.map((id) => `<@${id}>`).join(" ");
    if (!modsToPing) return;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("**Mod Ping In Progress**")
      .setDescription(
        `A mod ping is active. [Click here to view](${messageLink}).`
      )
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("stopModPing")
        .setLabel("Stop Mod Ping")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("blacklistUser")
        .setLabel("Stop and Blacklist User")
        .setStyle(ButtonStyle.Secondary)
    );

    return await channel.send({
      content: `${modsToPing}`,
      embeds: [embed],
      components: [buttons],
    });
  } catch (error) {
    console.error("Error pinging mods:", error);
  }
};

module.exports = { sendModPing };
