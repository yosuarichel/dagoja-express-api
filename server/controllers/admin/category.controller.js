import errorCodes from '../../errors/index.error';
import db from '../../../config/sequelize';
import helper from '../../misc/helper';

const fs = require('fs');

const Category = db.category;
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { setContent, getContentSuccess, getContentFail } = require('../../response/response');
const { simpleOrdering, simplePagination } = require('../../misc/misc');

function load(req, res, next, id) {
    Category
        .findByPk(id)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.categoryCTError.CATEGORY_NOT_FOUND);
                return res.status(404).json(getContentFail(req));
            }
            req.category = result;
            return next();
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function get(req, res) {
    setContent(200, req.category);
    return res.status(200).json(getContentSuccess());
}

const create = async (req, res) => {
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

    const categoryData = await Category.count({
        where: {
            name: req.body.name,
        },
        raw: true,
    });
    if (categoryData > 0) {
        setContent(400, errorCodes.categoryCTError.CATEGORY_ALREADY_EXIST);
        return res.status(400).json(getContentFail(req));
    }

    const upload = await helper.uploadCloudinary(req.file.path, filename, 'category');
    if (!upload) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_UPLOAD_FILE_TO_CDN);
        return res.status(400).json(getContentFail(req));
    }

    req.body.image_name = upload.public_id;
    req.body.image_source = upload.secure_url;
    return Category.create(req.body)
        .then(async (result) => {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            setContent(200, result);
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
    if (req.category.image_name) {
        const removeImage = await helper.removeCloudinary(req.category.image_name);
        if (!removeImage) {
            setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_REMOVE_FILE_FROM_CDN);
            return res.status(400).json(getContentFail(req));
        }
    }
    const upload = await helper.uploadCloudinary(req.file.path, filename, 'category');
    if (!upload) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_UPLOAD_FILE_TO_CDN);
        return res.status(400).json(getContentFail(req));
    }

    req.body.image_name = upload.public_id;
    req.body.image_source = upload.secure_url;
    return req.category.update(req.body)
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
    const ordering = simpleOrdering(req, 'category_id');
    const pagination = simplePagination(req);
    const option = {
        where: {
        },
        include: [],
        distinct: true,
    };
    return Category
        .scope([
            { method: ['ordering', ordering] },
            { method: ['pagination', req.query.pagination, pagination] },
        ])
        .findAndCountAll(option)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.categoryCTError.CATEGORY_NOT_FOUND);
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
    const { category } = req;
    if (category.image_name) {
        const removeImage = await helper.removeCloudinary(category.image_name);
        if (!removeImage) {
            setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_REMOVE_FILE_FROM_CDN);
            return res.status(400).json(getContentFail(req));
        }
    }
    return category.destroy()
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
