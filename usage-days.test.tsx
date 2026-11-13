// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { UsageDays } from "./usage-days.js";

afterEach(cleanup);

function renderDays(providerId: string, label: string, usedPercent: number) {
  return render(
    <UsageDays
      providerId={providerId}
      window={{ label, usedPercent, resetsAt: null, cost: null }}
    />,
  );
}

describe("day-equivalent usage", () => {
  it.each([
    ["codex", "Weekly limit", 7, 3.5],
    ["codex", "Weekly · Spark", 7, 3.5],
    ["acp-cursor", "Tokens this month", 30, 15],
  ])("converts %s %s consumption to days", (providerId, label, count, days) => {
    const view = renderDays(providerId, label, 50);
    const meter = view.getByRole("meter");
    expect(meter.children).toHaveLength(count);
    expect(meter.getAttribute("aria-valuenow")).toBe(String(days));
    expect(meter.getAttribute("aria-valuemax")).toBe(String(count));
    const filled = Array.from(meter.children).map((segment) =>
      segment.firstElementChild?.getAttribute("style"),
    );
    expect(filled.slice(0, Math.floor(days))).toEqual(
      Array.from({ length: Math.floor(days) }, () => "width: 100%;"),
    );
    if (days % 1 !== 0) expect(filled[Math.floor(days)]).toBe("width: 50%;");
    expect(filled.slice(Math.ceil(days))).toEqual(
      Array.from({ length: count - Math.ceil(days) }, () => "width: 0%;"),
    );
  });

  it.each([0, -10, 100, 140])(
    "bounds segment fill for %s percent",
    (percent) => {
      const view = renderDays("codex", "Weekly limit", percent);
      const meter = view.getByRole("meter");
      expect(meter.getAttribute("aria-valuenow")).toBe(
        percent <= 0 ? "0" : "7",
      );
      for (const segment of meter.children) {
        expect(segment.firstElementChild?.getAttribute("style")).toBe(
          percent <= 0 ? "width: 0%;" : "width: 100%;",
        );
      }
    },
  );

  it.each([
    ["codex", "Five-hour limit"],
    ["claude-code", "Weekly limit"],
    ["acp-opencode", "Monthly"],
  ])("omits day meters for %s %s", (providerId, label) => {
    expect(renderDays(providerId, label, 50).queryByRole("meter")).toBeNull();
  });
});
