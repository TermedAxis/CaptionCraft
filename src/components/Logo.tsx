interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 32, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Wizard hat body */}
      <path
        d="M16 3L7 22h18L16 3z"
        fill="white"
        fillOpacity="0.92"
      />
      {/* Hat brim */}
      <rect x="5" y="22" width="22" height="4" rx="2" fill="white" fillOpacity="0.75" />
      {/* Band on hat */}
      <rect x="10" y="19.5" width="12" height="2.5" rx="1.25" fill="white" fillOpacity="0.45" />
      {/* Star sparkle top-right */}
      <path
        d="M26 5l.6 1.8 1.9.6-1.9.6L26 10l-.6-2-1.9-.6 1.9-.6L26 5z"
        fill="white"
        fillOpacity="0.9"
      />
      {/* Star sparkle bottom-left */}
      <path
        d="M6 14l.4 1.2 1.2.4-1.2.4L6 17.2l-.4-1.2-1.2-.4 1.2-.4L6 14z"
        fill="white"
        fillOpacity="0.7"
      />
      {/* Wand dot on hat */}
      <circle cx="16" cy="3.5" r="1.5" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

export function LogoWordmark({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <LogoMark size={22} />
      </div>
      <span className={`text-lg font-bold ${dark ? 'text-gray-900' : 'text-gray-900'} hidden sm:block`}>
        Media Wizard
      </span>
    </div>
  );
}
