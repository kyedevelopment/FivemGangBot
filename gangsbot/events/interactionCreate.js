const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { v4: uuidv4 } = require('uuid');

module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        await interaction.reply({ content: "Successful Operation!", ephemeral: true }).catch(e => console.log(e));

        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({ content: "An error has occured! "});

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);

                option.options?.forEach((x) => { if (x.value) args.push(x.value); });
            } else if (option.value) args.push(option.value);
        }

        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    };

};