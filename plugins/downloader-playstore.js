import { GooglePlayAPI } from "@Haliq0841/google-play-api";
import { convert as coverthtml } from "html-to-text";
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'
const __dirname = dirname(fileURLToPath(import.meta.url));
var handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const optionshtml = {
  wordwrap: 130,
  // ...
};
    const tok = "oauth2_4/0AVG7fiQBZzjLZCktNgCnvnE1cRsvQgS4oEjKt-4ZsWr9l1EEgyowF6V5DOTXAnGYrq92TQ";
    const savetok = join(__dirname, "temp/token.txt");
    if (!text) return conn.reply(m.chat, `Silahkan masukan nama aplikasi atau link google play store!`, m);
    let playid = text;
    if (text.match(/(https:\/\/play.google.com\/)/gi)) {
        let [urlhtttp, idgoogle] = text.split(`details?id=`)
        playid = idgoogle;
    }
    const gpAPI = new GooglePlayAPI("haliq0841@gmail.com", "34539BD2CF4D93F1");
        gpAPI.setSdkVersion(23);
        gpAPI.setCountryCode('id');
        gpAPI.setLanguageCode('id');
    switch (command) {
        case "playstore":
        {
            const token = await gpAPI.getGoogleToken(tok, savetok);
            await gpAPI.googleAuth(token);
            try {
            const detail = await gpAPI.appDetails(playid);
            if (detail) {
                const { image, id, title, creator, descriptionHtml, details, shareUrl, promotionalDescription } = detail
                const { developerWebsite, versionCode, versionString, developerEmail, recentChangesHtml, infoUpdatedOn, downloadLabel} = details.appDetails;
                const infonya = `╭──── 〔 P L A Y S T O R E 〕 ─⬣
*${title}*
\`\`\`${promotionalDescription ? promotionalDescription : ''}\`\`\`
> Nama paket: \`${id}\`
> Developer: \`${creator}\`
> Versi: \`${ versionCode }(${versionString})\`
> terakhir di perbarui: \`${ infoUpdatedOn }\`
> telah di download \`${ downloadLabel }\` pengguna
> Website: \`${developerWebsite}\`
> Email: \`${developerEmail}\`
> Link: ${shareUrl}
${recentChangesHtml ? '> Daftar Pembaruan:\n' + await coverthtml(recentChangesHtml, optionshtml) : ''}

${descriptionHtml ? await coverthtml(descriptionHtml, optionshtml) : ""}
`;
                await conn.reply(m.chat, infonya, m, { contextInfo: {
          externalAdReply :{
    mediaUrl: image[0].imageUrl,
    mediaType: 2,
    title: title,
    body: id,
    thumbnail: await(await fetch(image[0].imageUrl)).buffer(),
    sourceUrl: shareUrl
     }}
  });
            }
            const downloadApkUrl = await gpAPI.downloadApkUrl(playid);
            if (!downloadApkUrl) throw 'Gagal mendownload'
            await m.reply(downloadApkUrl)
            conn.sendMessage(m.chat, { document: { url: downloadApkUrl }, mimetype: "application/vnd.android.package-archive", fileName: playid + ".apk" }, { quoted: m })
            //m.reply(details.text());
            } catch (error1) {
                try {
                    const search = await gpAPI.search(text);
                    if (!search || !search[0].subItem[0].title) throw 'Gagal Mencari Aplikasi'
                    //throw search.map(x=>JSON.stringify(x)).join("\n")
                    const info = search.map((v)=> `\`nama:\` ${v.subItem[0].title} \n\`Developer:\` ${v.subItem[0].creator} \n\`Google Play Id:\` ${v.subItem[0].id} \n\`Link:\` https://play.google.com/store/apps/details?id=${v.subItem[0].id}`).join`\n\n`
                    await m.reply("*HASIL PENCARIAN:* ```" + text + "```\n\n" + info);
                    await conn.sendMessage(m.chat, {text: `untuk mendownload silahkan salin google play id aplikasi/link aplikasi dan ketik ${usedPrefix+command}<spasi>Google Play Id\nContoh: \n${usedPrefix+command} ${search[0].subItem[0].id}\n${usedPrefix+command} https://play.google.com/store/apps/details?id=${search[0].subItem[0].id}`});
                } catch (error2) {
                    throw 'Gagal mencari Aplikasi. Coba Gunakan Kata kunci pencarian yg lain!'
                }
            }
        }
        break;
    }
}

handler.help = ['spotify', 'spotifydl', 'spotifysearch', 'splay', 'spotifyalbum', ];
handler.tags = ["downloader"];
handler.command = /^(playstore)$/i;
export default handler;