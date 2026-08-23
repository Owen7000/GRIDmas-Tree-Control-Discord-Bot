const { REST, Routes } = require("discord.js");
const { client_id, token, guild_id } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);



(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// const data = await rest.put(Routes.applicationCommands(client_id), { body: commands });

        // For development purposes only, because registering global commands takes too long
        const data = await rest.put(
            Routes.applicationGuildCommands(client_id, guild_id),
            { body: commands }
        );

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();