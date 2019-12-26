const Discord = require('discord.js');
const Canvas = require('canvas');
const client = new Discord.Client();
const { get } = require("https");
let config = require('./config.json');
let kana = require('./kana.json');
let vocabulary = require('./vocabulary.json');
 
var answer = 'none';
var URL = 'none';
var mode = 'hiragana';
 
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
  async function RENDER(string1, string2){
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
    ctx.font = '220px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(string1, 15, 210);
    ctx.font = '200px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(string1, 25, 200);
    ctx.strokeStyle = "#000000";
    ctx.font = '200px sans-serif';
    ctx.lineWidth = 2
    ctx.strokeText(string1, 25, 200);
    const buf = canvas.toBuffer('image/png');
    message.channel.send("Что это за символ?", {
      embed: {
        color: 0x7486C2,
        description:'Ответ:  ||'+ string2 +'||',
      },
      files: [{
        attachment: buf,
        name: "hiragana.png"
      }]
    });
    answer = string2;
  }

  async function RENDERREAD(string1, string2, string3){
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
    message.channel.send("ну давай, прочти это...", {
      embed: {
        color: 0x7486C2,
        description:'Ответ:  ||'+ string2 +'||\n\nПеревод: ||'+ string3 +'||',
      },
      files: [{
        attachment: buf,
        name: "hiragana.png"
      }]
    });
    answer = string2;
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
    RENDERREAD(vocabulary[rand].kana, vocabulary[rand].romaji,vocabulary[rand].definition)
  }
  if (message.content.toLowerCase() == answer||message.content.toLowerCase() == 'skip') {
    console.log(URL.slice(URL.length - 5, URL.length))
    if(URL.slice(URL.length - 5, URL.length) == '.webp')
    URL = 'https://cdn.discordapp.com/attachments/600294780144189481/641639925174763530/breakbot.jpg';
    if(message.content.toLowerCase() == 'skip')
    message.reply('Плохо.:rage:');
    else
    message.reply('правильно.');
    if(mode == 'hiragana')
      HIRAGANA();
    if(mode == 'katakana')
      KATAKANA();
    if(mode == 'read')
      READ();
  }
  
  if (message.content.toLowerCase().slice(0, 2) == 'j!') {
    if(message.content.toLowerCase().slice(2, message.content.length) == 'help'){
      HelpEmbed()
      function HelpEmbed() {
        message.channel.send(new Discord.RichEmbed()
            .setColor("0099ff")
            .setAuthor("MetaBOT", "https://cdn.discordapp.com/avatars/600705935228403722/3daed4e4f4174552d893477cc7d38c87.png?size=2048")
            .setDescription("Биб-буп! Konnichiha, бро.  Я ,MetaBOT, создан для помощи в изучении японского языка и подготовки к экзамену  JLPT n5.\n\nА вот и мои команды:\n\n**j!help** - Краткий список команд и объяснение их предназначение\n\n**j!hiragana** - запускает тренажер для запоминания хираганы. Префикс перед ответом ставить не надо.\n\n**j!katakana** - запускает тренажер для запоминания катаканы. Префикс перед ответом ставить не надо.\n\n**j!read** - запускает тренажер для чтения слов на хирагане и катакане. Префикс перед ответом ставить не надо.\n\nИсходный код: https://github.com/Metasux/MetaJesus")
            .setTitle("Информация")
            .setFooter("ByМетøчка v1.6", "https://avatars2.githubusercontent.com/u/49251114?s=460&amp;v=4"));
    }
  }
    if(message.content.toLowerCase().slice(2, message.content.length) == 'hiragana'){
      mode = 'hiragana';
      HIRAGANA();
      message.channel.send('Ну раз хирагана, то хирагана.')
    }
 
    if(message.content.toLowerCase().slice(2, message.content.length) == 'katakana'){
      mode = 'katakana';
      KATAKANA();
      message.channel.send('Ну раз катакана, то катакана.')
    }
    if(message.content.toLowerCase().slice(2, message.content.length) == 'read'){
      mode = 'read';
      READ();
      message.channel.send('Ничего себе, читать будешь? Ну оки-доки!')
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
//ByМетøчка for himself v1.6