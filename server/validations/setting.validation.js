/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
// import db from '../../config/sequelize';
import errorCodes from '../errors/index.error';

// const User = db.user;

// const Sequelize = require('sequelize');
const { check } = require('express-validator');

function validate(method) {
    switch (method) {
    case 'createSetting': {
        return [
            check('about')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('privacy_policy')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('terms_and_condition')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('supplier_session_expiry')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('dropshipper_session_expiry')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('admin_session_expiry')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('android_version_id')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('android_version_update_message')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('android_is_maintenance')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('android_maintenance_message')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('ios_version_id')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('ios_version_update_message')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('ios_is_maintenance')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('ios_maintenance_message')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
        ];
    }

    case 'updateSetting': {
        return [
            check('about')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('privacy_policy')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('terms_and_condition')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('supplier_session_expiry')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('dropshipper_session_expiry')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('admin_session_expiry')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('android_version_id')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('android_version_update_message')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('android_is_maintenance')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('android_is_maintenance_message')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('ios_version_id')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('ios_version_update_message')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('ios_is_maintenance')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('ios_is_maintenance_message')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
        ];
    }

    default: {
        return [];
    }
    }
}

export default { validate };
