import { Wallet } from '../domain/Wallet';
import { IWalletRepository } from '../repositories/IWalletRepository';
import { NotFoundError, ValidationError } from '../errors/AppError';

export class WalletService {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async createWallet(name: string): Promise<Wallet> {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Wallet name must not be empty');
    }
    const wallet = new Wallet(name.trim());
    return this.walletRepository.create(wallet);
  }

  async getWallet(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new NotFoundError(`Wallet with id '${id}' not found`);
    }
    return wallet;
  }

  async listWallets(): Promise<Wallet[]> {
    return this.walletRepository.findAll();
  }
}
