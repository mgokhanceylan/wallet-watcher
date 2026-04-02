export const ALLOWED_CHAINS = ['EVM', 'SOL', 'BTC', 'TRX', 'TON', 'COSMOS'] as const;
export type Chain = typeof ALLOWED_CHAINS[number];

export function validateAddress(address: string): boolean {
  return typeof address === 'string' && address.trim().length >= 10;
}

export function validateChain(chain: string): boolean {
  return (ALLOWED_CHAINS as readonly string[]).includes(chain);
}
