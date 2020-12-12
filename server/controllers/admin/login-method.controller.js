import errorCodes from '../../errors/index.error';
import db from '../../../config/sequelize';

const Sequelize = require('sequelize');

const loginMethod = db.login_method;
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { setContent, getContentSuccess, getContentFail } = require('../../response/response');
const { simpleOrdering, simplePagination } = require('../../misc/misc');

function load(req, res, next, id) {
    loginMethod
        .findByPk(id)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.loginMethodLMError.LOGIN_METHOD_NOT_FOUND);
                return res.status(404).json(getContentFail(req));
            }
            req.loginMethodData = result;
            return next();
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
}

function get(req, res) {
    setContent(200, req.loginMethodData);
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
    const loginMethodData = await loginMethod.count({
        where: {
            name: {
                [Sequelize.Op.iLike]: `%${req.body.name}%`,
            },
        },
        raw: true,
    });
    if (loginMethodData > 0) {
        setContent(400, errorCodes.loginMethodLMError.LOGIN_METHOD_ALREADY_EXIST);
        return res.status(400).json(getContentFail(req));
    }
    return loginMethod.create(req.body)
        .then((result) => {
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
    if (req.body.os) {
        if (Array.isArray(req.body.os) === false) {
            req.body.os = [req.body.os];
        }
    }
    return req.loginMethodData.update(req.body)
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
    const ordering = simpleOrdering(req, 'login_method_id');
    const pagination = simplePagination(req);
    const option = {
        where: {
        },
        include: [],
        distinct: true,
    };
    return loginMethod
        .scope([
            { method: ['ordering', ordering] },
            { method: ['pagination', req.query.pagination, pagination] },
        ])
        .findAndCountAll(option)
        .then((result) => {
            if (!result) {
                setContent(404, errorCodes.loginMethodLMError.LOGIN_METHOD_NOT_FOUND);
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
    const { loginMethodData } = req;
    return loginMethodData.destroy()
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
