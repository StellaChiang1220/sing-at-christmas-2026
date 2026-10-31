// 抽籤：把每個人的自選歌隨機分給參與者，且沒有人會抽到自己的歌
// 用法：npm run draw            （已經抽過會拒絕，避免不小心重抽）
//       npm run draw -- --force （確定要重新抽籤）
import { readFileSync, writeFileSync } from 'node:fs';
import { randomInt } from 'node:crypto';

const DATA_PATH = new URL('../src/results/participants.json', import.meta.url);
const MAX_ATTEMPTS = 10000;

const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
const { participants, total } = data;
const force = process.argv.includes('--force');

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

if (participants.length < 2) fail('至少要有 2 位參與者才能抽籤');
if (participants.length !== total) {
  fail(`目前只有 ${participants.length} / ${total} 位參與者，資料到齊再抽`);
}
if (participants.some((p) => !p.name?.trim() || !p.song?.trim())) {
  fail('有參與者缺少姓名或自選歌');
}
if (participants.some((p) => p.drawn) && !force) {
  fail('已經抽過籤了。確定要重抽請執行：npm run draw -- --force');
}

// Fisher–Yates 洗牌（使用加密等級亂數）
const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 重洗直到沒有人拿到跟自己自選歌相同的曲目（比對歌名，所以就算兩人選了同一首也不會抽到）
const songs = participants.map((p) => p.song.trim());
let drawn;
for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
  const candidate = shuffle(songs);
  if (candidate.every((song, i) => song !== songs[i])) {
    drawn = candidate;
    break;
  }
}
if (!drawn) fail('找不到符合條件的分配，請檢查是否太多人選了同一首歌');

data.participants = participants.map((p, i) => ({ ...p, drawn: drawn[i] }));
writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');

console.log('✓ 抽籤完成：');
for (const p of data.participants) console.log(`  ${p.name}：${p.song}  →  ${p.drawn}`);
