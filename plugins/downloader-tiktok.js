import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import { fileTypeFromStream } from 'file-type';
import { tiktokdl } from "@bochilteam/scraper";
//import cheerio from 'cheerio';
import tobytt from "@tobyg74/tiktok-api-dl";
const TiktokDownloader = tobytt.Downloader;

var handler = async (m, { conn, text, args, usedPrefix, command }) => {
//throw tobytt
  if (!args[0]) {
    throw `*[❗] Example: ${
      usedPrefix }tiktok https://www.tiktok.com/@tuanliebert/video/7313159590349212934?is_from_webapp=1&sender_device=pc\n Note: kalau ingin hanya di kirim satu aja, gunakan command : \n${usedPrefix}tiktoknowm = hanya di kirim video no wm\n ${usedPrefix}tiktokwm = hanya di kirim video dengan watermark\n${usedPrefix}tiktokaudio = untuk lagu\ndan ${usedPrefix}tiktokimg = kalau gambar atau tiktok slide\n`;
  }
conn.tiktok = conn.tiktok ? conn.tiktok : {};
if (m.sender in conn.tiktok) return !0
  const urltt = args[0];
  const sender = m.sender.split(`@`)[0];
let { key } = await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, video sedang di download...'})//ngalih isu
//conn.sendMessage(m.chat, {text: 'hai'}, { quoted: m })
//const key = isu.key
const listimage = [];
let gagal = false;
  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: '1⃣',
        key: m.key,
      },
    });
    /*await conn.reply(
      m.chat,
      "Tunggu sebentar kak, video sedang di download... server 1",
      m
    );*/
    conn.tiktok[m.sender] = true;
    const tiktokData = await tryServer1(urltt);

    if (!tiktokData) {
      throw "Gagal mendownload video!";
    }
    const videoURL = tiktokData.video.noWatermark;

    const videoURLWatermark = tiktokData.video.watermark;

    const infonya_gan = `Judul: ${tiktokData.title}\nUpload: ${
      tiktokData.created_at
    }\n\nSTATUS:\n=====================\nLike = ${
      tiktokData.stats.likeCount
    }\nKomen = ${tiktokData.stats.commentCount}\nShare = ${
      tiktokData.stats.shareCount
    }\nViews = ${tiktokData.stats.playCount}\nSimpan = ${
      tiktokData.stats.saveCount
    }\n=====================\n\nUploader: ${
      tiktokData.author.name || "Tidak ada informasi penulis"
    }\n(${tiktokData.author.unique_id} - https://www.tiktok.com/@${
      tiktokData.author.unique_id
    } )\nBio: ${tiktokData.author.signature}\nLagu: ${
      tiktokData.music.play_url
    }\nResolusi: ${tiktokData.video.ratio}\n`;
if (command == 'tiktoknowm' || command == 'ttnowm') { await conn.sendFile(
        m.chat,
        videoURL,
        "tiktok.mp4",
        (args[1] ? text.replace(urltt + ' ', '') : `Ini kak videonya\n\n${infonya_gan}`),
        m
      );
return !0 
}
if (command == 'tiktokwm' || command == 'ttwm') { await conn.sendFile(
        m.chat,
        videoURLWatermark,
        "tiktokwm.mp4",
        (args[1] ? text.replace(urltt, '') :`*Ini Versi Watermark nya*\n\n${infonya_gan}`),
        m
      );
return !0
}
if (command == 'tiktokaudio' || command == 'tiktokaud' || command == 'tiktoklagu' || command == 'ttaudio' || command == 'ttaud' || command == 'ttlagu') { await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: tiktokData.music.play_url 
}, 
mimetype: 'audio/mp4', fileName: `${tiktokData.music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: (tiktokData.music.title).replace("original sound", "suara asli"),
body: tiktokData.music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + tiktokData.music.title.replace("original sound", "suara asli"),
thumbnailUrl: tiktokData.music.cover_large || tiktokData.music.cover_medium || tiktokData.music.cover_thumb,
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
return !0
}
    if (videoURL || videoURLWatermark) {
      await conn.sendFile(
        m.chat,
        videoURL,
        "tiktok.mp4",
        (args[1] ? text.replace(urltt + ' ', '') : `Ini kak videonya\n\n${infonya_gan}`),
        m
      );

     /* 
      await conn.sendFile(
        m.chat,
        videoURLWatermark,
        "tiktokwm.mp4",
        `*Ini Versi Watermark*\n\n${infonya_gan}`,
        m
      );

      await conn.sendFile(
        m.chat,
        `${tiktokData.music.play_url}`,
        "lagutt.mp3",
        "ini lagunya",
        m
      );/*/
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: tiktokData.music.play_url 
}, 
mimetype: 'audio/mp4', fileName: `${tiktokData.music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: tiktokData.music.title.replace("original sound", "suara asli"),
body: tiktokData.music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + tiktokData.music.title.replace("original sound", "suara asli"),
thumbnailUrl: tiktokData.music.cover_large || tiktokData.music.cover_medium || tiktokData.music.cover_thumb,
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
/*      conn.reply(
        m.chat,
        "•⩊• Ini kak Videonya ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა\nDitonton yah ₍^ >ヮ<^₎",
        m
      );*/

    } else {
      throw "Tidak ada tautan video yang tersedia.";
    }
  } catch (error1) {
       await conn.sendMessage(m.chat, {
      react: {
        text: '2⃣️',
        key: m.key,
      },
    }); 
try {
    //const mainUrl = `https://dlpanda.com/id?url=${urltt}&token=G7eRpMaa`;
    //const backupUrl = `https://dlpanda.com/id?url=${urltt}&token51=G32254GLM09MN89Maa`;
    //const creator = 'Haliq0841';
    // Server 1 failed, try Server 2
                const res = await TiktokDownloader(urltt);
//throw res
                if (!res || (res.status !== 'success')) throw 'Gagal mendownload video'
                const { type, id, createTime, description, hashtag, author, statistics, music} = res.result;
                    const { playCount, downloadCount, shareCount, commentCount, diggCount, collectCount, forwardCount, whatsappShareCount, loseCount, loseCommentCount } = statistics;
                    const { uid, username, nickname, signature, region, avatarThumb, avatarMedium } = author;
                    const pesan = `Judul = ${description}\nView = ${playCount}\nLike = ${ diggCount }\nKomen = ${commentCount}\nShare = ${shareCount}\nDownload = ${downloadCount}\nSimpan = ${collectCount}\nUpload = ${createTime}\n\nInformasi Uploader:\nNama = ${ nickname}\n username = ${ username}\nID = ${uid}\n`;
                switch (type) {
                    case "video":
                    //const duration = res.result.duration? || 'Tidak Diketahui';
                    const { video } = res.result;
                    

if (command == 'tiktoknowm' || command == 'ttnowm') { await conn.sendFile(
        m.chat,
        video.playAddr[Math.floor(Math.random() * (video.playAddr).length)],
        "tiktok.mp4",
        (args[1] ? text.replace(urltt, '') :`Ini kak videonya\n\n${pesan}`),
        m
      );
return !0 
}
if (command == 'tiktokwm' || command == 'ttwm') { await conn.sendFile(
        m.chat,
        video.downloadAddr[Math.floor(Math.random() *  (video.downloadAddr).length)],
        "tiktokwm.mp4",
        (args[1] ? text.replace(urltt, '') :`*Ini Versi Watermark nya*\n\n${infonya_gan}`),
        m
      );
return !0
}
if (command == 'tiktokaudio' || command == 'tiktokaud' || command == 'tiktoklagu' || command == 'ttaudio' || command == 'ttaud' || command == 'ttlagu') { await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music.playUrl[0]
}, 
mimetype: 'audio/mp4', fileName: `${music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music.title.replace("original sound", "suara asli"),
body: music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music.title.replace("original sound", "suara asli"),
thumbnailUrl: music.coverlarge[Math.floor(Math.random() * music.coverlarge.length)] || music.coverMedium[Math.floor(Math.random() * music.coverMedium.length)] || music.coverThumb[Math.floor(Math.random() * music.coverThumb.length)],
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
return !0
}
      await conn.sendFile(
        m.chat,
        video.playAddr[Math.floor(Math.random() * (video.playAddr).length)],
        "tiktok.mp4",
        (args[1] ? text.replace(urltt, '') :`Ini kak videonya\n\n${pesan}`),
        m
      );

     /* 
      await conn.sendFile(
        m.chat,
        videoURLWatermark,
        "tiktokwm.mp4",
        `*Ini Versi Watermark*\n\n${infonya_gan}`,
        m
      );

      await conn.sendFile(
        m.chat,
        `${tiktokData.music.play_url}`,
        "lagutt.mp3",
        "ini lagunya",
        m
      );/*/
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music.playUrl[0]
}, 
mimetype: 'audio/mp4', fileName: `${music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music.title.replace("original sound", "suara asli"),
body: music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music.title.replace("original sound", "suara asli"),
thumbnailUrl: music.coverLarge[0] || music.coverMedium[0],
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
                        break;
                    case "image":
                        const { images } = res.result;
                        await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, sedang mengirim gambar', edit: key }); 
                        for (let i of images) {
            try {
                //await conn.sendFile(m.chat, i, '', null, m);
let jsncard = await conn.sendInter(m.chat, {
            media: { image: {url: i}, caption: pesan },
            createonly: true,
            hasMediaAttachment: true,
            footer: '©chitanda md',
            body: nickname + '\n@' + username,
            subtitle: '1',
            text: 'Tiktok image downloader',
            buttons: [{
                 "name": "cta_url",
                 "buttonParamsJson": `{"display_text":"url","url":"${i}","merchant_url":"${i}"}`
              }]
        }, m)
listimage.push(jsncard)
            } catch (e) {
                console.error(e);
                //m.reply('Terjadi error saat mengirim gambar, mencoba lagi...');
            };
        };
        await conn.sendInter(m.chat, {
    text: 'TIKTOK DOWNLOADER',
    hasMediaAttachment: false,
    footer: '©chitanda md',
    body: pesan,
    createonly: false,
    subtitle: '1',
    cards: listimage
}, m)
       //await m.reply(music.playUrl[0])
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music.playUrl[0]
}, 
mimetype: 'audio/mp4', fileName: `${music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music.title.replace("original sound", "suara asli"),
body: music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music.title.replace("original sound", "suara asli"),
thumbnailUrl: music.coverLarge[0] || music.coverMedium[0],
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
                        break;
            };
    } catch (error2) {
//return m.reply(JSON.stringify(error2))
      // Server 2 failed, try Server 3
      try {
      await conn.sendMessage(m.chat, {
      react: {
        text: '3⃣',
        key: m.key,
      },
    });
    throw "err"
      await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, video sedang di download... server 3', edit: key }); /*
        await conn.reply(
          m.chat,
          "Tunggu sebentar kak, video sedang di download... server 3",
          m
        );*/

        const tiktokData3 = await tryServer3(urltt);

        if (!tiktokData3) {
          throw "Gagal mendownload video!";
        }
        const { result } = tiktokData3;
        const { data  } = result;

        const {
          id,
          region,
          title,
          cover,
          origin_cover,
          duration,
          play,
          wmplay,
          size,
          wm_size,
          music,
          music_info,
          play_count,
          digg_count,
          comment_count,
          share_count,
          download_count,
          collect_count,
          create_time,
          author,
        } = data;
      
        //const musicInfo = tiktokData3.data.music_info;
        //const { play: musicPlay, title: musicTitle } = musicInfo;
      
        const sizeInMB = (sizeInBytes) => (sizeInBytes / (1024 * 1024)).toFixed(2);
      
        const sizeInMB_size = sizeInMB(size);
        const sizeInMB_wm_size = sizeInMB(wm_size);
        //const sizeInMB_hd_size = sizeInMB(hd_size);
      
        const pesan = `Judul = ${title}\nView = ${play_count}\nLike = ${ digg_count }\nKomen = ${comment_count}\nShare = ${share_count}\nDownload = ${download_count}\nSimpan = ${collect_count}\nUpload = ${create_time}\n\nInformasi Uploader:\nNama = ${ author.nickname} username = ${ author.unique_id}\nID = ${ author.id}`;
        const response = await fetch(data.play);
        const fileType = await fileTypeFromStream(response.body);
        if (!/video/.test(fileType.mime)) throw 'Ini bukan video'
        if (command == 'tiktoknowm' || command == 'ttnowm') { await conn.sendFile(
          m.chat,
          data.play,
          'tiktok3.mp4',
        (args[1] ? text.replace(urltt, '') :`*TANPA WATERMARK*\nUkuran: ${sizeInMB_size} MB\n\n${pesan}`),
          m
        );
return !0
}
        if (command == 'tiktokwm' || command == 'ttwm') { await conn.sendFile(
          m.chat,
          data.wmplay,
          'tiktokwm3.mp4',
        (args[1] ? text.replace(urltt, '') :`*Versi WATERMARK*\nUkuran: ${sizeInMB_wm_size} MB\n\n`),
          m
        ); 
return !0
}
        if (command == 'tiktokaudio' || command == 'tiktokaud' || command == 'tiktoklagu' || command == 'ttaudio' || command == 'ttaud' || command == 'ttlagu') { await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music 
}, 
mimetype: 'audio/mp4', fileName: `${music_info.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music_info.title.replace("original sound", "suara asli"),
body: music_info.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music_info.title.replace("original sound", "suara asli"),
thumbnailUrl: music_info.cover,
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
return !0
}
        await conn.sendFile(
          m.chat,
          data.play,
          'tiktok3.mp4',
        (args[1] ? text.replace(urltt, '') :`*TANPA WATERMARK*\nUkuran: ${sizeInMB_size} MB\n\n${pesan}`),
          m
        );/*
        await conn.sendFile(
          m.chat,
          data.wmplay,
          'tiktokwm3.mp4',
          `*Versi WATERMARK*\nUkuran: ${sizeInMB_wm_size} MB\n\n`,
          m
        );
        await conn.sendFile(
          m.chat,
          data.hdplay,
          'tiktokhd3.mp4',
          `*HD No Watermark (TANPA WATERMARK)*\nUkuran: ${sizeInMB_hd_size} MB\n\n${pesan}`,
          m
        );
        await conn.sendFile(
          m.chat,
          musicPlay,
          'tiktokmp3.mp3',
          `*MUSIC*\nJudul: ${musicTitle}`,
          m
        );*/
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music 
}, 
mimetype: 'audio/mp4', fileName: `${music_info.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music_info.title.replace("original sound", "suara asli"),
body: music_info.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music_info.title.replace("original sound", "suara asli"),
thumbnailUrl: music_info.cover,
renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
/*        await conn.reply(
          m.chat,
          "•⩊• Ini kak Videonya ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა\nDitonton yah ₍^ >ヮ<^₎",
          m
        );*/
      } catch (error3) {
        try {
      await conn.sendMessage(m.chat, {
      react: {
        text: '4⃣',
        key: m.key,
      },
    });
      await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, video sedang di download... server 4', edit: key });    /*
      await conn.reply(
        m.chat,
        "Tunggu sebentar kak, video sedang di download... server 2",
        m
      );*/
      const tiktokData2 = await tiktokdl(urltt);

      if (!tiktokData2.success) {
        throw "Gagal mendownload video!";
      }

      const { author, video } = tiktokData2;
      const { unique_id, nickname, avatar } = author;
      const { no_watermark, no_watermark_hd } = video;

      const avatarURL =
        avatar ||
        "https://i.pinimg.com/564x/56/2e/be/562ebed9cd49b9a09baa35eddfe86b00.jpg";

      const infonya_gan2 = `ID Unik: ${unique_id}\nNickname: ${nickname}`;

      await conn.sendFile(
        m.chat,
        avatarURL,
        "thumbnail.jpg",
        `Ini thumbnail videonya\n\n${infonya_gan2}`,
        m
      );
      await conn.sendFile(
        m.chat,
        no_watermark,
        "tiktok2.mp4",
        "Ini kak videonya dari Server 4",
        m
      );
      await conn.sendFile(
        m.chat,
        no_watermark_hd,
        "tiktokhd2.mp4",
        "Ini kak videonya dari Server 4 lebih hd",
        m
      );

      const audioURL2 = `suaratiktok.mp3`;
      await convertVideoToMp3(no_watermark, audioURL2);
      if (audioURL2) {
        await conn.sendFile(
          m.chat,
          mp3FileName,
          mp3FileName,
          `ini kak suaranya @${sender} versi MP3`,
          m
        );
        await fs.unlink(mp3FileName);
      }

      await conn.reply(
        m.chat,
        "•⩊• Ini kak Videonya ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა\nDitonton yah ₍^ >ヮ<^₎",
        m
      );
    } catch (error4) {
            //gagal = error4
            try {
                await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, video sedang di download... pada TiktokAPI ', edit: key });
                await conn.sendMessage(m.chat, {
      react: {
        text: '5⃣',
        key: m.key,
      },
    });
                const res = await TiktokDownloader(urltt, { version: "v1" });
                if (!res || !(res.status == 'success')) throw 'Gagal mendownload video'
                const { type, id, createTime, description, hashtag, author, statistics, music} = res.result;
                switch (type) {
                    case "video":
                    //const duration = res.result.duration? || 'Tidak Diketahui';
                    const { video } = res.result;
                    const { uid, username, nickname, signature, region, avatarLarger, avatarThumb, avatarMedium } = author;
                    const { playCount, downloadCount, shareCount, commentCount, likeCount, favoriteCount, forwardCount, whatsappShareCount, loseCount, loseCommentCount } = statistics;
                    const pesan = `Judul = ${description}\nView = ${playCount}\nLike = ${ likeCount }\nKomen = ${commentCount}\nShare = ${shareCount}\nDownload = ${downloadCount}\nSimpan = ${favoriteCount}\nUpload = ${createTime}\n\nInformasi Uploader:\nNama = ${ nickname}\n username = ${ username}\nID = ${uid}\nLink photo profile= ${ avatarLarger }`;
if (command == 'tiktoknowm' || command == 'ttnowm') { await conn.sendFile(
        m.chat,
        video[Math.floor(Math.random() * video.length)],
        "tiktok.mp4",
        (args[1] ? text.replace(urltt, '') :`Ini kak videonya\n\n${pesan}`),
        m
      );
return !0 
}
if (command == 'tiktokwm' || command == 'ttwm') { await conn.sendFile(
        m.chat,
        res.result.cover[Math.floor(Math.random() * res.result.cover.length)],
        "tiktokwm.mp4",
        (args[1] ? text.replace(urltt, '') :`*Ini Versi Watermark nya*\n\n${infonya_gan}`),
        m
      );
return !0
}
if (command == 'tiktokaudio' || command == 'tiktokaud' || command == 'tiktoklagu' || command == 'ttaudio' || command == 'ttaud' || command == 'ttlagu') { await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music.playUrl[Math.floor(Math.random() * music.playUrl.length)]
}, 
mimetype: 'audio/mp4', fileName: `${music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music.title.replace("original sound", "suara asli"),
body: music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music.title.replace("original sound", "suara asli"),
thumbnailUrl: music.coverlarge[Math.floor(Math.random() * music.coverlarge.length)] || music.coverMedium[Math.floor(Math.random() * music.coverMedium.length)] || music.coverThumb[Math.floor(Math.random() * music.coverThumb.length)],
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
return !0
}
      await conn.sendFile(
        m.chat,
        video[Math.floor(Math.random() * video.length)],
        "tiktok.mp4",
        (args[1] ? text.replace(urltt, '') :`Ini kak videonya\n\n${infonya_gan}`),
        m
      );

     /* 
      await conn.sendFile(
        m.chat,
        videoURLWatermark,
        "tiktokwm.mp4",
        `*Ini Versi Watermark*\n\n${infonya_gan}`,
        m
      );

      await conn.sendFile(
        m.chat,
        `${tiktokData.music.play_url}`,
        "lagutt.mp3",
        "ini lagunya",
        m
      );/*/
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music.playUrl[Math.floor(Math.random() * music.playUrl.length)]
}, 
mimetype: 'audio/mp4', fileName: `${music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music.title.replace("original sound", "suara asli"),
body: music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music.title.replace("original sound", "suara asli"),
thumbnailUrl: music.coverlarge[Math.floor(Math.random() * music.coverlarge.length)] || music.coverMedium[Math.floor(Math.random() * music.coverMedium.length)] || music.coverThumb[Math.floor(Math.random() * music.coverThumb.length)],
renderLargerThumbnail: true
      }
    }
  }, { quoted: m }); 
                        break;
                    case "image":
                        const { images } = res.result;
                        await m.reply("tunggu sebentar sedang mengirim gambar...");
                        for (let i of images) {
            try {
                await conn.sendFile(m.chat, i, '', null, m);
            } catch (e) {
                console.error(e);
                m.reply('Terjadi error saat mengirim gambar, mencoba lagi...');
            };
        };
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music.playUrl[Math.floor(Math.random() * music.playUrl.length)]
}, 
mimetype: 'audio/mp4', fileName: `${music.title}`, contextInfo: { externalAdReply: {
mediaType: 1,
title: music.title.replace("original sound", "suara asli"),
body: music.author,
sourceUrl: 'https://m.youtube.com/results?sp=mAEA&search_query=' + music.title.replace("original sound", "suara asli"),
thumbnailUrl: music.coverlarge[Math.floor(Math.random() * music.coverlarge.length)] || music.coverMedium[Math.floor(Math.random() * music.coverMedium.length)] || music.coverThumb[Math.floor(Math.random() * music.coverThumb.length)],
renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
                        break;
            };
        } catch (error5) {
        try {
            //gagal = error5
                        await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, video sedang di download... pada MusicalDown', edit: key });
                await conn.sendMessage(m.chat, {
      react: {
        text: '6⃣',
        key: m.key,
      },
    });
                const res = await TiktokDownloader(urltt, { version: "v3" });
                if (!res || !(res.status == 'success')) throw 'Gagal mendownload video'
                const { result } = res;
                const { type, author} = result;
                switch (type) {
                    case 'video':
                    let desc = (result.desc? result.desc : '_no caption_');
                    if (command == 'tiktoknowm' || command == 'ttnowm') {    
    let vidb = await conn.sendMessage(m.chat, { 
  video: 
  { 
    url: result.video_hd
}, 
mimetype: 'video/mp4', fileName: `tiktok.mp4`}, { quoted: m });
    if (!vidb) vidb = await conn.sendMessage(m.chat, { 
  video: 
  { 
    url: result.video2
}, 
mimetype: 'video/mp4', fileName: `tiktok.mp4`}, { quoted: m });
    if (!vidb) vidb = await conn.sendMessage(m.chat, { 
  video: 
  { 
    url: result.video1
}, 
mimetype: 'video/mp4', fileName: `tiktok.mp4`}, { quoted: m });
return !0 
}
if (command == 'tiktokwm' || command == 'ttwm') { await conn.sendFile(
        m.chat,
        result.video_watermark,
        "tiktokwm.mp4",
        `*Ini Versi Watermark nya*\n\n*${author.nickname}*\n${desc}`,
        m
      );
return !0
}
if (command == 'tiktokaudio' || command == 'tiktokaud' || command == 'tiktoklagu' || command == 'ttaudio' || command == 'ttaud' || command == 'ttlagu') { await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: result.music
}, 
mimetype: 'audio/mp4', fileName: `tiktok.mp3`}, { quoted: m });
return !0
}
/*
      await conn.sendFile(
        m.chat,
        (result.video_hd || result.video1 || result.video2),
        "tiktok.mp4",
        `Ini kak videonya\n\n*${author.nickname}*\n${desc}`,
        m
      ); */
    let vidb = await conn.sendMessage(m.chat, { 
  video: 
  { 
    url: result.video1
}, 
mimetype: 'video/mp4', fileName: `tiktok.mp4`}, { quoted: m });
    if (!vidb) vidb = await conn.sendMessage(m.chat, { 
  video: 
  { 
    url: result.video2
}, 
mimetype: 'video/mp4', fileName: `tiktok.mp4`}, { quoted: m });
    if (!vidb) vidb = await conn.sendMessage(m.chat, { 
  video: 
  { 
    url: result.video_hd
}, 
mimetype: 'video/mp4', fileName: `tiktok.mp4`}, { quoted: m });
     /* 
      await conn.sendFile(
        m.chat,
        result.video_watermark,
        "tiktokwm.mp4",
        `*Ini Versi Watermark nya*\n\n${infonya_gan}`,
        m
      );
      await conn.sendFile(
        m.chat,
        `${tiktokData.music.play_url}`,
        "lagutt.mp3",
        "ini lagunya",
        m
      );/*/
if (result.music) {
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: result.music
}, 
mimetype: 'audio/mp4', fileName: `tiktok.mp3`}, { quoted: m });
}
                        break;
                    case "image":
                        const { images } = res.result;
                        await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, sedang mengirim gambar', edit: key }); 
                        for (let i of images) {
            try {
                //await conn.sendFile(m.chat, i, '', null, m);
let jsncard = await conn.sendInter(m.chat, {
            media: { image: {url: i}, caption: pesan },
            createonly: true,
            hasMediaAttachment: true,
            footer: '©chitanda md',
            body: nickname + '\n@' + username,
            subtitle: '1',
            text: 'Tiktok image downloader',
            buttons: [{
                 "name": "cta_url",
                 "buttonParamsJson": `{"display_text":"url","url":"${i}","merchant_url":"${i}"}`
              }]
        }, m)
listimage.push(jsncard)
            } catch (e) {
                console.error(e);
                //m.reply('Terjadi error saat mengirim gambar, mencoba lagi...');
            };
        };
        await conn.sendInter(m.chat, {
    text: 'TIKTOK DOWNLOADER',
    hasMediaAttachment: false,
    footer: '©chitanda md',
    body: pesan,
    createonly: false,
    subtitle: '1',
    cards: listimage
}, m)
if (result.music) {
    await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: result.music
}, 
mimetype: 'audio/mp4', fileName: `tiktok.mp3`}, { quoted: m });
}
                        break;
                }
                } catch (error6) {
        try {
            await conn.sendMessage(m.chat, {text: 'Tunggu sebentar kak, video sedang di download... pada SSSTik', edit: key });
            await conn.sendMessage(m.chat, {
      react: {
        text: '7⃣',
        key: m.key,
      },
    });
                const res = await TiktokDownloader(urltt, { version: "v2" });
                if (!res || !(res.status == 'success')) throw 'Gagal mendownload video'
                const { result } = res;
                const { type, description, statistics, music } = result;
                const { likeCount, commentCount, shareCount} = statistics;
                switch (type) {
                    case 'video':
if (!result.video) throw 'gagal'
                    let desc = description;
                    let infonya = `*statistik:*\nSuka: ${likeCount}\nkomen: ${commentCount}\nshare: ${shareCount}`
                    if (command == 'tiktoknowm' || command == 'ttnowm') { await conn.sendFile(
        m.chat,
        result.video,
        "tiktok.mp4",
        (args[1] ? text.replace(urltt, '') :`Ini kak videonya\n\n*${author.nickname}*\n${desc}\n\n${infonya}`),
        m
      );
return !0 
}
if (command == 'tiktokwm' || command == 'ttwm') { 
throw 'Gak ada'
await conn.sendFile(
        m.chat,
        'iuu',
        "tiktokwm.mp4",
        (args[1] ? text.replace(urltt, '') :`*Ini Versi Watermark nya*\n\n*${author.nickname}*\n${desc}\n\n${infonya}`),
        m
      );
return !0
}
if (command == 'tiktokaudio' || command == 'tiktokaud' || command == 'tiktoklagu' || command == 'ttaudio' || command == 'ttaud' || command == 'ttlagu') { await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music
}, 
mimetype: 'audio/mp4', fileName: `tiktok.mp3`}, { quoted: m });
return !0
}
if (!result.video) throw 'gagal'
      await conn.sendFile(
        m.chat,
        result.video,
        "tiktok.mp4",
        `Ini kak videonya\n\n*${author.nickname}*\n${desc}\n\n${infonya}`,
        m
      );

     /* 
      await conn.sendFile(
        m.chat,
        result.video_watermark,
        "tiktokwm.mp4",
        `*Ini Versi Watermark nya*\n\n${infonya_gan}`,
        m
      );
      await conn.sendFile(
        m.chat,
        `${tiktokData.music.play_url}`,
        "lagutt.mp3",
        "ini lagunya",
        m
      );/*/
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music
}, 
mimetype: 'audio/mp4', fileName: `tiktok.mp3`}, { quoted: m });
                        break;
                    case "image":
                        const { images } = result;
                        await m.reply("tunggu sebentar sedang mengirim gambar...");
                        for (let i of images) {
            try {
                await conn.sendFile(m.chat, i, '', null, m);
            } catch (e) {
                console.error(e);
                m.reply('Terjadi error saat mengirim gambar, mencoba lagi...');
            };
        };
        await conn.sendMessage(m.chat, { 
  audio: 
  { 
    url: music
}, 
mimetype: 'audio/mp4', fileName: `tiktok.mp3`}, { quoted: m });
                        break;
                }
                } catch (error7) { 
                    gagal = error4
                }
        }
        //conn.reply(m.chat, `Error: ${error3}`, m);
        //gagal = error3
};
    };
      };
    };
  } finally {
					if (gagal) {
					m.reply('ada yg error:' + gagal + '\nSilahkan hubungi owner untuk memperbaiki nya');
                  //      await conn.sendMessage(m.chat, {text: 'ada yg error:' + gagal + '\nSilahkan hubungi owner untuk memperbaiki nya', edit: key },  { quoted: m });
                        await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key,
      },
    });
                        conn.sendMessage(m.chat, { delete: key })
					}
					delete conn.tiktok[m.sender];
				}
};

async function tryServer1(url) {
  // Try using tiklydown.eu.org API first
  try {
    let tiklydownAPI = `https://api.tiklydown.eu.org/api/download?url=${url}`;
    let response = await axios.get(tiklydownAPI, {
      headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cookie': 'cf_clearance=IDhpJ2RO8UDI40tXLI4g45ZZGDiET0lnWy6bO.4oLqQ-1706368220-1-ASlDi8PXO3c7Jk/wNqrgxTj4gCrY4qr6QonEpMmvW1EKPYICk//uDMJ+wFCv2LXuv7t26eyFoSyVEGbdV8dV2gQ=',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'If-None-Match': 'W/faa-OLjMXtR3QSf5fGpXMh35fxB63x0'
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
/*
async function tryServer3(url) {
  // Try using skizo.tech API as Server 3
  try {
    let skizoTechAPI = 'https://skizo.tech/api/tiktok';
    let response = await axios.post(skizoTechAPI, {
      'url': `${url}`
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
        'Accept': '*///*',
 /*       'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://tiktok.vihangayt.me/',
        'Content-Type': 'application/json',
        'Authorization': 'https://skizo.tech',
        'Origin': 'https://tiktok.vihangayt.me',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'TE': 'trailers'
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}*/

async function tryServer3(url) {
  try {
    const { data } = await axios.get(`https://tools.betabotz.eu.org/tools/tiktokdl?url=${url}`, {
      headers: {
        'accept': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    return 'Internal Server Error!';
  }
}

async function convertVideoToMp3(videoUrl, outputFileName) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .toFormat("mp3")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(outputFileName);
  });
}

handler.help = ["tiktok" , "tiktoknowm" , "tiktokwm" , "tiktokaudio"].map((v) => v + " <url>");
handler.tags = ["downloader"];
handler.exp = 500
handler.command = /^t(t|iktok(d(own(load(er)?)?|l))?|td(own(load(er)?)?|l))|t(t|iktok)(nowm|wm|aud(io)?|lagu)$/i;

export default handler;