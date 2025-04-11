const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

const sendModPing = async (interaction) => {
  try {
    const user = interaction.user;
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

    const stopModPing = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("stopModPing")
        .setLabel("Stop Mod Ping")
        .setStyle(ButtonStyle.Danger)
    );

    const modEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("**Mod Ping**")
      .setDescription(`A mod ping has been activated. Help is on the way!`)
      .setFooter({ text: `Triggered by: ${user.tag}`, iconURL: user.displayAvatarURL() });

    const pingMessage = await channel.send({
      content: modUserIds.map(userId => `<@${userId}>`).join(" "), 
      embeds: [modEmbed],
      components: [stopModPing],
    });

    const messageLink = replyMessage.url;

    const updatedModEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("**Mod Ping**")
      .setDescription(`A mod ping has been activated. [Click here to view](${messageLink}).`)
      .setFooter({ text: `Triggered by: ${user.tag}`, iconURL: user.displayAvatarURL() });

    await pingMessage.edit({
      embeds: [updatedModEmbed],
      components: [stopModPing], 
    });

    pingMessage.pingInterval = setInterval(async () => {
      await pingMods(channel, modUserIds, messageLink); 
    }, 60000);

    console.log("Mod ping sent successfully!");

    const filter = i => i.customId === 'stopModPing' && modUserIds.includes(i.user.id);
    const collector = pingMessage.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on('collect', async (i) => {
      await i.deferUpdate();

      clearInterval(pingMessage.pingInterval);

      const updatedEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("**Mod Ping Resolved**")
        .setDescription("The issue has been resolved. Thank you for your patience!");

      await replyMessage.edit({
        embeds: [updatedEmbed],
        components: [],
      });

      await channel.send("The issue has been resolved.");
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
