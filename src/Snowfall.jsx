import { useState } from 'react';

const FLAKE_COUNT = 70;

function createFlakes() {
  return Array.from({ length: FLAKE_COUNT }, (_, i) => {
    const size = 2 + Math.random() * 5;
    return {
      id: i,
      left: Math.random() * 100,
      size,
      opacity: 0.4 + Math.random() * 0.5,
      // 小雪花飄得慢，看起來比較遠
      fallDuration: 18 - size * 1.5 + Math.random() * 6,
      swayDuration: 3 + Math.random() * 4,
      // 負的延遲讓雪花一開始就散佈在畫面中，而不是同時從頂端出現
      delay: -Math.random() * 20,
    };
  });
}

// 全畫面飄雪，在內容卡片後面、不會擋到點擊
export default function Snowfall() {
  const [flakes] = useState(createFlakes);

  return (
    <div className="snowfall pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.fallDuration}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <span
            className="snowflake-inner"
            style={{
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              animationDuration: `${f.swayDuration}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
