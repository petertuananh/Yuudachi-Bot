const Discord = require("discord.js")
exports.checkperms = function checkPerms (target) {
    if (target.user.permissions.has(Discord.PermissionFlagsBits[target.permission])) {
        return true
    } else {
        return false
    }

}
