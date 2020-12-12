import express from 'express';
import categoryCtrl from '../../controllers/admin/category.controller';
import validation from '../../validations/index.validation';
import categoryImageUploader from '../../../config/multer/category';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], categoryCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        categoryImageUploader.single('category_image'),
        validation.adminRoleValidation.validate('createCategory'),
    ], categoryCtrl.create);

router.route('/:categoryId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], categoryCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        categoryImageUploader.single('category_image'),
        validation.adminRoleValidation.validate('updateCategory'),
    ], categoryCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], categoryCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('categoryId', categoryCtrl.load);

export default router;
