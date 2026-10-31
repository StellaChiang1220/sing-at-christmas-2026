import { useState } from 'react';
import Snowfall from '../Snowfall.jsx';
import { sha256 } from '../sha256.js';
import data from './participants.json';

// 結果頁密碼的 SHA-256 雜湊值（避免明文出現在原始碼中）
// 更換密碼：在終端機執行 printf '新密碼' | shasum -a 256，把結果貼到這裡
const RESULTS_PASSWORD_HASH = "c9de94b6405f7e055f62b647e8f1bcd8bb08d2dfb7139f2b253caec3d4f733ab";

// 同一個分頁重新整理時不用再輸入密碼
const UNLOCK_KEY = 'results-unlocked';

function readUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === RESULTS_PASSWORD_HASH;
  } catch {
    return false;
  }
}

function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checking) return;
    if (!password.trim()) {
      setError('請輸入密碼');
      return;
    }
    setChecking(true);
    const hash = await sha256(password.trim());
    setChecking(false);
    if (hash !== RESULTS_PASSWORD_HASH) {
      setError('密碼不正確，請再試一次');
      return;
    }
    try {
      sessionStorage.setItem(UNLOCK_KEY, hash);
    } catch {
      // 無法使用 sessionStorage 時，只是重新整理後需要再輸入一次
    }
    onUnlock();
  };

  return (
    <section className="glow-card rounded-2xl p-6 md:p-8 max-w-md mx-auto">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <label htmlFor="results-password" className="block text-sm font-medium text-amber-50/80">
          請輸入密碼觀看抽籤結果
        </label>
        <input
          type="password"
          id="results-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          autoFocus
          autoComplete="off"
          placeholder="請輸入結果頁密碼"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'results-password-error' : undefined}
          className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-white placeholder-amber-50/40 focus:outline-none transition-colors ${
            error ? 'border-red-500 focus:border-red-400' : 'border-amber-100/25 focus:border-amber-300'
          }`}
        />
        {error && (
          <p id="results-password-error" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={checking}
          className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-xl text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
        >
          查看結果
        </button>
      </form>
    </section>
  );
}

function ResultsTable() {
  const { participants } = data;

  if (participants.length === 0) {
    return (
      <section className="glow-card rounded-2xl p-4 md:p-6">
        <p className="text-center text-amber-100/70 py-8">還沒有參與者資料</p>
      </section>
    );
  }

  return (
    <section className="glow-card rounded-2xl p-4 md:p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base">
          <thead>
            <tr className="text-amber-200 border-b border-sky-200/20">
              <th scope="col" className="py-3 px-3 font-semibold whitespace-nowrap">參與者</th>
              <th scope="col" className="py-3 px-3 font-semibold whitespace-nowrap">自選歌</th>
              <th scope="col" className="py-3 px-3 font-semibold whitespace-nowrap">抽到的曲目</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.name} className="border-b border-sky-200/10 last:border-0">
                <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{p.name}</td>
                <td className="py-3 px-3 text-amber-50/80">{p.song}</td>
                <td className="py-3 px-3">
                  {p.drawn ? (
                    <span className="font-bold text-sky-200">{p.drawn}</span>
                  ) : (
                    <span className="text-amber-100/50">尚未抽籤</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Email 屬於個資，只放在本機的 emails.local.json（已加入 .gitignore）
// 只有 npm run dev 時才會讀取；部署出去的網站不會包含 Email
const localEmails = import.meta.env.DEV
  ? Object.values(import.meta.glob('./emails.local.json', { eager: true, import: 'default' }))[0] ?? {}
  : {};

function buildSubject({ name }) {
  return `🎄 ${name}，你的有梗禮題目出爐囉！｜第一屆聖誕邊唱邊換禮物大會`;
}

function buildLetter({ name, song, drawn }) {
  return [
    `親愛的 ${name}：`,
    '',
    '感謝你報名「第一屆聖誕邊唱邊換禮物大會」🎄',
    '有梗禮的抽籤結果出爐囉！',
    '',
    `🎤 你的自選曲：${song}`,
    `🎁 你抽到的題目：${drawn}`,
    '',
    `請準備好「${drawn}」題目的驚喜禮物，不要搞錯囉！`,
    '',
    '聖誕節當天見～',
    '主辦方 敬上',
  ].join('\n');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 不支援 Clipboard API 時的備用做法
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  }
}

function CopyButton({ text, label }) {
  const [status, setStatus] = useState('');

  const handleCopy = async () => {
    const ok = await copyText(text);
    setStatus(ok ? '已複製！' : '複製失敗');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border border-sky-200/30 text-sky-100 hover:bg-white/10 transition-colors"
    >
      {status || label}
    </button>
  );
}

function CopyRow({ label, value, buttonLabel }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-amber-200">{label}</p>
        <p className="text-sm text-white break-all mt-0.5">{value}</p>
      </div>
      <CopyButton text={value} label={buttonLabel} />
    </div>
  );
}

function LetterCard({ participant }) {
  const email = localEmails[participant.name];
  const subject = buildSubject(participant);
  const letter = buildLetter(participant);

  return (
    <article className="glow-item rounded-xl p-5 space-y-4">
      <h3 className="font-bold text-white text-lg">✉️ 給 {participant.name}</h3>
      {email && <CopyRow label="收件人" value={email} buttonLabel="複製 Email" />}
      <CopyRow label="標題" value={subject} buttonLabel="複製標題" />
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-amber-200">內容</p>
          <CopyButton text={letter} label="複製內容" />
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-amber-50/90">{letter}</p>
      </div>
    </article>
  );
}

function LetterCards() {
  const drawnParticipants = data.participants.filter((p) => p.drawn);
  if (drawnParticipants.length === 0) return null;

  return (
    <section className="glow-card rounded-2xl p-4 md:p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-red-400">📮 通知信內容</h2>
        <p className="text-amber-100/70 text-sm mt-1">
          分別複製收件人、標題和內容，貼到信件裡寄給每位參與者。
          {Object.keys(localEmails).length === 0 && '（Email 只會在本機 npm run dev 時顯示）'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drawnParticipants.map((p) => (
          <LetterCard key={p.name} participant={p} />
        ))}
      </div>
    </section>
  );
}

export default function ResultsApp() {
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const { participants, total } = data;
  const isDrawn = participants.length > 0 && participants.every((p) => p.drawn);

  return (
    <div className="bg-[linear-gradient(to_bottom,#020617_0%,#0b1d4d_95%,#1e3a8a_100%)] text-stone-100 min-h-screen relative overflow-hidden">
      <Snowfall />

      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 space-y-8">
        <section className="text-center space-y-3 pt-6">
          <span className="inline-block px-4 py-1 rounded-full bg-sky-400/15 text-sky-200 border border-sky-300/30 text-sm font-medium tracking-wider">
            🔒 非公開頁面
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
            🎁 有梗禮抽籤結果
          </h1>
          {unlocked && (
            <p className="text-amber-50/80">
              {isDrawn
                ? '每個人抽到的都不是自己的歌，請針對抽到的曲目準備有梗禮！'
                : `目前已收到 ${participants.length} / ${total} 位參與者，全員到齊後就會抽籤。`}
            </p>
          )}
        </section>

        {unlocked ? (
          <>
            <ResultsTable />
            <LetterCards />
          </>
        ) : (
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        )}
      </main>
    </div>
  );
}
