export function Check({ color, size = 16, className }: { color: string; size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" className={className} style={{ flex: "none" }}>
      <path d="M3 8.5 L6.5 12 L13 4.5" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
