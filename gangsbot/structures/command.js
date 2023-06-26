const { readdirSync } = require("fs");
const { join } = require("path");
const commandsFilePath = join(__dirname, "..", "commands");

module.exports.run = (client) => {
    readdirSync(commandsFilePath).filter(cmd => cmd.endsWith(".js")).map((value) => {
        const file = require(`${commandsFilePath}/${value}`);
        if (!file?.name) return;

        client.commands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        client.commandsArr.push(file);
    });

    console.log(`[======================]\n[$$] >> Loaded ${client.commands.size} commands.`);
}