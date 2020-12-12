import express from 'express';
import authCtrl from '../../controllers/admin/auth.controller';
import validation from '../../validations/index.validation';
import upload from '../../../config/multer/admin-profile';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/register-admin')
    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        upload.single('profile_image'),
        validation.authValidation.validate('registerAdmin'),
    ], authCtrl.registerAdmin);

router.route('/login-admin')
    .post([
        validation.authValidation.validate('loginAdmin'),
    ], authCtrl.loginAdmin);
router.route('/logout-admin')
    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], authCtrl.logoutAdmin);

export default router;
