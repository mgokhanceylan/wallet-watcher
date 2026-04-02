import { Wallet } from '../domain/Wallet';

export interface IWalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findById(id: string): Promise<Wallet | null>;
  findAll(): Promise<Wallet[]>;
}
