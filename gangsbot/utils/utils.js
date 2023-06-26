const request = require("request");

module.exports.missingPerms = function missingPerms(member, perms) {
    const missingPerms = member.permissions.missing(perms).map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

    return missingPerms.length > 1 ? `${missingPerms.slice(0, -1).join(", ")} and ${missingPerms.slice(-1)[0]}` : missingPerms[0];
}

module.exports.getUserFromMention = function getUserFromMention(client, mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}

module.exports.getPlayersInfo = async function getPlayersInfo(url) {
    return new Promise((resolve, reject) => {
        request(`${url}/players.json`, async function (err, res, body) {
            if (err) return reject(err);
            
            const parsedBody = await JSON.parse(body);

            return resolve(parsedBody);
        });
    });
};

module.exports.getServerInfo = async function getServerInfo(url) {
    return new Promise((resolve, reject) => {
        request(`${url}/info.json`, async function (err, res, body) {
            if (err) return reject(err);

            const parsedBody = await JSON.parse(body);

            return resolve(parsedBody);
        });
    });
};