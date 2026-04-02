import { WalletAddress } from '../domain/WalletAddress';
import { IWalletAddressRepository } from './IWalletAddressRepository';

export class InMemoryWalletAddressRepository implements IWalletAddressRepository {
  private readonly store = new Map<string, WalletAddress>();

  async create(address: WalletAddress): Promise<WalletAddress> {
    this.store.set(address.id, address);
    return address;
  }

  async findById(id: string): Promise<WalletAddress | null> {
    return this.store.get(id) ?? null;
  }

  async findByWalletId(walletId: string): Promise<WalletAddress[]> {
    return Array.from(this.store.values()).filter(a => a.walletId === walletId);
  }

  async findByWalletIdAndAddress(walletId: string, address: string): Promise<WalletAddress | null> {
    return Array.from(this.store.values()).find(
      a => a.walletId === walletId && a.address === address
    ) ?? null;
  }
}
