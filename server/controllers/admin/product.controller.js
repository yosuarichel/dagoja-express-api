import moment from 'moment';
import errorCodes from '../../errors/index.error';
import db from '../../../config/sequelize';


const Product = db.product;
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { setContent, getContentSuccess, getContentFail } = require('../../response/response');
const { simpleOrdering, simplePagination } = require('../../misc/misc');

function load(req, res, next, id) {
    Product
        .findByPk(id)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.productPRError.PRODUCT_NOT_FOUND);
                return res.status(404).json(getContentFail(req));
            }
            req.product = result;
            return next();
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function get(req, res) {
    setContent(200, req.product);
    return res.status(200).json(getContentSuccess());
}

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = _(errors.errors)
            .groupBy('param')
            .mapValues((group) => _.map(group, 'msg'))
            .value();
        setContent(422, data);
        return res.status(422).json(getContentFail(req));
    }

    const productCount = await Product.count({
        where: {
            sku: req.body.sku,
        },
        raw: true,
    });
    if (productCount > 0) {
        setContent(400, errorCodes.productPRError.PRODUCT_ALREADY_EXIST);
        return res.status(400).json(getContentFail(req));
    }

    const prefix = 'P';
    const initialLength = 3;
    const initialProductName = req.body.name.substr(0, initialLength).toUpperCase();
    const productWeight = req.body.weight;

    if (!req.body.ppn_percentage) {
        req.body.ppn_percentage = 0;
    }
    if (!req.body.markup_percentage) {
        req.body.markup_percentage = req.body.ppn_percentage;
    }
    if (req.body.warranty_expired_at) {
        req.body.warranty_expired_at = moment(req.body.warranty_expired_at).tz('Asia/Jakarta').format();
    }
    const markup = req.body.markup_percentage;
    const productPrice = (Number(req.body.supplier_price) / ((100 - markup) / 100));
    const priceAfterPPN = productPrice - (productPrice * (req.body.ppn_percentage / 100));
    req.body.final_price = priceAfterPPN.toFixed(0);
    console.log(req.body);
    return Product.create(req.body)
        .then(async (result) => {
            const productCode = `${prefix}${result.product_id}-${initialProductName}-${productWeight}-DGJ`;
            await Product.update({
                product_number: productCode,
            }, {
                where: {
                    product_id: result.product_id,
                },
            });
            Object.assign(result, {
                product_number: productCode,
            });
            setContent(200, result);
            return res.status(200).json(getContentSuccess());
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
};

function update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = _(errors.errors)
            .groupBy('param')
            .mapValues((group) => _.map(group, 'msg'))
            .value();
        setContent(422, data);
        return res.status(422).json(getContentFail(req));
    }

    if (req.body.warranty_expired_at) {
        req.body.warranty_expired_at = moment(req.body.warranty_expired_at).tz('Asia/Jakarta').format();
    }

    if (!req.body.supplier_price) {
        req.body.supplier_price = req.product.supplier_price;
    }
    if (!req.body.ppn_percentage) {
        req.body.ppn_percentage = req.product.ppn_percentage;
    }
    if (!req.body.markup_percentage) {
        req.body.markup_percentage = req.product.markup_percentage;
    }
    const markup = req.body.markup_percentage;
    const productPrice = (Number(req.body.supplier_price) / ((100 - markup) / 100));
    const priceAfterPPN = productPrice - (productPrice * (req.body.ppn_percentage / 100));
    req.body.final_price = priceAfterPPN.toFixed(0);
    // return console.log(req.body)
    return req.product.update(req.body)
        .then(() => {
            setContent(200, 'OK');
            return res.status(200).json(getContentSuccess());
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function list(req, res) {
    const ordering = simpleOrdering(req, 'product_id');
    const pagination = simplePagination(req);
    const option = {
        where: {
        },
        include: [],
        distinct: true,
    };
    return Product
        .scope([
            { method: ['ordering', ordering] },
            { method: ['pagination', req.query.pagination, pagination] },
        ])
        .findAndCountAll(option)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.productPRError.PRODUCT_NOT_FOUND);
                return res.status(404).json(getContentFail(req));
            }
            setContent(200, result);
            return res.status(200).json(getContentSuccess());
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function remove(req, res) {
    const { product } = req;
    return product.destroy()
        .then(() => {
            setContent(200, 'OK');
            return res.status(200).json(getContentSuccess());
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
};
