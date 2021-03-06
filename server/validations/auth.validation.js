/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
// import db from '../../config/sequelize';
import errorCodes from '../errors/index.error';

// const User = db.user;

// const Sequelize = require('sequelize');
const { check } = require('express-validator');

function validate(method) {
    switch (method) {
    case 'registerAdmin': {
        return [
            check('admin_role_id')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('full_name')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('email')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isEmail().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_EMAIL.message)),
            check('password')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('status')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isIn(['active', 'inactive']).withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ENUM.message)),
        ];
    }

    case 'loginAdmin': {
        return [
            check('email')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isEmail().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_EMAIL.message)),
            check('password')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
        ];
    }

    default: {
        return [];
    }
    }
}

export default { validate };
