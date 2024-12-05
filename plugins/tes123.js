import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler  = async (m, 
             { conn, 
                usedPrefix: _p }) => {

var info = `Ya, Aku di sini`

const pre = generateWAMessageFromContent(m.chat, { liveLocationMessage:{
  degreesLatitude: 0,
  degreesLongitude: 0,
  accuracyInMeters: 0,
  speedInMps: 0,
  degreesClockwiseFromMagneticNorth: 0,
  caption: info,
  sequenceNumber: 0,
  timeOffset: 8600,
  jpegThumbnail: conn.getFile('../thumbnail.jpg'),
  contextInfo: { mentionedJid: [m.sender] }
}}, { quoted: fakes })
return conn.relayMessage(m.chat, pre.message, { messageId: pre.key.id })
}
handler.customPrefix = /^(tes|bot|chitanda|test)$/i
handler.command = new RegExp
export default handler
