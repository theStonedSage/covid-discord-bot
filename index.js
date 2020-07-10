const Discord = require('discord.js');
const parser = require('discord-command-parser');
const { token } = require('./config.json');
const com = require("./commands/command")
const client = new Discord.Client();

client.once('ready',()=>{
    console.log('ready');
})

const prefix = "cov";

client.on('message',message=>{
    
    const parsed = parser.parse(message, prefix,{allowSpaceBeforeCommand:true});
    if(parsed.success){
        com[parsed.command](message,parsed.arguments);
        // console.log(parsed.arguments);
    }
})
client.login(token);