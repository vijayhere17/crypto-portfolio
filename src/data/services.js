// ─────────────────────────────────────────────────────────────
//  Services. The showcase, detail view and ecosystem map all read
//  from this list — add, remove or reorder entries here.
//
//  visual:  which built-in illustration to show (see ServiceVisual.jsx)
//  image:   optional real image / screenshot that replaces the illustration
// ─────────────────────────────────────────────────────────────

export const services = [
  {
    id: 'blockchain',
    title: 'Blockchain Development',
    short: 'Blockchain',
    tagline: 'Your own chain, built for your use case.',
    summary:
      'Custom blockchains, private and consortium networks and forks of proven chains — engineered for throughput, security and clear governance.',
    features: [
      'Custom network & consensus design',
      'Public, private or consortium chains',
      'Nodes, validators & staking setup',
      'Block explorer & network tooling',
      'Native coin, genesis & governance config',
      'Testnet → mainnet deployment',
    ],
    stack: ['EVM', 'Solidity', 'Node.js', 'Docker'],
    visual: 'blockchain',
    hue: 18,
  },
  {
    id: 'dapp',
    title: 'Decentralized Project Development',
    short: 'dApps',
    tagline: 'Products that run on-chain — not on trust.',
    summary:
      'Decentralized applications where the rules live in smart contracts: staking, rewards, DAOs and community platforms with a clean Web2-grade interface.',
    features: [
      'Smart-contract backed business logic',
      'MetaMask, Trust Wallet & WalletConnect',
      'Staking, farming & reward systems',
      'DAO voting & on-chain governance',
      'Admin dashboards & analytics',
      'Audit-ready, tested contracts',
    ],
    stack: ['Solidity', 'React', 'Ethers.js', 'BSC'],
    visual: 'dapp',
    hue: 28,
  },
  {
    id: 'wallet',
    title: 'Decentralized Wallet Development',
    short: 'Web3 Wallet',
    tagline: 'Self-custody wallets people actually trust.',
    summary:
      'Non-custodial wallets for mobile, web and browser extension — multi-chain, multi-token, with swaps and a dApp browser built in.',
    features: [
      'Non-custodial keys & seed-phrase backup',
      'Multi-chain & multi-token support',
      'Send, receive & in-app swap',
      'dApp browser & WalletConnect',
      'Biometric & PIN protection',
      'Android, iOS & browser extension',
    ],
    stack: ['React Native', 'Ethers.js', 'BIP-39', 'WalletConnect'],
    visual: 'wallet',
    hue: 200,
  },
  {
    id: 'dex',
    title: 'Decentralized Exchange Development',
    short: 'DEX',
    tagline: 'Swap, pool and earn — without a middleman.',
    summary:
      'AMM-based exchanges in the style of Uniswap and PancakeSwap, with liquidity pools, farming and a fast, simple swap experience.',
    features: [
      'AMM swap engine & price routing',
      'Liquidity pools & LP tokens',
      'Yield farming & staking pools',
      'Token listing & pair creation',
      'Charts, analytics & history',
      'Security-reviewed contracts',
    ],
    stack: ['Solidity', 'AMM', 'React', 'BSC'],
    visual: 'dex',
    hue: 262,
  },
  {
    id: 'cex',
    title: 'Centralised Exchange Development',
    short: 'CEX',
    tagline: 'A complete trading venue, engine to wallet.',
    summary:
      'Full centralised exchange platforms — order-matching engine, spot trading, wallets, KYC and a powerful admin back-office.',
    features: [
      'High-performance matching engine',
      'Spot trading, order book & live charts',
      'Hot / cold wallet management',
      'KYC / AML & user verification',
      'Admin panel, fees & liquidity tools',
      'Crypto deposits & withdrawals',
    ],
    stack: ['Node.js', 'WebSockets', 'MySQL', 'Redis'],
    visual: 'cex',
    hue: 150,
  },
  {
    id: 'nft',
    title: 'NFT Development',
    short: 'NFT',
    tagline: 'Digital assets with real utility.',
    summary:
      'NFT collections and contracts — generative art, minting sites, royalties and utility such as access, membership and in-game items.',
    features: [
      'ERC-721 & ERC-1155 contracts',
      'Generative collections & metadata',
      'Minting site, whitelist & presale',
      'Royalties & reveal mechanics',
      'IPFS / decentralised storage',
      'Utility: access, membership, gaming',
    ],
    stack: ['Solidity', 'ERC-721', 'ERC-1155', 'IPFS'],
    visual: 'nft',
    hue: 300,
  },
  {
    id: 'nft-marketplace',
    title: 'NFT Marketplace Development',
    short: 'NFT Market',
    tagline: 'A marketplace built around your community.',
    summary:
      'OpenSea-style marketplaces for art, gaming or niche communities — listing, auctions, offers and creator royalties handled on-chain.',
    features: [
      'Buy, sell, auctions & offers',
      'Lazy minting & creator tools',
      'Collections, profiles & rankings',
      'Automatic royalty distribution',
      'Multi-wallet & multi-chain',
      'Admin moderation & fee control',
    ],
    stack: ['Solidity', 'IPFS', 'React', 'Node.js'],
    visual: 'marketplace',
    hue: 330,
  },
  {
    id: 'token',
    title: 'Token Development',
    short: 'Tokens',
    tagline: 'Tokens designed to last beyond launch day.',
    summary:
      'Token creation on the major standards, with tokenomics, vesting, presale and staking designed so the token supports the business.',
    features: [
      'BEP-20, ERC-20 & TRC-20 tokens',
      'Tokenomics, supply & vesting design',
      'Presale, ICO & IDO launchpads',
      'Staking & reward contracts',
      'Liquidity & listing support',
      'Whitepaper & documentation support',
    ],
    stack: ['Solidity', 'BEP-20', 'ERC-20', 'TRC-20'],
    visual: 'token',
    hue: 40,
  },
  {
    id: 'messenger',
    title: 'Messenger Development',
    short: 'Messenger',
    tagline: 'Private, wallet-native messaging.',
    summary:
      'Secure messaging apps with end-to-end encryption, wallet-based identity and crypto transfers right inside the chat.',
    features: [
      'End-to-end encrypted chat',
      'Wallet-address login & identity',
      'Send crypto inside conversations',
      'Groups, channels & communities',
      'Media, voice & push notifications',
      'Web and mobile apps',
    ],
    stack: ['WebSockets', 'Node.js', 'React Native', 'E2EE'],
    visual: 'messenger',
    hue: 190,
  },
  {
    id: 'custom',
    title: 'Custom Development',
    short: 'New Ideas',
    tagline: 'Got a new idea? Let’s build it.',
    summary:
      'Anything else on-chain — GameFi, payments, metaverse, AI + Web3 or something nobody has built yet. We scope it, prototype it and ship it.',
    features: [
      'Idea validation & technical scoping',
      'Rapid MVP in short iterations',
      'GameFi, payments, metaverse, AI',
      'Integration with existing systems',
      'Architecture that scales past MVP',
      'Long-term support & upgrades',
    ],
    stack: ['Web3', 'APIs', 'React', 'Laravel'],
    visual: 'custom',
    hue: 18,
  },
]
