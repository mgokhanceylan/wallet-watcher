import { Router, Request, Response, NextFunction } from 'express';
import { WalletService } from '../services/WalletService';
import { WalletAddressService } from '../services/WalletAddressService';

export function createWalletRouter(
  walletService: WalletService,
  walletAddressService: WalletAddressService
): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as { name?: string };
      const wallet = await walletService.createWallet(name ?? '');
      res.status(201).json(wallet);
    } catch (err) {
      next(err);
    }
  });

  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const wallets = await walletService.listWallets();
      res.json(wallets);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallet = await walletService.getWallet(req.params.id);
      res.json(wallet);
    } catch (err) {
      next(err);
    }
  });

  router.post('/:id/addresses', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, chain, label } = req.body as {
        address?: string;
        chain?: string;
        label?: string;
      };
      const walletAddress = await walletAddressService.addAddress(
        req.params.id,
        address ?? '',
        chain,
        label
      );
      res.status(201).json(walletAddress);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id/addresses', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await walletAddressService.listAddresses(req.params.id);
      res.json(addresses);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
