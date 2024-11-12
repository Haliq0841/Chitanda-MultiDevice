import { 
  getOriginalUrl,
  search,
  downloads,
  downloads2,
  downloads3,
  downloadAlbum,
  downloadAlbum2,
  downloadAlbum3,
  downloadTrack,
  downloadTrack2,
  downloadTrack3
} from "@nechlophomeriaa/spotifydl"
import fetch from 'node-fetch'

var handler = async (m, { conn, args, text, usedPrefix, command }) => {
    switch (command) {
        case "dlspotify":
        case "sdownloader":
        case "spotifydownloader":
        case "spotifydownload":
        case "spotifydown":
        case "spotifydl":
        case "spotify":
        case "splay":
        case "spotifyplay":
        case "spotify":
        case "downloadspotify":
        case "laguspotify":
        case "spotifydown":
        case "downspotify":
        {
            if (!text) throw "masukkan judul yg ingin di cari atau url spotify";
            try {
            await conn.sendMessage(m.chat, {
      react: {
        text: '🔍',
        key: m.key,
      },
    });
            let downTrack
            try {
              downTrack = await downloadTrack(text)
              if (!downTrack.status) throw 'Fitur sedang tidak aktif atau dalam perbaikan'
            } catch (e) {
              try {
                downTrack = await downloadTrack2(text)
                if (!downTrack.status) throw 'Fitur sedang tidak aktif atau dalam perbaikan'
              } catch (e) {
                try {
                  downTrack = await downloadTrack3(text)
                  if (!downTrack.status) throw 'Fitur sedang tidak aktif atau dalam perbaikan'
                } catch (e) {
                  throw 'Terjadi kesalahan saat mencari'
                }
              }
            }
            
            if (!downTrack) throw 'Terjadi kesalahan saat mencari'
            if (!downTrack.status) throw 'Fitur sedang tidak aktif atau dalam perbaikan'
            const { title, artists, duration, popularity, url, album, imageUrl, audioBuffer } = downTrack;
            await conn.sendMessage(m.chat, {
      react: {
        text: '🎶',
        key: m.key,
      },
    });
            const caption = `╭──── 〔S P O T I F Y〕 ─⬣
⬡ Judul: ${title}
⬡ Artis: ${artists}
⬡ Durasi: ${duration}
⬡ Popularitas: ${popularity}%
⬡ *Album:* 
> Nama: ${album.name}
> Type: ${album.type}
> tracks: ${album.tracks}
> Tanggal Rilis: ${album.releasedDate}
⬡ Link: ${url}
╰────────⬣`;
            await conn.reply(m.chat, caption, m, { contextInfo: {
          externalAdReply :{
    mediaUrl: imageUrl,
    mediaType: 2,
    title: title,
    body: artists,
    thumbnail: await(await fetch(imageUrl)).buffer(),
    sourceUrl: url
     }}
  });
            await conn.sendMessage(m.chat, { 
  audio: audioBuffer, 
mimetype: 'audio/mp4', fileName: `${title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: title,
body: artists,
sourceUrl: url,
thumbnailUrl: imageUrl,
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
            } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key,
      },
    });
        throw `Ada yg error:\n${error}`
    }
        }
        break;
        case 'carispotify':
        case 'spotifysearch':
        case 'spsearch':
        {
        if (!text) throw 'masukkan judul yg ingin di cari'
        try {
        await conn.sendMessage(m.chat, {
      react: {
        text: '🔍',
        key: m.key,
      },
    });
        const searchTrackk = await fetch(`https://tools.betabotz.eu.org/tools/spotify-search?q=${text}`) //
        const searchTrack = await searchTrackk.json()
        if (!searchTrack.result.status) throw 'Gagal mencari'
        //console.log(searchTrack)
        for (const l of searchTrack.result.data) {
            const caption = `*Judul:* ${l.title}
*Durasi:* ${l.duration}
*Popularitas:* ${l.popularity}
*Artis:* ${l.artist}
*Link:* ${l.url}
*Cuplikan:* ${l.preview}`
            await conn.reply(m.chat, caption, m, { contextInfo: {
          externalAdReply :{
    mediaUrl: l.preview,
    mediaType: 2,
    title: l.title,
    body: l.artist,
    thumbnail: await(await fetch(l.thumbnail)).buffer(),
    sourceUrl: l.preview
     }}
  });
        }
await conn.sendMessage(m.chat, {text: `_Note: Untuk mendengar cuplikan silahkan ketik ${usedPrefix}get urlcuplikan_\n> Contoh: ${usedPrefix}get ${searchTrack.result.data[0].preview}\n_Untuk mendownload lagu silahkan ketik ${usedPrefix}spotify url_\n> Contoh: ${usedPrefix}spotify ${searchTrack.result.data[0].url}`})
        } catch (error) {
        await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key,
      },
    });
      throw 'Ada yang error coba lagi lain kali'
}
}
       break;
       case "playlist":
       case "playlistdown":
       case "playlistdownload":
       case "playlistdownloader":
       case "playlistspotify":
       case "spotifyplaylist":
       case "albumspotify":
       case "spotifyalbum":
       {
           if (!text) throw "Masukkan url playlist spotify yang mau di download"
           try {
                await conn.sendMessage(m.chat, {
               react: {
        text: '▶️',
        key: m.key,
      },
    });
               await m.reply('Tunggu Sebentar Playlist Sedang di unduh dan di kirim')
               const downAlbums = await downloadAlbum(text);
               if (!downAlbums) throw "Tidak dapat terhubung ke server"
               const { trackList } = downAlbums;
               const meta = downAlbums.metadata;
               await conn.sendMessage(m.chat, {
text: `*Nama playlist:* ${meta.title}\n*Artis:* ${meta.artists}\n*Tanggal Rilis:* ${meta.releaseDate}`,
contextInfo: {
externalAdReply: { 
title: meta.title,
body: meta.artists,
thumbnailUrl: meta.cover,
sourceUrl: text,
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m});
               const salam = [
"🔽",
"🔼",
"▶️",
"◀️"
]
               for (const { success, metadata, audioBuffer } of trackList) {
                               await conn.sendMessage(m.chat, {
      react: {
        text: salam.getRandom(),
        key: m.key,
      },
    }); 
if (success) {
                               await conn.sendMessage(m.chat, { 
  audio: audioBuffer, 
mimetype: 'audio/mp4', fileName: `${metadata.title}`, contextInfo: { externalAdReply: { // Bagian ini sesuka kalian berkreasi :'v
                                        showAdAttribution: true,
					title: metadata.title,
					body: metadata.artists,
					mediaUrl: metadata.url,
					description: 'Chitanda bot by Haliq0841',
					previewType: "PHOTO",
					thumbnail: await (await fetch(metadata.imageUrl || metadata.cover)).buffer(),
					sourceUrl: metadata.url		
				}
    }
  });
               }
               }
               await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key,
      },
    });
           } catch (error) {
        await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key,
      },
    });
      throw `Ada yg error:\n ${error}`
}
       }
       break;
    }
}

handler.help = ['spotify', 'spotifydl', 'spotifysearch', 'splay', 'spotifyalbum', ];
handler.tags = ["downloader"];
handler.command = /^((cari|dl|lagu|album|down(load(er)?)?|play)?spotify(dl|play|album|down(load(er)?)?|search|playlist)?|s(play|album|psearch)|playlist(down(lad(er)?)?|spotify)?)$/i;
export default handler;