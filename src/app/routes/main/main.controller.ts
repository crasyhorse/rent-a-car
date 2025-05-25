import { Response, Router } from 'express';

const router = Router();

router.get('/', async (_, res: Response) => {
    res.status(405).json({ status: 'API is running on /api/v1' });
});

export default router;

