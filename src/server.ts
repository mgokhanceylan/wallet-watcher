import { createApp } from './app';
import { InMemoryWalletRepository } from './repositories/InMemoryWalletRepository';
import { InMemoryWalletAddressRepository } from './repositories/InMemoryWalletAddressRepository';
import { WalletService } from './services/WalletService';
import { WalletAddressService } from './services/WalletAddressService';

export function startServer(): void {
  const walletRepository = new InMemoryWalletRepository();
  const walletAddressRepository = new InMemoryWalletAddressRepository();

  const walletService = new WalletService(walletRepository);
  const walletAddressService = new WalletAddressService(walletRepository, walletAddressRepository);

  const app = createApp(walletService, walletAddressService);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(port, () => {
    console.log(`Wallet Watcher server running on port ${port}`);
  });
}
