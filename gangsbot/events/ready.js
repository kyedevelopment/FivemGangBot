const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");

module.exports = async (client) => {
    console.log(`[$$] >> Logged in as: ${client.user.tag}.\n[======================]\n[$$] >> Gangs official bot source code.\n[$$] >> Coded by Kye.\n[======================]`);

    client.user.setPresence({ status: "Online" });
    client.user.setActivity('Gangs Bot', { type: 'PLAYING' });

    setInterval(() => console.clear(), 420000);

    const guild = client.guilds.cache.get(client.config.GUILD_ID);

    await guild.commands.set(client.commandsArr);

};