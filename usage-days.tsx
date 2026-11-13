import type { UsageWindow } from "./usage-schema.js";
import { usageBarColorClass } from "./usage-format.js";

export function UsageDays({
  providerId,
  window,
}: {
  providerId: string;
  window: UsageWindow;
}) {
  const days =
    providerId === "codex" && /^Weekly\b/u.test(window.label)
      ? 7
      : providerId === "acp-cursor"
        ? 30
        : null;
  if (days === null) return null;
  const usedDays = (Math.max(0, window.usedPercent) * days) / 100;
  const label = `${usedDays.toLocaleString(undefined, { maximumFractionDigits: 1 })} / ${days} days used`;
  return (
    <span className="flex min-w-0 items-center gap-2 py-0.5">
      <span
        role="meter"
        aria-label={`${window.label}: usage in days`}
        aria-valuemin={0}
        aria-valuemax={days}
        aria-valuenow={Math.min(days, usedDays)}
        aria-valuetext={label}
        title={`${label} · 1 day = ${(100 / days).toLocaleString(undefined, { maximumFractionDigits: 2 })}% of the limit`}
        className="grid min-w-0 flex-1 gap-px"
        style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: days }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="h-2 overflow-hidden bg-sidebar-border"
          >
            <span
              className={`block h-full ${usageBarColorClass(window.usedPercent)}`}
              style={{
                width: `${Math.max(0, Math.min(1, usedDays - index)) * 100}%`,
              }}
            />
          </span>
        ))}
      </span>
      <span className="shrink-0 text-2xs tabular-nums text-subtle-foreground">
        {label}
      </span>
    </span>
  );
}
