import express from 'express';
import loginMethodCtrl from '../../controllers/admin/login-method.controller';
import validation from '../../validations/index.validation';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], loginMethodCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.loginMethodValidation.validate('createLoginMethod'),
    ], loginMethodCtrl.create);

router.route('/:loginMethodId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], loginMethodCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.loginMethodValidation.validate('updateLoginMethod'),
    ], loginMethodCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], loginMethodCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('loginMethodId', loginMethodCtrl.load);

export default router;
