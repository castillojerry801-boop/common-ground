interface CGMarkProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * The CG combined letterform mark.
 * Uses currentColor so it inherits from the parent text color.
 */
export function CGMark({ size = 40, color = "currentColor", className = "" }: CGMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Outer C ring — 270° arc, gap at upper-right to lower-right */}
      <path
        d="M 80.4 19.6 A 43 43 0 1 0 80.4 80.4"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Inner G arc — concentric, same gap angle */}
      <path
        d="M 69.8 30.2 A 28 28 0 1 0 69.8 69.8"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* G crossbar — extends leftward from the outer right edge */}
      <path
        d="M 80.4 50 L 54 50"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* G vertical — drops from crossbar to lower gap */}
      <path
        d="M 80.4 50 L 80.4 80.4"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Horizontal lockup: CG mark + amber divider + stacked wordmark.
 * Use in Navbar and compact headers.
 */
export function CGLogoHorizontal({
  size = 36,
  markColor = "currentColor",
  className = "",
}: {
  size?: number;
  markColor?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CGMark size={size} color={markColor} />
      {/* Amber divider */}
      <div className="w-px self-stretch bg-amber-500/70" />
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className="font-bold tracking-[0.12em] uppercase text-current"
          style={{ fontSize: size * 0.33 }}
        >
          Common Ground
        </span>
        <span
          className="tracking-[0.18em] uppercase text-current opacity-50 mt-0.5"
          style={{ fontSize: size * 0.22 }}
        >
          — Workshop —
        </span>
      </div>
    </div>
  );
}

/**
 * Stacked lockup: CG mark centered above wordmark.
 * Use on login pages and splash screens.
 */
export function CGLogoStacked({
  size = 72,
  markColor = "currentColor",
  className = "",
}: {
  size?: number;
  markColor?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <CGMark size={size} color={markColor} />
      {/* Amber rule */}
      <div className="w-6 h-px bg-amber-500" />
      <div className="flex flex-col items-center leading-none gap-1">
        <span
          className="font-bold tracking-[0.15em] uppercase text-current"
          style={{ fontSize: size * 0.22 }}
        >
          Common Ground
        </span>
        <span
          className="tracking-[0.2em] uppercase text-current opacity-50"
          style={{ fontSize: size * 0.14 }}
        >
          — Workshop —
        </span>
      </div>
    </div>
  );
}
