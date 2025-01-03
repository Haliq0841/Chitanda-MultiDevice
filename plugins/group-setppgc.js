import { webp2png } from '../lib/webp2mp4.js'
import { URL_REGEX } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (/image/.test(mime)) {
    let url = await webp2png(await q.download())
    await conn.updateProfilePicture(m.chat, { url }).then(_ => m.reply('Success update profile picture'))
  } else if (args[0] && args[0].match(URL_REGEX)) {
    await conn.updateProfilePicture(m.chat, { url: args[0] }).then(_ => m.reply('Success update profile picture'))
  } else throw 'Where\'s the media?'
}
handler.help = ['setppgrup']
handler.tags = ['group']
handler.alias = ['setppgc', 'setppgrup', 'setppgroup']
handler.command = /^setpp(gc|grup|group)$/i
handler.group = handler.admin = handler.botAdmin = true

export default handler
