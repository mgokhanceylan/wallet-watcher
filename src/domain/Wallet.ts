import { v4 as uuidv4 } from 'uuid';

export class Wallet {
  public readonly id: string;
  public name: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(name: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id ?? uuidv4();
    this.name = name;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
