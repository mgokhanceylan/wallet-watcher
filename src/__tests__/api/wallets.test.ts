import request from 'supertest';
import { createApp } from '../../app';
import { InMemoryWalletRepository } from '../../repositories/InMemoryWalletRepository';
import { InMemoryWalletAddressRepository } from '../../repositories/InMemoryWalletAddressRepository';
import { WalletService } from '../../services/WalletService';
import { WalletAddressService } from '../../services/WalletAddressService';
import { Application } from 'express';

function buildApp(): Application {
  const walletRepo = new InMemoryWalletRepository();
  const addressRepo = new InMemoryWalletAddressRepository();
  const walletService = new WalletService(walletRepo);
  const walletAddressService = new WalletAddressService(walletRepo, addressRepo);
  return createApp(walletService, walletAddressService);
}

describe('Wallets API', () => {
  let app: Application;

  beforeEach(() => {
    app = buildApp();
  });

  describe('POST /api/wallets', () => {
    it('should create a wallet and return 201', async () => {
      const res = await request(app)
        .post('/api/wallets')
        .send({ name: 'My Wallet' });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('My Wallet');
      expect(res.body.id).toBeTruthy();
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app)
        .post('/api/wallets')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBeTruthy();
    });

    it('should return 400 when name is empty string', async () => {
      const res = await request(app)
        .post('/api/wallets')
        .send({ name: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/wallets', () => {
    it('should return empty array initially', async () => {
      const res = await request(app).get('/api/wallets');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return created wallets', async () => {
      await request(app).post('/api/wallets').send({ name: 'Wallet 1' });
      await request(app).post('/api/wallets').send({ name: 'Wallet 2' });
      const res = await request(app).get('/api/wallets');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /api/wallets/:id', () => {
    it('should return a wallet by id', async () => {
      const createRes = await request(app).post('/api/wallets').send({ name: 'Test' });
      const id = createRes.body.id as string;
      const res = await request(app).get(`/api/wallets/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
    });

    it('should return 404 for non-existent wallet', async () => {
      const res = await request(app).get('/api/wallets/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('POST /api/wallets/:id/addresses', () => {
    it('should add an address to a wallet', async () => {
      const createRes = await request(app).post('/api/wallets').send({ name: 'Test' });
      const id = createRes.body.id as string;
      const res = await request(app)
        .post(`/api/wallets/${id}/addresses`)
        .send({ address: '0x1234567890abcdef', chain: 'EVM', label: 'Main' });
      expect(res.status).toBe(201);
      expect(res.body.address).toBe('0x1234567890abcdef');
      expect(res.body.chain).toBe('EVM');
      expect(res.body.label).toBe('Main');
    });

    it('should return 404 for non-existent wallet', async () => {
      const res = await request(app)
        .post('/api/wallets/non-existent/addresses')
        .send({ address: '0x1234567890abcdef' });
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid address', async () => {
      const createRes = await request(app).post('/api/wallets').send({ name: 'Test' });
      const id = createRes.body.id as string;
      const res = await request(app)
        .post(`/api/wallets/${id}/addresses`)
        .send({ address: 'short' });
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid chain', async () => {
      const createRes = await request(app).post('/api/wallets').send({ name: 'Test' });
      const id = createRes.body.id as string;
      const res = await request(app)
        .post(`/api/wallets/${id}/addresses`)
        .send({ address: '0x1234567890abcdef', chain: 'INVALID' });
      expect(res.status).toBe(400);
    });

    it('should return 409 for duplicate address', async () => {
      const createRes = await request(app).post('/api/wallets').send({ name: 'Test' });
      const id = createRes.body.id as string;
      await request(app)
        .post(`/api/wallets/${id}/addresses`)
        .send({ address: '0x1234567890abcdef' });
      const res = await request(app)
        .post(`/api/wallets/${id}/addresses`)
        .send({ address: '0x1234567890abcdef' });
      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/wallets/:id/addresses', () => {
    it('should list addresses for a wallet', async () => {
      const createRes = await request(app).post('/api/wallets').send({ name: 'Test' });
      const id = createRes.body.id as string;
      await request(app)
        .post(`/api/wallets/${id}/addresses`)
        .send({ address: '0x1234567890abcdef' });
      const res = await request(app).get(`/api/wallets/${id}/addresses`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should return 404 for non-existent wallet', async () => {
      const res = await request(app).get('/api/wallets/non-existent/addresses');
      expect(res.status).toBe(404);
    });
  });
});
