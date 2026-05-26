import { describe, expect, it } from "vitest";
import {
  clamp,
  displayAddress,
  escapeHtml,
  percent,
  shortAddress,
  shortHash,
} from "./view-utils.js";

describe("dashboard view utilities", () => {
  it("computes integer percentages safely", () => {
    expect(percent(25n, 100n)).toBe(25);
    expect(percent(1n, 3n)).toBe(33);
    expect(percent(1n, 0n)).toBe(0);
  });

  it("clamps meter values to the 0-100 range", () => {
    expect(clamp(-4)).toBe(0);
    expect(clamp(42)).toBe(42);
    expect(clamp(150)).toBe(100);
  });

  it("shortens addresses and hashes for dense dashboard rows", () => {
    expect(shortAddress("0x78E7F4a3e06997D5f2EEF35db20bD85C626EC60A")).toBe(
      "0x78E7...C60A",
    );
    expect(shortHash("0x5549b9682b76b2069d462c06aab99b0521cd75835cefab15886f031b3323f5d0")).toBe(
      "0x5549b9...23f5d0",
    );
  });

  it("escapes non-address display strings", () => {
    expect(displayAddress("<script>")).toBe("&lt;script&gt;");
    expect(escapeHtml(`"agent" & 'operator'`)).toBe(
      "&quot;agent&quot; &amp; &#039;operator&#039;",
    );
  });
});
