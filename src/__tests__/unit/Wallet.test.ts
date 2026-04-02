import { Wallet } from '../../domain/Wallet';
import { validate as uuidValidate } from 'uuid';

describe('Wallet', () => {
  it('should create a wallet with a valid uuid id', () => {
    const wallet = new Wallet('My Wallet');
    expect(uuidValidate(wallet.id)).toBe(true);
  });

  it('should set name correctly', () => {
    const wallet = new Wallet('Test Wallet');
    expect(wallet.name).toBe('Test Wallet');
  });

  it('should set createdAt and updatedAt on creation', () => {
    const before = new Date();
    const wallet = new Wallet('Test');
    const after = new Date();
    expect(wallet.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(wallet.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    expect(wallet.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(wallet.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should update name and updatedAt when updateName is called', () => {
    const wallet = new Wallet('Original');
    const originalUpdatedAt = wallet.updatedAt;
    wallet.updateName('Updated');
    expect(wallet.name).toBe('Updated');
    expect(wallet.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
  });

  it('should accept a custom id', () => {
    const customId = '00000000-0000-0000-0000-000000000001';
    const wallet = new Wallet('Test', customId);
    expect(wallet.id).toBe(customId);
  });
});
