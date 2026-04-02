import { WalletAddress } from '../domain/WalletAddress';

export interface IWalletAddressRepository {
  create(address: WalletAddress): Promise<WalletAddress>;
  findById(id: string): Promise<WalletAddress | null>;
  findByWalletId(walletId: string): Promise<WalletAddress[]>;
  findByWalletIdAndAddress(walletId: string, address: string): Promise<WalletAddress | null>;
}
