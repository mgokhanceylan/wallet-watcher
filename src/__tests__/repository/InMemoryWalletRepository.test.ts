import { InMemoryWalletRepository } from '../../repositories/InMemoryWalletRepository';
import { Wallet } from '../../domain/Wallet';

describe('InMemoryWalletRepository', () => {
  let repo: InMemoryWalletRepository;

  beforeEach(() => {
    repo = new InMemoryWalletRepository();
  });

  it('should create and retrieve a wallet', async () => {
    const wallet = new Wallet('Test Wallet');
    await repo.create(wallet);
    const found = await repo.findById(wallet.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(wallet.id);
    expect(found?.name).toBe('Test Wallet');
  });

  it('should return null for non-existent id', async () => {
    const found = await repo.findById('non-existent-id');
    expect(found).toBeNull();
  });

  it('should return all wallets', async () => {
    const w1 = new Wallet('Wallet 1');
    const w2 = new Wallet('Wallet 2');
    await repo.create(w1);
    await repo.create(w2);
    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });

  it('should return empty array when no wallets', async () => {
    const all = await repo.findAll();
    expect(all).toHaveLength(0);
  });

  it('should assign an id to created wallet', async () => {
    const wallet = new Wallet('Test');
    expect(wallet.id).toBeTruthy();
    await repo.create(wallet);
    const found = await repo.findById(wallet.id);
    expect(found?.id).toBe(wallet.id);
  });
});
