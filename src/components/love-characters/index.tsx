interface CharacterProps {
  size?: number;
  className?: string;
}

const C = "#8B2252";
const FACE = "#FFF0F5";
const DARK = "#6E1A40";

export function FlameCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Outer flame halo */}
      <path d="M100 170 Q58 160 52 120 Q48 95 70 78 Q68 108 88 110 Q78 90 86 62 Q96 90 100 90 Q104 90 114 62 Q122 90 112 110 Q132 108 130 78 Q152 95 148 120 Q142 160 100 170 Z" fill={C} opacity="0.18" />
      {/* Main flame body */}
      <path d="M100 165 Q66 158 62 128 Q58 105 76 95 Q76 118 94 118 Q100 165 100 165 Z" fill={C} opacity="0.6" />
      <path d="M100 165 Q134 158 138 128 Q142 105 124 95 Q124 118 106 118 Q100 165 100 165 Z" fill={C} opacity="0.6" />
      {/* Head */}
      <circle cx="100" cy="76" r="26" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Intense angled eyes */}
      <path d="M86 72 Q90 69 94 72" stroke={C} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M106 72 Q110 69 114 72" stroke={C} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Eye pupils */}
      <circle cx="90" cy="74" r="3" fill={C} />
      <circle cx="110" cy="74" r="3" fill={C} />
      <circle cx="91" cy="73" r="1" fill="white" />
      <circle cx="111" cy="73" r="1" fill="white" />
      {/* Passionate wide smile */}
      <path d="M88 87 Q100 98 112 87" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Flame spikes on top of head */}
      <path d="M92 52 Q100 36 108 52 Q104 44 100 38 Q96 44 92 52 Z" fill={C} opacity="0.7" />
      <path d="M80 58 Q88 44 92 58 Q89 50 86 46 Q83 50 80 58 Z" fill={C} opacity="0.45" />
      <path d="M108 58 Q112 44 120 58 Q117 50 114 46 Q111 50 108 58 Z" fill={C} opacity="0.45" />
    </svg>
  );
}

export function HarbourCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Wide grounding base */}
      <ellipse cx="100" cy="172" rx="56" ry="14" fill={C} opacity="0.15" />
      {/* Lower body — round, settled */}
      <ellipse cx="100" cy="150" rx="46" ry="30" fill={C} />
      {/* Body */}
      <rect x="72" y="108" width="56" height="46" rx="14" fill={C} />
      {/* Wide welcoming arms */}
      <path d="M72 118 Q44 112 32 126 Q28 134 44 136 Q56 138 72 130 Z" fill={C} />
      <path d="M128 118 Q156 112 168 126 Q172 134 156 136 Q144 138 128 130 Z" fill={C} />
      {/* Hands — open */}
      <circle cx="32" cy="132" r="9" fill={C} />
      <circle cx="168" cy="132" r="9" fill={C} />
      {/* Head — round and warm */}
      <circle cx="100" cy="84" r="28" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Warm, steady eyes */}
      <circle cx="90" cy="82" r="4.5" fill={C} />
      <circle cx="110" cy="82" r="4.5" fill={C} />
      <circle cx="92" cy="80" r="1.5" fill="white" />
      <circle cx="112" cy="80" r="1.5" fill="white" />
      {/* Soft welcoming smile */}
      <path d="M87 94 Q100 105 113 94" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Rosy cheeks */}
      <circle cx="80" cy="91" r="6" fill={C} opacity="0.15" />
      <circle cx="120" cy="91" r="6" fill={C} opacity="0.15" />
    </svg>
  );
}

export function WandererCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Compass rose / direction lines */}
      <line x1="100" y1="20" x2="100" y2="44" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="156" x2="100" y2="180" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="20" y1="100" x2="44" y2="100" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="156" y1="100" x2="180" y2="100" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      {/* Body — tall, slightly asymmetric lean */}
      <path d="M80 116 L74 162 L90 166 L100 136 L110 166 L126 162 L120 116 Q112 110 100 110 Q88 110 80 116 Z" fill={C} transform="rotate(4 100 140)" />
      {/* One arm reaching / pointing */}
      <rect x="122" y="112" width="38" height="13" rx="6.5" fill={C} transform="rotate(-12 141 118)" />
      {/* Other arm relaxed */}
      <rect x="38" y="118" width="30" height="13" rx="6.5" fill={C} />
      {/* Head — tilted slightly, looking away/dreamy */}
      <circle cx="102" cy="82" r="26" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Dreamy half-lidded eyes */}
      <path d="M88 79 Q93 76 98 79" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M105 79 Q110 76 116 79" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="93" cy="81" r="3" fill={C} />
      <circle cx="111" cy="81" r="3" fill={C} />
      {/* Slight wistful smile */}
      <path d="M89 91 Q102 99 114 93" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Small star/dot above — wandering spirit */}
      <circle cx="148" cy="36" r="3.5" fill={C} opacity="0.5" />
      <circle cx="158" cy="28" r="2.5" fill={C} opacity="0.35" />
      <circle cx="142" cy="24" r="2" fill={C} opacity="0.25" />
    </svg>
  );
}

export function ArchitectCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Blueprint grid lines */}
      <line x1="40" y1="160" x2="160" y2="160" stroke={C} strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
      <line x1="40" y1="148" x2="160" y2="148" stroke={C} strokeWidth="1" opacity="0.1" strokeDasharray="4 4" />
      <line x1="60" y1="140" x2="60" y2="175" stroke={C} strokeWidth="1" opacity="0.1" strokeDasharray="4 4" />
      <line x1="140" y1="140" x2="140" y2="175" stroke={C} strokeWidth="1" opacity="0.1" strokeDasharray="4 4" />
      {/* Angular body — precise geometry */}
      <path d="M76 110 L72 162 L100 168 L128 162 L124 110 L100 106 Z" fill={C} />
      {/* Measured arms — straight out */}
      <rect x="34" y="114" width="44" height="12" rx="6" fill={C} />
      <rect x="122" y="114" width="44" height="12" rx="6" fill={C} />
      {/* Ruler / measuring tool in hand */}
      <rect x="28" y="112" width="8" height="20" rx="3" fill={DARK} opacity="0.6" />
      {/* Head — precise, square-ish feel */}
      <circle cx="100" cy="80" r="26" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Focused, deliberate eyes — square-shaped */}
      <rect x="87" y="75" width="9" height="9" rx="2" fill={C} />
      <rect x="104" y="75" width="9" height="9" rx="2" fill={C} />
      <rect x="89" y="77" width="3" height="3" rx="0.5" fill="white" />
      <rect x="106" y="77" width="3" height="3" rx="0.5" fill="white" />
      {/* Composed straight mouth */}
      <path d="M89 93 L111 93" stroke={C} strokeWidth="2.5" strokeLinecap="round" />
      {/* Small corner detail — methodical */}
      <path d="M74 67 L74 60 L81 60" stroke={C} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}

export function DevoteeCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Heart shape on chest */}
      <path d="M100 142 C100 142 72 126 72 110 C72 102 78 96 86 96 C92 96 97 100 100 104 C103 100 108 96 114 96 C122 96 128 102 128 110 C128 126 100 142 100 142 Z" fill={FACE} stroke={C} strokeWidth="2" />
      {/* Generous outstretched arms */}
      <path d="M72 118 Q48 108 30 116 Q22 124 30 130 Q44 136 68 126 Z" fill={C} />
      <path d="M128 118 Q152 108 170 116 Q178 124 170 130 Q156 136 132 126 Z" fill={C} />
      {/* Giving hands — open palms */}
      <ellipse cx="26" cy="124" rx="10" ry="8" fill={C} />
      <ellipse cx="174" cy="124" rx="10" ry="8" fill={C} />
      {/* Body */}
      <rect x="72" y="106" width="56" height="54" rx="14" fill={C} />
      {/* Head */}
      <circle cx="100" cy="78" r="26" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Warm, giving eyes */}
      <circle cx="90" cy="76" r="4.5" fill={C} />
      <circle cx="110" cy="76" r="4.5" fill={C} />
      <circle cx="92" cy="74" r="1.5" fill="white" />
      <circle cx="112" cy="74" r="1.5" fill="white" />
      {/* Generous warm smile */}
      <path d="M86 88 Q100 100 114 88" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Small floating hearts */}
      <path d="M58 54 C58 54 52 50 52 46 C52 43 54 41 57 41 C58.5 41 60 42 61 43 C62 42 63.5 41 65 41 C68 41 70 43 70 46 C70 50 64 54 61 56 Z" fill={C} opacity="0.4" />
      <path d="M138 48 C138 48 133 44.5 133 41 C133 38.5 134.8 36.5 137 36.5 C138.2 36.5 139.4 37.3 140 38 C140.6 37.3 141.8 36.5 143 36.5 C145.2 36.5 147 38.5 147 41 C147 44.5 142 48 140 50 Z" fill={C} opacity="0.3" />
    </svg>
  );
}

export function MirrorCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Mirror frame — oval shape */}
      <ellipse cx="100" cy="96" rx="54" ry="66" fill="none" stroke={C} strokeWidth="3" opacity="0.2" />
      <ellipse cx="100" cy="96" rx="48" ry="60" fill="none" stroke={C} strokeWidth="1.5" opacity="0.12" />
      {/* Symmetric body */}
      <path d="M78 116 L72 162 L100 166 L128 162 L122 116 Q112 110 100 110 Q88 110 78 116 Z" fill={C} />
      {/* Perfectly symmetric arms */}
      <rect x="36" y="116" width="44" height="13" rx="6.5" fill={C} />
      <rect x="120" y="116" width="44" height="13" rx="6.5" fill={C} />
      {/* Head */}
      <circle cx="100" cy="80" r="26" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Deep knowing eyes — slightly heavier */}
      <circle cx="90" cy="78" r="5" fill={C} />
      <circle cx="110" cy="78" r="5" fill={C} />
      <circle cx="92" cy="76" r="1.5" fill="white" />
      <circle cx="112" cy="76" r="1.5" fill="white" />
      {/* Subtle knowing smile */}
      <path d="M90 91 Q100 97 110 91" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Mirror reflection effect — light line down center */}
      <line x1="100" y1="56" x2="100" y2="104" stroke={C} strokeWidth="1" opacity="0.12" strokeDasharray="3 3" />
    </svg>
  );
}

export function SparkCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Electric rays */}
      <line x1="100" y1="100" x2="100" y2="22" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <line x1="100" y1="100" x2="164" y2="50" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <line x1="100" y1="100" x2="178" y2="100" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <line x1="100" y1="100" x2="164" y2="150" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <line x1="100" y1="100" x2="36" y2="50" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <line x1="100" y1="100" x2="22" y2="100" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      {/* Spark dots at tips */}
      <circle cx="100" cy="26" r="5" fill={C} opacity="0.5" />
      <circle cx="160" cy="54" r="4.5" fill={C} opacity="0.45" />
      <circle cx="174" cy="100" r="4.5" fill={C} opacity="0.45" />
      <circle cx="40" cy="54" r="4.5" fill={C} opacity="0.45" />
      <circle cx="26" cy="100" r="4.5" fill={C} opacity="0.45" />
      {/* Lightning bolt on body */}
      <path d="M105 108 L95 130 L104 130 L94 158 L116 126 L106 126 L118 108 Z" fill={DARK} opacity="0.25" />
      {/* Body */}
      <rect x="74" y="106" width="52" height="50" rx="14" fill={C} transform="rotate(-2 100 131)" />
      {/* Head */}
      <circle cx="100" cy="80" r="25" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Wide excited eyes */}
      <circle cx="90" cy="78" r="5" fill={C} />
      <circle cx="110" cy="78" r="5" fill={C} />
      <circle cx="92" cy="76" r="2" fill="white" />
      <circle cx="112" cy="76" r="2" fill="white" />
      {/* Big electric grin */}
      <path d="M84 90 Q100 104 116 90" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function AnchorLoveCharacter({ size = 200, className }: CharacterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      {/* Deep grounding shadow */}
      <ellipse cx="100" cy="174" rx="54" ry="12" fill={C} opacity="0.12" />
      {/* Lower body — solid, wide */}
      <ellipse cx="100" cy="152" rx="46" ry="28" fill={C} />
      {/* Body */}
      <rect x="72" y="110" width="56" height="46" rx="13" fill={C} />
      {/* Strong anchoring arms */}
      <ellipse cx="44" cy="124" rx="24" ry="12" fill={C} />
      <ellipse cx="156" cy="124" rx="24" ry="12" fill={C} />
      {/* Small anchor icon on chest */}
      <circle cx="100" cy="122" r="5" stroke={FACE} strokeWidth="2" fill="none" opacity="0.6" />
      <line x1="100" y1="127" x2="100" y2="138" stroke={FACE} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M92 136 Q92 141 100 141 Q108 141 108 136" stroke={FACE} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      <line x1="96" y1="118" x2="104" y2="118" stroke={FACE} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Head — serene, deeply calm */}
      <circle cx="100" cy="84" r="28" fill={FACE} stroke={C} strokeWidth="2.5" />
      {/* Serene closed-ish eyes */}
      <path d="M86 81 Q91 78 96 81" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M104 81 Q109 78 114 81" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="91" cy="83" r="3" fill={C} />
      <circle cx="109" cy="83" r="3" fill={C} />
      <circle cx="92" cy="82" r="1" fill="white" />
      <circle cx="110" cy="82" r="1" fill="white" />
      {/* Peaceful serene smile */}
      <path d="M88 95 Q100 104 112 95" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
