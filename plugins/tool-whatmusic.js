/*
TUTOR DAPETIN HOST, ACCESS_KEY, DAN ACCESS_SECRET
1. siapkan email palsu https://temp-mail.org/id
2. kesini https://console.acrcloud.com/#/register (isi bebas)
3. Kalian akan di arahkan ke website untuk login
4. pilih Audio & Video Recognition atau https://console.acrcloud.com/avr?region=ap-southeast-1
5. Pilih project dan pilih Audio & Video Recognition
6. Create project
7. isi project name bebas
8. pilih Recorded Audio (Audio captured via microphone or noisy audio files)
9. pilih ini Audio Fingerprinting & Cover Song (Humming) Identification
10. pilih buckets ACRCloud Music dan centang semua lalu confirm

NOTE: ini berlaku 14 hari, lakukan hal yang berulang kali. disarankan jangan spam atau terlalu ngasal.
*/
/*
import acrcloud from 'acrcloud';

let acr = new acrcloud({
    host: 'joajo818287&765',
    access_key: '#9ksjs52yyfdgjg6976',
    access_secret: 'isosj75581818373783djjhh'
});

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';
        
        if (/video|audio/.test(mime)) {
            let buffer = await q.download();
            await m.reply('_In progress, please wait..._');
            
            let { status, metadata } = await acr.identify(buffer);
            if (status.code !== 0) throw status.msg;

            let { title, artists, album, genres, release_date } = metadata.music[0];
            
            let txt = `*• Title:* ${title}${artists ? `\n*• Artists:* ${artists.map(v => v.name).join(', ')}` : ''}`;
            txt += `${album ? `\n*• Album:* ${album.name}` : ''}${genres ? `\n*• Genres:* ${genres.map(v => v.name).join(', ')}` : ''}\n`;
            txt += `*• Release Date:* ${release_date}`;
            
            conn.reply(m.chat, txt.trim(), m);
        } else {
            throw `Reply audio/video with command ${usedPrefix + command}`;
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Gagal mendeteksi lagu', m);
    }
};

handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.command = /^(whatmusic|whatsmusic|musikapa|whatmusik|detectmusic|deteksimusik|detectmusik)$/i;

export default handler;
*/
import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'
import { uploader } from 'serveruploader'
const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';
        
        if (/video|audio/.test(mime)) {
            let buffer = await q.download();
            await m.reply('_In progress, please wait..._');
            
        let media = await uploader(buffer)
        //m.reply(media)
		let json = await (await fetch(`https://api.botcahx.eu.org/api/tools/whatmusic?url=${media}&apikey=uovABsng`)).json()		
        conn.sendMessage(m.chat, { text: json.result }, { quoted: m })
        } else {
            throw `Reply audio/video with command ${usedPrefix + command}`;
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Gagal mendeteksi lagu', m);
    }
};

handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.command = /^(whatmusic|whatsmusic|musikapa|whatmusik|detectmusic|deteksimusik|detectmusik)$/i;

export default handler;

async function uploaderr(buffer) {
  let { ext, mime } = await fileTypeFromBuffer(buffer) || {}
  let blob = new Blob([buffer.toArrayBuffer()], { type: mime })
  let bodyForm = new FormData();
  bodyForm.append("file", buffer, "file." + ext);
  let res = await fetch("https://file.botcahx.eu.org/api/upload.php", {
    method: "post",
    body: bodyForm,
  });
  let data = await res.json();
  let resultUrl = data.result ? data.result.url : '';
  return resultUrl;
}