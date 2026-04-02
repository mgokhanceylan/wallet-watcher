import { WalletService } from '../../services/WalletService';
import { InMemoryWalletRepository } from '../../repositories/InMemoryWalletRepository';
import { NotFoundError, ValidationError } from '../../errors/AppError';
import { validate as uuidValidate } from 'uuid';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(() => {
    service = new WalletService(new InMemoryWalletRepository());
  });

  it('should create a wallet with a valid id', async () => {
    const wallet = await service.createWallet('My Wallet');
    expect(uuidValidate(wallet.id)).toBe(true);
    expect(wallet.name).toBe('My Wallet');
  });

  it('should throw ValidationError when name is empty', async () => {
    await expect(service.createWallet('')).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when name is whitespace', async () => {
    await expect(service.createWallet('   ')).rejects.toThrow(ValidationError);
  });

  it('should get a wallet by id', async () => {
    const created = await service.createWallet('Test');
    const found = await service.getWallet(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should throw NotFoundError when wallet does not exist', async () => {
    await expect(service.getWallet('non-existent-id')).rejects.toThrow(NotFoundError);
  });

  it('should list all wallets', async () => {
    await service.createWallet('Wallet 1');
    await service.createWallet('Wallet 2');
    const wallets = await service.listWallets();
    expect(wallets).toHaveLength(2);
  });

  it('should return empty array when no wallets', async () => {
    const wallets = await service.listWallets();
    expect(wallets).toHaveLength(0);
  });
});
