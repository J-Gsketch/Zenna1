import { onRequest } from 'firebase-functions/v2/https';

process.env.ZENNA_FUNCTIONS = 'true';
const { startServer } = await import('../server.js');
const app = await startServer();

export const api = onRequest({ region: 'australia-southeast1', invoker: 'public' }, app);
