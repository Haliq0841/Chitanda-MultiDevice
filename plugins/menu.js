// Script Ori By BochilGaming
// Ditulis Ulang Oleh ImYanXiao
//lalu di edit lagi oleh abdulhaliq   developer chitanda
import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'
//const moment = () => {}
const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

const defaultMenu = {
  before: `
╭─────═[ INFO USER ]═─────⋆
│╭───────────────···
┴│☂︎ *Name:* %name
⬡│☂︎ *Tag:* %tag
⬡│☂︎ *Premium:* %prems
⬡│☂︎ *Limit:* %limit
┬│☂︎ *Total Xp:* %totalexp
│╰────────────────···
┠─────═[ TODAY ]═─────⋆
│╭────────────────···
┴│    *${ucapan()} %name!*
⬡│☂︎ *Tanggal:* %week %weton
⬡│☂︎ *Date:* %date
⬡│☂︎ *Tanggal Islam:* %dateIslamic
⬡│☂︎ *Waktu:* %wita
┬│☂︎ *hitungan mundur ultah owner:* %ultah lagi 🎂
│╰────────────────···
┠─────═[ INFO BOT ]═─────⋆
│╭────────────────···
┴│☂︎ *Nama Bot:* %me
⬡│☂︎ *Mode:* %mode
⬡│☂︎ *Prefix:* [ *%_p* ]
⬡│☂︎ *Baileys:* Multi Device
⬡│☂︎ *Battery:* ${conn.battery != undefined ? `${conn.battery.value}% ${conn.battery.live ? '🔌 pengisian' : ''}` : 'tidak diketahui'}
⬡│☂︎ *Platform:* %platform
⬡│☂︎ *Type:* Node.Js
⬡│☂︎ *Uptime:* %muptime
┬│☂︎ *Database:* %rtotalreg dari %totalreg
│╰────────────────···
╰──────────═┅═──────────
> Dengan menggunakan bot berarti kamu menyetujui kebijakan dan syarat penggunaan bot ini!
> Silahkan ketik %_prules untuk membaca


⃝▣──「 *INFO CMD* 」───⬣
│ *Ⓟ* = Premium
│ *Ⓛ* = Limit
▣────────────⬣
%readmore
`.trimStart(),
  header: '⃝▣──「 %category 」───⬣',
  body: '│○ %cmd %isPremium %islimit',
  footer: '▣───────────⬣\n',
  after: `%c4 %me`,
}
let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command}) => {
let tags = {}
/*
let tags = {
  'main': 'Main',
  'store': 'Store',
  'game': 'Game',
  'rpg': 'RPG Games',
  'xp': 'Exp & Limit',
  'sticker': 'Sticker',
  'kerang': 'Kerang Ajaib',
  'quotes': 'Quotes',
  'fun': 'Fun',
  'anime': 'Anime',
  'admin': 'Admin',
  'group': 'Group',
  'vote': 'Voting',
  'absen': 'Absen',
  'premium': 'Premium',
  'anonymous': 'Anonymous Chat',
  'internet': 'Internet',
  'downloader': 'Downloader',
  'tools': 'Tools',
  'nulis': 'MagerNulis & Logo',
  'audio': 'Audio',
  'maker': 'Maker',
  'database': 'Database',
  'quran': 'Al Qur\'an',
  'owner': 'Owner',
  'host': 'Host',
  'advanced': 'Advanced',
  'info': 'Info',
  '': 'No Category',
}
*/
  try {
  	// DEFAULT MENU
      let dash = global.dashmenu
  	let m1 = global.dmenut
      let m2 = global.dmenub
      let m3 = global.dmenuf
      let m4 = global.dmenub2
      
      // COMMAND MENU
      let cc = global.cmenut
      let c1 = global.cmenuh
      let c2 = global.cmenub
      let c3 = global.cmenuf
      let c4 = global.cmenua
      
      // LOGO L P
      let lprem = global.lopr
      let llim = global.lolm
      let tag = `@${m.sender.split('@')[0]}`
    
    //-----------TIME---------
    let ucpn = `${ucapan()}`
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let _mpt
    if (process.send) {
      process.send('uptime')
      _mpt = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let mpt = clockString(_mpt)
    let usrs = db.data.users[m.sender]
   

 /**************************** TIME *********************/
 let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    let wibh = moment.tz('Asia/Jakarta').format('HH')
    let wibm = moment.tz('Asia/Jakarta').format('mm')
    let wibs = moment.tz('Asia/Jakarta').format('ss')
    let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')
    let wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`
 
 let mode = global.opts['self'] ? 'Private' : 'Publik'
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { age, exp, limit, level, role, registered, money} = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'Premium': 'Free'}`
    let platform = os.platform()
    let ultah = clockStringP(hitunganMundur(30, 11, 31, 5, 2025, -8))
    
    //---------------------
    
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    }) 
/*
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
          }
*/
for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                .replace(/%islimit/g, menu.limit ? llim : '')
                .replace(/%isPremium/g, menu.premium ? lprem : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      tag, dash,m1,m2,m3,m4,cc, c1, c2, c3, c4,lprem,llim,
      ucpn,platform, ultah, wita, mode, _p, money, age, tag, name, prems, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
  /*  
    //----------------- FAKE
 let fvn = {quoted: { key: {participant : '0@s.whatsapp.net'},message: { "audioMessage": {"mimetype":"audio/ogg; codecs=opus","seconds": "2022","ptt": "true"} } }}
 let floc = {quoted: { key: { participant : '0@s.whatsapp.net'}, message: { "liveLocationMessage": { "caption": `Menu`,"h": `${name}`, 'jpegThumbnail': fs.readFileSync('./thumbnail.jpg')}} }}
 let fdocs = {quoted: { key : { participant : '0@s.whatsapp.net'},message: {documentMessage: {title: `Hai Kak ${name}!`,  jpegThumbnail: fs.readFileSync('./thumbnail.jpg') }}}}
 let fgclink = {quoted: {key: {participant : '0@s.whatsapp.net'},message: {groupInviteMessage: {groupJid: "17608914335-1625305606@g.us",inviteCode: null,groupName: `Hai ${name}!`,  caption: wm,  jpegThumbnail: fs.readFileSync('./thumbnail.jpg') }} }}
 let fgif = {quoted: {key: { participant : '0@s.whatsapp.net'}, message: {  "videoMessage": {  "title": `Hai Kak ${name}!`, "h": `Hmm`, 'seconds': '999999999',  'gifPlayback': 'true',  'caption': wm, 'jpegThumbnail': fs.readFileSync('./thumbnail.jpg') } } } }
 let fkon = { key: { fromMe: false, participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${name}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}
 
    let ftoko = {
    key: {
    fromMe: false,
    participant: `${m.sender.split`@`[0]}` + '@s.whatsapp.net',
    remoteJid: 'status@broadcast',
  },
  message: {
  "productMessage": {
  "product": {
  "productImage":{
  "mimetype": "image/jpeg",
  "jpegThumbnail": fs.readFileSync('./thumbnail.jpg'),
    },
  "title": `${ucapan()}`,
  "description": '𝗧 𝗜 𝗠 𝗘 : ' + wktuwib,
  "currencyCode": "US",
  "priceAmount1000": "100",
  "retailerId": wm,
  "productImageCount": 999
        },
  "businessOwnerJid": `${m.sender.split`@`[0]}@s.whatsapp.net`
  }
  }
  }
  /*
    let urls = pickRandom(['https://telegra.ph/file/035e524939ab0294ba91f.jpg', 'https://telegra.ph/file/96b2275d3b14d071290bc.jpg', 'https://telegra.ph/file/2c6b7660bc6126404a9bb.jpg', 'https://telegra.ph/file/c635bf577bb9d59a3e00b.jpg', 'https://telegra.ph/file/be8dd52f6363f9e9f5a60.jpg', 'https://telegra.ph/file/02e53361b9dc946f63c8d.jpg', 'https://telegra.ph/file/298ed2f1bba17aeb64ca8.jpg', 'https://telegra.ph/file/be2a18221974147f66ea0.jpg'])
    const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
    */
    //FAKE TROLI
    let urls = 'https://i.pinimg.com/originals/7b/0a/ba/7b0aba89ee337ede45c60b12a82f565e.jpg'
    const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => 'https://i.pinimg.com/originals/7b/0a/ba/7b0aba89ee337ede45c60b12a82f565e.jpg')
    const ftrol = {
    key : {
    remoteJid: 'status@broadcast',
    participant : '0@s.whatsapp.net'
    },
    message: {
    orderMessage: {
    itemCount : 2022,
    status: 1,
    surface : 1,
    message: `Hai Kak ${name}!`, 
    orderTitle: `▮Menu ▸`,
    thumbnail: await (await fetch('https://i.pinimg.com/originals/74/59/1e/74591e80455fb1736b35313ed2f07148.jpg')).buffer(), //Gambarnye
    sellerJid: '0@s.whatsapp.net' 
    }
    }
    }
    /*
    const fload = {
    key : {
    remoteJid: 'status@broadcast',
    participant : '0@s.whatsapp.net'
    },
    message: {
    orderMessage: {
    itemCount : 2022,
    status: 1,
    surface : 1,
    message: '[❗] Memuat Menu ' + '...\n Sabar Ya Kak ^ω^', 
    orderTitle: `▮Menu ▸`,
    thumbnail: await (await fetch('https://i.pinimg.com/originals/74/59/1e/74591e80455fb1736b35313ed2f07148.jpg')).buffer(), //Gambarnye
    sellerJid: '0@s.whatsapp.net' 
    }
    }
    }
    */
    await conn.reply(m.chat, '*Tunggu Sebentar Kak. . .*', ftrol) 
    
    //------------------< MENU >----------------
    
    //------------------ SIMPLE
    /*conn.reply(m.chat, text, fkon, { contextInfo: { mentionedJid: [m.sender],
        externalAdReply: {
            title: `${htjava} ${namebot}`,
            body: titlebot,
            description: titlebot,
            mediaType: 2,
          thumbnail: await(await fetch(thumb2)).buffer(),
         mediaUrl: sig
        }
     }
    })*/
    
    //------------------ DOCUMENT
    let d1 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    let d2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    let d3  = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    let d4 = 'application/pdf'
    let d5 = 'application/vnd.android.package-archive'
    let d6 = 'application/zip'
    let td = `${pickRandom([d1,d2,d3,d4,d5,d6])}`
    
   //~~~Source : https://github.com/Rlxfly
    //------- MENU LOCATION
    /*
    const pre = generateWAMessageFromContent(m.chat, { liveLocationMessage:{
  degreesLatitude: 34.672314,
  degreesLongitude: 135.484802,
  accuracyInMeters: 100,
  speedInMps: 999,
  degreesClockwiseFromMagneticNorth: 99,
  caption: text.trim(),
  sequenceNumber: 774236889,
  timeOffset: 8600,
  jpegThumbnail: await(await fetch(thumb)).buffer(),
  contextInfo: { mentionedJid: [m.sender] }
}}, { quoted: m
					})

return conn.relayMessage(m.chat, pre.message, { messageId: pre.key.id })
*/

//-------DOC TEMPLATE
/*
    const message = { 
            document: { url: thumbdoc },
            jpegThumbnail: await (await fetch(urls)).buffer(),
            fileName: wm,
            mimetype: td,
            fileLength: fsizedoc,
            pageCount: fpagedoc,
            caption: text,
            footer: titlebot,
            templateButtons: [
                {
                    urlButton: {
                        displayText: `${namebot}`,
                        url: 'https://github.com/ImYanXiao/Elaina-MultiDevice'
                    }
                },
                {
                    urlButton: {
                        displayText: 'Instagram',
                        url: sig
                    }
                },
                {
                    quickReplyButton: {
                        displayText: 'Owner🎐',
                        id: '.owner'
                    }
                },
                {
                    quickReplyButton: {
                        displayText: 'Speed⚡',
                        id: '.ping'
                    }
                },
                {
                    quickReplyButton: {
                        displayText: 'Donasi💵',
                        id: '.donasi'
                    }
                },
            ]
        }
       //await conn.sendMessage(m.chat, message, m, { mentionedJid: [m.sender] })
        
        //MAIN MENU
      /*conn.sendButton(m.chat, `*${ucapan()}, ${name} 👋*`, text.trim(), await genProfile(conn, m), [['Speedtest', _p + 'speedtest'], ['Owner', _p + 'owner']], false, { quoted: fkon, contextInfo: { externalAdReply: { showAdAttribution: true,
    mediaUrl: global.sig,
    mediaType: "VIDEO",
    description: global.sig, 
    title: wm,
    body: 'Here List Menu',
    thumbnail: thumb,
    sourceUrl: sgc
}
} })*/

    //------------------- 2BUTTON VID
   // conn.sendMessage(m.chat, { video: { url: 'https://telegra.ph/file/c82d5c358495e8ef15916.mp4' }, gifPlayback: true, gifAttribution: ~~(Math.random() * 2), caption: text.trim(), footer: 'ᴍᴀᴅᴇ ᴡɪᴛʜ ❤ ʙʏ ɪᴍ-ʏᴀɴxɪᴀᴏ', templateButtons: [{ quickReplyButton: { displayText: 'Speedtest⚡', id: `${_p}speedtest` }}, { quickReplyButton: { displayText: 'Owner🎀', id: `${_p}owner` }} ] })
    
    //------------------- Payment MENU
    /*await conn.relayMessage(m.chat,  {
    requestPaymentMessage: {
      currencyCodeIso4217: 'USD',
      amount1000: 50000000,
      requestFrom: m.sender,
      noteMessage: {
      extendedTextMessage: {
      text: text.trim(),
      contextInfo: {
      externalAdReply: {
      showAdAttribution: true
      }}}}}}, {})*/
      
     //---Made By @ImYanXiao
    // Mampus Di Enc 🧢
    // Gausah Dihapus, Thx
    //------------------ DOCUMENT WITH EXTERNALADS WITHOUT BUTTON
    //function _0x2daf(){const _0x4c1076=['namedoc','social','1017dFLzIP','11680bWFOeX','sendMessage','1FnTozH','6qNtNxK','445374chjKag','2096504ySppGm','627669MaFyqj','readFileSync','ʜᴏᴡ\x20ᴀʀᴇ\x20ʏᴏᴜ\x20ᴛᴏᴅᴀʏ?','374160lMCurS','356228pujvOS','./thumbnail.jpg','1019845zOpQQK','pdf','chat'];_0x2daf=function(){return _0x4c1076;};return _0x2daf();}const _0x110137=_0x13bb;(function(_0x14d3d7,_0x67b65e){const _0x3a56bf={_0x2e964c:0x1b0,_0x4fc539:0x1bd,_0x2a1845:0x1b1,_0x2b6724:0x1b3,_0x4293cc:0x1b8,_0x59080a:0x1b9},_0x30692c=_0x13bb,_0x119b1c=_0x14d3d7();while(!![]){try{const _0x181128=parseInt(_0x30692c(0x1bb))/0x1*(parseInt(_0x30692c(_0x3a56bf._0x2e964c))/0x2)+parseInt(_0x30692c(_0x3a56bf._0x4fc539))/0x3+parseInt(_0x30692c(_0x3a56bf._0x2a1845))/0x4+parseInt(_0x30692c(_0x3a56bf._0x2b6724))/0x5*(parseInt(_0x30692c(0x1bc))/0x6)+-parseInt(_0x30692c(0x1ad))/0x7+-parseInt(_0x30692c(0x1be))/0x8+parseInt(_0x30692c(_0x3a56bf._0x4293cc))/0x9*(-parseInt(_0x30692c(_0x3a56bf._0x59080a))/0xa);if(_0x181128===_0x67b65e)break;else _0x119b1c['push'](_0x119b1c['shift']());}catch(_0x1caf7d){_0x119b1c['push'](_0x119b1c['shift']());}}}(_0x2daf,0x235d2));function _0x13bb(_0x16c7de,_0x1a27b8){const _0x2dafbc=_0x2daf();return _0x13bb=function(_0x13bbaf,_0x156d41){_0x13bbaf=_0x13bbaf-0x1ad;let _0x1a2b8a=_0x2dafbc[_0x13bbaf];return _0x1a2b8a;},_0x13bb(_0x16c7de,_0x1a27b8);}let buttonMessage={'document':{'url':sgh},'mimetype':td,'fileName':global[_0x110137(0x1b6)],'fileLength':fsizedoc,'pageCount':fpagedoc,'contextInfo':{'externalAdReply':{'showAdAttribution':!![],'mediaType':0x1,'previewType':_0x110137(0x1b4),'title':_0x110137(0x1af),'thumbnail':fs[_0x110137(0x1ae)](_0x110137(0x1b2)),'renderLargerThumbnail':!![],'sourceUrl':global[_0x110137(0x1b7)]}},'caption':text['trim']()};await conn[_0x110137(0x1ba)](m[_0x110137(0x1b5)],buttonMessage,{'quoted':fkontak});
    //m.reply(text.trim())
    await conn.sendMessage(m.chat, { text: text, contextInfo: { externalAdReply: { title: conn.user.name, body: '', thumbnailUrl: 'https://64.media.tumblr.com/1d40a74cccac72aba9e3d0d9da97a9ff/a7f9d89b63ec7d53-90/s1280x1920/f148893058a449ceb587a444e43611c3b8b4cac5.jpg', sourceUrl: "https://wa.me/"+ global.owner[0][0], mediaType: 1, renderLargerThumbnail: true }}})
     //------------------- 2BUTTON LOCATION
    /*conn.sendButton(m.chat, `${ucapan()}﹗`, text.trim(), `${timeimg()}`, [
      ['🎏 ᴍᴇɴᴜ', `${_p}menu`],
      ['⚡ sᴘᴇᴇᴅᴛᴇsᴛ', `${_p}speedtest`]
    ], m, {asLocation: true}))*/
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
   // throw e
  }
}
handler.help = ['menu','allmenu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|allmenu|help|\?)$/i

handler.register = false
handler.exp = 10

export default handler

//----------- FUNCTION -------

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('')
}
function clockStringP(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  //return [ye, ' *Tahun  🗓️*\n',  mo, ' *Bulan 🌙*\n', d, ' *Hari ☀️*\n', h, ' *Jam 🕐*\n', m, ' *Menit ⏰*\n', s, ' *Detik ⏱️*'].map(v => v.toString().padStart(2, 0)).join('')
  return [ye, ' *Tahun 🗓,️* ',  mo, ' *Bulan 🌙,* ', d, ' *Hari ☀️,* ', h, ' *Jam 🕐,* ', m, ' *Menit ⏰,* ', s, ' *Detik ⏱️,* '].map(v => v.toString().padStart(2, 0)).join('')
}
function ucapan() {
  
  const time = moment.tz('Asia/Makassar').format('HH')
  let res = "Kok Belum Tidur Kak? 🥱"
  if (time >= 4) {
    res = "Pagi Lord 🌄"
  }
  if (time >= 10) {
    res = "Siang Lord ☀️"
  }
  if (time >= 15) {
    res = "Sore Lord 🌇"
  }
  if (time >= 18) {
    res = "Malam Lord 🌙"
  }
  return res
  
}
/*
function timeimg() {
    let imgloc = ''
  const time = moment.tz('Asia/Jakarta').format('HH')
  imgloc = ('./media/elaina8.png')
  if (time >= 0) {
    imgloc = ('./media/elaina.png')
  }
  if (time >= 4) {
    imgloc = ('./media/elaina2.png')
  }
  if (time >= 8) {
    imgloc = ('./media/elaina3.png')
  }
  if (time >= 12) {
    imgloc = ('./media/elaina4.png')
  }
  if (time >= 16) {
    imgloc = ('./media/elaina5.png')
  }
  if (time >= 20) {
    imgloc = ('./media/elaina6.png')
  }
  if (time >= 24) {
    imgloc = ('./media/elaina7.png')
  }
  return imgloc
}
  */
function hitunganMundur(minute, hour, day, month, year, customTimezone) {
  // Mengatur zona waktu sesuai inputan
  const customDate = new Date(year, month - 1, day, hour, minute);
  const customOffset = customTimezone * 60;
  const utc = customDate.getTime() + (customDate.getTimezoneOffset() * 60000);
  const newDate = new Date(utc + (customOffset * 60000));

  // Menghitung selisih waktu antara sekarang dan waktu kustom
  const now = new Date();
  const selisih = newDate - now;

  return selisih;
}

// Contoh penggunaan fungsi
//const msSelisih = hitunganMundur(30, 11, 31, 5, 2024, +8);
//return msSelisih