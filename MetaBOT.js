const Discord = require('discord.js');
const Canvas = require('canvas');
const client = new Discord.Client();
const { get } = require("https");
const fs = require('fs');
let config = require('./config.json');
let kana = require('./kana.json');
let vocabulary = require('./vocabulary.json');
let vocabulary2 = require('./vocabulary2.json');
let profile = require('./profile.json');
var URL = 'none';
 
async function NEKOS_API(){
  get("https://neko-love.xyz/api/v1/neko", (res) => {
  const { statusCode } = res;
  if (statusCode != 200) {
      res.resume;
  }
  res.setEncoding("utf8");
  let rawData = '';
  res.on("data", (chunk) => {
      rawData += chunk;
  });
  res.on("end", () => {
      try {
          const parsedData = JSON.parse(rawData);
          URL = parsedData.url;
          console.log(parsedData.url)
      } catch (e) {
          console.error(e.message);
      }
  });
}).on("error", (err) => {
  console.error(err.message);
})
};
 
NEKOS_API();
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame('j!help for help')
});
 
client.on('message', async message => {
  async function RENDER(string1, string2, string3){
    await NEKOS_API()
    const canvas = Canvas.createCanvas(250, 250);
    const ctx = canvas.getContext('2d');
    ctx.rect(20, 20, canvas.width-40, canvas.height-40);
    ctx.lineJoin = "round";
    ctx.lineWidth = 40;
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-in';
    const background = await Canvas.loadImage(URL);
    if(background.width>background.height)
     ctx.drawImage(background, (background.width-background.height)/2, 0, background.height, background.height, 0, 0, canvas.width, canvas.height);
    else
      ctx.drawImage(background, 0, (background.height-background.width)/2, background.width, background.width, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = 250/string1.length+'px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(string1, 125, 125);
    ctx.font = 250/string1.length+'px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(string1, 125, 125);
    ctx.strokeStyle = "#000000";
    ctx.font = 250/string1.length+'px sans-serif';
    ctx.lineWidth = 2
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(string1, 125, 125);
    const buf = canvas.toBuffer('image/png');
    if(profile[message.author.id].mode === ('hiragana'||'katakana')){
      message.channel.send("Что это за символ, "+message.author.username+"?", {
        embed: {
          color: 0x7486C2,
          description:'Ответ:  ||'+ string2 +'||',
        },
        files: [{
          attachment: buf,
          name: "hiragana.png"
        }]
      });
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].answer = string2;

        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
    }
    if(profile[message.author.id].mode === 'read'){
      message.channel.send("ну давай, "+message.author.username+", прочти это...", {
        embed: {
          color: 0x7486C2,
          description:'Ответ:  ||'+ string2 +'||\n\nПеревод: '+ string3,
        },
        files: [{
          attachment: buf,
          name: "hiragana.png"
        }]
      });
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].answer = string2;
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
    }
    if(profile[message.author.id].mode === 'learn'){
      var temp1 = Math.floor(Math.random() * (2 - 0));
      if(temp1 === 0){
        for (var i = 0; i < 1 ; i++){
          profile[message.author.id].answer = string2;
          temp1 = '__ПЕРЕВЕДИ__';
          fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
        }
      }
      else{
        for (var i = 0; i < 1 ; i++){
          temp1 = '__ПРОЧИТАЙ__';
          profile[message.author.id].answer = string3;
          fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
        }
      }
      if(profile[message.author.id].massid[0] === 1){
        if(profile[message.author.id].points[profile[message.author.id].massid[1]] <= 7){
          message.channel.send("ну давай, "+message.author.username+", "+temp1+" это...", {
            embed: {
              color: 0x7486C2,
              description:'Читается как: '+ string3 +'\n\nПодсказка: ||'+ string2+'||',
            },
            files: [{
              attachment: buf,
              name: "hiragana.png"
            }]
          });
        }
        else{
          if(profile[message.author.id].points[profile[message.author.id].massid[1]] <= 10){
            message.channel.send("ну давай, "+message.author.username+", "+temp1+" это...", {
              embed: {
                color: 0x7486C2,
                description:'Читается как: ||'+ string3 +'||',
              },
              files: [{
                attachment: buf,
                name: "hiragana.png"
              }]
            });
          }
          else{
            message.channel.send("ну давай, "+message.author.username+", "+temp1+" это...", {
              embed: {
                color: 0x7486C2,
                description:'Никаких подсказок!!!',
              },
              files: [{
                attachment: buf,
                name: "hiragana.png"
              }]
            });
          }
        }
      }
      else{
        message.channel.send("ну давай, "+message.author.username+", "+temp1+" это...", {
          embed: {
            color: 0x7486C2,
            description:'Читается как: ||'+ string3 +'||',
          },
          files: [{
            attachment: buf,
            name: "hiragana.png"
          }]
        });
      }
    }
  }
  function HIRAGANA(){
    var rand = Math.floor(Math.random() * (70 - 0 + 1)) + 0;
    RENDER(kana[rand].hiragana, kana[rand].romaji)
  }
  function KATAKANA(){
    var rand = Math.floor(Math.random() * (70 - 0 + 1)) + 0;
    RENDER(kana[rand].katakana, kana[rand].romaji)
  }
  function READ(){
    var rand = Math.floor(Math.random() * (726 - 0 + 1)) + 0;
    RENDER(vocabulary[rand].kana, vocabulary[rand].romaji,vocabulary[rand].definition)
  }
  function LEARN(){
    var temp = 0
    var rand = Math.floor(Math.random() * (100 - 0)) + 1
    if(profile[message.author.id].learned.length > 33) temp = 33;
    else temp = profile[message.author.id].learned.length;
    if(rand > temp){
      var rand = Math.floor(Math.random() * (10 - 0));
      RENDER(vocabulary2[profile[message.author.id].learning[rand]].kana, vocabulary2[profile[message.author.id].learning[rand]].definition, vocabulary2[profile[message.author.id].learning[rand]].romaji)
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].massid[0] = 1;
        profile[message.author.id].massid[1] = rand;
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
    }
    else{
      var rand = Math.floor(Math.random() * (profile[message.author.id].learned.length - 0));
      RENDER(vocabulary2[profile[message.author.id].learned[rand]].kana, vocabulary2[profile[message.author.id].learned[rand]].definition, vocabulary2[profile[message.author.id].learned[rand]].romaji)
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].massid[0] = 2;
        profile[message.author.id].massid[1] = rand;
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
    }
  }

  if(!profile[message.author.id] === false){
    if(profile[message.author.id].channel == message.channel.id && profile[message.author.id].mode == 'learn' && message.content.toLowerCase().slice(0, 2) != 'j!'){
      if(URL.slice(URL.length - 5, URL.length) == '.webp')
      URL = 'https://cdn.discordapp.com/attachments/600294780144189481/641639925174763530/breakbot.jpg';
      if(message.content.toLowerCase() == 'skip'){
        message.reply('плохо!!! Ответ был ``'+profile[message.author.id].answer+'`` :rage:');
        LEARN()
      }
      else{
        if(message.content.toLowerCase() == profile[message.author.id].answer){
          message.reply('правильно.');
          if(profile[message.author.id].points[profile[message.author.id].massid[1]] < 25){
            for (var i = 0; i < 1 ; i++){
              profile[message.author.id].points[profile[message.author.id].massid[1]]++
              fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
            }
          }
          else{
            for (var i = 0; i < 1 ; i++){
              profile[message.author.id].points[profile[message.author.id].massid[1]] = 0;
              profile[message.author.id].learned.push(profile[message.author.id].learning[profile[message.author.id].massid[1]]);
              profile[message.author.id].learning[profile[message.author.id].massid[1]] = profile[message.author.id].learning.length + profile[message.author.id].learned.length -1;
              console.log(profile[message.author.id].learning.length + profile[message.author.id].learned.length -1)
              fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
            }
          }
          LEARN()
        }
        else{
          message.reply('неправильно. Ответ был ``'+profile[message.author.id].answer+'`` :rage:');
          LEARN()
        }
      }
    }
  }

  if(!profile[message.author.id] === false){
    if((message.content.toLowerCase() == profile[message.author.id].answer || message.content.toLowerCase() == 'skip') && profile[message.author.id].channel == message.channel.id && profile[message.author.id].mode != 'learn') {
      if(URL.slice(URL.length - 5, URL.length) == '.webp')
      URL = 'https://cdn.discordapp.com/attachments/600294780144189481/641639925174763530/breakbot.jpg';
      if(message.content.toLowerCase() == 'skip')
      message.reply('Плохо.:rage:');
      else
      message.reply('правильно.');
      if(profile[message.author.id].mode == 'hiragana')
        HIRAGANA();
      if(profile[message.author.id].mode == 'katakana')
        KATAKANA();
      if(profile[message.author.id].mode == 'read')
        READ();
    }
  }
  
  if (message.content.toLowerCase().slice(0, 2) == 'j!') {
    if(!profile[message.author.id]){
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id]= {
          hentai:"false",
          mode:"",
          answer:"",
          channel:"",
          learning:[0,1,2,3,4,5,6,7,8,9],
          points:[0,0,0,0,0,0,0,0,0,0],
          learned:[],
          massid:[0,0]
        }
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
    }
    if(message.content.toLowerCase().slice(2, message.content.length) == 'help'){
      HelpEmbed()
      function HelpEmbed() {
        message.channel.send(new Discord.RichEmbed()
            .setColor("0099ff")
            .setAuthor("MetaBOT", "https://cdn.discordapp.com/avatars/600705935228403722/3daed4e4f4174552d893477cc7d38c87.png?size=2048")
            .setDescription("Биб-буп! Konnichiha, бро.  Я ,MetaBOT, создан для помощи в изучении японского языка и подготовки к экзамену  JLPT n5.\n\nА вот и мои команды:\n\n**j!help** - Краткий список команд и объяснение их предназначение\n\n**j!hiragana** - запускает тренажер для запоминания хираганы. Префикс перед ответом ставить не надо.\n\n**j!katakana** - запускает тренажер для запоминания катаканы. Префикс перед ответом ставить не надо.\n\n**j!read** - запускает тренажер для чтения слов на хирагане и катакане. Префикс перед ответом ставить не надо.\n\n**j!learn** - запускает тренажер, который вас закидывает вашей личной колодой карточек со словами, которая по мере изучения будет расширяться.\n\nИсходный код: https://github.com/Metasux/MetaJesus")
            .setTitle("Информация")
            .setFooter("ByМетøчка v1.8", "https://avatars2.githubusercontent.com/u/49251114?s=460&amp;v=4"));
    }
  }
    if(message.content.toLowerCase().slice(2, message.content.length) == 'hiragana'){
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].mode = 'hiragana';
        profile[message.author.id].channel = message.channel.id;
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
      HIRAGANA();
      message.channel.send('Ну раз хирагана, то хирагана.')
    }
 
    if(message.content.toLowerCase().slice(2, message.content.length) == 'katakana'){
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].mode = 'katakana';
        profile[message.author.id].channel = message.channel.id;
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
      KATAKANA();
      message.channel.send('Ну раз катакана, то катакана.')
    }
    if(message.content.toLowerCase().slice(2, message.content.length) == 'read'){
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].mode = 'read';
        profile[message.author.id].channel = message.channel.id;
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
      READ();
      message.channel.send('Ничего себе, читать будешь? Ну оки-доки!')
    }
    if(message.content.toLowerCase().slice(2, message.content.length) == 'learn'){
      for (var i = 0; i < 1 ; i++){
        profile[message.author.id].mode = 'learn';
        profile[message.author.id].channel = message.channel.id;
        fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{if(err) console.log(err);});
      }
      LEARN()
      message.channel.send('Ну окей, переводи.')
    }
  }
});

client.on('messageDelete', message => {
  if(message.guild.id == "540145900526501899" && message.author.id == "521680806779813908") {
    message.channel.send(`Здесь покоится сообщение ${message.author.tag.split('`').join('')}:\n\`\`\`\n${message.cleanContent.split('`').join('')}\n\`\`\``);
  }
})

client.on('messageUpdate', (msg, newmsg) => {
  if (msg.author.id == "521680806779813908") {
  msg.channel.send(`${msg.author.tag} отредачил сообщение:\n\`\`\`\n${msg.cleanContent.split('`').join('')}\n\`\`\`на:\n\`\`\`\n${newmsg.cleanContent}\n\`\`\``);
  }
})

client.login(config.token);
//ByМетøчка for himself v1.8