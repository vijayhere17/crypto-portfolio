// ─────────────────────────────────────────────────────────────
//  Central site content. Edit this file to update brand and
//  contact details — the UI reads everything from here.
//  The site is intentionally anonymous: no personal details.
// ─────────────────────────────────────────────────────────────

export const site = {
  brand: 'ROCYWEB',
  domain: 'rocyweb.com',
  brandSuffix: 'Blockchain Development Studio',
  disciplines: ['Blockchain', 'DeFi', 'Exchanges', 'NFT', 'Tokens'],
  statement: {
    lead: 'Building the',
    joiner: '',
    accent: 'decentralised',
    tail: 'products of tomorrow.',
  },
  intro:
    'A blockchain development studio. Chains, dApps, wallets, exchanges, NFTs, tokens and messengers — engineered end to end and taken live.',

  about: {
    heading: ['A blockchain studio', 'that ships.'],
    body: [
      'We are an independent team of blockchain engineers and product builders. We design, build and launch crypto products — from smart contracts and tokens to exchanges, wallets and marketplaces.',
      'We work quietly and let the products speak. What matters is what goes live, and how well it runs after launch.',
    ],
    pillars: [
      { value: '10', label: 'Service lines' },
      { value: 'EVM', label: 'Ethereum · BSC · Polygon' },
      { value: 'E2E', label: 'Idea → launch → support' },
      { value: 'TG', label: 'Direct line on Telegram' },
    ],
  },

  // Only non-empty values are shown on the site.
  contact: {
    telegram: 'your_telegram_handle', // username without @
    email: '',
    website: 'https://rocyweb.com',
  },
}

export const telegramUrl = `https://t.me/${site.contact.telegram}`
