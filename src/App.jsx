import { useEffect, useRef, useState } from 'react';
import Snowfall from './Snowfall.jsx';
import Snowman from './Snowman.jsx';

const FORMSPREE_URL = "https://formspree.io/f/mvkzwyde";

// 邀請函密碼的 SHA-256 雜湊值（避免明文出現在原始碼中）
// 更換密碼：在終端機執行 printf '新密碼' | shasum -a 256，把結果貼到這裡
const INVITE_CODE_HASH = "1bd134b2ab8345b4c082f3382e85ed4c00340c7188876b6cbe1e17cf161e4c69";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS = [
  { name: 'name', label: '參加人姓名', type: 'text', placeholder: '可以不用誠實寫名字', autoComplete: 'name' },
  { name: 'email', label: '參加人 Email', type: 'email', placeholder: '必須是收得到信的唷！不然你會收不到題目', autoComplete: 'email' },
  { name: 'song', label: '準備收到有梗禮的歌 (1首你會唱的歌)', shortLabel: '你的歌', type: 'text', placeholder: '必須是錢櫃能點到的歌，還有，請善良' },
  { name: 'inviteCode', label: '邀請函密碼', type: 'password', placeholder: '你說要參加以後，主辦方才會給你密碼唷', autoComplete: 'off' },
];

const CHECKLIST = [
  { id: 'gift', text: '我會準備一份價值 $400 元以上的良心禮，並想好一首形容它的歌' },
  { id: 'songs', text: '我填的歌是我真的會唱的拿手歌' },
  { id: 'funny', text: '我知道之後會被分配一首歌，要準備一份對應的有梗禮' },
];

const EMPTY_FORM = Object.fromEntries(FIELDS.map((f) => [f.name, '']));

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function validate(values) {
  const errors = {};
  for (const field of FIELDS) {
    if (!values[field.name].trim()) errors[field.name] = `請填寫${field.shortLabel ?? field.label}`;
  }
  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Email 格式看起來不太對，請再檢查一次';
  }
  if (!errors.inviteCode && (await sha256(values.inviteCode.trim())) !== INVITE_CODE_HASH) {
    errors.inviteCode = '邀請函密碼不正確';
  }
  return errors;
}

export default function App() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [checked, setChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const honeypotRef = useRef(null);

  const allChecked = CHECKLIST.every((item) => checked[item.id]);

  useEffect(() => {
    if (!confirming) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) setConfirming(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirming, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // 第一步：檢查欄位，通過後打開確認視窗
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const nextErrors = await validate(values);
    setErrors(nextErrors);
    const firstInvalid = FIELDS.find((f) => nextErrors[f.name]);
    if (firstInvalid) {
      document.getElementById(firstInvalid.name)?.focus();
      return;
    }
    setChecked({});
    setConfirming(true);
  };

  // 第二步：確認後才真正送到 Formspree（不會送出邀請函密碼）
  const handleConfirm = async () => {
    if (loading || !allChecked) return;
    setLoading(true);
    setSubmitError('');

    const formData = new FormData();
    formData.append('name', values.name.trim());
    formData.append('email', values.email.trim());
    formData.append('song', values.song.trim());
    formData.append('_gotcha', honeypotRef.current?.value ?? '');
    formData.append('_subject', `聖誕大會報名：${values.name.trim()}`);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
        setConfirming(false);
      } else {
        const data = await response.json().catch(() => null);
        const detail = data?.errors?.map((err) => err.message).join('、');
        setSubmitError(`送出失敗，請稍後再試一次。${detail ? `（${detail}）` : ''}`);
        setConfirming(false);
      }
    } catch {
      setSubmitError('網路連線異常，請檢查您的網路狀況後再送出一次。');
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-white placeholder-amber-50/40 focus:outline-none transition-colors ${
      errors[name] ? 'border-red-500 focus:border-red-400' : 'border-amber-100/25 focus:border-amber-300'
    }`;

  const renderField = (field) => (
    <div key={field.name}>
      <label htmlFor={field.name} className="block text-sm font-medium text-amber-50/80 mb-1.5">
        {field.label} <span className="text-red-400">*</span>
      </label>
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        value={values[field.name]}
        onChange={handleChange}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        aria-invalid={Boolean(errors[field.name])}
        aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
        className={inputClass(field.name)}
      />
      {errors[field.name] && (
        <p id={`${field.name}-error`} className="mt-1.5 text-sm text-red-400">
          {errors[field.name]}
        </p>
      )}
    </div>
  );

  const fieldByName = Object.fromEntries(FIELDS.map((f) => [f.name, f]));

  return (
    <div className="bg-[linear-gradient(to_bottom,#020617_0%,#0b1d4d_95%,#1e3a8a_100%)] text-stone-100 min-h-screen relative overflow-hidden flex flex-col">
      {/* 夜空頂端的月光光暈 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-sky-300/10 blur-[120px] pointer-events-none"></div>

      <Snowfall />

      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 pt-12 space-y-12 flex-1">

        {/* Section 1 */}
        <section className="text-center space-y-4 pt-6">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-medium tracking-wider">
            🎄 聖誕限定活動
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            第一屆
            <br />
            聖誕邊唱邊換禮物大會
          </h1>
          <p className="text-lg text-amber-50/80 font-light">
            2026《錢櫃音樂課》沒有贊助主辦
          </p>
        </section>

        {/* Section 2 */}
        <section className="glow-card rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
            🎁 你需要準備：
          </h2>
          <ol className="space-y-4 text-amber-50/90">
            <li className="flex items-start gap-3 glow-item p-4 rounded-xl">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <strong className="text-white block mb-0.5">一份精選良心禮</strong>
                <span className="text-amber-100/70 text-sm">價值 $400 元以上，並挑選一首「歌」來形容它作為猜謎線索。</span>
              </div>
            </li>
            <li className="flex items-start gap-3 glow-item p-4 rounded-xl">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <strong className="text-white block mb-0.5">一首你會唱的歌</strong>
                <span className="text-amber-100/70 text-sm">提供一首拿手歌曲，將成為「有梗禮」的抽題母體。</span>
              </div>
            </li>
            <li className="flex items-start gap-3 glow-item p-4 rounded-xl">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <strong className="text-white block mb-0.5">一份「有梗禮」</strong>
                <span className="text-amber-100/70 text-sm">系統將隨機配對一首歌給你，請針對這首歌準備對應的超有梗禮物！</span>
              </div>
            </li>
          </ol>
        </section>

        {/* Section 3 */}
        <section className="glow-card rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
            ⏰ 當日流程：
          </h2>
          <div className="relative border-l-2 border-emerald-500/30 ml-3 space-y-6 pl-6">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-400 text-emerald-400 shadow-[0_0_10px_currentColor]"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">19:00 - 19:40</span>
              <h3 className="text-lg font-bold text-white mt-0.5">歡樂用餐與進場準備時間</h3>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-400 text-emerald-400 shadow-[0_0_10px_currentColor]"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">19:40 - 20:30</span>
              <h3 className="text-lg font-bold text-white mt-0.5">誰是「有梗王」</h3>
              <p className="text-sm text-amber-100/70 mt-1">事前抽歌大比拼，現場票選出最會搞怪的有梗王，搶先獲得優先選禮權！</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-200 text-amber-200 shadow-[0_0_10px_currentColor]"></span>
              <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">20:30 - 20:40</span>
              <h3 className="text-lg font-bold text-white mt-0.5">休息拍照</h3>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-red-400 text-red-400 shadow-[0_0_10px_currentColor]"></span>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">20:40 - 22:00</span>
              <h3 className="text-lg font-bold text-white mt-0.5">真正「良心禮」</h3>
              <p className="text-sm text-amber-100/70 mt-1">點歌、捏鼻唱提示、白板速寫搶答、抽籤交換拿好禮！</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-400 text-emerald-400 shadow-[0_0_10px_currentColor]"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">22:00 - 23:00</span>
              <h3 className="text-lg font-bold text-white mt-0.5">聊天唱歌聖誕快樂</h3>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="glow-card rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            📜 活動規則：
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glow-item p-5 rounded-xl">
              <h3 className="font-bold text-amber-300 text-lg mb-2">關於良心禮</h3>
              <p className="text-amber-50/80 text-sm leading-relaxed">價值 $400 以上。主唱上台唱歌時，必須將禮物特徵融入歌中（甚至規定捏鼻子唱），台下使用白板搶答，最後由有梗王抽籤帶回家！</p>
            </div>
            <div className="glow-item p-5 rounded-xl">
              <h3 className="font-bold text-amber-300 text-lg mb-2">關於拿手歌</h3>
              <p className="text-amber-50/80 text-sm leading-relaxed">每人提交 1 首平常最拿手的口袋歌，交給系統進行隨機盲抽盲配，絕不重複且絕對保密到家。</p>
            </div>
            <div className="glow-item p-5 rounded-xl">
              <h3 className="font-bold text-amber-300 text-lg mb-2">關於有梗禮</h3>
              <p className="text-amber-50/80 text-sm leading-relaxed">拿到指定的歌後，發揮創意準備超有梗、諧音梗、或是惡搞的實質禮物，當天隨時拿出來引爆全場笑聲！</p>
            </div>
          </div>
        </section>

        {/* Section 5 - 表單區塊（已加上 name 屬性與 Formspree 串接） */}
        <section className="glow-card rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-2 flex items-center gap-2">
            📝 報名與歌曲填寫
          </h2>
          <p className="text-amber-100/70 text-sm mb-6">請填寫下方表單提交您的個人資料與一首拿手歌曲（<span className="text-red-400">*</span> 為必填）：</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {renderField(fieldByName.name)}
              {renderField(fieldByName.email)}
              {renderField(fieldByName.song)}
              {renderField(fieldByName.inviteCode)}

              {/* 防機器人欄位：真人看不到，機器人填了 Formspree 會自動擋掉 */}
              <input ref={honeypotRef} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              {submitError && (
                <div role="alert" className="p-4 bg-red-500/15 border border-red-500/40 text-red-300 rounded-xl text-sm">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-xl text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? '送出中...' : '送出歌單與報名'}
              </button>
            </form>
          ) : (
            <div className="p-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-center space-y-2">
              <h3 className="text-xl font-bold">✨ 提交成功！</h3>
              <p className="text-sm text-amber-50/80">資料已順利送出，我們已經收到您的歌單囉！</p>
            </div>
          )}
        </section>

        {/* Section 6 */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            祝我們玩得愉快！
          </h2>
        </section>

      </main>

      {/* 頁面最下方的雪地：後層較暗、前層純白，做出起伏的層次 */}
      <div className="relative h-28 md:h-40 pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path
            d="M0,70 C180,30 340,40 520,65 C700,90 860,35 1040,45 C1200,55 1320,80 1440,60 L1440,160 L0,160 Z"
            fill="#dbeafe"
          />
          <path
            d="M0,105 C160,80 320,85 480,100 C660,118 820,78 1000,88 C1180,98 1300,115 1440,100 L1440,160 L0,160 Z"
            fill="#ffffff"
          />
        </svg>
        {/* 左右兩個雪人，右邊的鏡像翻轉並換上綠圍巾 */}
        <Snowman className="absolute bottom-[18%] left-[4%] md:left-[8%] w-16 md:w-28 h-auto drop-shadow-lg" />
        <Snowman scarfColor="#059669" className="absolute bottom-[18%] right-[4%] md:right-[8%] w-14 md:w-24 h-auto -scale-x-100 drop-shadow-lg" />
      </div>

      {/* 送出前確認視窗 */}
      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !loading && setConfirming(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0b1d4d]/95 border border-amber-200/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(253,224,71,0.2)] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-title" className="text-xl font-bold text-white">🎄 送出前再確認一下</h3>

            <dl className="glow-item rounded-xl p-4 space-y-2 text-sm">
              {FIELDS.filter((f) => f.name !== 'inviteCode').map((f) => (
                <div key={f.name} className="flex gap-3">
                  <dt className="w-24 flex-shrink-0 text-amber-100/70">{f.shortLabel ?? f.label}</dt>
                  <dd className="text-white break-all">{values[f.name].trim()}</dd>
                </div>
              ))}
            </dl>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-amber-50/80 mb-2">請勾選以下檢查事項：</legend>
              {CHECKLIST.map((item) => (
                <label key={item.id} className="flex items-start gap-3 text-sm text-amber-50/90 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-emerald-500 flex-shrink-0"
                  />
                  <span>{item.text}</span>
                </label>
              ))}
            </fieldset>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl border border-amber-100/40 text-amber-50 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                返回修改
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading || !allChecked}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? '送出中...' : '確認送出'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}