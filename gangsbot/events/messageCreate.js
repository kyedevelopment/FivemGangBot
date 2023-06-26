const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
    

    const whitelistedChannels = client.config.GUILD_WHITELISTED_CHANNELS.split(" ");

    await messagesGate(message, whitelistedChannels);

    async function messagesGate(message, whitelistedChannels) {
        const linksRegEx = /\b(https?:\/\/\S*\b)/g;

        if (message.mentions.everyone && client.db.get(`antiMentionMode`) === 1) {
            if (client.mentionsMap.has(message.author.id) && !message.member.roles.cache.has(client.config.STAFF_ROLE_ID)) {
                const userData = await client.mentionsMap.get(message.author.id);

                userData.mentionCount = userData.mentionCount + 1;
                await client.mentionsMap.set(message.author.id, userData);

                if (userData.mentionCount >= 7 && message.member.manageable) {
                    await message.member.ban({ reason: "[Anti Raid System - Anti Mention] => Auto ban - this mode is enabled. Member reached to 7 mentions then got banned." }).catch(() => {
                        return console.log("[Anti Raid System - Anti Mention] => Cannot ban this member.");
                    })
                    return await message.channel.bulkDelete(7).catch(() => {
                        return console.log("[Anti Raid System - Anti Mention] => Cannot bulk delete messages from this channel.");
                    });
                }

                return await message.delete();
            } else {
                await client.mentionsMap.set(message.author.id, { mentionCount: 1 });

                setTimeout(async () => { await client.mentionsMap.delete(message.author.id) }, 5000);
            }
        } else if (message.content.toString().match(linksRegEx) && !whitelistedChannels.includes(message.channel.id)) {
            var code;

            if (message.content.match(linksRegEx).toString().includes("discord.com/")) {
                code = message.content.match(linksRegEx).toString().split("discord.com/")[1];
            } else if (message.content.match(linksRegEx).toString().includes("discord.gg/")) {
                code = message.content.match(linksRegEx).toString().split("discord.gg/")[1];
            } else if (message.content.match(linksRegEx).toString().includes(".gg/")) {
                code = message.content.match(linksRegEx).toString().split(".gg/")[1];
            } else if (message.content.match(linksRegEx).toString().includes("d.gg/")) {
                code = message.content.match(linksRegEx).toString().split("d.gg/")[1];
            }

            if (client.db.get(`antiLinkMode`) === 1) {
                if (whitelistedChannels.includes(message.channel.id)) return;
                if (client.db.has(`activeTickets-${message.channel.id}`)) return;

                message.guild.invites.fetch().then(async (invites) => {
                    if (invites.has(code)) return;
                    else {
                        if (client.linksMap.has(message.author.id) && !message.member.roles.cache.has(client.config.STAFF_ROLE_ID)) {
                            const userData = await client.linksMap.get(message.author.id);
        
                            userData.linksCount = userData.linksCount + 1;
                            await client.linksMap.set(message.author.id, userData);
        
                            if (userData.linksCount >= 7 && message.member.manageable) {
                                await message.member.ban({ reason: "[Anti Raid System - Anti Links] => Auto ban - this mode is enabled. Member reached to 7 links sent in a row." }).catch(() => {
                                    return console.log("[Anti Raid System - Anti Links] => Cannot ban this member.");
                                })
                                return await message.channel.bulkDelete(7).catch(() => {
                                    return console.log("[Anti Raid System - Anti Links] => Cannot bulk delete messages from this channel.");
                                });
                            }
        
                            return await message.delete();
                        } else {
                            await message.delete();
                            await client.linksMap.set(message.author.id, { linksCount: 1 });
            
                            setTimeout(async () => { await client.linksMap.delete(message.author.id) }, 5000);
                        }
                    }
                }).catch(() => console.log("[Anti Raid System - Anti Links] => Couldnt check that code."))
            }
        } else if (client.db.get(`antiSpamMode`) === 1 && !message.member.roles.cache.has(client.config.STAFF_ROLE_ID)) {
            if (client.spamsMap.has(message.author.id)) {
                const userData = await client.spamsMap.get(message.author.id);
        
                userData.spamsCount = userData.spamsCount + 1;
                await client.spamsMap.set(message.author.id, userData);

                if (userData.spamsCount >= 10 && message.member.manageable) {
                    await message.member.ban({ reason: "[Anti Raid System - Anti Links] => Auto ban - this mode is enabled. Member reached to 10 messages he/she spammed in a row." }).catch(() => {
                        return console.log("[Anti Raid System - Anti Links] => Cannot ban this member.");
                    });

                    return await message.channel.bulkDelete(15).catch(() => {
                        return console.log("[Anti Raid System - Anti Links] => Cannot bulk delete messages from this channel.");
                    });
                }
            } else {
                await client.spamsMap.set(message.author.id, { spamsCount: 1 });
            
                setTimeout(async () => { await client.spamsMap.delete(message.author.id) }, 5000);
            }
        } else if (Array.isArray(message.embeds) && message.embeds?.length > 0) {
            if (client.db.get(`antiSelfBotMode`) === 1) {
                return message.member.ban({ reason: "[Anti Raid System - Anti Self Bot] => Auto ban - this mode is enabled. Member have self-bot modules." });
            }
        }
    }
}