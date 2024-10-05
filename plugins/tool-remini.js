import FormData from "form-data";
import Jimp from "jimp";
import { uploader } from 'server-uploader'

async function processing(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res
					.on("data", function (chunk, resp) {
						data.push(chunk);
					})
					.on("end", () => {
						resolve(Buffer.concat(data));
					});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}
let handler = async (m, { conn, args, usedPrefix, command }) => {
	switch (command) {
		case "remini":
			{   
				conn.enhancer = conn.enhancer ? conn.enhancer : {};
				if (m.sender in conn.enhancer)
					throw "Masih Ada Proses Yang Belum Selesai Kak, Silahkan Tunggu Sampai Selesai Yah >//<";
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime && !args[1])
					throw `Fotonya Mana Kak?`;
				if (!/image\/(jpe?g|png)/.test(mime) && !args[1])
					throw `Mime ${mime} tidak support`;
				else conn.enhancer[m.sender] = true;

				let img 
                if (!args[1]) img = await q.download?.();
                if (!args[0] || !(args[0] == '2' || args[0] == '4')) {  
                    let url = await uploader(img)
                    handler.limit = false
                    delete conn.enhancer[m.sender]
                    return await conn.sendInter(m.chat, {
            //media: imggam,
            createonly: false,
            hasMediaAttachment: false,
            footer: "",
            body: `Masukin kualitas antara 2 atau 4.
contoh ${usedPrefix + command} 4 `,
            subtitle: '1',
            text: '',
            buttons: [ {
                "name": "single_select",
                "buttonParamsJson": `{"title":"Pilih resolusi kualitas nya kak","sections":[{"title":"Note: hasil kualitas *2* yang di ulangi dua kali akan lebih teliti daripada langsung memilih 4","highlight_label":"Kualitas lebih besar lebih baik","rows":[{"header":"4","title":"${usedPrefix + command} 4","description":"","id":"${usedPrefix + command} 4 ${url}"},{"header":"2","title":"${usedPrefix + command} 2","description":"","id":"${usedPrefix + command} 2 ${url}"}]}]}`
              }]
        }, m)
                }
				let error;
				try {
				m.reply("Proses Kak...");
					//const This = await processing(img, "enhance");
                    const res = await (await fetch(`https://widipe.com/remini?url=${ args[1] ? args[1] : await uploader(img)}&resolusi=${args[0]}`)).json()
					let berhasil = await conn.sendFile(m.chat,res.url , "", "Sudah Jadi Kak >//<", m);
                    if (!berhasil || !res.url) throw "Gagal"
                    if (berhasil) handler.limit = parseInt(args[0])
				} catch (er) {
					try {
                        if (args[1]) img = await (await fetch(args[1])).buffer()
					    const This = await processing(img, "enhance");
                        await conn.sendFile(m.chat, This, "", "Sudah Jadi Kak >//<", m);
                        handler.limit = 1
					} catch (e) {
                        handler.limit = false
					    error = true;
					}
				} finally {
					if (error) {
						m.reply("Proses Gagal :(");
					}
					delete conn.enhancer[m.sender];
				}
			}
			break;
		case "color":
			{
				conn.recolor = conn.recolor ? conn.recolor : {};
				if (m.sender in conn.recolor)
					throw "Masih Ada Proses Yang Belum Selesai Kak, Silahkan Tunggu Sampai Selesai Yah >//<";
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime)
					throw `Fotonya Mana Kak?`;
				if (!/image\/(jpe?g|png)/.test(mime))
					throw `Mime ${mime} tidak support`;
				else conn.recolor[m.sender] = true;
				m.reply("Proses Kak...");
				let img = await q.download?.();
				let error;
				try {
					const This = await processing(img, "recolor");
					conn.sendFile(m.chat, This, "", "Sudah Jadi Kak >//<", m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Proses Gagal :(");
					}
					delete conn.recolor[m.chat];
				}
			}
			break;
		case "hdr":
			{
				conn.hdr = conn.hdr ? conn.hdr : {};
				if (m.sender in conn.hdr)
					throw "Masih Ada Proses Yang Belum Selesai Kak, Silahkan Tunggu Sampai Selesai Yah >//<";
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime)
					throw `Fotonya Mana Kak?`;
				if (!/image\/(jpe?g|png)/.test(mime))
					throw `Mime ${mime} tidak support`;
				else conn.hdr[m.sender] = true;
				m.reply("Proses Kak...");
				let img = await q.download?.();
				let error;
				try {
					const This = await processing(img, "dehaze");
					conn.sendFile(m.chat, This, "", "Sudah Jadi Kak >//<", m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Proses Gagal :(");
					}
					delete conn.hdr[m.sender];
				}
			}
			break;
	}
};
handler.help = ["remini","color","hdr"];
handler.tags = ["ai"];
handler.limit = false;
handler.command = ["remini","color","hdr"];
export default handler;