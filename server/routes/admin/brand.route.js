import express from 'express';
import brandCtrl from '../../controllers/admin/brand.controller';
import validation from '../../validations/index.validation';
import brandImageUploader from '../../../config/multer/brand';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], brandCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        brandImageUploader.single('brand_image'),
        validation.adminRoleValidation.validate('createBrand'),
    ], brandCtrl.create);

router.route('/:brandId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], brandCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        brandImageUploader.single('brand_image'),
        validation.adminRoleValidation.validate('updateBrand'),
    ], brandCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], brandCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('brandId', brandCtrl.load);

export default router;
