import { InMemoryWalletAddressRepository } from '../../repositories/InMemoryWalletAddressRepository';
import { WalletAddress } from '../../domain/WalletAddress';

describe('InMemoryWalletAddressRepository', () => {
  let repo: InMemoryWalletAddressRepository;
  const walletId = '00000000-0000-0000-0000-000000000001';
  const otherWalletId = '00000000-0000-0000-0000-000000000002';
  const validAddress = '0x1234567890abcdef';

  beforeEach(() => {
    repo = new InMemoryWalletAddressRepository();
  });

  it('should create and retrieve a wallet address by id', async () => {
    const wa = new WalletAddress(walletId, validAddress);
    await repo.create(wa);
    const found = await repo.findById(wa.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(wa.id);
  });

  it('should return null for non-existent id', async () => {
    const found = await repo.findById('non-existent-id');
    expect(found).toBeNull();
  });

  it('should find addresses by walletId', async () => {
    const wa1 = new WalletAddress(walletId, validAddress);
    const wa2 = new WalletAddress(walletId, '0xabcdef1234567890');
    const wa3 = new WalletAddress(otherWalletId, '0x9999999999999999');
    await repo.create(wa1);
    await repo.create(wa2);
    await repo.create(wa3);
    const found = await repo.findByWalletId(walletId);
    expect(found).toHaveLength(2);
    found.forEach(a => expect(a.walletId).toBe(walletId));
  });

  it('should find by walletId and address', async () => {
    const wa = new WalletAddress(walletId, validAddress);
    await repo.create(wa);
    const found = await repo.findByWalletIdAndAddress(walletId, validAddress);
    expect(found).not.toBeNull();
    expect(found?.address).toBe(validAddress);
  });

  it('should return null when address not found for wallet', async () => {
    const found = await repo.findByWalletIdAndAddress(walletId, validAddress);
    expect(found).toBeNull();
  });

  it('should not find address from different wallet', async () => {
    const wa = new WalletAddress(walletId, validAddress);
    await repo.create(wa);
    const found = await repo.findByWalletIdAndAddress(otherWalletId, validAddress);
    expect(found).toBeNull();
  });
});
