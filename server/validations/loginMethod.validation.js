/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
// import db from '../../config/sequelize';
import errorCodes from '../errors/index.error';

// const User = db.user;

// const Sequelize = require('sequelize');
const { check } = require('express-validator');

function validate(method) {
    switch (method) {
    case 'createLoginMethod': {
        return [
            check('name')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('is_disable')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('is_coming_soon')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('os')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .toArray()
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            // .custom((value) => {
            //     if (value.length === 0) {
            //         return Promise.reject();
            //     }
            //     return Promise.resolve();
            // }).withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message)),
            check('status')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isIn(['active', 'inactive']).withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ENUM.message)),
        ];
    }

    case 'updateLoginMethod': {
        return [
            check('name')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('is_disable')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('is_coming_soon')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('os')
                .optional()
                .toArray()
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('status')
                .optional()
                .isIn(['active', 'inactive']).withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ENUM.message)),
        ];
    }

    default: {
        return [];
    }
    }
}

export default { validate };
