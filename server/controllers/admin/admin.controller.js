import errorCodes from '../../errors/index.error';
import db from '../../../config/sequelize';
import helper from '../../misc/helper';

const Sequelize = require('sequelize');
const crypto = require('crypto');
const fs = require('fs');

const Admin = db.admin;
const adminRole = db.admin_role;
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { setContent, getContentSuccess, getContentFail } = require('../../response/response');
const { simpleOrdering, simplePagination } = require('../../misc/misc');

function load(req, res, next, id) {
    Admin
        .findByPk(id)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.adminADError.ADMIN_NOT_FOUND);
                return res.status(404).json(getContentFail(req));
            }
            req.admin = result;
            return next();
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function get(req, res) {
    setContent(200, req.admin);
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
    const adminRoleCount = await adminRole.count({
        where: {
            admin_role_id: req.body.admin_role_id,
        },
        raw: true,
    });
    if (adminRoleCount === 0) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        setContent(400, errorCodes.adminRoleARError.ADMIN_ROLE_NOT_FOUND);
        return res.status(400).json(getContentFail(req));
    }
    const adminData = await Admin.count({
        where: {
            email: {
                [Sequelize.Op.iLike]: `%${req.body.email}%`,
            },
        },
        raw: true,
    });
    if (adminData > 0) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        setContent(400, errorCodes.adminADError.ADMIN_ALREADY_REGISTERED);
        return res.status(400).json(getContentFail(req));
    }
    const passHashed = crypto.createHash('sha256')
        .update(req.body.password)
        .digest('hex');
    const upload = await helper.uploadCloudinary(req.file.path, filename, 'admin-profile');
    if (!upload) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_UPLOAD_FILE_TO_CDN);
        return res.status(400).json(getContentFail(req));
    }

    req.body.password = passHashed;
    req.body.profile_image_name = upload.public_id;
    req.body.profile_image_source = upload.secure_url;
    return Admin.create(req.body)
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
    if (req.admin.profile_image_name) {
        const removeImage = await helper.removeCloudinary(req.admin.profile_image_name);
        if (!removeImage) {
            setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_REMOVE_FILE_FROM_CDN);
            return res.status(400).json(getContentFail(req));
        }
    }
    const upload = await helper.uploadCloudinary(req.file.path, filename, 'admin-profile');
    if (!upload) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_UPLOAD_FILE_TO_CDN);
        return res.status(400).json(getContentFail(req));
    }
    req.body.profile_image_name = upload.public_id;
    req.body.profile_image_source = upload.secure_url;
    return req.admin.update(req.body)
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
    const ordering = simpleOrdering(req, 'admin_id');
    const pagination = simplePagination(req);
    const option = {
        where: {
        },
        include: [],
        distinct: true,
    };
    return Admin
        .scope([
            { method: ['ordering', ordering] },
            { method: ['pagination', req.query.pagination, pagination] },
            { method: ['includeAdminRole', req.query.admin_role_id, adminRole] },
        ])
        .findAndCountAll(option)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.adminADError.ADMIN_NOT_FOUND);
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
    const { admin } = req;
    if (admin.profile_image_name) {
        const removeImage = await helper.removeCloudinary(admin.profile_image_name);
        if (!removeImage) {
            setContent(400, errorCodes.generalGEError.UPLOAD.FAILED_REMOVE_FILE_FROM_CDN);
            return res.status(400).json(getContentFail(req));
        }
    }
    return admin.destroy()
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
