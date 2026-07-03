interface CGMarkProps {
  size?: number;
  color?: string;
  className?: string;
}

function colorFilter(color: string): string | undefined {
  const c = color.toLowerCase().trim();
  if (
    c === "currentcolor" ||
    c === "black" ||
    c === "#000" ||
    c === "#000000" ||
    c === "#0a0a0a"
  ) {
    return undefined;
  }
  if (c === "white" || c === "#fff" || c === "#ffffff" || c === "#fafafa") {
    return "brightness(0) invert(1)";
  }
  // Amber (#f59e0b)
  if (c === "#f59e0b") {
    return "brightness(0) saturate(100%) invert(72%) sepia(97%) saturate(581%) hue-rotate(355deg) brightness(104%)";
  }
  return undefined;
}

export function CGMark({ size = 40, color = "currentColor", className = "" }: CGMarkProps) {
  const filter = colorFilter(color);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/cg-badge.png"
      width={size}
      height={size}
      alt="Common Ground Workshop"
      className={className}
      style={filter ? { filter } : undefined}
    />
  );
}

export function CGLogoHorizontal({
  size = 40,
  markColor = "currentColor",
  className = "",
}: {
  size?: number;
  markColor?: string;
  className?: string;
}) {
  return <CGMark size={size} color={markColor} className={className} />;
}

export function CGLogoStacked({
  size = 72,
  markColor = "currentColor",
  className = "",
}: {
  size?: number;
  markColor?: string;
  className?: string;
}) {
  return <CGMark size={size} color={markColor} className={className} />;
}
