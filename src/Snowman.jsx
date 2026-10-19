// 雪地上的雪人裝飾（純 SVG）
export default function Snowman({ scarfColor = '#dc2626', className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 170" aria-hidden="true">
      {/* 樹枝手臂 */}
      <g stroke="#5b3a1e" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M38,84 L8,64 M18,71 L10,58" />
        <path d="M82,84 L112,62 M102,69 L112,74" />
      </g>

      {/* 身體：下、中、頭 */}
      <g fill="#ffffff" stroke="#bfdbfe" strokeWidth="2">
        <circle cx="60" cy="132" r="34" />
        <circle cx="60" cy="84" r="25" />
        <circle cx="60" cy="47" r="18" />
      </g>
      {/* 陰影，讓雪球有立體感 */}
      <g fill="#dbeafe" opacity="0.7">
        <path d="M60,166 A34,34 0 0 1 28,142 A40,40 0 0 0 92,142 A34,34 0 0 1 60,166 Z" />
        <path d="M60,109 A25,25 0 0 1 37,92 A30,30 0 0 0 83,92 A25,25 0 0 1 60,109 Z" />
      </g>

      {/* 圍巾 */}
      <path d="M41,62 Q60,72 79,62 L80,69 Q60,79 40,69 Z" fill={scarfColor} />
      <path d="M68,68 L74,90 L64,92 L61,70 Z" fill={scarfColor} />

      {/* 高帽 */}
      <rect x="38" y="28" width="44" height="6" rx="2" fill="#111827" />
      <rect x="46" y="6" width="28" height="24" rx="2" fill="#111827" />
      <rect x="46" y="22" width="28" height="5" fill={scarfColor} />

      {/* 臉 */}
      <circle cx="53" cy="44" r="2.3" fill="#111827" />
      <circle cx="67" cy="44" r="2.3" fill="#111827" />
      <path d="M60,49 L76,52 L60,53 Z" fill="#f97316" />
      <g fill="#111827">
        <circle cx="52" cy="57" r="1.3" />
        <circle cx="56" cy="59" r="1.3" />
        <circle cx="60" cy="59.6" r="1.3" />
        <circle cx="64" cy="59" r="1.3" />
        <circle cx="68" cy="57" r="1.3" />
      </g>

      {/* 鈕扣 */}
      <g fill="#111827">
        <circle cx="60" cy="80" r="2.5" />
        <circle cx="60" cy="92" r="2.5" />
        <circle cx="60" cy="122" r="3" />
      </g>
    </svg>
  );
}
