const Discord = require('discord.js');
const Canvas = require('canvas');
const client = new Discord.Client();
const { get } = require("https");

var answer = 'none';
var URL = 'none';
var mode = 'hiragana';
var romaji = [ 
  'a','i','u','e','o',
  'ka','ki','ku','ke','ko',
  'sa','shi','su','se','so',
  'ta','chi','tsu','te','to',
  'na','ni','nu','ne','no',
  'ha','hi','fu','he','ho',
  'ma','mi','mu','me','mo',
  'ya','yu','yo',
  'ra','ri','ru','re','ro',
  'wa','wo',
  'n',
  'ga','gi','gu','ge','go',
  'za','ji','zu','ze','zo',
  'da','ji','zu','de','do',
  'ba','bi','bu','be','bo',
  'pa','pi','pu','pe','po'
];
var hiragana = [
  'あ','い','う','え','お',
  'か','き','く','け','こ',
  'さ','し','す','せ','そ',
  'た','ち','つ','て','と',
  'な','に','ぬ','ね','の',
  'は','ひ','ふ','へ','ほ',
  'ま','み','む','め','も',
  'や','ゆ','よ',
  'ら','り','る','れ','ろ',
  'わ','を',
  'ん',
  'が','ぎ','ぐ','げ','ご',
  'ざ','じ','ず','ぜ','ぞ',
  'だ','ぢ','づ','で','ど',
  'ば','び','ぶ','べ','ぼ',
  'ぱ','ぴ','ぷ','ぺ','ぽ'
];
var katakana = [
  'ア','イ','ウ','エ','オ',
  'カ','キ','ク','ケ','コ',
  'サ','シ','ス','セ','ソ',
  'タ','チ','ツ','テ','ト',
  'ナ','ニ','ヌ','ネ','ノ',
  'ハ','ヒ','フ','ヘ','ホ',
  'マ','ミ','ム','メ','モ',
  'ヤ','ユ','ヨ',
  'ラ','リ','ル','レ','ロ',
  'ワ','ヲ',
  'ン',
  'ガ','ギ','グ','ゲ','ゴ',
  'ザ','ジ','ズ','ゼ','ゾ',
  'ダ','ヂ','ヅ','デ','ド',
  'バ','ビ','ブ','ベ','ボ',
  'パ','ピ','プ','ペ','ポ'
]

async function TEST(){
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

TEST();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  async function RENDER(string1, string2){
    await TEST()
    message.reply('правильно.');
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
  function HIRAGANA(){
    var rand = Math.floor(Math.random() * (70 - 0 + 1)) + 0;
    RENDER(hiragana[rand], romaji[rand])
  }
  function KATAKANA(){
    var rand = Math.floor(Math.random() * (70 - 0 + 1)) + 0;
    RENDER(katakana[rand], romaji[rand])
  }
  if (message.content.toLowerCase() == answer) {
    if(mode == 'hiragana')
      HIRAGANA();
    if(mode == 'katakana')
      KATAKANA();
  }
  if (message.content.toLowerCase().slice(0, 2) == 'j!') {
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
  }
});
client.login('NjAwNzA1OTM1MjI4NDAzNzIy.Xb8Zug.RO2dekrOS1X3fJBOzmTHoQ2ofbA');
//ByМетøчка for himself v1.3
