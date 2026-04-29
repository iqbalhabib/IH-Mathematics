export default function IHLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="IH Mathematics Logo"
    >
      {/* Rotated square (diamond points) */}
      <polygon
        points="50,3 97,50 50,97 3,50"
        fill="#2563EB"
        stroke="#111827"
        strokeWidth="4"
      />
      {/* Regular octagon */}
      <polygon
        points="88,32 68,11 32,11 12,32 12,68 32,89 68,89 88,68"
        fill="#2563EB"
        stroke="#111827"
        strokeWidth="4"
      />
      {/* I — three vertical bars */}
      <rect x="22" y="30" width="4" height="40" fill="#F59E0B" rx="1" />
      <rect x="28" y="30" width="4" height="40" fill="#F59E0B" rx="1" />
      <rect x="34" y="30" width="4" height="40" fill="#F59E0B" rx="1" />
      {/* Serifs on I */}
      <rect x="20" y="30" width="20" height="4"  fill="#F59E0B" rx="1" />
      <rect x="20" y="66" width="20" height="4"  fill="#F59E0B" rx="1" />

      {/* H */}
      <rect x="44" y="30" width="5"  height="40" fill="#F59E0B" rx="1" />
      <rect x="44" y="47" width="20" height="5"  fill="#F59E0B" rx="1" />
      <rect x="59" y="30" width="5"  height="40" fill="#F59E0B" rx="1" />
      {/* Serifs on H */}
      <rect x="42" y="30" width="9"  height="4"  fill="#F59E0B" rx="1" />
      <rect x="42" y="66" width="9"  height="4"  fill="#F59E0B" rx="1" />
      <rect x="57" y="30" width="9"  height="4"  fill="#F59E0B" rx="1" />
      <rect x="57" y="66" width="9"  height="4"  fill="#F59E0B" rx="1" />
    </svg>
  );
}
