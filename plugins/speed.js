import { cpus as _cpus } from 'os';
import osu from 'node-os-utils';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';
import { sizeFormatter } from 'human-readable';

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

const handler = async (m, { conn }) => {
  let _muptime = 0;

  try {
    if (process.send) {
      process.send('uptime');
      _muptime = await new Promise(resolve => {
        process.once('message', resolve);
        setTimeout(resolve, 1000);
      }) * 1000;
    }
  
    const muptime = clockString(_muptime);
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
    const usedMemory = process.memoryUsage();

    const cpus = _cpus().map(cpu => ({
      ...cpu,
      total: Object.values(cpu.times).reduce((last, type) => last + type, 0)
    }));

    const cpu = cpus.reduce((last, cpu) => ({
      total: last.total + cpu.total,
      speed: last.speed + cpu.speed / cpus.length,
      times: {
        user: last.times.user + cpu.times.user,
        nice: last.times.nice + cpu.times.nice,
        sys: last.times.sys + cpu.times.sys,
        idle: last.times.idle + cpu.times.idle,
        irq: last.times.irq + cpu.times.irq
      }
    }), {
      speed: 0,
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0
      }
    });

    const NotDetect = 'Not Detect';
    const cpuCore = osu.cpu.count();

    const [cpuUsage, driveInfo, memInfo, netInfo] = await Promise.all([
      osu.cpu.usage().catch(() => NotDetect),
      osu.drive.info().catch(() => ({
        totalGb: NotDetect,
        usedGb: NotDetect,
        usedPercentage: NotDetect,
      })),
      osu.mem.info().catch(() => ({
        totalMemMb: NotDetect,
        usedMemMb: NotDetect,
      })),
      osu.netstat.inOut().catch(() => ({
        total: {
          inputMb: NotDetect,
          outputMb: NotDetect
        }
      }))
    ]);

    const { ip, country, cc } = await (await fetch("https://api.myip.com")).then(response => response.json()).catch(() => ({}));

    const date = new Date(Date.now() + 3600000);
    const locale = `${cc}`;
    const timeString = date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });

    const old = performance.now();
    await m.reply(`*ᴛ ᴇ s ᴛ ɪ ɴ ɢ . . .*`);
    const neww = performance.now();

    await conn.reply(m.chat, `
- *ᴘ ɪ ɴ ɢ* -
${Math.round(neww - old)}ms

- *ʀ ᴜ ɴ ᴛ ɪ ᴍ ᴇ* -
${muptime}

- *ᴄ ʜ ᴀ ᴛ s* -
• *${groupsIn.length}* Group Chats
• *${groupsIn.length}* Groups Joined
• *0* Groups Left
• *${chats.length - groupsIn.length}* Personal Chats
• *${chats.length}* Total Chats

- *s ᴇ ʀ ᴠ ᴇ ʀ* -
*🛑 Rᴀᴍ:* ${memInfo.usedMemMb} MB / ${memInfo.totalMemMb} MB
*🔵 FʀᴇᴇRᴀᴍ:* ${format(memInfo.totalMemMb - memInfo.usedMemMb)} 
*🔭 ᴘʟᴀᴛғᴏʀᴍ:* ${os.platform()}
*🧿 sᴇʀᴠᴇʀ:* ${os.hostname()}
*💻 ᴏs:* ${osu.os.platform()}
*📍 ɪᴘ:* ${ip}
*🌎 ᴄᴏᴜɴᴛʀʏ:* ${country}
*💬 ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ:* ${cc}
*📡 ᴄᴘᴜ ᴍᴏᴅᴇʟ:* ${osu.cpu.model()}
*🔮 ᴄᴘᴜ ᴄᴏʀᴇ:* ${cpuCore} Core
*🎛️ ᴄᴘᴜ:* ${cpuUsage}%
*⏰ ᴛɪᴍᴇ sᴇʀᴠᴇʀ:* ${timeString}

*${htjava} ɴᴏᴅᴇJS ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ*
${'```' + Object.keys(usedMemory).map((key) => `${key.padEnd(15, ' ')}: ${format(usedMemory[key])}`).join('\n') + '```'}
`, m);
  } catch (error) {
    console.error('Error handling command:', error);
    await conn.reply(m.chat, 'An error occurred while processing your request. Please try again later.');
  } 
};

handler.help = ['ping', 'speed'];
handler.tags = ['info', 'tools'];
handler.command = /^(ping|speed|info)$/i;

export default handler

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
function clockString(ms) {
  if (isNaN(ms)) return '-- *Days* --, -- *Hours* --, -- *Minutes* --, -- *Seconds* --';
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return `${d} *Days* ${h} *Hours* ${m} *Minutes* ${s} *Seconds*`;
}
