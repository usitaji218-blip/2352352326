/**
 * StonkFun - Trader Reward Pool Configuration
 * All editable parameters, links, copy, and demo wallets are defined here.
 */
window.STONK_CONFIG = {
  // Main branding & copy
  brand: {
    name: "StonkFun",
    token: "$STONK",
    network: "Solana",
    logoUrl: "img/logo.svg"
  },

  // Reward pool details
  pool: {
    badge: "Trader reward pool",
    headline: "$1,000,000 for StonkFun traders",
    description: "This pool is reserved for wallets that have traded a token launched on StonkFun — buying or selling counts, holding alone doesn't. Connect your wallet to see if your trading history qualifies.",
    totalValue: "$1,000,000",
    totalValueSub: "Reserved for eligible traders",
    eligibleTokens: "All StonkFun\nlaunches",
    eligibleTokensSub: "Any token launched on the platform",
    claimWindow: "Open now",
    claimWindowSub: "Snapshot based on trade history",
    claimExpires: "2026-10-31T23:59:59Z"
  },

  // Eligibility block
  checker: {
    title: "Check your eligibility",
    description: "Connect your wallet to check whether your on-chain trade history on StonkFun-launched tokens qualifies you for a share of the pool.",
    ctaButton: "Check my eligibility"
  },

  // Who qualifies list
  rules: [
    {
      highlight: "Traded, not just held —",
      text: "at least one buy or sell of any token launched on StonkFun"
    },
    {
      highlight: "Any launch counts —",
      text: "trades on any StonkFun-launched token are eligible, not just $STONKS"
    },
    {
      highlight: "One claim per wallet —",
      text: "reward size scales with trading volume and activity, not balance"
    },
    {
      highlight: "Wash-trading excluded —",
      text: "self-trades and sybil patterns are filtered out before payout"
    }
  ],

  // Links & Socials
  links: {
    telegram: "https://t.me/StonkFun",
    twitter: "https://x.com/StonkFun",
    stonkToken: "#stonk",
    revenue: "#revenue",
    api: "#api",
    rewards: "#rewards",
    terms: "#terms"
  },

  // Mock / Demo wallets for live interactive eligibility testing
  demoWallets: {
    "7xKXvP9m1Q2W3E4R5T6Y7U8I9O0P_TOP": {
      address: "7xKXvP9m1Q2W3E4R5T6Y7U8I9O0PaS2d",
      eligible: true,
      tier: "Tier 1 (Top 2%)",
      tokensTraded: 28,
      totalVolume: "$142,580",
      rewardUsd: "$3,450.00",
      rewardTokens: "11,200 $STONK",
      txCount: 84,
      multiplier: "2.5x",
      sybilCheck: "Passed ✓"
    },
    "3vM4aB5cD6eF7gH8jK9mN0pQ1rS2tU_ACTIVE": {
      address: "3vM4aB5cD6eF7gH8jK9mN0pQ1rS2tU3v",
      eligible: true,
      tier: "Tier 2 (Active Trader)",
      tokensTraded: 9,
      totalVolume: "$28,400",
      rewardUsd: "$1,250.00",
      rewardTokens: "4,120 $STONK",
      txCount: 22,
      multiplier: "1.4x",
      sybilCheck: "Passed ✓"
    },
    "9wQ1xY2zA3bC4dE5fG6hI7jK8lM9nO_CASUAL": {
      address: "9wQ1xY2zA3bC4dE5fG6hI7jK8lM9nOpQ",
      eligible: true,
      tier: "Tier 3 (Trader)",
      tokensTraded: 2,
      totalVolume: "$3,200",
      rewardUsd: "$320.00",
      rewardTokens: "1,050 $STONK",
      txCount: 4,
      multiplier: "1.0x",
      sybilCheck: "Passed ✓"
    },
    "5kR8sT1uV2wX3yZ4aB5cD6eF7gH8jK_INELIGIBLE": {
      address: "5kR8sT1uV2wX3yZ4aB5cD6eF7gH8jKmN",
      eligible: false,
      reason: "No buy or sell transactions detected on StonkFun-launched tokens before the snapshot.",
      advice: "Holding tokens alone without trading activity does not qualify for this pool."
    }
  }
};
