import axios from 'axios';
let handler = async (m, { conn, text }) => {
if (!text) throw 'Linknya mana?'
if (!isURL(text)) throw 'Hanya mendukung url!'
let url = 'https://app.publer.io/hooks/media';
const data = {
  url: text
};
m.reply('Tunggu ya kak Sedang di proses...');
const headers = {
  'accept': 'application/json, text/plain, /',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'id',
  'content-type': 'application/json',
  'origin': 'https://publer.io',
  'priority': 'u=1, i',
  'referer': 'https://publer.io/',
  'sec-ch-ua': '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 Edg/130.0.0.0'
};

try {
  let jobResponse = await axios.post(url, data, { headers: headers });
  let jobId = jobResponse.data.job_id;

  url = 'https://app.publer.io/api/v1/job_status/' + jobId
  
  let statusResponse = await axios.get(url, { headers });
  
  headers['if-none-match'] = statusResponse.headers.etag;

  let response;
  do {
    try {
      response = (await axios.get(url, { headers })).data;
        await new Promise(resolve => setTimeout(resolve, 10000));
        headers['if-none-match'] = response.headers.etag;
               } catch (error) {
      console.error('Error fetching job status:', error);
          }
  } while (!response || response.status === 'working');
  await m.reply('Berhasil mendapatkan data, sedang mengirim...');
  for (let media of response.payload) {
    //await conn.sendFile(m.chat, media.url, '', '', m);
    if (media.type === 'photo') media.type = 'image'
    try {
      await conn.sendMessage(m.chat, { [media.type]: { url: media.path } }, { quoted: m });
    } catch (error) {
      if (media.path) {
        await m.reply('Gagal mengirim, mencoba sekali lagi...\n\nApabila masih tidak berhasil anda bisa coba download sendiri dengan mengklik url ini:\n' + media.path);
        try {
          await conn.sendFile(m.chat, media.path, '', '', m);
        } catch (er1) {
          m.reply("Memang tidak dapat saya kirim, Download manual aja ya dengan klik url yang saya berikan di atas")
        }
      }
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
} catch (error) {
  throw 'Error during the initial request or job creation:' + error
}
};

handler.help = ['download'];
handler.tags = ['downloader'];
handler.command = /^down(load(er)?)?|dl|all$/i;

export default handler;

function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}