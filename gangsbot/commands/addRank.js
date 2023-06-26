const { createConnection } = require("mysql");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "addrank",
    description: "Adds a gang.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "name",
            type: "STRING",
            description: "Gang's rank.",
            required: true
        },
        {
            name: "label",
            type: "STRING",
            description: "Gang's rank name.",
            required: true
        },
        {
            name: "gang_name",
            type: "STRING",
            description: "Gang's set code.",
            required: true
        },
        {
            name: "ranking",
            type: "STRING",
            description: "Gang's ranking.",
            required: true
        }
    ],
    requirements: { userPerms: [], clientPerms: [], staffOnly: false },

    run: async (client, interaction, args) => {
        const gangName = interaction.options.getString("name");
        const gangLabel = interaction.options.getString("label");
        const gangCode = interaction.options.getString("gang_name");
        const gangRanking = interaction.options.getString("ranking");

        const logsChannel = client.channels.cache.get(client.config.LOG_CHANNEL)
        const LogMessage = new MessageEmbed()
            .setTitle(`Gang Logs`)
            .setColor(client.config.EMBED_DEF_COLOR)
            .setFooter({ text: `discord.gg/changeme`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();
        logsChannel.send({ embeds: [LogMessage.setDescription(`[**NEW GANG RANKS!**] -> A gangs ranks have been added.\n ${gangName}\n ${gangLabel}\n ${gangCode}\n ${gangRanking}`)]})

        const connection = createConnection({
            host: client.config.DB_HOST,
            user: client.config.DB_USER,
            password: client.config.DB_PASS,
            database: client.config.DB_NAME
        });

        connection.connect();

        return addRank(gangName, gangLabel, gangCode, gangRanking);

        function addRank(gangName, gangLabel, gangCode, gangRanking) {
            return connection.query('INSERT INTO gang_ranks (name, label, gang_name, ranking) VALUES (?, ?, ?, ?)', [gangName, gangLabel, gangCode, gangRanking], function (error, results, fields) {
                if (error) throw error;
            });
        }
    }
};