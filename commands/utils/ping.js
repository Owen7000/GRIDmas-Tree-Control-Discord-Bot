const { EmbedBuilder, SlashCommandBuilder, ActivityType } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder().setName('ping').setDescription('Test to see if the bot is responsive'),
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
            .setAuthor({ name: 'GRIDmas Tree' })
            .setDescription(`I'm Alive!`)
            .addFields(
                { name: 'Status', value: 'The bot is alive, and replying to messages' }
            );

        await interaction.reply({ embeds: [pingEmbed] });
    }
}