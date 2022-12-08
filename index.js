const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "MESSAGE_CONTENT"] })
const { token, guildId, adminId } = require('./config.json')
const questions = require('./questions.json')
client.on("ready", () => {
    console.log("Bot ready.");


})

client.on("ready", () => {

    const guild = client.guilds.cache.get(guildId)

    const commands = guild.commands
    commands.create({
        name: "play",
        description: "Starts A Trivia Game",


    })


    //listens for an interaction
    client.on("interactionCreate", interaction => {
        if (!interaction.isCommand()) return
        const { channel, commandName, member } = interaction
        if (commandName === "play") {
            let adminRole = interaction.guild.roles.cache.get(adminId)
            console.log(adminRole.name);
            
           console.log(!member.roles.cache.has(adminRole.id));
            if (!member.roles.cache.has(adminRole.id)) return interaction.reply({ephemeral:true, content: "You do not have the permission to start a trivia!"})
            let introEmbed = new Discord.MessageEmbed()
                .setTitle(`:question: New trivia started by ${member.displayName}`)
                .setDescription("Type your answer in this channel. The first to answer gets the point. The question will be shown in a few seconds.. Get ready!")
                .setTimestamp()
            interaction.reply({ embeds: [introEmbed] })

            setTimeout(() => {
                let questionIndex = Math.floor(Math.random() * Object.keys(questions.list).length)

                let question = Object.keys(questions.list)[questionIndex]
                let answer = Object.values(questions.list)[questionIndex]

                console.log(question)
                console.log(answer)
                const filter = message => !message.author.bot
                let collector = new Discord.MessageCollector(channel,{ filter,time: 30 * 1000, })
                console.log("a");
                collector.on("collect", (message) => {
                    console.log("collect");
                    if (message.content.toLowerCase().includes(answer.toLowerCase())) {
                        console.log("correct!");
                        let winEmbed = new Discord.MessageEmbed()
                        .setTitle("Trivia Ended!")
                        .setDescription(`${message.member.displayName} has answered correctly!\n\nThe answer was: ${answer}`)
                        .setFooter({text:`Trivia Started By ${member.displayName}`})
                        channel.send({embeds: [winEmbed]})
                        collector.stop()
                    }
    
                })

                collector.on("end", (collected,reason) => {
                    console.log(reason);
                    if (reason == "time") {
                    let endEmbed = new Discord.MessageEmbed()
                    .setTitle("Trivia Ended!")
                    .setDescription("Noone answered correctly in 30 seconds. Nice try!")
                    .setFooter({text:`Trivia Started By ${member.displayName}`})
                    .setTimestamp()
                    channel.send({embeds: [endEmbed]})
                    }
                })
                let qEmbed = new Discord.MessageEmbed()
                    .setTitle(":question: Trivia!")
                    .setDescription(`**${question}**\n\nYou have 30 seconds to answer, if noone gets it, the question will expire.`)
                    .setFooter({ text: `Trivia Started By ${member.displayName}` })
                    .setTimestamp()

                channel.send({ embeds: [qEmbed] })



                


            }, 5000)
          
        }
    })




})




client.login(token)

