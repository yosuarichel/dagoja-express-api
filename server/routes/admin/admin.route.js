import express from 'express';
import adminCtrl from '../../controllers/admin/admin.controller';
import validation from '../../validations/index.validation';
import adminProfileUploader from '../../../config/multer/admin-profile';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], adminCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        adminProfileUploader.single('profile_image'),
        validation.adminValidation.validate('createAdmin'),
    ], adminCtrl.create);

router.route('/:adminId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], adminCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        adminProfileUploader.single('profile_image'),
        validation.adminValidation.validate('updateAdmin'),
    ], adminCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], adminCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('adminId', adminCtrl.load);

export default router;
