import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  toBytes,
  type Chain,
  type Hex,
  type PublicClient,
  type WalletClient,
} from "viem";
import { spendAccountAbi } from "./abi.js";
import { parseUsdc } from "./amounts.js";
import { arcTestnet } from "./chain.js";
import { decodeRejectionReason } from "./reasons.js";
import type {
  AuditEvent,
  AuditEventQuery,
  BudgetState,
  CounterpartyState,
  GuardrailsClientConfig,
  HexAddress,
  SpendRequest,
  SpendResult,
} from "./types.js";

const DEFAULT_EVENT_LOG_RANGE = 9_000n;

export class GuardrailsClient {
  readonly accountAddress: HexAddress;
  readonly publicClient: PublicClient;
  readonly walletClient?: WalletClient;
  readonly chain: Chain;

  constructor(private readonly config: GuardrailsClientConfig) {
    this.chain = config.chain ?? arcTestnet;
    const transport = http(config.rpcUrl ?? this.chain.rpcUrls.default.http[0]);

    this.accountAddress = config.accountAddress;
    this.publicClient = createPublicClient({ chain: this.chain, transport });
    if (config.account) {
      this.walletClient = createWalletClient({
        account: config.account,
        chain: this.chain,
        transport,
      });
    }
  }

  async state(): Promise<BudgetState> {
    const [perTxCap, dailyCap, daySpent, remainingDailyCap, paused, revoked] =
      await Promise.all([
        this.publicClient.readContract({
          address: this.accountAddress,
          abi: spendAccountAbi,
          functionName: "perTxCap",
        }),
        this.publicClient.readContract({
          address: this.accountAddress,
          abi: spendAccountAbi,
          functionName: "dailyCap",
        }),
        this.publicClient.readContract({
          address: this.accountAddress,
          abi: spendAccountAbi,
          functionName: "daySpent",
        }),
        this.publicClient.readContract({
          address: this.accountAddress,
          abi: spendAccountAbi,
          functionName: "remainingDailyCap",
        }),
        this.publicClient.readContract({
          address: this.accountAddress,
          abi: spendAccountAbi,
          functionName: "paused",
        }),
        this.publicClient.readContract({
          address: this.accountAddress,
          abi: spendAccountAbi,
          functionName: "revoked",
        }),
      ]);

    return {
      perTxCap,
      dailyCap,
      daySpent,
      remainingDailyCap,
      paused,
      revoked,
    };
  }

  async spend(request: SpendRequest): Promise<SpendResult> {
    if (!this.config.account || !this.walletClient) {
      throw new Error("GuardrailsClient.spend requires a signer account");
    }

    const amountBaseUnits = parseUsdc(request.amountUsdc);
    const reasonValue = await this.publicClient.readContract({
      address: this.accountAddress,
      abi: spendAccountAbi,
      functionName: "canAgentSpend",
      args: [request.counterparty, amountBaseUnits],
    });
    const reason = decodeRejectionReason(Number(reasonValue));

    if (reason !== "NONE") {
      if (request.recordRejection !== false) {
        const txHash = await this.walletClient.writeContract({
          address: this.accountAddress,
          abi: spendAccountAbi,
          functionName: "requestSpend",
          account: this.config.account,
          chain: this.chain,
          args: [
            request.counterparty,
            amountBaseUnits,
            actionToBytes32(request.action),
          ],
        });

        return {
          ok: false,
          reason,
          txHash,
          counterparty: request.counterparty,
          amountBaseUnits,
        };
      }

      return {
        ok: false,
        reason,
        counterparty: request.counterparty,
        amountBaseUnits,
      };
    }

    const txHash = await this.walletClient.writeContract({
      address: this.accountAddress,
      abi: spendAccountAbi,
      functionName: "requestSpend",
      account: this.config.account,
      chain: this.chain,
      args: [
        request.counterparty,
        amountBaseUnits,
        actionToBytes32(request.action),
      ],
    });

    return {
      ok: true,
      txHash,
      counterparty: request.counterparty,
      amountBaseUnits,
    };
  }

  async counterpartyState(counterparty: HexAddress): Promise<CounterpartyState> {
    const [allowed, cap, spent, remaining] = await Promise.all([
      this.publicClient.readContract({
        address: this.accountAddress,
        abi: spendAccountAbi,
        functionName: "counterpartyAllowed",
        args: [counterparty],
      }),
      this.publicClient.readContract({
        address: this.accountAddress,
        abi: spendAccountAbi,
        functionName: "counterpartyCap",
        args: [counterparty],
      }),
      this.publicClient.readContract({
        address: this.accountAddress,
        abi: spendAccountAbi,
        functionName: "counterpartySpent",
        args: [counterparty],
      }),
      this.publicClient.readContract({
        address: this.accountAddress,
        abi: spendAccountAbi,
        functionName: "remainingCounterpartyCap",
        args: [counterparty],
      }),
    ]);

    return {
      counterparty,
      allowed,
      cap,
      spent,
      remaining,
    };
  }

  async auditEvents(query: AuditEventQuery = {}): Promise<AuditEvent[]> {
    const latestBlock =
      query.toBlock === "latest" || query.toBlock === undefined
        ? await this.publicClient.getBlockNumber()
        : query.toBlock;
    const ranges = planEventLogRanges({
      fromBlock: query.fromBlock,
      toBlock: query.toBlock,
      latestBlock,
      maxBlockRange: query.maxBlockRange,
    });

    const eventPages = await Promise.all(
      ranges.map(async (range) => {
        const [executed, rejected] = await Promise.all([
          this.publicClient.getContractEvents({
            address: this.accountAddress,
            abi: spendAccountAbi,
            eventName: "SpendExecuted",
            fromBlock: range.fromBlock,
            toBlock: range.toBlock,
          }),
          this.publicClient.getContractEvents({
            address: this.accountAddress,
            abi: spendAccountAbi,
            eventName: "SpendRejected",
            fromBlock: range.fromBlock,
            toBlock: range.toBlock,
          }),
        ]);

        return { executed, rejected };
      }),
    );
    const executed = eventPages.flatMap((page) => page.executed);
    const rejected = eventPages.flatMap((page) => page.rejected);

    const approvedEvents = executed.map((event) => {
      const args = event.args as {
        agent?: HexAddress;
        counterparty?: HexAddress;
        amount?: bigint;
        action?: Hex;
        remainingDailyCap?: bigint;
      };

      return {
        id: `${event.transactionHash}-${event.logIndex}`,
        status: "approved" as const,
        agent: requireArg(args.agent, "agent"),
        counterparty: requireArg(args.counterparty, "counterparty"),
        amountBaseUnits: requireArg(args.amount, "amount"),
        action: requireArg(args.action, "action"),
        remainingDailyCap: requireArg(args.remainingDailyCap, "remainingDailyCap"),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex,
      };
    });

    const rejectedEvents = rejected.map((event) => {
      const args = event.args as {
        agent?: HexAddress;
        counterparty?: HexAddress;
        amount?: bigint;
        action?: Hex;
        reason?: number;
      };

      return {
        id: `${event.transactionHash}-${event.logIndex}`,
        status: "rejected" as const,
        agent: requireArg(args.agent, "agent"),
        counterparty: requireArg(args.counterparty, "counterparty"),
        amountBaseUnits: requireArg(args.amount, "amount"),
        action: requireArg(args.action, "action"),
        reason: decodeRejectionReason(Number(requireArg(args.reason, "reason"))),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex,
      };
    });

    return [...approvedEvents, ...rejectedEvents].sort((a, b) => {
      if (a.blockNumber === b.blockNumber) return a.logIndex - b.logIndex;
      return a.blockNumber < b.blockNumber ? -1 : 1;
    });
  }
}

export function createGuardrailsClient(config: GuardrailsClientConfig): GuardrailsClient {
  return new GuardrailsClient(config);
}

export function actionToBytes32(action: string): `0x${string}` {
  return keccak256(toBytes(action));
}

export type EventLogRangePlan = {
  fromBlock?: bigint;
  toBlock?: bigint | "latest";
  latestBlock: bigint;
  maxBlockRange?: bigint;
};

export function planEventLogRanges({
  fromBlock,
  toBlock,
  latestBlock,
  maxBlockRange = DEFAULT_EVENT_LOG_RANGE,
}: EventLogRangePlan) {
  if (maxBlockRange <= 0n) {
    throw new Error("maxBlockRange must be greater than zero");
  }

  const resolvedToBlock = toBlock === "latest" || toBlock === undefined
    ? latestBlock
    : toBlock;
  const resolvedFromBlock =
    fromBlock ?? (resolvedToBlock > maxBlockRange ? resolvedToBlock - maxBlockRange : 0n);

  if (resolvedFromBlock > resolvedToBlock) {
    return [];
  }

  const ranges: Array<{ fromBlock: bigint; toBlock: bigint }> = [];
  for (
    let start = resolvedFromBlock;
    start <= resolvedToBlock;
    start += maxBlockRange + 1n
  ) {
    const end =
      start + maxBlockRange > resolvedToBlock
        ? resolvedToBlock
        : start + maxBlockRange;
    ranges.push({ fromBlock: start, toBlock: end });
  }

  return ranges;
}

function requireArg<T>(value: T | undefined, name: string): T {
  if (value === undefined) {
    throw new Error(`Missing event argument: ${name}`);
  }
  return value;
}
