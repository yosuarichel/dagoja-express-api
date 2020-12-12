import express from 'express';
import appVersionCtrl from '../../controllers/admin/app-version.controller';
import validation from '../../validations/index.validation';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], appVersionCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.appVersionValidation.validate('createAppVersion'),
    ], appVersionCtrl.create);

router.route('/:appVersionId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], appVersionCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.appVersionValidation.validate('updateAppVersion'),
    ], appVersionCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], appVersionCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('appVersionId', appVersionCtrl.load);

export default router;
