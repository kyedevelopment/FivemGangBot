const { Client, Intents, Collection } = require("discord.js");

const allIntents = new Intents(32767);
const client = new Client({ intents: [allIntents] });

const db = require("quick.db");

const commands = require("./structures/command");
const events = require("./structures/event");
const utils = require("./utils/utils");

require("dotenv").config();

client.config = process.env;
client.commands = new Collection();
client.commandsArr = [];
client.db = db;
client.utils = utils;
client.snipes = new Collection();
client.cooldowns = new Set();
client.mentionsMap = new Map();
client.linksMap = new Map();
client.spamsMap = new Map();
client.statusCoolDown = new Set();

commands.run(client);
events.run(client);

client.login(client.config.CLIENT_TOKEN);