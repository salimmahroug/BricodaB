export default function Logo({ dark = false }) {
  const fg = dark ? "#fff" : "#151515";
  return (
    <svg viewBox="0 0 250 84" role="img" aria-label="Brico Dab Zarzis">
      <path d="M32 26 L66 6 L100 26" fill="none" stroke="#f5c518" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M86 18 V8 h8 v14" fill="none" stroke={fg} strokeWidth="4" />
      <rect x="61" y="17" width="4" height="4" fill="#f5c518" /><rect x="67" y="17" width="4" height="4" fill="#f5c518" />
      <rect x="61" y="23" width="4" height="4" fill="#f5c518" /><rect x="67" y="23" width="4" height="4" fill="#f5c518" />
      <text x="2" y="60" fontFamily="Montserrat, Poppins, sans-serif" fontWeight="800" fontSize="36" fill={fg} letterSpacing="-.5">BRICO</text>
      <text x="130" y="60" fontFamily="Montserrat, Poppins, sans-serif" fontWeight="800" fontSize="36" fill="#f5c518" letterSpacing="-.5">DAB</text>
      <line x1="4" y1="75" x2="78" y2="75" stroke="#f5c518" strokeWidth="2.5" />
      <line x1="170" y1="75" x2="212" y2="75" stroke="#f5c518" strokeWidth="2.5" />
      <text x="124" y="80" textAnchor="middle" fontFamily="Montserrat, Poppins, sans-serif" fontWeight="700" fontSize="14" letterSpacing="4" fill={fg}>ZARZIS</text>
    </svg>
  );
}
