export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 28 28">
      <rect x="7" y="2" width="16" height="22" rx="3" fill="#F7C548" transform="rotate(12 15 13)" />
      <rect x="4" y="4" width="16" height="22" rx="3" fill="#FFF7E8" stroke="#14302B" strokeWidth="1.5" />
      <circle cx="12" cy="15" r="4" fill="#2A9D8F" />
    </svg>
  );
}
