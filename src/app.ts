import express, { Application, Request, Response, NextFunction } from 'express';
import { createWalletRouter } from './routes/walletRoutes';
import { WalletService } from './services/WalletService';
import { WalletAddressService } from './services/WalletAddressService';
import { AppError } from './errors/AppError';

export function createApp(
  walletService: WalletService,
  walletAddressService: WalletAddressService
): Application {
  const app = express();

  app.use(express.json());

  app.use('/api/wallets', createWalletRouter(walletService, walletAddressService));

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}
