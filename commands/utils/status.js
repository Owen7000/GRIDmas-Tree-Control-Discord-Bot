const { EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const { getCurrentPattern } = require("../../tree/api.js");
const process = require("process");

module.exports = {
    data:new SlashCommandBuilder()
    .setName("status")
    .setDescription("Is the tree working?"),
    async execute(interaction) {
        const current = await getCurrentPattern();
        console.log(current);

        const statusEmbed = new EmbedBuilder()
            .setAuthor({ name: "GRIDmas Tree" })
            .setDescription("The current status of Christmas is shown below")
            .setTitle("Current Status")
            .addFields(
                { name: "Current Pattern", value: `${current.patternName}`},
                { name: "Server response time", value: `${Math.round(current.responseTime)}ms`},
                { name: "Bot uptime", value: `${Math.round(process.uptime())}s`}
            );
        await interaction.reply({ embeds: [statusEmbed] })
    }
}