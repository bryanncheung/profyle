import { Archetype } from "@/lib/types";

interface CharacterProps {
  size?: number;
  className?: string;
}

export function BuilderCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Hard hat brim */}
      <ellipse cx="100" cy="72" rx="38" ry="8" fill="#E8650A" opacity="0.25" />
      {/* Hat dome */}
      <path d="M 68 73 Q 68 44 100 44 Q 132 44 132 73 Z" fill="#E8650A" />
      {/* Head */}
      <circle cx="100" cy="84" r="22" fill="#FDF6EE" stroke="#E8650A" strokeWidth="2" />
      {/* Eyes — square dots */}
      <rect x="90" y="80" width="7" height="7" rx="1.5" fill="#E8650A" />
      <rect x="103" y="80" width="7" height="7" rx="1.5" fill="#E8650A" />
      {/* Mouth — satisfied line */}
      <path d="M 93 92 Q 100 97 107 92" stroke="#E8650A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Stocky body */}
      <rect x="64" y="108" width="72" height="58" rx="14" fill="#E8650A" />
      {/* Left arm */}
      <rect x="34" y="113" width="32" height="14" rx="7" fill="#E8650A" />
      {/* Right arm */}
      <rect x="134" y="113" width="32" height="14" rx="7" fill="#E8650A" />
      {/* Wrench (simplified) */}
      <rect x="158" y="100" width="14" height="30" rx="5" fill="#0E0E0E" opacity="0.75" />
      <rect x="154" y="100" width="22" height="9" rx="4.5" fill="#0E0E0E" opacity="0.75" />
      {/* Legs */}
      <rect x="72" y="162" width="22" height="26" rx="9" fill="#C45008" />
      <rect x="106" y="162" width="22" height="26" rx="9" fill="#C45008" />
    </svg>
  );
}

export function DisruptorCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Burst spikes */}
      <path d="M100 20 L108 72 L150 40 L118 80 L180 82 L130 100 L172 128 L120 114 L130 168 L100 130 L70 168 L80 114 L28 128 L70 100 L20 82 L82 80 L50 40 L92 72 Z" fill="#E82B2B" opacity="0.18" />
      {/* Inner burst */}
      <path d="M100 42 L106 78 L134 58 L114 84 L152 88 L118 100 L142 122 L108 112 L116 148 L100 122 L84 148 L92 112 L58 122 L82 100 L48 88 L86 84 L66 58 L94 78 Z" fill="#E82B2B" opacity="0.35" />
      {/* Core body — angular */}
      <path d="M100 64 L118 84 L114 110 L100 120 L86 110 L82 84 Z" fill="#E82B2B" />
      {/* Head — circle */}
      <circle cx="100" cy="78" r="20" fill="#FEF4F4" stroke="#E82B2B" strokeWidth="2" />
      {/* Eyes — sharp */}
      <line x1="88" y1="74" x2="96" y2="80" stroke="#E82B2B" strokeWidth="3" strokeLinecap="round" />
      <line x1="112" y1="74" x2="104" y2="80" stroke="#E82B2B" strokeWidth="3" strokeLinecap="round" />
      {/* Determined mouth */}
      <path d="M 91 87 L 109 87" stroke="#E82B2B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Lower body */}
      <path d="M 82 110 L 76 154 L 90 158 L 100 130 L 110 158 L 124 154 L 118 110 Z" fill="#C42020" />
    </svg>
  );
}

export function AnchorCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Wide weighted base */}
      <ellipse cx="100" cy="168" rx="52" ry="14" fill="#0F8A8A" opacity="0.2" />
      {/* Lower body — wide oval */}
      <ellipse cx="100" cy="148" rx="44" ry="28" fill="#0F8A8A" />
      {/* Body */}
      <rect x="72" y="108" width="56" height="44" rx="12" fill="#0F8A8A" />
      {/* Arms — wide, anchoring */}
      <ellipse cx="44" cy="122" rx="22" ry="11" fill="#0F8A8A" />
      <ellipse cx="156" cy="122" rx="22" ry="11" fill="#0F8A8A" />
      {/* Head — round and calm */}
      <circle cx="100" cy="86" r="26" fill="#F0FAF9" stroke="#0F8A8A" strokeWidth="2.5" />
      {/* Eyes — calm, steady */}
      <circle cx="91" cy="84" r="4" fill="#0F8A8A" />
      <circle cx="109" cy="84" r="4" fill="#0F8A8A" />
      {/* Calm smile */}
      <path d="M 90 94 Q 100 102 110 94" stroke="#0F8A8A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Small highlight dots on eyes */}
      <circle cx="93" cy="82" r="1.5" fill="white" />
      <circle cx="111" cy="82" r="1.5" fill="white" />
    </svg>
  );
}

export function CatalystCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Radiating energy lines */}
      <line x1="100" y1="100" x2="100" y2="24" stroke="#C4A800" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="100" x2="162" y2="52" stroke="#C4A800" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="100" x2="176" y2="100" stroke="#C4A800" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="100" x2="162" y2="148" stroke="#C4A800" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="100" x2="38" y2="52" stroke="#C4A800" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="100" x2="24" y2="100" stroke="#C4A800" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      {/* Spark dots at ray tips */}
      <circle cx="100" cy="28" r="5" fill="#C4A800" opacity="0.5" />
      <circle cx="158" cy="56" r="5" fill="#C4A800" opacity="0.5" />
      <circle cx="172" cy="100" r="5" fill="#C4A800" opacity="0.5" />
      <circle cx="42" cy="56" r="5" fill="#C4A800" opacity="0.5" />
      <circle cx="28" cy="100" r="5" fill="#C4A800" opacity="0.5" />
      {/* Body — dynamic, slight tilt */}
      <rect x="74" y="108" width="52" height="48" rx="14" fill="#C4A800" transform="rotate(-3 100 132)" />
      {/* Head */}
      <circle cx="100" cy="82" r="24" fill="#FDFBEE" stroke="#C4A800" strokeWidth="2.5" />
      {/* Eyes — bright, energetic */}
      <circle cx="91" cy="80" r="4.5" fill="#C4A800" />
      <circle cx="109" cy="80" r="4.5" fill="#C4A800" />
      {/* Big smile */}
      <path d="M 88 90 Q 100 101 112 90" stroke="#C4A800" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Eye highlights */}
      <circle cx="93" cy="78" r="1.5" fill="white" />
      <circle cx="111" cy="78" r="1.5" fill="white" />
    </svg>
  );
}

export function SovereignCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Crown */}
      <path d="M 72 66 L 72 46 L 86 58 L 100 40 L 114 58 L 128 46 L 128 66 Z" fill="#7B4FE0" />
      <circle cx="100" cy="40" r="5" fill="#7B4FE0" />
      <circle cx="72" cy="46" r="4" fill="#7B4FE0" opacity="0.7" />
      <circle cx="128" cy="46" r="4" fill="#7B4FE0" opacity="0.7" />
      {/* Crown band */}
      <rect x="72" y="62" width="56" height="8" rx="4" fill="#7B4FE0" opacity="0.6" />
      {/* Head */}
      <circle cx="100" cy="88" r="24" fill="#F5F2FF" stroke="#7B4FE0" strokeWidth="2.5" />
      {/* Composed eyes — symmetric */}
      <rect x="88" y="84" width="8" height="8" rx="2" fill="#7B4FE0" />
      <rect x="104" y="84" width="8" height="8" rx="2" fill="#7B4FE0" />
      {/* Composed mouth */}
      <path d="M 90 97 Q 100 103 110 97" stroke="#7B4FE0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Elegant body — symmetric */}
      <path d="M 78 114 L 72 158 L 100 162 L 128 158 L 122 114 Q 118 110 100 110 Q 82 110 78 114 Z" fill="#7B4FE0" />
      {/* Shoulders — wide, symmetric */}
      <ellipse cx="60" cy="118" rx="20" ry="10" fill="#7B4FE0" />
      <ellipse cx="140" cy="118" rx="20" ry="10" fill="#7B4FE0" />
      {/* Decorative center gem */}
      <rect x="95" y="122" width="10" height="10" rx="2" fill="#D0BBFF" />
    </svg>
  );
}

export function ArchetypeCharacter({
  archetype,
  size = 200,
  className,
}: {
  archetype: Archetype;
  size?: number;
  className?: string;
}) {
  switch (archetype) {
    case "Builder": return <BuilderCharacter size={size} className={className} />;
    case "Disruptor": return <DisruptorCharacter size={size} className={className} />;
    case "Anchor": return <AnchorCharacter size={size} className={className} />;
    case "Catalyst": return <CatalystCharacter size={size} className={className} />;
    case "Sovereign": return <SovereignCharacter size={size} className={className} />;
  }
}
