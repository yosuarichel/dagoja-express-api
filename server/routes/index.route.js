import express from 'express';
import path from 'path';
import adminRoutes from './admin/index.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
    res.send('OK');
});

router.get('/admin-documentation', (req, res) => {
    res.sendFile(path.resolve('./docs/dagoja-admin-documentation.html'));
});

// mount user routes at /users
router.use('/admin', adminRoutes);

export default router;
