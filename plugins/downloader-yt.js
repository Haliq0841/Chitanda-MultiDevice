import fs from 'fs';
import fsp from 'fs/promises'
import ytdl from '@distube/ytdl-core';
import { exec } from 'child_process';
import { promisify } from 'util';
import NodeID3 from 'node-id3';
import ffmpeg from 'fluent-ffmpeg';
//import srt2vtt from 'srt-to-vtt';
//import { Readable } from 'stream';
import path, { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique folder names
import xml2js from 'xml2js';
import striptags from 'striptags'
import axios from 'axios';
import yts from 'yt-search'
const convertSec = (sec) => {
  var hours = Math.floor(sec / 3600)
  hours >= 1 ? (sec = sec - hours * 3600) : (hours = "00")
  var min = Math.floor(sec / 60)
  min >= 1 ? (sec = sec - min * 60) : (min = "00")
  sec < 1 ? (sec = "00") : void 0
  min.toString().length == 1 ? (min = "0" + min) : void 0
  sec.toString().length == 1 ? (sec = "0" + sec) : void 0
  return hours + ":" + min + ":" + sec
}
const parser = new xml2js.Parser();
// Cookie dan agen untuk ytdl-core
//let cookies = await fsp.readFile(path.join(__dirname(), 'cookie.json'), 'utf8');
//cookies = JSON.parse(cookies);
let cookies = JSON.parse((await conn.getFile('cookie.json')).data);
const agentOptions = {
  pipelining: 5,
  maxRedirections: 0
  //localAddress: "127.0.0.1",
};
const agent = await ytdl.createAgent(cookies, agentOptions);
const execPromise = promisify(exec);

var handler = async (m, { conn, args, command, text, usedPrefix }) => {
  const tmpDir = path.join(__dirname(), 'tmp', uuidv4()); // Ensure tmpDir is defined
    fs.mkdirSync(tmpDir, { recursive: true }); // Create the directory
  if (command == 'yt' && text) {
    const regex = /(https?:\/\/(www\.)?(youtube\.com|youtu\.?be)\/[^\s]+)/g;
    const urls = text.match(regex);
    if (!urls) command = 'play';
   }
try {
    
  switch (command) {
    case "play":
    case "ytplay":
    case "youtubeplay": {
      const tempAudioFile = path.join(tmpDir, 'temp_audio.webm'); // File sementara
      const audioFile = path.join(tmpDir, 'audio.mp3');
      fs.createWriteStream(tempAudioFile);
      fs.createWriteStream(audioFile);
      if (!text) throw `Masukkan mau cari apa? \n\ncontoh : ${usedPrefix + command} Yasashisa no riyuu`;

      let pemisah = '|♡♡♡|';
      let [judul, numo] = text.split(pemisah);

      await conn.sendMessage(m.chat, {
        react: {
          text: '🔍',
          key: m.key,
        },
      });

      let search = await yts(judul);
      let num = 0;
      if (numo) num += parseInt(numo);
      let vid = search.videos[num];

      if (!search) throw 'Tidak Ditemukan';

      let { title, thumbnail, timestamp, views, ago, url } = vid;
      let caption = `╭──── 〔 Y O U T U B E 〕
• Judul: ${title}
• Durasi: ${timestamp}
• Views: ${views}
• Upload: ${ago}
• Link: ${url}`;

      await conn.sendInter(m.chat, {
        media: { image: { url: thumbnail }, caption: 'Hasil pencarian dari' + judul },
        createonly: false,
        hasMediaAttachment: false,
        footer: '©chitanda MD',
        body: caption,
        subtitle: '1',
        text: '',
        buttons: [
          {
            "name": "cta_copy",
            "buttonParamsJson": `{"display_text":"salin url","id":"123456789","copy_code":"${url}"}`
          },
          {
            "name": "quick_reply",
            "buttonParamsJson": `{"display_text":"Download mp4","id":"${usedPrefix}ytmp4 ${url}"}`
          },
          {
            "name": "quick_reply",
            "buttonParamsJson": `{"display_text":"Next","id":"${usedPrefix}play ${judul}${pemisah}${num + 1}"}`
          }
        ]
      }, m);
      await conn.sendMessage(m.chat, {
        react: {
          text: '📥',
          key: m.key,
        },
      });
      try {
        await downloadAudio(url, tempAudioFile, audioFile);
        let doc = {
          audio: {
            url: audioFile,
          },
          mimetype: 'audio/mpeg',
          fileName: `${title}.mp3`,
        }; 
        await conn.sendMessage(m.chat, doc, { quoted: m });
      } catch (err) {
        //console.error(`Terjadi kesalahan saat mengunduh audio:\n${err}`);
        throw `Terjadi kesalahan saat mengunduh audio:\n${err}`;
      }
      await conn.sendMessage(m.chat, {
        react: {
          text: '🎵',
          key: m.key,
        },
      });
    }
    break;
    case "ytmp3":
    case "getaud":
    case "yta" :
    case "getaud": {
      if (!args[0]) throw `Masukkan link`;
      const regex = /(https?:\/\/(www\.)?(youtube\.com|youtu\.?be)\/[^\s]+)/g;
      const urls = text.match(regex);
      if (urls.length < 1) throw `Masukkan link`;
      await conn.sendMessage(m.chat, {
        react: {
          text: '📥',
          key: m.key,
        },
      });
      const { videoInfo } = await listFormats(urls[0]);
      const { url, title, duration, description, author, releaseDate, thumbnailUrl } = videoInfo;
      const tempAudioFile = path.join(tmpDir, 'temp_audio.webm'); // File sementara
      const audioFile = path.join(tmpDir, 'audio.mp3');
      fs.createWriteStream(tempAudioFile);
      fs.createWriteStream(audioFile);
      await downloadAudio(url, tempAudioFile, audioFile);
      let doc = {
        document: {
          url: audioFile,
        },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        jpegThumbnail: await (await conn.getFile(thumbnailUrl)).data,
        caption: description
      };
      await conn.sendMessage(m.chat, {
        react: {
          text: '✅',
          key: m.key,
        },
      });
      await conn.sendMessage(m.chat, doc, { quoted: m });
    }
    break;
    case "yt":
    case "ytmp4":
    case "getvid" :
    case "youtubemp4": {
      if (!args[0]) throw `Masukkan link`;
      const regex = /(https?:\/\/(www\.)?(youtube\.com|youtu\.?be)\/[^\s]+)/g;
      const urls = text.match(regex);
      if (urls.length < 1) throw `Masukkan link`;
      let pemisah = '|';
      let [, resolution] = text.split(pemisah);
      const { videoInfo, formats } = await listFormats(urls[0]);
      const { url, title, duration, description, author, releaseDate, thumbnailUrl } = videoInfo;
      let selectedFormat = formats.video.find(item => item.itag === parseInt(resolution))
      if (!resolution || !selectedFormat) {
        const row = formats.video.map(item => ({
          "header": item.data.container,
          "title": item.resolution,
          "description": item.type,
          "id": `${usedPrefix}${command} ${urls[0]}|${item.itag}`,
          }))
          let thumb = await(await conn.getFile(thumbnailUrl)).data
          let caption = `╭──── 〔 Y O U T U B E 〕
• Judul: ${title}
• Durasi: ${convertSec(duration)}
• author: ${author}
• Upload: ${releaseDate}
• Link: ${url}

╰───────────────`
          conn.sendInter(m.chat, {
            media: { image: thumb},
            createonly: false,
            hasMediaAttachment: false,
            footer: 'Pilih resolusinya kak',
            body: caption,
            subtitle: description,
            text: '',
            buttons: [ {
                "name": "single_select",
                "buttonParamsJson": `{"title":"Klik di sini","sections":[{"title":"pilih Resolusi nya kak","rows":${JSON.stringify(row)}}]}`
              }] 
        }, m)
        return;
      }
      await conn.sendMessage(m.chat, {
        react: {
          text: '📥',
          key: m.key,
        },
      });
      let { key } = await conn.sendMessage(m.chat, {text: 'Mengunduh video...'})
      try {
        const videoFile = path.join(tmpDir, 'video.' + selectedFormat.data.container);
        const tempAudioFile = path.join(tmpDir, 'temp_audio.webm'); // File sementara
        const audioFile = path.join(tmpDir, 'audio.' + (selectedFormat.data.container === 'webm' ? 'opus' : 'aac') );
        let finalOutputFile = path.join(tmpDir, 'output.' + selectedFormat.data.container);
        fs.createWriteStream(videoFile);
        fs.createWriteStream(tempAudioFile);
        fs.createWriteStream(audioFile);
        fs.createWriteStream(finalOutputFile);
        const subtitleLang = 'id'; // Bahasa subtitle default
    
        // Unduh video
        await downloadVideo(url, selectedFormat.itag, videoFile);
        await conn.sendMessage(m.chat, {text: 'Mengunduh Audio...', edit: key });
        // Unduh audio dan konversi ke MP3
        const bestAudioFormat = await getBestAudioFormat(url);
        if (bestAudioFormat) {
          await downloadAudio(url, tempAudioFile, audioFile , selectedFormat.data.container === 'webm' ? 'webm' : 'aac');
        }
        selectedFormat.data.url = url;
        // Gabungkan video dan audio
        await conn.sendMessage(m.chat, {text: 'Menggabungkan Video, Audio dan Subtitle...', edit: key });
        if (fs.existsSync(videoFile) && fs.existsSync(audioFile)) {
          await mergeVideoAndAudio(videoFile, audioFile, finalOutputFile, selectedFormat.data);
        }
        /*
        // Unduh dan gabungkan subtitle
        await conn.sendMessage(m.chat, {text: 'Mengunduh Subtitle...', edit: key });
        const subtitleFile = await downloadSubtitle(url, subtitleLang);
        if (subtitleFile && selectedFormat.data.container === 'mp4') {
          await conn.sendMessage(m.chat, {text: 'Menggabungkan subtitle...', edit: key });
          let withSubtitleOutputFile = path.join(tmpDir, 'outputwithsubtitle.' + selectedFormat.data.container);
          fs.createWriteStream(withSubtitleOutputFile);
          try {
          await new Promise((resolve, reject) => {
            ffmpeg(finalOutputFile)
            .outputOptions('-c:v libx264') // video codec encoding ulang
            .outputOptions('-c:a copy') // Copy audio codec tanpa encoding ulang
            .outputOptions('-c:s mov_text') // Mengatur codec subtitle agar kompatibel dengan mp4
            .outputOptions('-metadata:s:s:0 language=id') // Set bahasa subtitle (opsional)
            .outputOptions(`-vf subtitles=${subtitleFile}`) // Menambahkan file subtitle vtt
            .on('start', (cmd) => {
              console.log(`Memulai proses: ${cmd}`);
            })
            .on('error', (err) => {
              console.log(`Terjadi error: ${err.message}`);
              reject(err);
            })
            .on('end', () => {
              console.log('Proses selesai!');
              resolve();
            })
            .save(withSubtitleOutputFile);
              });
            } catch (error) {
              console.error(error);
            }
          finalOutputFile = withSubtitleOutputFile;
          await fsp.unlink(subtitleFile); // Hapus file subtitle
        }
        */
        // Kirim video

// ... existing code ...

        try {
  // ... existing code ...

  // Check the size of the final output file
          const stats = fs.statSync(finalOutputFile);
          const fileSizeInBytes = stats.size;
          const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

          console.log(`File size: ${fileSizeInMB} MB`);

          if (fileSizeInMB > 999 ) {
            // Handle the case where the file size exceeds 99 MB
            await conn.sendMessage(m.chat, { text: `Ukuran video terlalu besar (${fileSizeInMB} MB). Tidak dapat dikirim.`, edit: key });
          } else if (fileSizeInMB > 54 ) {
            await conn.sendMessage(m.chat, {text: `Ukuran video: ${fileSizeInMB} MB.\nMengirim video sebagai document...`, edit: key });
    // Handle the case where the file size exceeds 
            await conn.sendMessage(m.chat, { document: { url: finalOutputFile }, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: description, jpegThumbnail: await (await conn.getFile(thumbnailUrl)).data });
          } else {
    // Kirim video
            await conn.sendMessage(m.chat, {text: `Ukuran video: ${fileSizeInMB} MB.\nMengirim video...`, edit: key });
            if (selectedFormat.data.container === 'mp4') {
              await conn.sendMessage(m.chat, { video: { url: finalOutputFile }, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: description, jpegThumbnail: await (await conn.getFile(thumbnailUrl)).data });
            } else {
              await conn.sendMessage(m.chat, { document: { url: finalOutputFile }, mimetype: selectedFormat.data.mimeType.split(';')[0], fileName: `${title}.${selectedFormat.data.container}`, caption: description, jpegThumbnail: await (await conn.getFile(thumbnailUrl)).data });
            }
          }
        } catch (err) {
          throw 'Error saat mengirim video:\n' + err;
        }

        // Hapus file sementara
        fs.unlinkSync(videoFile);
        fs.unlinkSync(audioFile);
        fs.unlinkSync(tempAudioFile);
    
      } catch (err) {
        throw 'Error saat mengunduh video:\n' + err;
      }
    }
  }
} catch (e) {
  throw e
} finally {
  await fsp.rm(tmpDir, { recursive: true });
}
}

handler.tags = ['downloader'];
handler.help = ['yt' , 'play', 'ytplay', 'youtubeplay', 'ytlist', 'youtubelist', 'ytl', 'yta', 'ytmp3', 'getaud', 'youtubemp3', 'yts', 'youtubesearch', 'getvid', 'ytmp4', 'youtubemp4'];
handler.command = ['yt' , 'play', 'ytplay', 'youtubeplay', 'ytlist', 'youtubelist', 'ytl', 'yta', 'ytmp3', 'getaud', 'youtubemp3', 'yts', 'youtubesearch', 'getvid', 'ytmp4', 'youtubemp4'];
handler.limit = true;

export default handler;
// Fungsi untuk menulis tag ID3 ke file MP3
async function writeTags(file, tags) {
  try {
    await NodeID3.write(tags, file);
    console.log('ID3 tags added successfully.');
  } catch (err) {
    console.error('Error writing ID3 tags:', err);
  }
}


// Fungsi untuk menampilkan format yang tersedia
async function listFormats(url) {
  try {
    const info = await ytdl.getInfo(url, { agent });
    const formats = info.formats;
    const videoFormats = formats.filter(format => format.hasVideo);
    const audioFormats = formats.filter(format => format.hasAudio);
    const videoFormatsDetails = videoFormats.map((format) => ({
      itag: format.itag,
      resolution: format.qualityLabel || 'N/A',
      audio: format.audioBitrate || 'N/A',
      type: format.mimeType,
      data: format
    }));

    const audioFormatsDetails = audioFormats.map((format) => ({
      itag: format.itag,
      bitrate: format.audioBitrate || 'N/A',
      type: format.mimeType,
      data: format
    }));

    const formatDetails = {
      video: videoFormatsDetails,
      audio: audioFormatsDetails
    };

    const videoInfo = {
      url: url,
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      description: info.videoDetails.shortDescription,
      author: info.videoDetails.author.name,
      releaseDate: info.videoDetails.publishDate,
      thumbnailUrl: info.videoDetails.thumbnails[0].url // Mengambil URL thumbnail pertama
    };

    return {
      videoInfo: videoInfo,
      formats: formatDetails
    };
  } catch (err) {
    console.error('Error fetching video info:', err);
    throw err;
  }
}

// Fungsi untuk mengunduh video
async function downloadVideo(url, format, outputFile) {
  console.log('Mengunduh video...');
  await new Promise((resolve, reject) => {
  ytdl(url, { format: format, agent })
    .pipe(fs.createWriteStream(outputFile))
    .on('finish', () => {
      console.log(`Video berhasil diunduh: ${outputFile}`);
      resolve();
    })
    .on('error', (err) => {
      console.error('Error downloading video:', err);
      reject(err);
    });
  });
}

// Fungsi untuk mengunduh audio
async function downloadAudio(url, tempFile, outputFile, type = 'mp3') {
  console.log('Mengunduh audio...');
  await new Promise((resolve, reject) => {
  ytdl(url, { filter: 'audioonly', agent })
    .pipe(fs.createWriteStream(tempFile))
    .on('finish', resolve)
    .on('error', reject);
  })
    if (type === "webm") {
      await new Promise((resolve, reject) => {
        ffmpeg(tempFile)  // File input dalam format webm
          .audioCodec('libopus')  // Menggunakan codec Opus
          .output(outputFile)  // Output dalam format Opus
          .on('end', () => {
            console.log('Konversi ke Opus selesai');
            resolve();
          })
          .on('error', (err) => {
            console.log('Terjadi kesalahan: ' + err.message);
            reject(err);
          })
          .run();
      })
    } else if (type === "aac") {
      await new Promise((resolve, reject) => {
        ffmpeg(tempFile)
        .audioCodec('aac') // Menentukan codec AAC
        .on('start', (commandLine) => {
          console.log('FFmpeg process started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Konversi selesai!');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error:', err.message);
          reject(err);
        })
        .save(outputFile);
        })  
    } else if (type === "mp3") {
    try {
      await new Promise((resolve, reject) => {
      ffmpeg(tempFile)
          .audioBitrate(384)
          .toFormat('mp3')
          .save(outputFile)
          .on('end', resolve)
          .on('error', reject);
        })
      // Menambahkan tag ID3
      const info = await ytdl.getInfo(url, { agent });
      const imageBuffer = await fetch(info.videoDetails.thumbnails[0].url).then((res) => res.buffer())
      await fsp.writeFile("cover-yt.jpg", imageBuffer)
      const tags = {
          title: info.videoDetails.title,
          artist: info.videoDetails.author.name,
          album: 'Chitanda MD',
          APIC: __dirname() + "/cover-yt.jpg",
          image: {
            description: "Cover Image",
            imageBuffer: imageBuffer
          }
      };
      await writeTags(outputFile, tags);
      //fs.unlinkSync(tempFile); // Hapus file sementara
     } catch (err) {
      console.error('Error converting audio to MP3:', err);
     }
    }
}

// Fungsi untuk mendapatkan format audio terbaik berdasarkan bitrate
async function getBestAudioFormat(url) {
  try {
    const info = await ytdl.getInfo(url, { agent });
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

    // Pilih format dengan bitrate tertinggi
    const bestFormat = audioFormats.reduce((max, format) => {
      return format.audioBitrate > max.audioBitrate ? format : max;
    }, { audioBitrate: 0 });

    return bestFormat;
  } catch (err) {
    console.error('Error fetching video info:', err);
  }
}

// Fungsi untuk menggabungkan video dan audio
async function mergeVideoAndAudio(videoFile, audioFile, outputFile , videoData ) {
  console.log('Menggabungkan video dan audio...');
  const subtitleFile = await downloadSubtitle(videoData.url, 'id');
  const ffmpeg_config = ['-c:a copy', '-c:v ' + videoData.codecs === 'vp9' ? 'libvpx' : 'copy']
  const ffmpeg_config_subs = [
    '-c:v copy', // Mengonversi video dengan codec x264
    '-c:a copy', // Menyalin audio tanpa perubahan
    '-threads 1',
    '-preset ultrafast',
    `-scodec mov_text`,
    `-vf subtitles=${path.resolve(subtitleFile)}`,
  ]
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoFile)
      .input(audioFile)
      //.videoCodec(videoData.codecs === 'vp9' ? 'libvpx' : 'copy') // Salin codec video asli
      .outputOptions(subtitleFile && videoData.container === 'mp4'? ffmpeg_config_subs : ffmpeg_config)      //.audioCodec('copy') // Salin codec audio asli
      .format(videoData.container)
      .save(outputFile)
      .on('start', (commandLine) => {
        console.log('Spawned FFmpeg with command: ' + commandLine);
      })
      .on('end', () => {
        resolve();
        console.log('Proses penggabungan selesai.');
      })
      .on('error', (err, stdout, stderr) => {
        reject(err);
        console.error('Terjadi kesalahan: ' + err.message);
        console.error('FFmpeg stdout: ' + stdout);
        console.error('FFmpeg stderr: ' + stderr);
      });
  });
}



// Fungsi untuk mengonversi detik ke format WebVTT (hh:mm:ss.mmm)
function convertToVttTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(6, '0')}`;
}

// Fungsi utama untuk membaca buffer, mengonversi TTML ke WebVTT, dan menulis hasil ke file
async function convertTtmlURLToFile(subtitleUrl, outputFilePath) {
    try {
      const response = await fetch(subtitleUrl);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const ttmlData = await response.text();
        const result = await new Promise((resolve, reject) => {
            parser.parseString(ttmlData, (err, parsedResult) => {
                if (err) return reject(err);
                resolve(parsedResult);
            });
        });

        // Konversi TTML ke WebVTT
        let vttData = 'WEBVTT\n\n'; // Header WebVTT

        result.transcript.text.forEach((cue, index) => {
            const start = parseFloat(cue.$.start);
            const duration = parseFloat(cue.$.dur);
            const end = start + duration;
            const rawText = cue._;

            // Hapus tag HTML dengan striptags
            const cleanText = striptags(rawText);

            vttData += `${index + 1}\n`;
            vttData += `${convertToVttTime(start)} --> ${convertToVttTime(end)}\n`;
            vttData += `${cleanText}\n\n`;
        });

        // Simpan hasil WebVTT ke file
        await fs.promises.writeFile(outputFilePath, vttData);

        console.log(`TTML berhasil dikonversi ke WebVTT dan disimpan ke ${outputFilePath}`);
    } catch (err) {
        console.error("Terjadi kesalahan:", err);
    }
}

// Contoh penggunaan
//convertTtmlBufferToFile('subtitle.ttml', 'subtitle.vtt');

// Fungsi untuk mengunduh subtitle
async function downloadSubtitle(url, lang = 'id') {
  try {
    const info = await ytdl.getInfo(url, { agent });
    let subtitleTrack = info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks.find(track => track.languageCode === lang);
    if (!subtitleTrack) subtitleTrack = info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks.find(track => track.languageCode === 'en');
    if (!subtitleTrack) {
      console.log('Subtitle not found for the selected language.');
      return null;
    }

    const subtitleUrl = subtitleTrack.baseUrl;
    //const subtitleData = await (await fetch(subtitleUrl)).text();
    //const vttData = await srt2vtt(subtitleData);
    const subtitleFile = 'subtitles.vtt';
    await convertTtmlURLToFile(subtitleUrl, subtitleFile)
  

    return subtitleFile;
  } catch (err) {
    console.error('Error downloading subtitle:', err);
  }
}

// Fungsi utama untuk menjalankan semua proses
async function main(url, format, subtitleLang = 'id') {
  const tmpDir = path.join(__dirname, 'tmp', uuidv4());
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const videoFile = path.join(tmpDir, 'video.mp4');
    const tempAudioFile = path.join(tmpDir, 'temp_audio.webm'); // File sementara
    const audioFile = path.join(tmpDir, 'audio.mp3');
    const finalOutputFile = path.join(tmpDir, 'output.mp4');

    // Unduh video
    await downloadVideo(url, format, videoFile);

    // Unduh audio dan konversi ke MP3
    const bestAudioFormat = await getBestAudioFormat(url);
    if (bestAudioFormat) {
      await downloadAudio(url, tempAudioFile, audioFile);
    }

    // Gabungkan video dan audio
    if (fs.existsSync(videoFile) && fs.existsSync(audioFile)) {
      await mergeVideoAndAudio(videoFile, audioFile, finalOutputFile);
    }

    // Unduh dan gabungkan subtitle
    const subtitleFile = await downloadSubtitle(url, subtitleLang);
    if (subtitleFile) {
      await new Promise((resolve, reject) => {
            ffmpeg()
              .input(finalOutputFile)
              .input(subtitleFile)
              .outputOptions('-c copy', '-c:s mov_text')
              .save(finalOutputFile)
              .on('end', () => {
                resolve();
              })
              .on('error', (err) => {
                reject(err);
              });
          });
      await fsp.unlink(subtitleFile); // Hapus file subtitle
    }

    // Hapus file sementara
    fs.unlinkSync(videoFile);
    fs.unlinkSync(audioFile);
    fs.unlinkSync(tempAudioFile);

  } catch (err) {
    console.error('Error in main function:', err);
  } finally {
    // Hapus folder sementara
    fs.rmdirSync(tmpDir, { recursive: true });
  }
}

// URL video YouTube yang ingin diproses
//const videoUrl = 'https://www.youtube.com/watch?v=VIDEO_ID';

// Tampilkan format yang tersedia
//await listFormats(videoUrl);

// Jalankan fungsi utama
//await main(videoUrl, '18'); // '18' adalah itag untuk format video kualitas standar, sesuaikan dengan itag yang diinginkan
