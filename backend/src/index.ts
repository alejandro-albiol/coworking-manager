import express from 'express';
import { TenantMiddleware } from './middlewares/TenantMiddleware';

const app = express();

app.use('/api/v1', TenantMiddleware.handle);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log("App is running");