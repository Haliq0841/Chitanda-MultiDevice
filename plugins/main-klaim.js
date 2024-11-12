const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default
global.randomlimit = [
 5,
 6,
 7,
 8,
 9, 
10,
 11,
 12,
 13,
 14, 
 15,
 25,
 50,
]
function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())];
}


const user = 500
//const limit = 10
const koin = 1000

let handler = async (m, { isPrems , isOwner, text, isAdmin}) => {
    let limit = pickRandom(global.randomlimit);
     //limit = 0
    //if (text === 'Chitanda MD') limit = 100
    //if (text === 'ꓷW ɐpuɐʇıɥↃ') limit = 1000
    let time = global.db.data.users[m.sender].udahklaim + 86400000
  if (new Date - global.db.data.users[m.sender].udahklaim < 86400000 && !isOwner && !isAdmin) throw `Kamu Sudah Mengambilnya Hari Ini\nTunggu Selama ${msToTime(time - new Date())} Lagi`
        if (global.db.data.users[m.sender].koin = null) global.db.data.users[m.sender].koin = 1
        global.db.data.users[m.sender].koin += koin
        global.db.data.users[m.sender].limit += limit
        global.db.data.users[m.sender].udahklaim = new Date * 1
        return conn.reply(m.chat, `Selamat Kamu Mendapatkan:\n\n+${limit} Limit\n+${koin} Koin`, m)
        let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `Selamat Kamu Mendapatkan:\n\n+${limit} Limit\n+${koin} Koin`
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
                "buttonParamsJson": "{\"display_text\":\"reset limit ku\",\"id\":\".limit reset\"}"
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
        global.db.data.users[m.sender].udahklaim = new Date * 1
    }
handler.help = ['klaim']
handler.tags = ['main']
handler.command = /^((c|k)laim)$/i

handler.fail = null

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    monthly = Math.floor((duration / (1000 * 60 * 60 * 24)) % 720)

  monthly  = (monthly < 10) ? "0" + monthly : monthly
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return monthly + " Hari " +  hours + " Jam " + minutes + " Menit"
}