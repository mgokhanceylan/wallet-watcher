import { WalletAddress } from '../domain/WalletAddress';
import { IWalletRepository } from '../repositories/IWalletRepository';
import { IWalletAddressRepository } from '../repositories/IWalletAddressRepository';
import { NotFoundError, ValidationError, ConflictError } from '../errors/AppError';
import { validateAddress, validateChain } from '../validation/addressValidator';

export class WalletAddressService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly walletAddressRepository: IWalletAddressRepository
  ) {}

  async addAddress(
    walletId: string,
    address: string,
    chain?: string,
    label?: string
  ): Promise<WalletAddress> {
    const wallet = await this.walletRepository.findById(walletId);
    if (!wallet) {
      throw new NotFoundError(`Wallet with id '${walletId}' not found`);
    }

    if (!validateAddress(address)) {
      throw new ValidationError('Address must be at least 10 characters and non-empty');
    }

    if (chain !== undefined && !validateChain(chain)) {
      throw new ValidationError(`Chain must be one of: EVM, SOL, BTC, TRX, TON, COSMOS`);
    }

    const existing = await this.walletAddressRepository.findByWalletIdAndAddress(walletId, address);
    if (existing) {
      throw new ConflictError(`Address '${address}' already exists for this wallet`);
    }

    const walletAddress = new WalletAddress(walletId, address, chain, label);
    return this.walletAddressRepository.create(walletAddress);
  }

  async listAddresses(walletId: string): Promise<WalletAddress[]> {
    const wallet = await this.walletRepository.findById(walletId);
    if (!wallet) {
      throw new NotFoundError(`Wallet with id '${walletId}' not found`);
    }
    return this.walletAddressRepository.findByWalletId(walletId);
  }
}
