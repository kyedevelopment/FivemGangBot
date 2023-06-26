const { createConnection } = require("mysql");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "addgang",
  description: "Adds a gang.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "name",
      type: "STRING",
      description: "Gang's set code.",
      required: true
    },
    {
      name: "label",
      type: "STRING",
      description: "Gang's name.",
      required: true
    },
    {
      name: "leadership",
      type: "STRING",
      description: "Gang's leadership rank.",
      required: true
    }
  ],
  requirements: { userPerms: [], clientPerms: [], staffOnly: false },

  run: async (client, interaction, args) => {
    const gangCode = interaction.options.getString("name");
    const gangLabel = interaction.options.getString("label");
    const gangLeadership = interaction.options.getString("leadership");

    const logsChannel = client.channels.cache.get(client.config.LOG_CHANNEL);
    const LogMessage = new MessageEmbed()
      .setTitle("Gang Logs")
      .setColor(client.config.EMBED_DEF_COLOR)
      .setFooter({
        text: `discord.gg/changeme`,
        iconURL: client.user.displayAvatarURL()
      })
      .setTimestamp();
    logsChannel.send({
      embeds: [LogMessage.setDescription(`[**NEW GANG ADDED!**] -> A gang has been added with the following:\n **Gang Name:** ${gangCode}\n **Gang Label:** ${gangLabel}\n **Gang Leadership:** ${gangLeadership}`)]
    });

    const connection = createConnection({
      host: client.config.DB_HOST,
      user: client.config.DB_USER,
      password: client.config.DB_PASS,
      database: client.config.DB_NAME
    });

    connection.connect();

    if (await codeAlreadyExists(connection, gangCode)) {
      return interaction.followUp({ content: "This gang already exists!", ephemeral: true });
    } else {
      return addGang(connection, gangCode, gangLabel, gangLeadership);
    }

    async function codeAlreadyExists(connection, gangCode) {
        return new Promise((resolve, reject) => {
          connection.query('SELECT id FROM gangs WHERE id >= 0 ORDER BY id ASC', function (error, results, fields) {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              let nextId = 0;
      
              for (const result of results) {
                if (result.id === nextId) {
                  nextId++;
                } else {
                  break;
                }
              }
      
              connection.query('SELECT * FROM gangs WHERE id = ?', [nextId], function (error, results, fields) {
                if (error) {
                  console.error(error);
                  reject(error);
                }
      
                if (results.length === 0) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              });
            }
          });
        });
      }
      
      async function addGang(connection, gangCode, gangLabel, gangLeadership) {
        return new Promise((resolve, reject) => {
          codeAlreadyExists(connection, gangCode)
            .then((exists) => {
              if (exists) {
                resolve("This gang already exists!");
              } else {
                let nextId = 0;
      
                connection.query('SELECT MAX(id) AS maxId FROM gangs', function (error, results, fields) {
                  if (error) {
                    console.error(error);
                    reject(error);
                  } else {
                    const maxId = results[0].maxId;
                    nextId = maxId !== null ? maxId + 1 : 0;
      
                    connection.query('INSERT INTO gangs (id, name, label, leadership_rank) VALUES (?, ?, ?, ?)', [nextId, gangCode, gangLabel, gangLeadership], function (error, results, fields) {
                      if (error) {
                        console.error(error);
                        reject(error);
                      } else {
                        resolve("Gang added successfully!");
                      }
                    });
                  }
                });
              }
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        });
      };
    },
}