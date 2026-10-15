import React, { useState } from 'react';

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const FORMSPREE_URL = "https://formspree.io/f/mvkzwyde";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

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
      } else {
        alert('發生了一點小錯誤，請稍後再試一次！');
      }
    } catch (error) {
      alert('網路連線異常，請檢查您的網路狀況。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-950 via-stone-900 to-emerald-950 text-stone-100 min-h-screen relative overflow-hidden">
      {/* 裝飾背景光暈 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 blur-[120px] pointer-events-none"></div>

      <main className="relative max-w-3xl mx-auto px-4 py-12 space-y-12">

        {/* Section 1 */}
        <section className="text-center space-y-4 pt-6">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-medium tracking-wider">
            🎄 聖誕限定活動
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            第一屆
            <br></br>
            聖誕邊唱邊換禮物大會
          </h1>
          <p className="text-lg text-stone-300 font-light">
            2026《錢櫃音樂課》沒有贊助主辦
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-stone-900/80 backdrop-blur border border-stone-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
            🎁 你需要準備：
          </h2>
          <ol className="space-y-4 text-stone-200">
            <li className="flex items-start gap-3 bg-stone-800/50 p-4 rounded-xl border border-stone-800">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <strong className="text-white block mb-0.5">一份精選良心禮</strong>
                <span className="text-stone-400 text-sm">價值 $400 元以上，並挑選一首「歌」來形容它作為猜謎線索。</span>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-stone-800/50 p-4 rounded-xl border border-stone-800">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <strong className="text-white block mb-0.5">兩首你會唱的歌</strong>
                <span className="text-stone-400 text-sm">提供兩首拿手歌曲，將成為「有梗禮」的抽題母體。</span>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-stone-800/50 p-4 rounded-xl border border-stone-800">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <strong className="text-white block mb-0.5">兩份「有梗禮」</strong>
                <span className="text-stone-400 text-sm">系統將隨機配對兩首歌給你，請針對這兩首歌準備對應的超有梗禮物！</span>
              </div>
            </li>
          </ol>
        </section>

        {/* Section 3 */}
        <section className="bg-stone-900/80 backdrop-blur border border-stone-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
            ⏰ 當日流程：
          </h2>
          <div className="relative border-l-2 border-emerald-500/30 ml-3 space-y-6 pl-6">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-stone-900"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">19:00 - 19:40</span>
              <h3 className="text-lg font-bold text-white mt-0.5">歡樂用餐與進場準備時間</h3>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-stone-900"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">19:40 - 20:30</span>
              <h3 className="text-lg font-bold text-white mt-0.5">誰是「有梗王」</h3>
              <p className="text-sm text-stone-400 mt-1">事前抽歌大比拼，現場票選出最會搞怪的有梗王，搶先獲得優先選禮權！</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-600 ring-4 ring-stone-900"></span>
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">20:30 - 20:40</span>
              <h3 className="text-lg font-bold text-white mt-0.5">休息拍照</h3>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-stone-900"></span>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">20:40 - 22:00</span>
              <h3 className="text-lg font-bold text-white mt-0.5">真正「良心禮」</h3>
              <p className="text-sm text-stone-400 mt-1">點歌、捏鼻唱提示、白板速寫搶答、抽籤交換拿好禮！</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-stone-900"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">22:00 - 23:00</span>
              <h3 className="text-lg font-bold text-white mt-0.5">聊天唱歌聖誕快樂</h3>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-stone-900/80 backdrop-blur border border-stone-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            📜 活動規則：
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-800/40 border border-stone-800 p-5 rounded-xl">
              <h3 className="font-bold text-amber-300 text-lg mb-2">關於良心禮</h3>
              <p className="text-stone-300 text-sm leading-relaxed">價值 $400 以上。主唱上台唱歌時，必須將禮物特徵融入歌中（甚至規定捏鼻子唱），台下使用白板搶答，最後由有梗王抽籤帶回家！</p>
            </div>
            <div className="bg-stone-800/40 border border-stone-800 p-5 rounded-xl">
              <h3 className="font-bold text-amber-300 text-lg mb-2">關於兩首歌</h3>
              <p className="text-stone-300 text-sm leading-relaxed">每人提交 2 首平常最拿手的口袋歌單，交給系統進行隨機盲抽盲配，絕不重複且絕對保密到家。</p>
            </div>
            <div className="bg-stone-800/40 border border-stone-800 p-5 rounded-xl">
              <h3 className="font-bold text-amber-300 text-lg mb-2">關於有梗禮</h3>
              <p className="text-stone-300 text-sm leading-relaxed">拿到指定歌單後，發揮創意準備超有梗、諧音梗、或是惡搞的實質禮物，當天隨時拿出來引爆全場笑聲！</p>
            </div>
          </div>
        </section>

        {/* Section 5 - 表單區塊（已加上 name 屬性與 Formspree 串接） */}
        <section className="bg-stone-900/80 backdrop-blur border border-stone-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-red-400 mb-2 flex items-center gap-2">
            📝 報名與歌曲填寫
          </h2>
          <p className="text-stone-400 text-sm mb-6">請填寫下方表單提交您的個人資料與兩首拿手歌曲：</p>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">參加人姓名</label>
                <input type="text" name="name" required className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-red-500 transition-colors" placeholder="例如：派對小天后" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">參加人 Email</label>
                <input type="email" name="email" required className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-red-500 transition-colors" placeholder="your.email@example.com" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-1.5">第一首歌</label>
                  <input type="text" name="song1" required className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-red-500 transition-colors" placeholder="歌手 - 歌名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-1.5">第二首歌</label>
                  <input type="text" name="song2" required className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-red-500 transition-colors" placeholder="歌手 - 歌名" />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? '送出中...' : '送出歌單與報名'}
              </button>
            </form>
          ) : (
            <div className="p-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-center space-y-2">
              <h3 className="text-xl font-bold">✨ 提交成功！</h3>
              <p className="text-sm text-stone-300">資料已順利送出，我們已經收到您的歌單囉！</p>
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
    </div>
  );
}