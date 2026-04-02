import { validateAddress, validateChain, ALLOWED_CHAINS } from '../../validation/addressValidator';

describe('validateAddress', () => {
  it('should return true for a valid address', () => {
    expect(validateAddress('0x1234567890abcdef')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(validateAddress('')).toBe(false);
  });

  it('should return false for address shorter than 10 chars', () => {
    expect(validateAddress('short')).toBe(false);
  });

  it('should return true for address exactly 10 chars', () => {
    expect(validateAddress('1234567890')).toBe(true);
  });

  it('should return false for whitespace-only string', () => {
    expect(validateAddress('         ')).toBe(false);
  });
});

describe('validateChain', () => {
  it('should return true for EVM', () => {
    expect(validateChain('EVM')).toBe(true);
  });

  it('should return true for all allowed chains', () => {
    ALLOWED_CHAINS.forEach(chain => {
      expect(validateChain(chain)).toBe(true);
    });
  });

  it('should return false for unknown chain', () => {
    expect(validateChain('UNKNOWN')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateChain('')).toBe(false);
  });

  it('should be case-sensitive', () => {
    expect(validateChain('evm')).toBe(false);
  });
});

describe('ALLOWED_CHAINS', () => {
  it('should contain EVM, SOL, BTC, TRX, TON, COSMOS', () => {
    expect(ALLOWED_CHAINS).toContain('EVM');
    expect(ALLOWED_CHAINS).toContain('SOL');
    expect(ALLOWED_CHAINS).toContain('BTC');
    expect(ALLOWED_CHAINS).toContain('TRX');
    expect(ALLOWED_CHAINS).toContain('TON');
    expect(ALLOWED_CHAINS).toContain('COSMOS');
  });

  it('should have exactly 6 entries', () => {
    expect(ALLOWED_CHAINS).toHaveLength(6);
  });
});
