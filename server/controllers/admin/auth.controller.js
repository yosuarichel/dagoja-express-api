import moment from 'moment';
import errorCodes from '../../errors/index.error';
import db from '../../../config/sequelize';

const Sequelize = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Admin = db.admin;
const adminRole = db.admin_role;
const adminSession = db.admin_session;
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { setContent, getContentSuccess, getContentFail } = require('../../response/response');
// const { simpleOrdering, simplePagination } = require('../../misc/misc');


const registerAdmin = async (req, res) => {
    const { settingData } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = _(errors.errors)
            .groupBy('param')
            .mapValues((group) => _.map(group, 'msg'))
            .value();
        setContent(422, data);
        return res.status(422).json(getContentFail(req));
    }
    const adminRoleCount = await adminRole.count({
        where: {
            admin_role_id: req.body.admin_role_id,
        },
        raw: true,
    });
    if (adminRoleCount === 0) {
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
        setContent(400, errorCodes.adminADError.ADMIN_ALREADY_REGISTERED);
        return res.status(400).json(getContentFail(req));
    }
    const passHashed = crypto.createHash('sha256')
        .update(req.body.password)
        .digest('hex');
    const payload = {
        admin_role_id: req.body.admin_role_id,
        full_name: req.body.full_name,
        email: req.body.email,
        password: passHashed,
        status: req.body.status,
    };
    return Admin.create(payload)
        .then(async (result) => {
            const sessionHash = crypto.createHash('sha256')
                .update(`Admin${result.admin_id}${result.email}${Date.now()}`)
                .digest('hex');
            const now = moment(Date.now()).tz('Asia/Jakarta').format();
            const split = settingData.admin_session_expiry.split(';');
            const valueExp = split[0];
            const intervalExp = split[1];
            const sessionExpiry = moment(now).add(valueExp, `${intervalExp}`).tz('Asia/Jakarta');
            const diff = sessionExpiry.diff(now) / 1000;

            await adminSession.create({
                admin_id: result.admin_id,
                session: sessionHash,
                expire_value: diff,
                expired_at: moment(sessionExpiry).tz('Asia/Jakarta').format(),
            });
            const token = jwt.sign({
                type: 'admin',
                role_id: result.admin_role_id,
                name: result.full_name,
                email: result.email,
                session: sessionHash,
                session_expiry: moment(sessionExpiry).tz('Asia/Jakarta').format(),
                status: result.status,
            }, process.env.JWT_SECRET, { expiresIn: diff });
            setContent(200, {
                email: result.email,
                session: sessionHash,
                session_expiry: moment(sessionExpiry).tz('Asia/Jakarta').format(),
                status: result.status,
                token,
            });
            return res.status(200).json(getContentSuccess());
        })
        .catch((e) => {
            setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
            return res.status(500).json(getContentFail(req, e));
        });
};

const loginAdmin = async (req, res) => {
    const { settingData } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = _(errors.errors)
            .groupBy('param')
            .mapValues((group) => _.map(group, 'msg'))
            .value();
        setContent(422, data);
        return res.status(422).json(getContentFail(req));
    }

    const adminData = await Admin.findOne({
        where: {
            email: req.body.email,
        },
        raw: true,
    });
    if (!adminData) {
        setContent(400, errorCodes.authAUError.INVALID_CREDENTIAL);
        return res.status(400).json(getContentFail(req));
    }
    if (adminData.status === 'inactive') {
        setContent(400, errorCodes.authAUError.ACCOUNT_SUSPENDED);
        return res.status(400).json(getContentFail(req));
    }

    const passHashed = crypto.createHash('sha256')
        .update(req.body.password)
        .digest('hex');
    if (adminData.password !== passHashed) {
        setContent(400, errorCodes.authAUError.INVALID_CREDENTIAL);
        return res.status(400).json(getContentFail(req));
    }

    const sessionHash = crypto.createHash('sha256')
        .update(`Admin${adminData.admin_id}${adminData.email}${Date.now()}`)
        .digest('hex');
    const now = moment(Date.now()).tz('Asia/Jakarta').format();
    const split = settingData.admin_session_expiry.split(';');
    const valueExp = split[0];
    const intervalExp = split[1];
    const sessionExpiry = moment(now).add(valueExp, `${intervalExp}`).tz('Asia/Jakarta');
    const diff = sessionExpiry.diff(now) / 1000;

    const adminSessionData = await adminSession.findOne({
        where: {
            admin_id: adminData.admin_id,
        },
        raw: true,
    });
    if (adminSessionData) {
        await adminSession.update({
            session: sessionHash,
            expiry_value: diff,
            expiry_date: moment(sessionExpiry).tz('Asia/Jakarta').format(),
        }, {
            where: {
                admin_id: adminData.admin_id,
            },
        });
    }
    if (!adminSessionData) {
        await adminSession.create({
            admin_id: adminData.admin_id,
            session: sessionHash,
            expire_value: diff,
            expired_at: moment(sessionExpiry).tz('Asia/Jakarta').format(),
        });
    }

    const token = jwt.sign({
        type: 'admin',
        role_id: adminData.admin_role_id,
        name: adminData.full_name,
        email: adminData.email,
        session: sessionHash,
        session_expiry: moment(sessionExpiry).tz('Asia/Jakarta').format(),
        status: adminData.status,
    }, process.env.JWT_SECRET, { expiresIn: diff });
    res.cookie('accessToken', token, { maxAge: diff * 1000 });
    setContent(200, {
        email: adminData.email,
        session: sessionHash,
        session_expiry: moment(sessionExpiry).tz('Asia/Jakarta').format(),
        status: adminData.status,
        token,
    });
    return res.status(200).json(getContentSuccess());
};

const logoutAdmin = async (req, res) => {
    const { adminData } = req;
    return adminSession.destroy({
        where: {
            admin_id: adminData.admin_id,
            session: adminData.session,
        },
    }).then(() => {
        setContent(200, 'Logged Out');
        return res.status(200).json(getContentSuccess(req));
    }).catch((e) => {
        setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
        return res.status(500).json(getContentFail(req, e));
    });
};


export default {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
};
