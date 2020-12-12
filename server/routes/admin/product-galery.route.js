import express from 'express';
import productGaleryCtrl from '../../controllers/admin/product-galery.controller';
import validation from '../../validations/index.validation';
import productGaleryUploader from '../../../config/multer/product-galery';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], productGaleryCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        productGaleryUploader.array('product_image', 5),
        validation.productGaleryValidation.validate('createProductGalery'),
    ], productGaleryCtrl.create);

router.route('/:productGaleryId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], productGaleryCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        productGaleryUploader.single('product_image'),
        validation.productGaleryValidation.validate('updateProductGalery'),
    ], productGaleryCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], productGaleryCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('productGaleryId', productGaleryCtrl.load);

export default router;
