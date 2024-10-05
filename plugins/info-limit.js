const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

let handler = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    let ke1 = global.db.data.users[who].limit
    let ke2 = global.db.data.users[who].exp
    let ke3 = global.db.data.users[who].koin
    if (args[0] == 'reset') {
    global.db.data.users[who].limit = 0
    global.db.data.users[who].exp = 0
    global.db.data.users[who].koin = 0
    return m.reply('berhasil di reset')
/*
        let list = Object.entries(global.db.data.users)
        let lim = !args || !args[0] ? 1000 : isNumber(args[0]) ? parseInt(args[0]) : 1000
        lim = Math.max(1, lim)
        list.map(([user, data], i) => (Number(data.limit = lim)))

        conn.reply(m.chat, `*Berhasil direset ${lim} / user*`, fakes, adReply)
*/
    
    }


    let caption = `
${dmenut} *Harta milik ${await conn.getName(who)}*
${dmenub} 📛 *Limit:* ${ke1}
${dmenub} 💳 *Exp:* ${ke2}
${dmenub} 🪙 *koin:* ${String(ke3)}
${dmenuf}
`
    //conn.reply(m.chat, caption, fakes, adReply)
//let { proto, generateWAMessageFromContent } = require('@adiwajshing/baileys')
return await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: caption
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "chitanda"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            subtitle: "",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"reset💀\",\"id\":\".limit reset\"}"
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"ke menu utama\",\"id\":\".menu\"}"
              }
           ],
          })
        })
    }
  }
}, {})

await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id,
  qouted: m})
}
handler.help = ['limit [@user]']
handler.tags = ['xp']
handler.command = /^((cek)?limit)$/i
export default handler

function isNumber(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
}