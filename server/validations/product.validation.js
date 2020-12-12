/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
// import db from '../../config/sequelize';
import errorCodes from '../errors/index.error';

// const User = db.user;

// const Sequelize = require('sequelize');
const { check } = require('express-validator');

function validate(method) {
    switch (method) {
    case 'createProduct': {
        return [
            check('brand_id')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('supplier_id')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            // check('product_number')
            //     .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
            //     .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('sku')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('name')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('supplier_price')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('ppn_percentage')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('markup_percentage')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            // check('final_price')
            //     .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
            //     .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('quantity')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('remaining_quantity')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('sizes')
                .toArray()
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('available_sizes')
                .toArray()
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('colors')
                .toArray()
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('available_colors')
                .toArray()
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('weight')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('condition')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('minimum_order')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('is_discount')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('discount_percentage')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('is_warranty')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('warranty_expired_at')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('description')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('status')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('is_disable')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('is_coming_soon')
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('os')
                .toArray()
                .not().isEmpty().withMessage((value, { req }) => req.t(errorCodes.validationVLError.REQUIRED.message))
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),

        ];
    }

    case 'updateProduct': {
        return [
            check('brand_id')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('supplier_id')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('sku')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('name')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('supplier_price')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('ppn_percentage')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('markup_percentage')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            // check('final_price')
            //     .optional()
            //     .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('quantity')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('remaining_quantity')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('sizes')
                .optional()
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('available_sizes')
                .toArray()
                .optional()
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('colors')
                .optional()
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('available_colors')
                .toArray()
                .optional()
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
            check('weight')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('condition')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('minimum_order')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('is_discount')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('discount_percentage')
                .optional()
                .isNumeric().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_INTEGER.message)),
            check('is_warranty')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('warranty_expired_at')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('description')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('status')
                .optional()
                .isString().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_STRING.message)),
            check('is_disable')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('is_coming_soon')
                .optional()
                .isBoolean().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_BOOLEAN.message)),
            check('os')
                .toArray()
                .optional()
                .isArray().withMessage((value, { req }) => req.t(errorCodes.validationVLError.MUST_BE_ARRAY.message)),
        ];
    }

    default: {
        return [];
    }
    }
}

export default { validate };
