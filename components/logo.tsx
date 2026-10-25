export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0A0F1A" />
      <rect x="7" y="6" width="5" height="20" rx="2" fill="#F0F4F8" />
      <rect x="7" y="6" width="16" height="5" rx="2" fill="#F0F4F8" />
      <rect x="7" y="14" width="12" height="4" rx="2" fill="#F0F4F8" />
      <circle cx="26" cy="8.5" r="3.5" fill="#b8f566" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[1.05rem] font-semibold tracking-tight">Fiscit</span>
    </span>
  );
}
