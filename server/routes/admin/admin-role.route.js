import express from 'express';
import adminRoleCtrl from '../../controllers/admin/admin-role.controller';
import validation from '../../validations/index.validation';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], adminRoleCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.adminRoleValidation.validate('createAdminRole'),
    ], adminRoleCtrl.create);

router.route('/:adminRoleId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], adminRoleCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.adminRoleValidation.validate('updateAdminRole'),
    ], adminRoleCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], adminRoleCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('adminRoleId', adminRoleCtrl.load);

export default router;
