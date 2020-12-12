import { isEmpty } from 'lodash';
import errorCodes from '../../errors/index.error';
import db from '../../../config/sequelize';
import helper from '../../misc/helper';

// const Sequelize = require('sequelize');
const fs = require('fs');

const productGalery = db.product_galery;
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { setContent, getContentSuccess, getContentFail } = require('../../response/response');
const { simpleOrdering, simplePagination } = require('../../misc/misc');

function load(req, res, next, id) {
    productGalery
        .findByPk(id)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.productGaleryPGError.PRODUCT_GALERY_NOT_FOUND);
                return res.status(404).json(getContentFail(req));
            }
            req.productGaleryData = result;
            return next();
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function get(req, res) {
    setContent(200, req.productGaleryData);
    return res.status(200).json(getContentSuccess());
}

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!isEmpty(req.fileValidationError)) {
        // req.fileValidationError.map((x) => errors.errors.push(x));
        errors.errors.push(req.fileValidationError);
    }
    if (!errors.isEmpty()) {
        if (!isEmpty(req.files)) {
            req.files.map(async (x) => {
                fs.unlinkSync(x.path);
            });
        }
        const data = _(errors.errors)
            .groupBy('param')
            .mapValues((group) => _.map(group, 'msg'))
            .value();
        setContent(422, data);
        return res.status(422).json(getContentFail(req));
    }

    const payload = [];
    if (!isEmpty(req.files)) {
        await Promise.all(req.files.map(async (x) => {
            const filename = x.filename.split('.')[0];
            const uploadImage = await helper.uploadCloudinary(x.path, filename, 'product');
            if (!uploadImage) {
                fs.unlinkSync(x.path);
            }
            payload.push({
                product_id: req.body.product_id,
                image_name: uploadImage.public_id,
                image_source: uploadImage.secure_url,
            });
        }));
    }

    return productGalery.bulkCreate(payload)
        .then(async (result) => {
            if (!isEmpty(req.files)) {
                req.files.map(async (x) => {
                    fs.unlinkSync(x.path);
                });
            }
            setContent(200, result);
            return res.status(200).json(getContentSuccess());
        })
        .catch(async (e) => {
            if (!isEmpty(req.files)) {
                req.files.map(async (x, i) => {
                    await helper.removeCloudinary(payload[i].image_name);
                    fs.unlinkSync(x.path);
                });
            }
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
};

async function update(req, res) {
    const errors = validationResult(req);
    if (req.fileValidationError) {
        errors.errors.push(req.fileValidationError);
    }
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        const data = _(errors.errors)
            .groupBy('param')
            .mapValues((group) => _.map(group, 'msg'))
            .value();
        setContent(422, data);
        return res.status(422).json(getContentFail(req));
    }

    const filename = req.file.filename.split('.')[0];
    if (req.productGaleryData.image_name) {
        const removeImage = await helper.removeCloudinary(req.productGaleryData.image_name);
        if (!removeImage) {
            setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_REMOVE_FILE_FROM_CDN);
            return res.status(400).json(getContentFail(req));
        }
    }
    const upload = await helper.uploadCloudinary(req.file.path, filename, 'product');
    if (!upload) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_UPLOAD_FILE_TO_CDN);
        return res.status(400).json(getContentFail(req));
    }
    req.body.image_name = upload.public_id;
    req.body.image_source = upload.secure_url;
    return req.productGaleryData.update(req.body)
        .then(() => {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            setContent(200, 'OK');
            return res.status(200).json(getContentSuccess());
        })
        .catch(async (e) => {
            await helper.removeCloudinary(upload.public_id);
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function list(req, res) {
    const ordering = simpleOrdering(req, 'product_galery_id');
    const pagination = simplePagination(req);
    const option = {
        where: {
        },
        include: [],
        distinct: true,
    };
    return productGalery
        .scope([
            { method: ['ordering', ordering] },
            { method: ['pagination', req.query.pagination, pagination] },
        ])
        .findAndCountAll(option)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.productGaleryPGError.PRODUCT_GALERY_NOT_FOUND);
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

async function remove(req, res) {
    const { productGaleryData } = req;
    if (productGaleryData.image_name) {
        const removeImage = await helper.removeCloudinary(productGaleryData.image_name);
        if (!removeImage) {
            setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_REMOVE_FILE_FROM_CDN);
            return res.status(400).json(getContentFail(req));
        }
    }
    return productGaleryData.destroy()
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
