const Discord = require('discord.js')
const {Client, Collection, Attachment, MessageEmbed} = require('discord.js');
const bot = new Client({ partials: ['MESSSAGE']});
const ms = require("ms");
const fs = require("fs");
const PREFIX = "ps!"
const token = 'NzM3MzA2ODA5NzczMDY0Mjkz.Xx7ceQ.VVT8JP8A24e5wn-BflcL-mwsFbk';
const Jimp = require(`jimp`)
const superagent = require('superagent');
const moment = require("moment")
require("moment-duration-format")
const urban = require('urban.js')
const malScraper = require('mal-scraper');
const rp = require('request-promise-native');
const randomPuppy = require("random-puppy");
const booru = require('booru');

var userTickets = new Map();



var fortunes = [
  "`Yes`",
  "`No`",
  "`Maybe`",
  "`Ask again`",
  "`Sometimes`",
  "`Okay`",
  "`HELL NO`",
  "`FUCK YEAH`",
  "`no no no`"
];

const { GiveawaysManager } = require('discord-giveaways');
bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});
// We now have a client.giveawaysManager property to manage our giveaways!

bot.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

bot.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});
const used = new Map();
const Duration = require('humanize-duration');

const invites = {};

// A pretty useful method to create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);


bot.on('ready',() =>{
   console.log("Started up! Lets go bois!")
const startUp = new Discord.MessageEmbed()
   .setTitle("Bot Status")
   .setDescription("*``Bot Started UP!``*")
   .setColor(0x36FF00)
   .setTimestamp()
   .setFooter("PokeSupport Bot") 
  bot.channels.cache.get('737338067698057278').send(startUp)
  bot.user.setStatus('online')
    bot.user.setActivity('with Pokémpire',{
            type: "PLAYING"})
})

bot.on('guildMemberAdd', member=>{
  const channel = member.guild.channels.cache.find(channel => channel.id === "734226555206631476");
  if(!channel) return
 const greet = new Discord.MessageEmbed()
  .setTitle(`:partying_face: Welcome to __***${channel.guild.name}***__ :partying_face:`)
  .setDescription(`\n :beers: **You are our ${member.guild.memberCount} member of the server!** \n \n :dizzy: **Read our server rules from <#737338067287015512>!** \n \n :dizzy: **Get some roles from <#737338067698057281>.**`)
  .setImage('https://i.pinimg.com/originals/fc/3c/77/fc3c7730dd88bbec6d8f214d351a9b0e.gif')
  .setColor(0xEE41D6)
  .setThumbnail(member.displayAvatarURL)
  .setFooter("Gotta Catch em' All!")
  .setTimestamp()
 channel.send(`${member} Welcome to the Server!`,greet)
})

bot.on('guildMemberRemove', member =>{
  const channel = member.guild.channels.cache.find(channel => channel.id === "734226531974643822");
  if(!channel) return
  channel.send(`**${member.user.tag}** Just left the server... We hope you had a great time here😭. See ya soon!🤗`)
})


bot.on('message' ,async message=>{

  if(message.author.bot || message.channel.type === 'dm') return;

  /*if(message.author.bot) {
    if(message.embeds.length === 1 && message.embeds[0].description.startsWith('React')) {
        message.react(':pokeball:737700976827301999')
        .then(msgReaction => console.log('Reacted.'))
        .catch(err => console.log(err));
    }
    if(message.embeds.length === 1 && message.embeds[0].title === 'Ticket Support') {
        message.react(':warn:739554268154953834')
        .then(reaction => console.log("Reacted with " + reaction.emoji.name))
        .catch(err => console.log(err));
    }
};

if(message.content.toLowerCase() === 'ps!sendmsg') {
  const embed = new Discord.MessageEmbed()
  .setAuthor(bot.user.username, bot.user.displayAvatarURL())
  .setDescription('React to this message to open a support ticket')
  .setColor('#F39237')
  message.channel.send(embed);
}*/

if(message.content.toLowerCase() === 'ps!createticket' && message.channel.id === '740178580360790106') {
  let Ticketmodlog = message.guild.channels.cache.get('740174369040367627');

  Ticketmodlog.send({embed: {
    color: 3447003,
    author: {
      name: bot.user.username,
      icon_url: bot.user.avatarURL
    },
    fields: [{
        name: "createticket:",
        value: `**USER:** ${message.author.username}#${message.author.discriminator}`
            }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: bot.user.avatarURL,
      text: bot.user.username
    }
  }
});
  /**
   * Check if the map has the user's id as a key
   * We also need to check if there might be another channel the bot made that it did not delete, (could've been from an old ticket but the bot crashed so the channel was not closed/deleted.)
   */
  if(userTickets.has(message.author.id) || 
  message.guild.channels.cache.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
      message.author.send("You already have a ticket!");
  } 
  else {
      let guild = message.guild;
      /**
       * Create the channel, pass in params.
       * Make sure you assign appropriate permissions for each role.
       * If you have additional roles: e.g Moderator, Trial Mod, etc. each of them needs permissions for it.
       * You can choose to set up additional permissions.
       */
      guild.channels.create(`${message.author.username}s-ticket`, {
          type: 'text',
          permissionOverwrites: [
              {
                  allow: 'VIEW_CHANNEL',
                  id: message.author.id
              },
              {
                  deny: 'VIEW_CHANNEL',
                  id: guild.id
              },
              {
                  allow: 'VIEW_CHANNEL',
                  id: '718721073360797707'
              }
          ]
      }).then(ch => {
          userTickets.set(message.author.id, ch.id); // Once our channel is created, we set the map with a key-value pair where we map the user's id to their ticket's channel id, indicating that they have a ticket opened.
      }).catch(err => console.log(err));
  }
}
else if(message.content.toLowerCase() === 'ps!closeticket') { // Closing the ticket.
  if(userTickets.has(message.author.id)) { // Check if the user has a ticket by checking if the map has their ID as a key.
      if(message.channel.id === userTickets.get(message.author.id)) {
        let TicketClosemodlog = message.guild.channels.cache.get('740174369040367627');

        TicketClosemodlog.send({embed: {
          color: 3447003,
          author: {
            name: bot.user.username,
            icon_url: bot.user.avatarURL
          },
          fields: [{
              name: "closeticket:",
              value: `**USER:** ${message.author.username}#${message.author.discriminator}`
                  }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });

          message.channel.delete('closing ticket') // Delete the ticket.
          .then(channel => {
              console.log("Deleted " + channel.name);
              userTickets.delete(message.author.id);
          })
          .catch(err => console.log(err));
      }
  }
  /** 
   * Here we will check the server to see if there were additional tickets created that the bot may have missed due to 
   * either crashing, restarting, etc.. This part will delete ALL of the tickets that follow the format of 
   * "<username>s-ticket" because that was the way we hard-coded. You can modify this obviously.
   */
  if(message.guild.channels.cache.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
      message.guild.channels.forEach(channel => {
          if(channel.name.toLowerCase() === message.author.username + 's-ticket') {
              channel.delete().then(ch => console.log('Deleted Channel ' + ch.id))
              .catch(err => console.log(err));
          }
      });
  }
}


   if (message.mentions.has(bot.user)){
    if(message.author.bot || message.channel.type === 'dm') return;
      message.channel.send(`My PREFIX for the server is \`${PREFIX}\``)
   }
  
    switch(message.content.toLowerCase()){

      

       case 'spawn':
          message.channel.send('No Spawn For you!')
          break;
        case 'nigga':
        case 'bitch':
        case 'asshole':
        case 'fucker':        
        case 'fuck':
        case 'cunt':
            message.channel.send("Please be respectful in the server.")
            break;
        case 'lucifer':
            message.channel.send("is pro!")
            break;
    }
    
    let args = message.content.substring(PREFIX.length).split(" ");

    if(message.content.substring(0, PREFIX.length) == PREFIX){
        let argss = args[0].toLowerCase() 
        
        switch(argss)
        {
          case "help":

        try {
            message.reply("Please check your direct messages :inbox_tray:");

            message.react('✅');

            message.author.send({embed: {
            color: 3447003,
            title: "Bot's commands",
            fields: [{
                name: "⚙️ Moderation",
                value: 'ban , kick , softban , unban, mute, unmute'
              },
              {
                name: "🎉 Fun",
                value: 'meme, rps, ratewaifu, 8ball, advice, anime, dick, roll, urban, animesearch, notice, coinflip, quote, baka, dog, say'
              },
              {
                name: "🎞 Gif",
                value: "pat, punch, stare, highfive, smile, handhold, kill, hug, cry, kiss, tickle, spank, poke"
              },
              {
                name: " 🛠 Admin",
                value: "announce, botnick, uptime, dm, purge"
              },
              {
                name: "📊 Server",
                value: "announce, avatar, server-suggest/ssugest, bot-suggest/bsuggest, poll, invite, calc/calculator, ping, issue, serverinfo, info, createticket, closeticket"
              },
              {
                name: "🎊 Giveaway",
                value: "giveaway-start, giveaway-reroll, giveaway-end"

              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
        }
        catch(err) {
            message.channel.send('I could not send you my commands!');
        } 
        break;
        
           case 'purge':
            if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("You need 'Manage Messages' permission to use this command!")
    //Number of messages to delete
    var temp = parseInt(args[1]) || 0;//parseInt(msg.content.substring(6).trim()) || 0;
    
      //Discord has a limit of 100 messages.
			if(temp < 1 || temp > 99)
				message.channel.send('Please select a number from 1-99');
			else {
          //Trying to figure out why not adding 1 deletes temp-1 but
          //adding 1 deletes temp+1
			    
          //Because 2 messages get deleted if only 1 is requested.
          //if(temp == 1)
            //temp--;
            //Gets messages to be deleted.
            //To Be Fixed at a Later Date.
				message.channel.messages.fetch({limit: (temp+1/*Because logic*/)}).then(messages => {
				    const unpinnedMessages = messages.filter(message => !(message.pinned)); //A collection of messages that aren't pinned
				    message.channel.bulkDelete(unpinnedMessages, true);
            //For case of 1 message to be deleted.
            //if(temp == 0)
            //  placeholder = 0;
				    msgsDeleted = unpinnedMessages.array().length; // number of messages deleted
            //Kind of wish I commented this when I originally coded it.
            bot.flag = true;
					msg.channel.send(msgsDeleted-1 + ' message(s) deleted!');
					
          //msg.delete();
				}).catch(err => {
					
          message.delete();
				});
			}

              break;
              
              /*case 'auc-start':
                case 'auction-start':
                  case 'acs':
                   let aucTime = args[1]
                  if(!aucTime){
                    message.channel.send("You need to give a time duration for the auction.")
                  }else{
                    message.channel.send("Info the card you want to auction.")

                    const filter = response => {
                      return response.author.id == Authorid;
                    }
                    message.channel.awaitMessages(filter, {max:1, time:30000}).then(collected => { 
                      const response = collected.first().content.toLowerCase();
                    }  
                  }




                  break;*/

              case 'pat':
               let pat2 = message.mentions.users.first();
               let pat1 = message.author;
               const rand_pat = ['https://media1.tenor.com/images/dce2241cab947a1eeefe0b4c8be4d2e0/tenor.gif?itemid=15930799' , 'https://media1.tenor.com/images/153e9bdd80008e8c0f94110450fcbf98/tenor.gif?itemid=10534102' , 'https://media1.tenor.com/images/61187dd8c7985c443bf9cd39bc310c02/tenor.gif?itemid=12018805' , 'https://media1.tenor.com/images/28f4f29de42f03f66fb17c5621e7bedf/tenor.gif?itemid=8659513' , 'https://media1.tenor.com/images/8331ba63516b37eb6987dcd45c4c0f66/tenor.gif?itemid=11780508' , 'https://media1.tenor.com/images/a36f0a746c5939603a202911c6b1b2b1/tenor.gif?itemid=16901828' ];
               file = rand_pat[Math.floor(Math.random() * rand_pat.length)]
                  if(message.content === PREFIX + "pat"){
                     const patttt = new Discord.MessageEmbed()
                     .setColor(0x44E0CD)
                     .setTitle('Wrong Syntax')
                     .addField('Correct Syntax',PREFIX + 'pat @user')
                     .addField('Example',PREFIX+'pat @Lunala')
                     message.channel.send(patttt)
                  
                  }else if(pat2 !== message.author){
                     const patt = new Discord.MessageEmbed()  
                      .setTitle(`${pat1.username} gives a nice pat to ${pat2.username}`  )
                      .setColor(0x44E0CD) 
                      .setImage(file) 
                      .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                      message.channel.send(patt);                   
                  
                  }else if (pat2 == message.author){
                     const pattt = new Discord.MessageEmbed()
                       .setTitle(`${bot.user.username} gives ${pat2.username} a big pat`)
                       .setColor(0x44E0CD) 
                       .setImage(file)  
                       .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                       message.channel.send(pattt);
                  }        
            break;
     
              case 'punch':
                 let punch2 = message.mentions.users.first();
                 let punch1 = message.author;
                 const rand_punch = ['https://media1.tenor.com/images/c621075def6ca41785ef4aaea20cc3a2/tenor.gif?itemid=7679409' , 'https://media1.tenor.com/images/3b09dfc9c38209d87426b5fb5cee794e/tenor.gif?itemid=12395640' , 'https://media1.tenor.com/images/5511a8309a1719987a27aa7b1ee7da04/tenor.gif?itemid=12303482' , 'https://media1.tenor.com/images/517f63ce5ffc6426bddd17d7413ebaca/tenor.gif?itemid=5247335' , 'https://media1.tenor.com/images/ee3f2a6939a68df9563a7374f131fd96/tenor.gif?itemid=14210784' , 'https://media1.tenor.com/images/31686440e805309d34e94219e4bedac1/tenor.gif?itemid=4790446' , 'https://media1.tenor.com/images/0d0afe2df6c9ff3499a81bf0dab1d27c/tenor.gif?itemid=15580060']
                 file = rand_punch[Math.floor(Math.random() * rand_punch.length)]
                   if(message.content === PREFIX + "punch"){
                    const punc = new Discord.MessageEmbed()
                    .setColor(0x942727)
                    .setTitle("Wrong syntax")
                    .addField('Correct syntax' ,PREFIX + 'punch @user')
                    .addField('Example' ,PREFIX + 'punch @Lunala')
                    message.channel.send(punc)
     
                 }else if(punch2 !== message.author){
                    const punchh = new Discord.MessageEmbed()  
                     .setTitle(`${punch1.username} punches ${punch2.username} real hard!`  )
                     .setColor(0x942727) 
                     .setImage(file) 
                     .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                     message.channel.send(punchh);                   
                 
                 }else if (punch2 == message.author){
                    const punchhh = new Discord.MessageEmbed()
                      .setTitle(`${bot.user.username} punches ${punch2.username}...rip!`)
                      .setColor(0x942727) 
                      .setImage(file)  
                      .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                      message.channel.send(punchhh);
                 }        
           break; 
              case 'stare':
                 let stare2 = message.mentions.users.first();
                 let stare1 = message.author;
                 const rand_stare = ['https://media1.tenor.com/images/6db16173c29293e2c0f63db13601a85d/tenor.gif?itemid=15313333' , 'https://media1.tenor.com/images/ec2187a26ef99212ede5a4408c7bfc9d/tenor.gif?itemid=14577429' , 'https://media1.tenor.com/images/58adf5859001fe3f1586e87b5d86cebd/tenor.gif?itemid=7025500' , 'https://media1.tenor.com/images/da9ed668e256bc3853be34cf287b93a7/tenor.gif?itemid=15726453' , 'https://media1.tenor.com/images/93b8b8cc7b96978b69d627840b5866e4/tenor.gif?itemid=9885022' , 'https://media1.tenor.com/images/9d1f45f7e2dd8f1bf9fabaa184b3065c/tenor.gif?itemid=5929722' , 'https://media1.tenor.com/images/afd4282d996325f5da7be3c2c963df41/tenor.gif?itemid=4686978']
                 file = rand_stare[Math.floor(Math.random() * rand_stare.length)]
                    if(message.content === PREFIX + "stare"){
                       const stareeeee = new Discord.MessageEmbed()
                       .setColor(0xD2ECB2)
                       .setTitle('Wrong Syntax')
                       .addField('Correct Syntax',PREFIX + 'stare @user')
                       .addField('Example',PREFIX+'stare @Lunala')
                       message.channel.send(stareeeee)
                    
                    }else if(stare2 !== message.author){
                       const staree = new Discord.MessageEmbed()  
                        .setTitle(`${stare1.username} stares at ${stare2.username}`  )
                        .setColor(0xD2ECB2) 
                        .setImage(file) 
                        .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                        message.channel.send(staree);                   
                    
                    }else if (stare2 == message.author){
                       const stareeee = new Discord.MessageEmbed()
                         .setTitle(`${bot.user.username} stares at ${stare2.username}`)
                         .setColor(0xD2ECB2) 
                         .setImage(file)  
                         .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                         message.channel.send(stareeee);
                    }        
              break;
     
              case 'highfive':
                 let highfive2 = message.mentions.users.first();
                 let highfive1 = message.author;
                 const rand_highfive = ['https://media1.tenor.com/images/16267f3a34efb42598bd822effaccd11/tenor.gif?itemid=14137081' , 'https://media1.tenor.com/images/d9789c904472970f6654633ac2b03aa1/tenor.gif?itemid=4746486' , 'https://media1.tenor.com/images/b714d7680f8b49d69b07bc2f1e052e72/tenor.gif?itemid=13400356' , 'https://media1.tenor.com/images/9730876547cb3939388cf79b8a641da9/tenor.gif?itemid=8073516' , 'https://media1.tenor.com/images/c3263b8196afc25ddc1d53a4224347cd/tenor.gif?itemid=9443275' , 'https://media1.tenor.com/images/0c23b320822afd5b1ce3faf01c2b9b69/tenor.gif?itemid=14137078' , 'https://media1.tenor.com/images/0c23b320822afd5b1ce3faf01c2b9b69/tenor.gif?itemid=14137078' , 'https://media1.tenor.com/images/e54ea154faa78f972a815f2d6f158413/tenor.gif?itemid=16227553']
                 file = rand_highfive[Math.floor(Math.random() * rand_highfive.length)]
                    if(message.content === PREFIX + "highfive"){
                       const hf = new Discord.MessageEmbed()
                       .setColor(0xB6CDF3)
                       .setTitle('Wrong Syntax')
                       .addField('Correct Syntax',PREFIX + 'highfive @user')
                       .addField('Example',PREFIX+'highfive @Lunala')
                       message.channel.send(hf)
                    
                    }else if(highfive2 !== message.author){
                       const hf1 = new Discord.MessageEmbed()  
                        .setTitle(`${highfive1.username} Highfives ${highfive2.username}!`  )
                        .setColor(0xB6CDF3) 
                        .setImage(file) 
                        .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                        message.channel.send(hf1);                   
                    
                    }else if (highfive2 == message.author){
                       const hf2 = new Discord.MessageEmbed()
                         .setTitle(`${bot.user.username} highfives ${highfive2.username}!`)
                         .setColor(0xB6CDF3) 
                         .setImage(file)
                         .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)  
                         message.channel.send(hf2);
                    }        
              break;
     
              case 'smile':
                 let smilef = message.mentions.users.first();
                 let smileq = message.author;
                 const rand_smile = ['https://media1.tenor.com/images/ba7c28c45c0123e95fbdf0854cbc7861/tenor.gif?itemid=12869746' , 'https://media1.tenor.com/images/29b71255760361c5f6c40f089847b1ab/tenor.gif?itemid=7338963' , 'https://media1.tenor.com/images/d40f71dfc053af4995d48de258931f44/tenor.gif?itemid=7909470' , 'https://media1.tenor.com/images/8a549e6d7066bbc0aeb63d7c69a42c27/tenor.gif?itemid=4838963' , 'https://media1.tenor.com/images/bb0cbe662c9c7fb3bd59e75a7214475d/tenor.gif?itemid=4838964' , 'https://media1.tenor.com/images/c49dc9422aac61eebbf8ae9d42bb26b7/tenor.gif?itemid=15792815']
                 file = rand_smile[Math.floor(Math.random() * rand_smile.length)]
                    if(message.content === PREFIX + "smile"){
                       const smile = new Discord.MessageEmbed()
                       .setColor(0xDFE741)
                       .setTitle(`${smileq.username} is happy and Smiles!`)
                       .setImage(file)
                       message.channel.send(smile)
                    
                    }else if(smilef !== message.author){
                       const smilee = new Discord.MessageEmbed()  
                        .setTitle(`${smileq.username} smiles at ${smilef.username}!`  )
                        .setColor(0xDFE741) 
                        .setImage(file) 
                        .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                        message.channel.send(smilee);                   
                    
                    }else if (smilef == message.author){
                       const smileee = new Discord.MessageEmbed()
                         .setTitle(`${bot.user.username} smiles at ${smilef.username}!creepy!`)
                         .setColor(0xDFE741) 
                         .setImage(file) 
                         .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`) 
                         message.channel.send(smileee);
                    }        
              break;
     
              case 'handhold':
                 let hh2 = message.mentions.users.first();
                 let hh1 = message.author;
                 const rand_handhold = ['https://media1.tenor.com/images/890c34d3b8a85bf1972c0a73dbd56ea8/tenor.gif?itemid=7384775' , 'https://media1.tenor.com/images/a341e4d663412d93ec242ec5e555b382/tenor.gif?itemid=14833997' , 'https://media1.tenor.com/images/d3c5561f3850d35ec5535dac4de2aa59/tenor.gif?itemid=5372737' , 'https://media1.tenor.com/images/741d9a13871d4b423280e24a56aa760f/tenor.gif?itemid=15128874' , 'https://media1.tenor.com/images/81863150cf5d1689ba75db403236c55b/tenor.gif?itemid=16325513' , 'https://media1.tenor.com/images/9efc80eed18bc75caa776eb9bca8ef88/tenor.gif?itemid=15064969' , 'https://media1.tenor.com/images/9e375f33e538a944072598ecca5c2ec3/tenor.gif?itemid=14709525']
                 file = rand_handhold[Math.floor(Math.random() * rand_handhold.length)]
                 if(message.content === PREFIX + "handhold"){
                    const hhh = new Discord.MessageEmbed()
                    .setColor(0xB77DF1)
                    .setTitle('Wrong Syntax')
                    .addField('Correct Syntax',PREFIX + 'handhold @user')
                    .addField('Example',PREFIX+'handhold @Lunala')
                    message.channel.send(hhh)
                 
                 }else if(hh2 !== message.author){
                    const hh = new Discord.MessageEmbed()  
                     .setTitle(`${hh1.username} holds ${hh2.username}`  )
                     .setColor(0xB77DF1) 
                     .setImage(file) 
                     .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                     message.channel.send(hh);                   
                 
                 }else if (hh2 == message.author){
                    const h = new Discord.MessageEmbed()
                      .setTitle(`${bot.user.username} hold ${hh2.username}`)
                      .setColor(0xB77DF1) 
                      .setImage(file)  
                      .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                      message.channel.send(h);
                 }        
              break;
              
              case 'kill':
                 let kill2 = message.mentions.users.first();
                 let kill1 = message.author;   
                 const rand_kill = ['https://media1.tenor.com/images/a80b2bf31635899ac0900ea6281a41f6/tenor.gif?itemid=5535365' , 'https://media1.tenor.com/images/d87333803d4dd839ac4fd4237e401551/tenor.gif?itemid=7350212' , 'https://media1.tenor.com/images/3c906bf056e743c5a1d175cbf52d38ec/tenor.gif?itemid=13124827' , 'https://media1.tenor.com/images/3e1febe60d2d72b8565190be010fd172/tenor.gif?itemid=12294724' , 'https://media1.tenor.com/images/b1f74ea1c8c07a930c90e0f7f74d2165/tenor.gif?itemid=9955716' , 'https://media1.tenor.com/images/d3f0893d296d19b1fb6201a30619206c/tenor.gif?itemid=7256224' , 'https://media1.tenor.com/images/3c906bf056e743c5a1d175cbf52d38ec/tenor.gif?itemid=13124827' , 'https://media1.tenor.com/images/2586b3fcdcb8c2dc9c160796738484b4/tenor.gif?itemid=11812232' , 'https://media1.tenor.com/images/3918ab9203b15b16cfc872f5540bfedc/tenor.gif?itemid=5958526' , 'https://media1.tenor.com/images/4b9da6364dc6372740eae7b15aed2306/tenor.gif?itemid=12320494']
                 file = rand_kill[Math.floor(Math.random() * rand_kill.length)]
                 if(message.content === PREFIX + "kill"){
                    const kill = new Discord.MessageEmbed()
                    .setColor(0xDADCF1)
                    .setTitle('Wrong Syntax')
                    .addField('Correct Syntax',PREFIX + 'kill @user')
                    .addField('Example',PREFIX+'kill @Lunala')
                    message.channel.send(kill)
                 
                 }else if(kill2 !== message.author){
                    const killl = new Discord.MessageEmbed()  
                     .setTitle(`${kill1.username} kills ${kill2.username}..AMEN.`  )
                     .setColor(0xDADCF1) 
                     .setImage(file) 
                     .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                     message.channel.send(killl);                   
                 
                 }else if (kill2 == message.author){
                    const killll = new Discord.MessageEmbed()
                      .setTitle(`${bot.user.username} kills ${kill2.username}...AMEN.`)
                      .setColor(0xDADCF1) 
                      .setImage(file)  
                      .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                      message.channel.send(killll);
                 }        
              break;
     
              case 'hug':
                 let hug2 = message.mentions.users.first();
                 let hug1 = message.author;   
                 const rand_hug = ['https://media1.tenor.com/images/4e9c3a6736d667bea00300721cff45ec/tenor.gif?itemid=14539121','https://media1.tenor.com/images/1f7b0ceb53e128a6d9f4d39cef074d93/tenor.gif?itemid=11098325' , 'https://media1.tenor.com/images/94989f6312726739893d41231942bb1b/tenor.gif?itemid=14106856' , 'https://media1.tenor.com/images/aeb42019b0409b98aed663f35b613828/tenor.gif?itemid=14108949' , 'https://media1.tenor.com/images/daffa3b7992a08767168614178cce7d6/tenor.gif?itemid=15249774' , 'https://media1.tenor.com/images/4db088cfc73a5ee19968fda53be6b446/tenor.gif?itemid=14637016' , 'https://media1.tenor.com/images/81f693db5e5265c9ae21052d55ab7b3d/tenor.gif?itemid=13576354' , 'https://media1.tenor.com/images/edea458dd2cbc76b17b7973a0c23685c/tenor.gif?itemid=13041472' , 'https://media1.tenor.com/images/79c461726e53ee8f9a5a36521f69d737/tenor.gif?itemid=13221416' , 'https://media1.tenor.com/images/059e93bd8a1ed2eef5d36f93442242d4/tenor.gif?itemid=4968922']
                 file = rand_hug[Math.floor(Math.random() * rand_hug.length)]
                 if(message.content === PREFIX + "hug"){
                    const hugggg = new Discord.MessageEmbed()
                    .setColor(0xEF46AD)
                    .setTitle('Wrong Syntax')
                    .addField('Correct Syntax',PREFIX + 'hug @user')
                    .addField('Example',PREFIX+'hug @Ash')
                    message.channel.send(hugggg)
                 
                 }else if(hug2 !== message.author){
                    const hugg = new Discord.MessageEmbed()  
                     .setTitle(`${hug1.username} gives a big hug to ${hug2.username}`  )
                     .setColor(0xEF46AD) 
                     .setImage(file) 
                     .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                     message.channel.send(hugg);                   
                 
                 }else if (hug2 == message.author){
                    const huggg = new Discord.MessageEmbed()
                      .setTitle(`${bot.user.username} gives ${hug2.username} a big hug`)
                      .setColor(0xEF46AD) 
                      .setImage(file)  
                      .setTimestamp()
                      .setFooter(`${bot.user.username} Bot`)
                      message.channel.send(huggg);
                 }        
              break;
     
              case 'cry':
                 const rand_cry = ['https://media1.tenor.com/images/4f22255d60f3f19edf9296992b4e3483/tenor.gif?itemid=4772697' , 'https://media1.tenor.com/images/7443eb36be27659fc4d3effbaa766db5/tenor.gif?itemid=11358249' , 'https://media1.tenor.com/images/d1529619add194c4275053d852a0bb79/tenor.gif?itemid=14120358' , 'https://media1.tenor.com/images/0436bfc9861b4b57ffffda82d3adad6e/tenor.gif?itemid=15550145' , 'https://media1.tenor.com/images/26e7564bfb4408f9f7ff9518d4f87308/tenor.gif?itemid=8199739' , 'https://media1.tenor.com/images/1a7ca63640bd266a8b88bf14d2babc8d/tenor.gif?itemid=13425110' , 'https://media1.tenor.com/images/1a7ca63640bd266a8b88bf14d2babc8d/tenor.gif?itemid=13425110' , 'https://media1.tenor.com/images/ecf674c5e0ed2fdf0260ade4fad2146f/tenor.gif?itemid=5580602' , 'https://media1.tenor.com/images/23b1cfca45f7551bf08c357e3e15cf78/tenor.gif?itemid=9772379']
                 file = rand_cry[Math.floor(Math.random() * rand_cry.length)]
                 if(message.content === PREFIX + "cry"){
                 const cryy = new Discord.MessageEmbed()
                   .setColor(0x5CBBE5)
                   .setTitle(`Oh No! ${message.author.username} is crying...`)
                   .setImage(file)
                   .setTimestamp()
                  .setFooter(`${bot.user.username} Bot`)
                  message.channel.send(cryy)
                 }
              break;
              case 'kiss':
                 let kiss2 = message.mentions.users.first();
                 let kiss1 = message.author;
                 const rand_kiss = ['https://media1.tenor.com/images/2f23c53755a5c3494a7f54bbcf04d1cc/tenor.gif?itemid=13970544' , 'https://media1.tenor.com/images/558f63303a303abfdddaa71dc7b3d6ae/tenor.gif?itemid=12879850' , 'https://media1.tenor.com/images/3d56f6ef81e5c01241ff17c364b72529/tenor.gif?itemid=13843260' , 'https://media1.tenor.com/images/ea9a07318bd8400fbfbd658e9f5ecd5d/tenor.gif?itemid=12612515' , 'https://media1.tenor.com/images/4b5d5afd747fe053ed79317628aac106/tenor.gif?itemid=5649376' , 'https://media1.tenor.com/images/39bb47e07d20c180b55ec2fc24e315f3/tenor.gif?itemid=9985265' , 'https://media1.tenor.com/images/a02c53fd3985c5a6d94c32c775ae168d/tenor.gif?itemid=6158862' , 'https://media1.tenor.com/images/2d7b586b4cc799abcfb1922f13724d70/tenor.gif?itemid=12894882'] 
                 file = rand_kiss[Math.floor(Math.random() * rand_kiss.length)]
                 if(message.content === PREFIX + "kiss"){
                    const kisssss = new Discord.MessageEmbed()
                    .setColor(0xF55E5E )
                    .setTitle('Wrong Syntax')
                    .addField('Correct Syntax',PREFIX + 'kiss @user')
                    .addField('Example',PREFIX+'kiss @Ash')
                    message.channel.send(kisssss)
                 
                 }else if(kiss2 !== message.author){
                    const kisss = new Discord.MessageEmbed()  
                     .setTitle(`oop! ${kiss1.username} kisses ${kiss2.username}`  )
                     .setColor(0xF55E5E ) 
                     .setImage(file) 
                     .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                     message.channel.send(kisss);                   
                 
                 }else if (kiss2 == message.author){
                    const kissss = new Discord.MessageEmbed()
                      .setTitle(`Dark Solgaleo gives ${kiss2.username} a kiss`)
                      .setColor(0xF55E5E) 
                      .setImage(file)  
                      .setTimestamp()
                     .setFooter(`${bot.user.username} Bot`)
                      message.channel.send(kissss);
                 }        
                 break;

                 case "invite":
                 
                  message.reply("Sorry but i don't accept invites. I serve this server only! :(");
                  break;

case 'tickle':
  const user = message.mentions.users.first();
              if(!user)
                  return message.reply('Mention someone to tickle!');
  
              superagent.get('https://nekos.life/api/v2/img/tickle')
                  .end((err, response) => {
                const lewdembed = new Discord.MessageEmbed()
                .setTitle(user.username + " just got tickled by " + message.author.username)
                .setImage(response.body.url)
                .setColor(`RANDOM`) 
                .setDescription((user.toString() + " got tickled by " + message.author.toString()))
                .setFooter(bot.user.username)
                .setTimestamp()
                .setURL(response.body.url);
            message.channel.send(lewdembed);
                  })
            break;

            case 'spank':
              if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
              const spankuser = message.mentions.users.first();
          if(!spankuser)
              return message.reply('Mention someone to spank! ._.');

          superagent.get('https://nekos.life/api/v2/img/spank')
              .end((err, response) => {
            const lewdembed = new Discord.MessageEmbed()
            .setTitle(spankuser.username + " just got spanked by " + message.author.username)
            .setImage(response.body.url)
            .setColor(`RANDOM`)
            .setDescription((spankuser.toString() + " got SPANKED! by " + message.author.toString()))
            .setFooter(`That must hurt ._.`)
            .setURL(response.body.url);
        message.channel.send(lewdembed);
          })
              break;
case 'anal':
              if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
superagent.get('https://nekos.life/api/v2/img/anal')
    .end((err, response) => {
  const analembed = new Discord.MessageEmbed()
  .setTitle("Hentai")
  .setImage(response.body.url)
  .setColor(`#000000`)
  .setFooter(`Tags: anal`)
  .setURL(response.body.url);
message.channel.send(analembed);
})
break;

case 'boobs':
if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')


  return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function(res)  {
    return rp.get({
        url:'http://media.oboobs.ru/' + res[0].preview,
        encoding: null
    });
}).then(function(res)   {

const boobsembed = new Discord.MessageEmbed()
      .setTitle("Boobs")
      .setColor(`#000000`)
      .setImage("attachment://file.png").attachFiles([{ attachment: res, name: "file.png" }])


    message.channel.send(boobsembed);
});
break;

case 'blowjob':
  if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
superagent.get('https://nekos.life/api/v2/img/blowjob')
    .end((err, response) => {
  const bjembed = new Discord.MessageEmbed()
  .setTitle("blowjob")
  .setImage(response.body.url)
  .setColor(`#000000`)
  .setFooter(`Tags: blowjob`)
  .setURL(response.body.url);
message.channel.send(bjembed);
})
break;
              /*if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')*/
              case 'smug':
                superagent.get('https://nekos.life/api/v2/img/smug')
                    .end((err, response) => {
                  const lewdembed = new Discord.MessageEmbed()
                  .setTitle("( ͡° ͜ʖ ͡°)")
                  .setImage(response.body.url)
                  .setColor(`RANDOM`)
                  .setTimestamp()
                  .setFooter(bot.user.username)
                  .setURL(response.body.url);
              message.channel.send(lewdembed);
                })
                break;

case 'meme':
  const subReddits = ["dankmeme", "meme", "me_irl"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        const Memeimg = await randomPuppy(random);
        const Memeembed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setImage(Memeimg)
            .setTitle(`From /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`)
            .setFooter(bot.user.username)
            .setTimestamp()

        message.channel.send(Memeembed);
  break;

  case 'rps':
    if(message.guild === null)return;
  
  function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
  
var msg1 = Array(3);
		msg1[1] = "Rock :black_circle:";
	    msg1[2] = "Paper :page_facing_up:";
		msg1[3] = "Scissors :scissors:"
        var x = getRandomInt(0, 9);
		if (x < 6){
         if (x < 3){
			message.channel.send(msg1[1]);
		}
		else{
               message.channel.send(msg1[3]);
		}
		}
		else{ 
			message.channel.send(msg1[2]);
}
 break;



                case 'poke':
                  const pokeuser = message.mentions.users.first();
          if(!pokeuser)
              return message.reply('Mention someone to poke!');

          superagent.get('https://nekos.life/api/v2/img/poke')
              .end((err, response) => {
            const lewdembed = new Discord.MessageEmbed()
            .setTitle(pokeuser.username + " just got poked by " + message.author.username)
            .setImage(response.body.url)
            .setColor(`RANDOM`)
            .setDescription((pokeuser.toString() + " got poked by " + message.author.toString()))
            .setFooter(bot.user.username)
            .setTimestamp()
            .setURL(response.body.url);
        message.channel.send(lewdembed);
          })
          break;
               case 'ratewaifu':
                 
                 let m421 = args.join(" ");
                  if (!m421) return message.channel.send('Please define your waifus name.')
                  if (m421.length > 30) return message.channel.send(`I can't rate your waifu! It's over 30 text!`)
                  let result = Math.floor((Math.random() * 100) + 0);
                  
                    const happyrate = new Discord.MessageEmbed()
                  .setDescription(`I would rate **${m421}** ${result}/100 ?`)
                  .setColor(`GREEN`)
                    
                      const sadembed = new Discord.MessageEmbed()
                  .setDescription(`I would rate **${m421}** ${result}/100 ??`)
                  .setColor(`GREEN`)
                      
                        const idkembed = new Discord.MessageEmbed()
                  .setDescription(`I would rate **${m421}** ${result}/100 ??`)
                  .setColor(`GREEN`)
                        
                      const shrugembed = new Discord.MessageEmbed()
                  .setDescription(`I would rate **${m421}** ${result}/100 ??`)
                  .setColor(`GREEN`)
                                
                          const okembed = new Discord.MessageEmbed()
                  .setDescription(`I would rate **${m421}** ${result}/100 ??`)
                  .setColor(`GREEN`)
                                        
                const thumbupembed = new Discord.MessageEmbed()
                  .setDescription(`I would rate **${m421}** ${result}/100 ??`)
                  .setColor(`GREEN`)
                
                const eyesembed = new Discord.MessageEmbed()
                  .setDescription(`I would rate **${m421}** ${result}/100 ??`)
                  .setColor(`GREEN`)
                  
                  if (result > 90) return message.channel.send(happyrate)
                  if (result < 30) return message.channel.send(sadembed)
                  if (result > 40) return message.channel.send(idkembed)
                  if (result > 50) return message.channel.send(shrugembed)
                  if (result > 60) return message.channel.send(okembed)
                  if (result > 70) return message.channel.send(thumbupembed)
                  if (result > 80) return message.channel.send(eyesembed)

                  break;


                  case "8ball":
                    
                    let question = message.content.split(' ').slice(1).join(' ');
            
                    if (!question) {
                        return message.reply(`What question should I answer on?\n\**Usage:** ${PREFIX}8ball is Blue Malgeran is sexy af?\``);
                    }
            
                  message.channel.send({embed: {
                    color: 3447003,
                    author: {
                      name: `8ball`,
                      icon_url: 'http://8ballsportsbar.com/wp-content/uploads/2016/02/2000px-8_ball_icon.svg_.png'
                    },
                    fields: [{
                      name: question,
                        value: `**My answer:** ${fortunes[~~(Math.random() * fortunes.length)]}`
                      }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: bot.user.avatarURL,
                      text: bot.user.username
                    }
                  }
                });
                    break;

         case 'addrole':
          let RoleColor = args[1];
          let addRName = message.content.split(' ').slice(2).join(' ');
          if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES')) {
            return message.channel.send(':lock: **You** need `MANAGE_ROLES` Permissions to execute `addrole`')      
        }
        if(!addRName) return message.channel.send("The Role needs a Name! USAGE:\`addrole #colorhex (optional) <role-name>")
        if (RoleColor){
          
          message.guild.roles.create({name:addRName, color: RoleColor});
          message.channel.send(`Role **${addRName}** created!`)
        }else if(!RoleColor){
          try{
          message.guild.roles.create({name:addRName, color: "#000000"});
          message.channel.send(`Role **${addRName}** created!`)
          }catch  (err){
            if(err) message.channel.send("Incorrect Color Hex Code!")
          }
        }
         break;

         case 'unmute':

          let userunMute = message.mentions.users.first();
          let unMutedmodlog = message.guild.channels.cache.get('734201804262211694');

          if(!unmutedperson) return message.channel.send("User not found!");

          let unmainrole = message.guild.roles.cache.find(role => role.name === "Trainer");
          let unmuterole = message.guild.roles.cache.find(role => role.name === "PokéMuted");

          if (!message.guild.member(message.author).hasPermission('MUTE_MEMBERS')) {
            return message.channel.send(':lock: **You** need `MUTE_MEMBERS` Permissions to execute `mute`')
        }
  
        if (!message.guild.member(bot.user).hasPermission('MUTE_MEMBERS')) {
            return message.channel.send(':lock: **I** need `MUTE_MEMBERS` Permissions to execute `mute`')
        }
  
        if (!unMutedmodlog) {
            return message.channel.send('I need a text channel named `mod-log` to print my mutes logs in, please create one')
        }

        if(!userunMute){
          try {
            // Check if a valid userID has been entered instead of a Discord user mention
            if (!message.guild.members.cache.get(args.slice(1, 2).join(' '))) throw new Error('Couldn\'t get a Discord user with this userID!');
            // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
            userunMute = message.guild.members.cache.get(args.slice(1, 2).join(' '));
            userunMute = userunMute.user;
            } catch (error) {
            return message.reply('Couldn\'t get a Discord user with this userID!');
            }
        }

        
  
        if (message.author === userunMute) {
          return message.channel.send('You cannot unmute yourself :wink:')
      }
  
      if (userunMute.roles.cache.find(r => r.name === "Trainer")){
               return message.channel.send("User is already Unmuted.")
      }
      if (userUnmute.roles.cache.find(r => r.name === "PokéMuted")){
        
        userunMute.roles.add(unmainrole.id);
        userunMute.roles.remove(unmuterole.id);
        message.channel.send(`User has been unmuted!`)

     unMutedmodlog.send({embed: {
            color: 3447003,
            author: {
              name: bot.user.username,
              icon_url: bot.user.avatarURL
            },
            fields: [{
                name: "Unmute:",
                value: `**Unmuted:** ${userunMute.username}#${userunMute.discriminator}\n**Moderator:** ${message.author.username}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
      }
         break;

         case "mute":

          let userMute = message.mentions.users.first();
           let muteReason = message.content.split(' ').slice(3).join(' ');
          let Mutedmodlog = message.guild.channels.cache.get('734201804262211694');
         let mutedperson = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]))
         if(!mutedperson) return message.channel.send("User not found!");

         let mainrole = message.guild.roles.cache.find(role => role.name === "Trainer");
         let muterole = message.guild.roles.cache.find(role => role.name === "PokéMuted");
         let mttime = args[2];

         if (!message.guild.member(message.author).hasPermission('MUTE_MEMBERS')) {
          return message.channel.send(':lock: **You** need `MUTE_MEMBERS` Permissions to execute `mute`')
      }

      if (!message.guild.member(bot.user).hasPermission('MUTE_MEMBERS')) {
          return message.channel.send(':lock: **I** need `MUTE_MEMBERS` Permissions to execute `mute`')
      }
     
    

      if (!Mutedmodlog) {
          return message.channel.send('I need a text channel named `mod-log` to print my mutes logs in, please create one')
      }

      if(!mutedperson){
        try {
          // Check if a valid userID has been entered instead of a Discord user mention
          if (!message.guild.members.cache.get(args.slice(1, 2).join(' '))) throw new Error('Couldn\'t get a Discord user with this userID!');
          // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
         mutedperson = message.guild.members.cache.get(args.slice(1, 2).join(' '));
          mutedperson = mutedperson.user;
          } catch (error) {
          return message.reply('Couldn\'t get a Discord user with this userID!');
          }
      }

      if (message.author === userMute) {
        return message.channel.send('You can just not send messages instead of mutting yourself :wink:')
    }

    if (mutedperson.roles.cache.find(r => r.name === "PokéMuted")){
             return message.channel.send("User is already Muted.")
    }
         if(!muterole){
           message.guild.roles.create({name:"PokéMuted", color: "#FFOOOO", permissions:["VIEW_CHANNEL"]});

          

           if(!mttime){
             return message.channel.send("You need to set a time limit for the Mute")
           }

           if(!muteReason) {
             return message.channel.send("You need to provide a reason for the mute")
           }

           mutedperson.roles.remove(mainrole.id);
           mutedperson.roles.add(muterole.id);
          let muteEmbed = new Discord.MessageEmbed()
          .setDescription(`User has been muted for \`${ms(ms(mttime))}\` REASON: \`${muteReason}\`!`)
          .setColor(0x4177CB)
          .setFooter()
          .setTimestamp()
          message.channel.send(muteEmbed)
           setTimeout(() => {
            userMute.roles.add(mainrole.id);
            userMute.roles.remove(muterole.id);
           userMute.send(`You have been unmuted in **${message.guild.name}**`)
           }, ms(mttime));
           Mutemodlog.send({embed: {
            color: 3447003,
            author: {
              name: bot.user.username,
              icon_url: bot.user.avatarURL
            },
            fields: [{
                name: "Mute:",
                value: `**Muted:** ${userMute.username}#${userMute.discriminator}\n**Moderator:** ${message.author.username} \n**Duration:** ${ms(ms(mttime), {long: true})} \n**Reason:** ${muteReason}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
         }else if (muterole){
          if(!mttime){
            return message.channel.send("You need to set a time limit for the Mute")
          }

          if(!muteReason) {
            return message.channel.send("You need to provide a reason for the mute")
          }

          mutedperson.roles.remove(mainrole.id);
          mutedperson.roles.add(muterole.id);

          message.channel.send(`\`${userMute.username}\` has been muted for \`${ms(ms(mttime))}\` REASON: \`${muteReason}\`!`)
          setTimeout(() => {
            mutedperson.roles.add(mainrole.id);
            mutedperson.roles.remove(muterole.id);
           mutedperson.send(`You have been unmuted in **${message.guild.name}**`)
          }, ms(mttime));
          Mutedmodlog.send({embed: {
            color: 3447003,
            author: {
              name: bot.user.username,
              icon_url: bot.user.avatarURL
            },
            fields: [{
                name: "Mute:",
                value: `**Muted:** ${userMute.username}#${userMute.discriminator}\n**Moderator:** ${message.author.username} \n**Duration:** ${ms(ms(mttime), {long: true})} \n**Reason:** ${muteReason}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
         }
        
        break;
         
         case 'unban':
           

            let guildUnban = message.guild;
            let modlogUnban = message.guild.channels.cache.get('734201804262211694');
            let userMentionID = args[1];
            let usermentionUnban = message.mentions.members.first();
            let member = await bot.users.fetch(userMentionID);
            let ban = await message.guild.fetchBans();
            
            if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
               return message.channel.send(':lock: **You** need `BAN_MEMBERS` Permissions to execute `unban`')
           }
   
           if (!message.guild.member(bot.user).hasPermission('BAN_MEMBERS')) {
               return message.channel.send(':lock: **I** need `BAN_MEMBERS` Permissions to execute `unban`')
           }
   
           if (!modlogUnban) {
               return message.channel.send('I need a text channel named `mod-log` to print my unban logs in, please create one')
           }
   
           if (!userMentionID)  {
               return message.channel.send('You need to give id of the person to unban!')
           }
   
           if (message.author.id === userMentionID) {
               return message.channel.send('You cant use this command if you are not already unbanned :wink:')
           }

           if (!ban.get(userMentionID)) {
               return message.channel.send(`${userUnban.tag} is not banned.`);
            break;
           }
            else {
            
            message.guild.members.unban(userMentionID)
            let UnbanEmbed = new Discord.MessageEmbed()
            .setDescription(`${userUnban.tag} has been Unbanned`)
            .setFooter(bot.user.username)
            .setTimestamp()
            message.channel.send(UnbanEmbed)
           }
          
          modlogUnban.send({embed: {
            color: 3447003,
            author: {
              name: bot.user.username,
              icon_url: bot.user.avatarURL
            },
            fields: [{
                name: "Unban:",
                value: `**User ID:** ${userMentionID}\n**Moderator:** ${message.author.username}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
break;
         case "ban":
        console.log(`${message.author.tag} used the ${PREFIX}ban command!`);
           

        const mmss = require('ms');
        let reason = message.content.split(' ').slice(3).join(' ');
        let time = message.content.split(' ')[2];
        let guild = message.guild;
        let modlog = message.guild.channels.cache.get('734201804262211694');
        let usermention = message.mentions.users.first();
        let testt = isNaN(usermention)
        message.channel.send(testt)

        if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
            return message.channel.send(':lock: **You** need `BAN_MEMBERS` Permissions to execute `ban`')
        }

        if (!message.guild.member(bot.user).hasPermission('BAN_MEMBERS')) {
            return message.channel.send(':lock: **I** need `BAN_MEMBERS` Permissions to execute `ban`')
        }

        if (!modlog) {
            return message.channel.send('I need a text channel named `mod-log` to print my ban/kick logs in, please create one')
        }

        if(!usermention){
          try {
            // Check if a valid userID has been entered instead of a Discord user mention
            if (!message.guild.members.cache.get(args.slice(1, 2).join(' '))) throw new Error('Couldn\' get a Discord user with this userID!');
            // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
            usermention = message.guild.members.cache.get(args.slice(1, 2).join(' '));
            usermention = usermention.user;
            } catch (error) {
            return message.reply('Couldn\' get a Discord user with this userID!');
            }
        }

        if (message.author === usermention ) {
            return message.channel.send('You cant punish yourself :wink:')
        }

        if (!time) {
            return message.channel.send(`How much time ? **Usage:**\`~ban [@mention] [1d] [example]\``)
        }

        if (!time.match(/[1-7][s,m,h,d,w]/g)) {
            return message.channel.send('I need a valid time ! look at the Usage! right here: **Usage:**`~ban [@mention] [1m] [example]`')
        }

        if (!reason) {
            return message.channel.send(`You must give me a reason for the ban **Usage:**\`${PREFIX}ban [@mention] [1d] [example]\``)
        }

        if (!message.guild.member(usermention).bannable) {
            return message.channel.send('This member is above me in the `role chain` Can\'t ban them')
        }

        message.channel.send(`${usermention.tag} has been banned from the server.`);

        usermention.send(`You've just got banned from ${guild.name}  \n Reason: **${reason}** \n **Disclamer**: If the ban is not timed and Permanent you may not appeal the **BAN**!`)
        await message.guild.members.ban(usermention)
        setTimeout(() => {
          message.guild.members.unban(usermention)
        }, mmss(time));
        modlog.send({embed: {
            color: 3447003,
            author: {
              name: bot.user.username,
              icon_url: bot.user.avatarURL
            },
            fields: [{
                name: "Ban:",
                value: `**Banned:** ${usermention.username}#${usermention.discriminator}\n**Moderator:** ${message.author.username} \n**Duration:** ${mmss(mmss(time), {long: true})} \n**Reason:** ${reason}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
        break;

        case 'kick':
         console.log(`${message.author.tag} used the ${PREFIX}kick command!`);
           
         let reasonKick = message.content.split(' ').slice(2).join(' ');
         let guildKick = message.guild;
         let modlogKick = message.guild.channels.cache.get('734201804262211694');
         let usermentionKick = message.mentions.users.first();
 
         if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) {
             return message.channel.send(':lock: **You** need `KICK_MEMBERS` Permissions to execute `kick`')
         }
 
         if (!message.guild.member(bot.user).hasPermission('KICK_MEMBERS')) {
             return message.channel.send(':lock: **I** need `KICK_MEMBERS` Permissions to execute `kick`')
         }
 
         if (!modlogKick) {
             return message.channel.send('I need a text channel named `mod-log` to print my kick logs in, please create one')
         }
 
         if (!usermentionKick) {
          try {
            // Check if a valid userID has been entered instead of a Discord user mention
            if (!message.guild.members.cache.get(args.slice(1, 2).join(' '))) throw new Error('Couldn\'t get a Discord user with this userID!');
            // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
            usermentionKick = message.guild.members.cache.get(args.slice(1, 2).join(' '));
            usermentionKick = usermentionKick.user;
            } catch (error) {
            return message.reply('Couldn\'t get a Discord user with this userID!');
            }
        }

         
 
         if (message.author === usermentionKick) {
             return message.channel.send('You cant punish yourself :wink:')
         }
 
         if (!reasonKick) {
             return message.channel.send(`You must give me a reason for the kick **Usage:**\`${PREFIX}kick [@mention] [Reason]\``)
         }
 
         if (!message.guild.member(usermentionKick).kickable) {
             return message.channel.send('This member is above me in the `role chain` Can\'t kick them')
         }

         if(!message.channel.guild.id === usermentionKick.id){
            return message.channel.send("I can't kick someone who is not in the server, I ain't a God?")
         }
        let KickEmbed = new Discord.MessageEmbed()
           .setDescription(`**${usermentionKick}** has been kicked from the server!`)
           .setFooter(bot.user.username)
           .setTimestamp()         
           message.channel.send(KickEmbed);
 
         userKick.send(`You've just got Kicked from ${guildKick.name}  \n Reason: **${reasonKick}**`)
         usermentionKick.kick();
   
         modlogKick.send({embed: {
             color: 3447003,
             author: {
               name: bot.user.username,
               icon_url: bot.user.avatarURL
             },
             fields: [{
                 name: "Kick:",
                 value: `**Kicked:** ${usermentionKick.username}#${usermentionKick.discriminator}\n**User ID:** ${usermentionKick.id}\n**Moderator:** ${message.author.username}\n**Reason:** ${reasonKick}`
               }
             ],
             timestamp: new Date(),
             footer: {
               icon_url: bot.user.avatarURL,
               text: bot.user.username
             }
           }
         });
        break;

        case 'calculate':
        case "calc":
                let math = require('math-expression-evaluator');
                let calcArgs = message.content.split(' ').slice(1).join(' ');

                if (!calcArgs[0]) {
                    message.channel.send({embed: {
                        color: 3447003,
                        footer: {
                          icon_url: bot.user.avatarURL,
                          text: "Please input an expression."
                        }
                      }
                    });
                }
                let calcResult;
                try {
                    calcResult = math.eval(calcArgs);
                } catch (e) { 
                    calcResult = 'Error: "Invalid Input"';
                }

                message.channel.send({embed: {
                    color: 3447003,
                    author: {
                      name: 'PokeSupport\'s calculator',
                      icon_url: bot.user.avatarURL
                    },
                    fields: [
                        { name: "Input", value: `\`\`\`js\n${calcArgs}\`\`\`` },
                      { name: "Output", value: `\`\`\`js\n${calcResult}\`\`\`` }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: bot.user.avatarURL,
                      text: bot.user.username
                    }
                  }
                });
            break;

            case "advice":
      
              const advicesf = require('snekfetch');
      
                  let r = await advicesf.get('http://api.adviceslip.com/advice');
      
                  let advice = JSON.parse(r.body).slip.advice;
      
                  message.channel.send({embed: {
                      color: 3447003,
                      author: {
                        name: bot.user.username,
                        icon_url: bot.user.avatarURL
                      },
                      fields: [{
                          name: "Advice:",
                          value: `\`${advice}\``
                        }
                      ],
                      timestamp: new Date(),
                      footer: {
                        icon_url: bot.user.avatarURL,
                        text: bot.user.username
                      }
                    }
                  });
              break;

              case "anime":
               
                
                const animesf = require('snekfetch');
        
                    let res = await animesf.get('http://api.cutegirls.moe/json');
                    if (res.body.status !== 200) {
                        return message.channel.send('An error occurred while processing this command.');
                    }
                    let animepicembed = new Discord.MessageEmbed()
                    .setColor('#f266f9')
                    .setTitle('Anime Picture')
                    .setImage(res.body.data.image);
            
                    message.channel.send(animepicembed);
                break;

                case "dick":
       

        let dicksize = ["8=D", "8==D", "8===D", "8====D", "8=====D", "8======D", "8=======D", "8========D", "8=========D", "8==========D", "404 not found"];
        let dickuser = message.mentions.users.first();

        if (!dickuser) {
            return message.channel.send('You must mention someone!\n(This is 100% accurate!)');
        }
        if (dickuser.id == "424568410765262848") {
            return message.channel.send(`**${dickuser} Size: ** 8=============================D\nSized by **${message.author.tag}**`);
        }

         message.channel.send(`**${dickuser} Size: ** ${dicksize[~~Math.floor(Math.random() * dicksize.length)]}\nSized by **${message.author.tag}**`);
        break;

        case "roll":
         
          let rollnumber = message.content.split(' ').slice(1).join(' ');
  
          if (!rollnumber) {
              return message.reply(`:game_die: Just rolled a number: **${Math.floor(Math.random() * 100) + 1}**`);
          }
  
          message.reply(`:game_die: Just rolled a number: **${Math.floor(Math.random() * rollnumber) + 1}**`);
          break;
  
          case 'urban':
            const bargs =  message.content.split(' ');
            const searchString = bargs.slice(1).join(' ')
            if(!searchString)return message.channel.send(`You have to type in word`)
            
            
            
          urban(searchString).then(urbans=>{
            
            message.channel.send({embed: {
                    
                description: `__**${urbans.word}**__\n\n**Definition**\n${urbans.definition}\n\n**Example**\n${urbans.example}\n\n**Tags:** ${urbans.tags}\n\n👍 **${urbans.thumbsUp}** *Thumbs Up* **|** 👎 **${urbans.thumbsDown}** *Thumbs Down*`,
                author: {
                    name: message.author.username,
                    icon_url: message.author.avatarURL,
                },
                color: 0xff0000,
            
          
                timestamp: new Date(),
            
            }
          })
          })
            
          break;

          case 'animesearch':
            const search = `${args}`;
            if(!search)
            return message.reply('Please add a search query if invalid command will not work.');
            
            malScraper.getInfoFromName(search)
              .then((data) => {
              const malEmbed = new Discord.MessageEmbed()
                .setAuthor(`My Anime List search result for ${args}`.split(',').join(' '))
                .setThumbnail(data.picture)
                .setColor('#ffc1cc') //I personally use bubblegum pink!
                .addField('English Title', data.englishTitle, true)
                .addField('Japanese Title', data.japaneseTitle, true)
                .addField('Type', data.type, true)
                .addField('Episodes', data.episodes, true)
                .addField('Rating', data.rating, true)
                .addField('Aired', data.aired, true)
                .addField('Score', data.score, true)
                .addField('Score Stats', data.scoreStats, true)
                .addField('Link', data.url);
            
                message.channel.send(malEmbed);
            
              })
          break;

          case 'ping':
            const m = await message.channel.send("If you can see this the bot is slow or the discord api is slow");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
              
          break;

case 'uptime':
  if(!message.member.hasPermission('ADMINISTRATION')) return message.channel.send("You need ADMIN perms to use this command!")
  const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    message.channel.send(duration)
    break;


    case 'neko':
      if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
      superagent.get('https://nekos.life/api/v2/img/lewd')
          .end((err, response) => {
        const Nekoembed = new Discord.MessageEmbed()
        .setTitle("Neko")
        .setImage(response.body.url)
        .setColor(`#000000`)
        .setFooter(`Tags: neko`)
        .setURL(response.body.url);
      message.channel.send(Nekoembed);
      })  
    break;

case 'hentai':
  if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
  superagent.get('https://nekos.life/api/v2/img/hentai')
      .end((err, response) => {
    const hentaiembed = new Discord.MessageEmbed()
    .setTitle("Hentai")
    .setImage(response.body.url)
    .setColor(`#000000`)
    .setFooter(`Tags: hentai`)
    .setURL(response.body.url);
  message.channel.send(hentaiembed);
  })  
break;


case 'feet':
  if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
  superagent.get('https://nekos.life/api/v2/img/feet')
      .end((err, response) => {
    const feetembed = new Discord.MessageEmbed()
    .setTitle("futanari")
    .setImage(response.body.url)
    .setColor(`#000000`)
    .setFooter(`Tags: feet`)
    .setURL(response.body.url);
  message.channel.send(feetembed);
  })
break;

    case 'pussy':
      if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
      superagent.get('https://nekos.life/api/v2/img/pussy')
          .end((err, response) => {
        const pussyembed = new Discord.MessageEmbed()
        .setTitle("Pussy")
        .setImage(response.body.url)
        .setColor(`#000000`)
        .setFooter(`Tags: Pussy`)
        .setURL(response.body.url);
      message.channel.send(pussyembed);
      })  
    break;
          case "issue":
            let issue = new Discord.MessageEmbed()
             .setTitle("ISSUE")
             .setDescription('If the bot got some bugs you can report them to <@424568410765262848> in DM!')
             .setColor(0x615CA4)
             .setFooter(bot.user.username)
             .setTimestamp()
            message.channel.send(issue);
            break;

            case "botnick":
             
      
              const botnickname = message.content.split(' ').slice(1).join(' ');
      
              if ((message.author.id == '424568410765262848') || (message.member.hasPermission("ADMINISTRATOR", explicit = true))){
                  message.guild.members.cache.get(bot.user.id).setNickname(botnickname);
                  message.channel.send('Done. :ok_hand:');
              } else {
                  message.react('❌');
                  message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
              }
              break;

              case "botname":

        const botusername = message.content.split(' ').slice(1).join(' ');

        if (message.author.id == settings.ownerID) {
            bot.user.setUsername(botusername);
            message.reply('Done. :ok_hand:');
        } else {
            message.react('❌');
            message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
        }
        break;

        case "softban":
  
          let reasonSoftban = message.content.split(' ').slice(2).join(' ');
          let timeSoftban = message.content.split(' ')[2];
          let guildSoftban = message.guild;
          let modlogSoftban= message.guild.channels.cache.get('734201804262211694');
          let userSoftban = message.mentions.users.first();
          let userSoft = message.mentions.members.first();
          if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
              return message.reply(':lock: You need to have `BAN_MEMBERS` Permission to execute `SoftBan`');
          }
          if (!message.guild.member(bot.user).hasPermission('BAN_MEMBERS')) {
              return message.reply(':lock: I need to have `BAN_MEMBERS` Permission to execute `SoftBan`');
          }
          if (!modlogSoftban) {
              return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
          }
          if (message.author.id === userSoftban.id) {
              return message.reply('You cant punish yourself :wink:');
          }
          if (message.mentions.users.size < 1) {
              return message.reply('You need to mention someone to SoftBan him!');
          }
          if (!reasonSoftban) {
              return message.reply(`You must give me a reason for the ban **Usage:**\`${PREFIX}softban [@mention] [example]\``);
          }
          userSoftban.send(`You've just got softbanned from ${guildSoftban.name}  \n State reason: **${reasonSoftban}** \n **Disclamer**: In a softban you can come back straight away, we just got your messages deleted`);
          userSoft.ban();
          setTimeout(() => {
            message.guild.members.unban(userSoft.id)
          }, 0);
  
          modlogSoftban.send({embed: {
              color: 0x18FE26,
              author: {
                name: bot.user.username,
                icon_url: bot.user.avatarURL
              },
              fields: [{
                  name: "Softban:",
                  value: `**Softbanned:** ${userSoftban.username}#${userSoftban.discriminator}\n**Moderator:** ${message.author.username}\n**Reason:** ${reasonSoftban}`
                }
              ],
              timestamp: new Date(),
              footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.username
              }
            }
          });
          break;

          case "notice":
           
            var hugs = [
                "`＼(^o^)／`",
                "`d=(´▽｀)=b`",
                "`⊂((・▽・))⊃`",
                "`⊂( ◜◒◝ )⊃`",
                "`⊂（♡⌂♡）⊃`",
                "`⊂(◉‿◉)つ`"
            ];
            message.reply(`${hugs[~~(Math.random() * hugs.length)]}`);
            break;

            case "coinflip":
              case 'cf':
                case 'toss':
                  case 'cointoss':
              
      
              let answers = [
                  'heads',
                  'tails'
              ];
      
              message.channel.send({embed: {
                  color: 3447003,
                  title: "Coinflip:",
                  fields: [{
                      name: "Result",
                      value: `\`${answers[~~(Math.random() * answers.length)]}\``
                    }
                  ],
                  timestamp: new Date(),
                  footer: {
                    icon_url: bot.user.avatarURL,
                    text: bot.user.username
                  }
                }
              });
              break;
      

            case "quote":
      
              const fetchquote = require('snekfetch');
              fetchquote.get('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en').then(quote => {
                  if (quote.body.quoteText === undefined) {
                      return message.reply('Something is messing up the API try again please!');
                  }
      
                  message.channel.send({embed: {
                      color: 3447003,
                      author: {
                        name: 'A smart guy said once:',
                        icon_url: 'http://pngimages.net/sites/default/files/right-double-quotation-mark-png-image-80280.png'
                      },
                      fields: [{
                          name: "Quote with source",
                          value: `"${quote.body.quoteText}"\n**Author:** ${quote.body.quoteAuthor}\n**Source:** ${quote.body.quoteLink}`
                        }
                      ],
                      timestamp: new Date(),
                      footer: {
                        icon_url: bot.user.avatarURL,
                        text: bot.user.username
                      }
                  }
              })
              });
              break;

              case '3d':
                if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
                if (message.content.toUpperCase().includes('LOLI') || message.content.toUpperCase().includes('GORE')) return message.channel.send('That kind of stuff is not allowed! Not even in NSFW channels!');

  var query = message.content.split(/\s+/g).slice(1).join(" ");
  booru.search('rb', [query], {nsfw: true, limit: 1, random: true })
      .then(booru.commonfy)
      .then(images => {
          for (let image of images) {
              const embed = new Discord.MessageEmbed()
              .setTitle("3D:")
              .setImage(image.common.file_url)
              .setColor('#000000')
              .setFooter(`Tags: 3D ${query}`)
              .setURL(image.common.file_url);
          return message.channel.send({ embed });
          }

      }).catch(err => {
          if (err.name === 'booruError') {
              return message.channel.send(`No results found for **${query}**!`);
          } else {
              return message.channel.send(`No results found for **${query}**!`);
          }
})  
              break;
              case 'baka':
                superagent.get('https://nekos.life/api/v2/img/baka')
                .end((err, response) => {
              const lewdembed = new Discord.MessageEmbed()
              .setTitle("BAKA!!!")
              .setImage(response.body.url)
              .setColor(`RANDOM`)
              .setFooter(`idiot!`)
              .setURL(response.body.url);
          message.channel.send(lewdembed);
            })  
              break;

        case "todo":

        if (message.author.id == '424568410765262848') {
            return message.channel.send(`**Unban command.**\n
**Bot's owner commands.**\n
**Some fun commands.**\n
~~Mute command~~\n
~~Unmute command~~\n
~~Server info~~\n
~~Softban command\n~~
**~~watch porn man~~**`);
        } else {
            message.react('❌');
            message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
        }
        break;

            case "eval":
              if (!message.author.id == '424568410765262848') return message.channel.send("You can't use this command!")
        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          }

            const evalargs = message.content.split(" ").slice(1);

              if  (message.author.id == '424568410765262848') {
              try {
                const code = evalargs.join(" ");
                let evaled = eval(code);

                if (typeof evaled !== "string")
                  evaled = require("util").inspect(evaled);

                message.channel.send(clean(evaled), {code:"xl"});
              } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
              }
            } else {
                message.react('❌');
                message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
            };
        break;

                case "dog":
                  
          
                  
          
                  let {body} = await superagent
                  .get(`https://random.dog/woof.json`);
          
                  let dogpicembed = new Discord.MessageEmbed()
                  .setColor('#ff9900')
                  .setTitle('Dog Picture')
                  .setImage(body.url);
          
                  message.channel.send(dogpicembed);
                  break;

                case "say":
       
        const botsay = message.content.split(' ').slice(1).join(' ');

        if (!botsay) return message.channel.send('Please tell me what to say!');

            message.delete();
            message.channel.send(botsay);
        break;

        case "serverinfo":

        let guildmessageServerInfo = message.guild;
        let nameServerInfo = message.guild.name;
        let createdAtServerInfo = moment(message.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');
        let channelsServerInfo = message.guild.channels.size;
        let ownerServerInfo = message.guild.owner.user.tag;
        let memberCountServerInfo = message.guild.memberCount;
        let largeServerInfo = message.guild.large;
        let iconUrlServerInfo = message.guild.iconURL;
        let regionServerInfo = message.guild.region;
        let afkServerInfo = message.guild.channels.cache.get(message.guild.afkChannelID) === undefined ? 'None' : message.guild.channels.cache.get(guildmessageServerInfo.afkChannelID).name;

            message.channel.send({embed: {
                color: 3447003,
                author: {
                  name: message.guild.name,
                  icon_url: message.guild.iconURL
                },
                thumbnail:`${iconUrlServerInfo}`,
                title: message.guild.iconURL,
                fields: [{
                    name: "Channels",
                    value: `**Channel Count:** ${channelsServerInfo}\n**AFK Channel:** ${afkServerInfo}`
                  },
                  {
                    name: "Members",
                    value: `**Member Count:** ${memberCountServerInfo}\n**Owner:** ${ownerServerInfo}\n**Owner ID:** ${message.guild.owner.id}`
                  },
                  {
                    name: "More",
                    value: `**Created at:** ${createdAtServerInfo}\n**Large Guild?:** ${largeServerInfo ? 'Yes' : 'No'}\n**Region:** ${regionServerInfo}`
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: bot.user.avatarURL,
                  text: bot.user.usernmame
                }
              }
            });
        break;

           case 'avatar':
              case 'av':
              if(!message.mentions.users.first()){
               const avSelf = new Discord.MessageEmbed()
               .setAuthor(message.author.username)
               .setColor(0xFEFB2D)
               .setFooter('PokeSupport Bot')
               .setTimestamp()
               .setImage(message.author.avatarURL({size: 2048, format: "png", dynamic: true}))
               message.channel.send(avSelf) 

              }else if (message.mentions.users.first()){
                 let avMention = message.mentions.users.first();
               const avOther = new Discord.MessageEmbed()
               .setAuthor(avMention.username)
               .setColor(0xFEFB2D)
               .setFooter('PokeSupport Bot')
               .setTimestamp()
               .setImage(avMention.avatarURL({size: 2048, format: "png", dynamic: true}))
               message.channel.send(avOther) 
              
              }
              break;

           case 'server-suggest':
            case 'ssuggest':
                const ssuggest = new Discord.MessageEmbed()
                  .setColor(0xD8F544)
                  .setTitle('**Server Suggestion**')
                  .setDescription(`${PREFIX}ssuggest <suggestion>`)
                  .setTimestamp()
                  .setFooter("PokeSupport Bot")
                if(!args[1]){
                   message.channel.send(suggest)
                   break;
                }
                let msgArgs1 = args.slice(1).join(" "); 
                  const suggestt = new Discord.MessageEmbed()
                     .setTitle('<:pokeball:737700976827301999> Server Suggestion <:pokeball:737700976827301999>')
                     .setDescription(`👉 ${msgArgs1} 👈`)
                     .setTimestamp()
                     .setFooter(`Suggested By: ${message.author.tag}`)
                     .setColor(0xD8F544);
                      bot.channels.cache.get('734459929041174548').send(suggestt).then(messageReaction =>{
                      messageReaction.react('👍');
                      messageReaction.react('👎');
                      message.channel.send("Suggestion sent to <#734459929041174548>")
                   })   
                   if(err) 
                   {
                      message.channel.send(err)
                   } 
                break;
            case 'bot-suggest':
            case 'bsuggest':
                    const bsuggest = new Discord.MessageEmbed()
                      .setColor(0xD8F544)
                      .setTitle('**Bot Suggestion**')
                      .setDescription(`${PREFIX}bsuggest <suggestion>`)
                      .setTimestamp()
                      .setFooter("PokeSupport Bot")
                    if(!args[1]){
                       message.channel.send(bsuggest)
                       break;
                    }
                    let msgArgs2 = args.slice(1).join(" "); 
                      const suggest = new Discord.MessageEmbed()
                         .setTitle('<:pokeball:737700976827301999> Bot Suggestion <:pokeball:737700976827301999>')
                         .setDescription(`👉 ${msgArgs2} `)
                         .setTimestamp()
                         .setFooter(`Suggested By: ${message.author.tag}`)
                         .setColor(0xD8F544);
                          bot.channels.cache.get('718721151563726939').send(suggest).then(messageReaction =>{
                          messageReaction.react('👍');
                          messageReaction.react('👎');
                          message.channel.send("Suggestion sent to <#718721151563726939>")
                       })    
                    break;   
                    case 'dm':
                        let mention1 = message.mentions.users.first();
                        if((message.member.roles.cache.find(r => r.id === 720938217637019659)) || (message.author.id == '424568410765262848')) {
                        if (!mention1){
                          message.channel.send("Mention an user to DM.")
                         break;
                        }
                        if(!args[2]){
                        message.channel.send("Type a message to send.")
                        break;
                          }
                        let msgArgs3 = args.slice(2).join(" "); 
                        mention1.send(msgArgs3) 
                        message.channel.send("Message sent to user!✅")
                        }
                        else return message.channel.send("You are not allowed to use this command.")
                        break;    
                        
                        case 'poll':
                          if(message.member.hasPermission("ADMINISTRATOR", explicit = true)){
                            const pol = new Discord.MessageEmbed()
                              .setColor(0xFFC300)
                              .setTitle("Poll Creation")
                              .setDescription(`${PREFIX}poll <poll topic>`)
                              .setTimestamp()
                              .setFooter("PokeSupport Bot")
                            if(!args[1]){
                               message.channel.send(pol)
                              
                            }  else if(args[1]){
                                message.delete();
                            let msgArgs = args.slice(1).join(" ");
                              const poll = new Discord.MessageEmbed()
                                 .setTitle('📊Server Poll')
                                 .setDescription(`📌**${msgArgs}**`)
                                 .setFooter(`Poll By: ${message.author.tag}`)
                                 .setTimestamp()
                                 .setColor(0xFFC300);
                            message.channel.send(poll).then(messageReaction =>{
                               messageReaction.react('👍');
                               messageReaction.react('👎');
                            })
                            }  
                          }else return message.channel.send("You need ADMIN perms to use this command!") 
                         break;  
            case 'announce':
               if(message.member.hasPermission("ADMINISTRATOR", explicit = true)){
                const announceH = new Discord.MessageEmbed()
                .setColor(0xFF0087)
                .setTitle('**Server Announcement**')
                .setDescription(`${PREFIX}announce <announcement>`)
                .setTimestamp()
                .setFooter("PokeSupport Bot")
              if(!args[1]){
                 message.channel.send(announceH)
              }else if(args[1]){
                  message.delete();
              let msgARGS = args.slice(1).join(" "); 
                    bot.channels.cache.get('734182171585151078').send(msgARGS)
                    message.channel.send("Announcement sent to <#734182171585151078>")
              }
            }
            else message.channel.send("Missing Admin perm!")
              break;     


              
              case 'shutdown': 
                if (!message.author.id == '424568410765262848')
                  return;
          
                message.channel.send('Shutting down...').then(m => {
                  bot.destroy();
                });
                break; 
            case 'info':
                let infoMention = message.mentions.users.first()
                if(!infoMention){
                    let self = message.guild.member(message.author)
                    const SelfInfo = new Discord.MessageEmbed()
                       .setTitle('👤 User Info')
                       .setThumbnail(message.author.displayAvatarURL())
                       .addField('Username:' , `\`${message.author.tag}\``, true)
                       .addField('User ID:' , `\`${message.author.id}\``,true)
                       .addField('Status:' , `${message.author.presence.status}`)
                       .addField('Joined at:', `\`${self.joinedAt}\``, true)
                       .addField('Created at:' , `\`${message.author.createdAt}\``, true)
                       .setFooter('PokeSupport Bot')
                       .setTimestamp()
                       message.channel.send(SelfInfo)

                }else if(infoMention){
                    let Tagh = message.guild.member(message.author)
                    const TagInfo = new Discord.MessageEmbed()
                       .setTitle('👤 User Info')
                       .setThumbnail(infoMention.displayAvatarURL())
                       .addField('Username:' , `\`${infoMention.tag}\``,true)
                       .addField('User ID:' , `\`${infoMention.id}\``,true)
                       .addField('Status:' , `${infoMention.presence.status}`)
                       .addField('Joined at:', `\`${Tagh.joinedAt}\``, true)
                       .addField('Created at:' , `\`${infoMention.createdAt}\``, true)
                       .setFooter('PokeSupport Bot')
                       .setTimestamp()
                       message.channel.send(TagInfo)
                }
                break;

                case 'giveaway-reroll':
                   case 'gr':
 
                     if(!message.member.hasPermission('MANAGE_MESSAGES') || !message.member.roles.cache.some((r) => r.name === "Giveaways")){
                        return message.channel.send(':x: You need to have the manage messages permissions or \`Giveaways\` role to reroll giveaways.');
                    }
                
                    // If no message ID or giveaway name is specified
                    if(!args[1]){
                        return message.channel.send(':x: You have to specify a valid Giveaway message ID!');
                    }
                
                    // try to found the giveaway with prize then with ID
                    let giveawayr = 
                    // Search with giveaway prize
                    bot.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
                    // Search with giveaway ID
                    bot.giveawaysManager.giveaways.find((g) => g.messageID === args[1]);
                
                    // If no giveaway was found
                    if(!giveawayr){
                        return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') +'`.');
                    }
                
                    // Reroll the giveaway
                    bot.giveawaysManager.reroll(giveawayr.messageID)
                    .then(() => {
                        // Success message
                        
                    })
                    .catch((e) => {
                        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
                            message.channel.send('This giveaway has not ended!');
                        } else {
                            console.error(e);
                            message.channel.send('An error occured...');
                        }
                    });
                    break;

                case 'giveaway-end':
                   case 'ge':

                    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') || !message.member.roles.cache.some((r) => r.name === "Giveaways")){
      return message.channel.send(':x: You need to have the manage messages permissions or \`Giveaways\` role to reroll giveaways.');
  }

  // If no message ID or giveaway name is specified
  if(!args[1]){
      return message.channel.send(':x: You have to specify a valid message ID!');
  }

  // try to found the giveaway with prize then with ID
  let giveaway = 
  // Search with giveaway prize
  bot.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
  // Search with giveaway ID
  bot.giveawaysManager.giveaways.find((g) => g.messageID === args[1]);

  // If no giveaway was found
  if(!giveaway){
      return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') + '`.');
  }

  // Edit the giveaway
  bot.giveawaysManager.edit(giveaway.messageID, {
      setEndTimestamp: Date.now()
  })
  // Success message
  .then(() => {
      // Success message
      message.channel.send('Giveaway will end in less than '+(bot.giveawaysManager.options.updateCountdownEvery/1000)+' seconds...');
  })
  .catch((e) => {
      if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)){
          message.channel.send('This giveaway is already ended!');
      } else {
          console.error(e);
          message.channel.send('An error occured...');
      }
  });
  break;

                case 'giveaway-start':
                   case 'gs':

                  if(!message.member.hasPermission('MANAGE_MESSAGES') || !message.member.roles.cache.some((r) => r.name === "Giveaways")){
                     return message.channel.send(':x: You need to have the manage messages permissions to start giveaways or the \`Giveaway\` role.');
                 }
                 // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(':x: You have to mention a valid channel!');
    }

    // Giveaway duration
    let giveawayDuration = args[2];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: You have to specify a valid duration!');
    }

    // Number of winners
    let giveawayNumberWinners = args[3];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(':x: You have to specify a valid number of winners!');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(4).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: You have to specify a valid prize!');
    }

    // Start the giveaway
    bot.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: giveawayNumberWinners,
        // Who hosts this giveaway
        hostedBy: message.author,
        // Messages
        messages: {
            giveaway: `🎉**${message.guild.name} GIVEAWAY** 🎉`,
            giveawayEnded: `🎉 **${message.guild.name} GIVEAWAY ENDED** 🎉`,
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎉 to participate!",
            winMessage: "Congratulations, {winners}! You won **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by: {user}",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.channel.send(`Giveaway started in ${giveawayChannel}!`);
   break;         
    }
    }

  })

  /*bot.on('raw', payload => {
    if(payload.t === 'MESSAGE_REACTION_ADD') { // Check if the event name is MESSAGE_REACTION_ADD
      
        if(payload.d.emoji.name === 'pokeball') // If the emoji is ticketreact
        {
            if(payload.d.message_id === '739842481612521572') { // Here we check if the id of the message is the ID of the embed that we had the bot send using the ?sendmsg command.
              
              let channel = bot.channels.cache.get(payload.d.channel_id) // Get the proper channel object. 
                if(channel.messages.cache.has(payload.d.message_id)) { // Check if the channel has the message in the cache.
                    
                }
                else {
                 // Fetch the message and then get the reaction & user objects and emit the messageReactionAdd event manually.
                   
                 channel.messages.fetch(payload.d.message_id)
                    .then(msg => {
                      console.log("then statement")  
                        let reaction = msg.reactions.cache.get(':pokeball:737700976827301999');
                        let user = bot.users.cache.get(payload.d.user_id);
                        bot.emit('messageReactionAdd', reaction, user);
                        
                    })
                    .catch(err => console.log(err));
                }
            }
        }
        // Check if the emoji is checkreact, meaning we're deleting the channel.
        // This will only be significant if our bot crashes/restarts and there are additional ticket channels that have not been closed.
        else if(payload.d.emoji.name === 'warn') {
            let channel = bot.channels.get(payload.d.channel_id);
            if(channel.messages.cache.has(payload.d.message_id)) {
                return;
            }
            else {
                channel.messages.fetch(payload.d.message_id)
                .then(msg => {
                    let reaction = msg.reactions.cache.get(':warn:739554268154953834');
                    let user = bot.users.get(payload.d.user_id);
                    bot.emit('messageReactionAdd', reaction, user);
                })
                // Additional code that I did not need, but leaving it here for future purposes.
                /*
                .then(msg => msg.embeds.length === 1 && msg.embeds[0].title === 'Ticket Support' ? Promise.resolve(msg.channel) : Promise.reject('Incorrect Msg')
                ).then(ch => ch.delete('closing ticket'))
                .then(guildChannel => console.log("Deleted " + guildChannel.name))
                .catch(err => console.log(err)); */

            /*}
        }
    }
});*/

/*bot.on('messageReactionAdd', (reaction, user) => {
  if(reaction.emoji.name === 'pokeball') { // If the emoji name is ticketreact, we will create the ticket channel.
    console.log("reacted on pokeball ") 
    /**
       * Here we need to check the map to see if the user's id is in there, indicating they have a ticket.
       * We also need to check if there are any other guild channels with their name concatenated with 's-ticket'. We need to 
       * check this case because the bot may have crashed or restarted, and their ID won't be stored in the map.
       */
      /*if(userTickets.cache.has(user.id) || reaction.message.guild.channels.some(channel => channel.name.toLowerCase() === user.username + 's-ticket')) {
          user.send("You already have a ticket!"); // Send user msg indicating they have a ticket.
      }
      else {
          let guild = reaction.message.guild;
          // Create channel based on permissions. Note, you need to modify the permissionsOverwrites array to fit your needs for permissions.
          guild.channels.create(`${user.username}s-ticket`, {
              type: 'text',
              permissionOverwrites: [
                  {
                      allow: 'VIEW_CHANNEL',
                      id: user.id
                  },
                  {
                      deny: 'VIEW_CHANNEL',
                      id: guild.id
                  },
                  {
                      allow: 'VIEW_CHANNEL',
                      id: '737338067257655380'
                  }
              ]
          }).then(ch => {
              userTickets.set(user.id, ch.id); // Once ticket is created, set the user's id as a key mapping to the channel id.
              let embed = new Discord.MessageEmbed()
              .setTitle('Ticket Support')
              .setDescription('Please briefly explain your problem here and a staff member will get back to you shortly.')
              .setColor('#40BCD8')
              ch.send(embed) // Send a message to user.
          }).catch(err => console.log(err));
      }
  }
  else if(reaction.emoji.name === 'warn') {
      // If emoji is checkreact, they are trying to close the ticket.
      if(userTickets.has(user.id)) {
          if(reaction.message.channel.id === userTickets.get(user.id)) {
              let embed = new Discord.MessageEmbed()
              .setDescription("Ticket will be closed in 5 seconds.")
              reaction.message.channel.send(embed);
              setTimeout(() => {
                  reaction.message.channel.delete('closing ticket')
                  .then(channel => {
                      console.log("Deleted " + channel.name);
                  })
                  .catch(err => console.log(err));
              }, 5000);
          }
      }
      // This case is really for handling tickets that were not closed by the bot due to the bot possibly crashing.
      // In order for this to actually work, the user needs to have a ticket opened already.
      else if(reaction.message.guild.channels.cache.some(channel => channel.name.toLowerCase() === user.username + 's-ticket')) {
          let embed = new Discord.MessageEmbed()
         .setDescription("Ticket will be closed in 5 seconds.")
          reaction.message.channel.send(embed);
          setTimeout(() => {
              reaction.message.guild.channels.forEach(channel => {
                  if(channel.name.toLowerCase() === user.username + 's-ticket') {
                      channel.delete().then(ch => console.log('Deleted Channel ' + ch.id))
                  }
              });
          }, 5000);
      }
  }else message.channel.send("error")
})*/
bot.login(token);