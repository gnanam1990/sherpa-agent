import { describe, expect, it } from "vitest";
import {
  ARC_TESTNET,
  actionToBytes32,
  arcTestnet,
  decodeRejectionReason,
  formatUsdc,
  planEventLogRanges,
  parseUsdc,
} from "./index.js";

describe("USDC helpers", () => {
  it("parses whole and fractional USDC into 6-decimal base units", () => {
    expect(parseUsdc("50")).toBe(50_000_000n);
    expect(parseUsdc("0.5")).toBe(500_000n);
    expect(parseUsdc("1.000001")).toBe(1_000_001n);
  });

  it("formats 6-decimal USDC base units", () => {
    expect(formatUsdc(50_000_000n)).toBe("50");
    expect(formatUsdc(500_000n)).toBe("0.5");
    expect(formatUsdc(1_000_001n)).toBe("1.000001");
  });

  it("rejects over-precision amounts", () => {
    expect(() => parseUsdc("0.0000001")).toThrow();
  });
});

describe("Arc Testnet constants", () => {
  it("keeps native gas and ERC-20 USDC precision separate", () => {
    expect(arcTestnet.nativeCurrency.decimals).toBe(18);
    expect(ARC_TESTNET.nativeCurrencyDecimals).toBe(18);
    expect(ARC_TESTNET.usdcErc20Decimals).toBe(6);
  });
});

describe("contract mappings", () => {
  it("maps contract enum values to SDK reasons", () => {
    expect(decodeRejectionReason(0)).toBe("NONE");
    expect(decodeRejectionReason(7)).toBe("DAILY_CAP_EXCEEDED");
    expect(decodeRejectionReason(8)).toBe("COUNTERPARTY_CAP_EXCEEDED");
  });

  it("hashes human action labels to bytes32 tags", () => {
    expect(actionToBytes32("api_call")).toMatch(/^0x[0-9a-f]{64}$/);
  });
});

describe("event log range planning", () => {
  it("chunks ranges under Arc RPC getLogs limits", () => {
    expect(
      planEventLogRanges({
        fromBlock: 10n,
        toBlock: 25n,
        latestBlock: 25n,
        maxBlockRange: 5n,
      }),
    ).toEqual([
      { fromBlock: 10n, toBlock: 15n },
      { fromBlock: 16n, toBlock: 21n },
      { fromBlock: 22n, toBlock: 25n },
    ]);
  });

  it("defaults to the latest safe window when no fromBlock is provided", () => {
    expect(
      planEventLogRanges({
        latestBlock: 100n,
        maxBlockRange: 10n,
      }),
    ).toEqual([{ fromBlock: 90n, toBlock: 100n }]);
  });
});
