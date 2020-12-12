import express from 'express';
import adminRoute from './admin.route';
import settingRoute from './setting.route';
import adminRoleRoute from './admin-role.route';
import authRoute from './auth.route';
import loginMethodRoute from './login-method.route';
import appVersionRoute from './app-version.route';
import brandRoute from './brand.route';
import categoryRoute from './category.route';
import productRoute from './product.route';
import productGaleryRoute from './product-galery.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
    res.send('OK');
});


router.use('/admin', adminRoute);
router.use('/setting', settingRoute);
router.use('/admin-role', adminRoleRoute);
router.use('/auth', authRoute);
router.use('/login-method', loginMethodRoute);
router.use('/app-version', appVersionRoute);
router.use('/brand', brandRoute);
router.use('/category', categoryRoute);
router.use('/product', productRoute);
router.use('/product-galery', productGaleryRoute);

export default router;
