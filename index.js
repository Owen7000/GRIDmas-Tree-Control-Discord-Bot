const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits, MessageFlags} = require("discord.js");
const { token } = require("./config.json");

// Create the bot client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Runs once the bot logs in
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Client logged in as ${readyClient.user.tag}`);

    // Temporarily set the bots presence to DND while it sets up, and verifies that the tree is ready
    client.user.setPresence({
        activities: [{ name: "Please wait. I am still waking up!" }],
        status: "dnd"
    });
})

const foldersPath= path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`The command in file: ${filePath} is missing either execute or data`);
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    const command= interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName}`);
        return;
    }

    if(interaction.isAutocomplete()) {
        try {
            if (typeof command.autocomplete === "function") {
                    await command.autocomplete(interaction);
            }
        } catch (error) {
            console.error(error);
        }

        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error trying to execute that command. Either it didn't exist, or there was a mini wormhole inbetween you and the tree.",
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.followUp({
                content: "TCongratulations, the bot quite literally didn't know what to do... needless to say, your command wasn't run",
                flags: MessageFlags.Ephemeral,
            });

            console.error(error);
        }
    }
})

client.login(token);