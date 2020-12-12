import express from 'express';
import settingCtrl from '../../controllers/admin/setting.controller';
import validation from '../../validations/index.validation';
import middleware from '../../misc/middleware';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], settingCtrl.list)

    .post([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.settingValidation.validate('createSetting'),
    ], settingCtrl.create);

router.route('/:settingId')
    .get([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], settingCtrl.get)

    .put([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
        validation.settingValidation.validate('updateSetting'),
    ], settingCtrl.update)

    .delete([
        (req, res, next) => middleware.checkTokenJwt(req, res, next, ['admin']),
        middleware.checkAdminSession,
    ], settingCtrl.remove);

/** Load when API with Id route parameter is hit */
router.param('settingId', settingCtrl.load);

export default router;
