import { WalletAddress } from '../../domain/WalletAddress';
import { validate as uuidValidate } from 'uuid';

describe('WalletAddress', () => {
  const walletId = '00000000-0000-0000-0000-000000000001';
  const validAddress = '0x1234567890abcdef';

  it('should create a WalletAddress with a valid uuid id', () => {
    const wa = new WalletAddress(walletId, validAddress);
    expect(uuidValidate(wa.id)).toBe(true);
  });

  it('should set walletId and address correctly', () => {
    const wa = new WalletAddress(walletId, validAddress);
    expect(wa.walletId).toBe(walletId);
    expect(wa.address).toBe(validAddress);
  });

  it('should set createdAt on creation', () => {
    const before = new Date();
    const wa = new WalletAddress(walletId, validAddress);
    const after = new Date();
    expect(wa.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(wa.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should accept a valid chain', () => {
    const wa = new WalletAddress(walletId, validAddress, 'EVM');
    expect(wa.chain).toBe('EVM');
  });

  it('should accept an optional label', () => {
    const wa = new WalletAddress(walletId, validAddress, undefined, 'My Label');
    expect(wa.label).toBe('My Label');
  });

  it('should throw if address is too short', () => {
    expect(() => new WalletAddress(walletId, 'short')).toThrow();
  });

  it('should throw if chain is invalid', () => {
    expect(() => new WalletAddress(walletId, validAddress, 'INVALID')).toThrow();
  });

  it('should have undefined chain and label when not provided', () => {
    const wa = new WalletAddress(walletId, validAddress);
    expect(wa.chain).toBeUndefined();
    expect(wa.label).toBeUndefined();
  });
});
