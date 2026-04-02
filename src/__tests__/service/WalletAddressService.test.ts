import { WalletAddressService } from '../../services/WalletAddressService';
import { WalletService } from '../../services/WalletService';
import { InMemoryWalletRepository } from '../../repositories/InMemoryWalletRepository';
import { InMemoryWalletAddressRepository } from '../../repositories/InMemoryWalletAddressRepository';
import { NotFoundError, ValidationError, ConflictError } from '../../errors/AppError';

describe('WalletAddressService', () => {
  let walletService: WalletService;
  let walletAddressService: WalletAddressService;
  let walletRepo: InMemoryWalletRepository;
  let addressRepo: InMemoryWalletAddressRepository;

  beforeEach(() => {
    walletRepo = new InMemoryWalletRepository();
    addressRepo = new InMemoryWalletAddressRepository();
    walletService = new WalletService(walletRepo);
    walletAddressService = new WalletAddressService(walletRepo, addressRepo);
  });

  it('should add an address to a wallet', async () => {
    const wallet = await walletService.createWallet('My Wallet');
    const addr = await walletAddressService.addAddress(wallet.id, '0x1234567890abcdef', 'EVM', 'Main');
    expect(addr.walletId).toBe(wallet.id);
    expect(addr.address).toBe('0x1234567890abcdef');
    expect(addr.chain).toBe('EVM');
    expect(addr.label).toBe('Main');
  });

  it('should throw NotFoundError when wallet does not exist', async () => {
    await expect(
      walletAddressService.addAddress('non-existent', '0x1234567890abcdef')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for invalid address', async () => {
    const wallet = await walletService.createWallet('My Wallet');
    await expect(
      walletAddressService.addAddress(wallet.id, 'short')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid chain', async () => {
    const wallet = await walletService.createWallet('My Wallet');
    await expect(
      walletAddressService.addAddress(wallet.id, '0x1234567890abcdef', 'INVALID')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ConflictError for duplicate address on same wallet', async () => {
    const wallet = await walletService.createWallet('My Wallet');
    await walletAddressService.addAddress(wallet.id, '0x1234567890abcdef');
    await expect(
      walletAddressService.addAddress(wallet.id, '0x1234567890abcdef')
    ).rejects.toThrow(ConflictError);
  });

  it('should list addresses for a wallet', async () => {
    const wallet = await walletService.createWallet('My Wallet');
    await walletAddressService.addAddress(wallet.id, '0x1234567890abcdef');
    await walletAddressService.addAddress(wallet.id, '0xabcdef1234567890');
    const addresses = await walletAddressService.listAddresses(wallet.id);
    expect(addresses).toHaveLength(2);
  });

  it('should throw NotFoundError when listing addresses for non-existent wallet', async () => {
    await expect(
      walletAddressService.listAddresses('non-existent')
    ).rejects.toThrow(NotFoundError);
  });
});
