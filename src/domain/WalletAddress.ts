import { v4 as uuidv4 } from 'uuid';
import { ALLOWED_CHAINS, Chain } from '../validation/addressValidator';

export class WalletAddress {
  public readonly id: string;
  public readonly walletId: string;
  public readonly address: string;
  public readonly chain?: Chain;
  public readonly label?: string;
  public readonly createdAt: Date;

  constructor(
    walletId: string,
    address: string,
    chain?: string,
    label?: string,
    id?: string,
    createdAt?: Date
  ) {
    if (!address || address.trim().length < 10) {
      throw new Error('Address must be at least 10 characters');
    }
    if (chain !== undefined && !(ALLOWED_CHAINS as readonly string[]).includes(chain)) {
      throw new Error(`Chain must be one of: ${ALLOWED_CHAINS.join(', ')}`);
    }
    this.id = id ?? uuidv4();
    this.walletId = walletId;
    this.address = address;
    this.chain = chain as Chain | undefined;
    this.label = label;
    this.createdAt = createdAt ?? new Date();
  }
}
