import { Wallet } from '../domain/Wallet';
import { IWalletRepository } from './IWalletRepository';

export class InMemoryWalletRepository implements IWalletRepository {
  private readonly store = new Map<string, Wallet>();

  async create(wallet: Wallet): Promise<Wallet> {
    this.store.set(wallet.id, wallet);
    return wallet;
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Wallet[]> {
    return Array.from(this.store.values());
  }
}
