import express from 'express';
import productCtrl from '../../controllers/admin/product.controller';
import validation from '../../validations/index.validation';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], productCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.productValidation.validate('createProduct'),
    ], productCtrl.create);

router.route('/:productId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], productCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.productValidation.validate('updateProduct'),
    ], productCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], productCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('productId', productCtrl.load);

export default router;
