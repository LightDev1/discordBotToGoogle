import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';
import config from 'config';
import { commands } from './commands.js';

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`${client.user.username} запустился!`);
    console.log('Ссылка-приглашение: ', 'https://discord.com/api/oauth2/authorize?client_id=828292696807440385&permissions=2054&scope=bot');
});

client.on('message', msg => {
    if (msg.author.username !== client.user.username && msg.author.discriminator !== client.user.discriminator) {
        const command = msg.content.trim() + ' ';
        const commandName = command.slice(0, command.indexOf(' '));
        const messageArray = command.split(' ');
        console.log(messageArray);
        for (let i = 0; i < commands.length; i++) {
            const prefix = config.get('prefix');
            const commandTemp = prefix + commands[i].name;

            if (commandTemp === commandName) {
                commands[i].out(client, msg, messageArray);
            }
        }

    }
});

client.login(process.env.BOT_TOKEN);