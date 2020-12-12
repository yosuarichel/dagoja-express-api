/* eslint-disable camelcase */
/* eslint-disable max-len */
import moment from 'moment';
import db from '../../config/sequelize';
import { setContent, getContentFail } from '../response/response';
import errorCodes from '../errors/index.error';
// import request from '../model/request.schema';

require('dotenv').config();

const Setting = db.setting;
const adminSession = db.admin_session;
const Admin = db.admin;
// const CryptoJS = require('crypto-js');
// const rp = require('request-promise-core');
const jwt = require('jsonwebtoken');

const getSetting = async (req, res, next) => {
    let settingError = false;
    let settingErrorData = null;
    let settingData = null;
    await Setting.findByPk(1)
        .then((result) => {
            if (result) {
                settingData = result.dataValues;
            }
        }).catch((e) => {
            settingError = true;
            settingErrorData = e;
        });
    if (settingError) {
        setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
        return res.status(500).json(getContentFail(req, settingErrorData));
    }
    if (!settingData) {
        setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
        return res.status(500).json(getContentFail(req, settingData));
    }
    req.settingData = settingData;
    return next();
};

const checkTokenJwt = (req, res, next, types) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const jwtToken = req.headers.authorization.split(' ')[1];
        return jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                Object.assign(errorCodes.authAUError.NOT_AUTHORIZED, {
                    detail: err.name,
                });
                setContent(401, errorCodes.authAUError.NOT_AUTHORIZED);
                return res.status(401).json(getContentFail(req));
            }
            if (!decoded.session) {
                setContent(401, errorCodes.authAUError.NOT_AUTHORIZED);
                return res.status(401).json(getContentFail(req));
            }
            if (!types.includes((decoded.type).toLowerCase())) {
                setContent(401, errorCodes.authAUError.NOT_AUTHORIZED);
                return res.status(401).json(getContentFail(req));
            }
            // if (decoded.session !== req.sessionPlatformData.session) {
            //     setContent(401, errorCodes.authAUError.NOT_AUTHORIZED);
            //     return res.status(401).json(getContentFail(req));
            // }
            req.decoded = decoded;
            return next();
        });
    }
    setContent(401, errorCodes.authAUError.NOT_AUTHORIZED);
    return res.status(401).json(getContentFail(req));
};

const checkAdminSession = async (req, res, next) => {
    const { settingData } = req;
    let sessionAdmin = null;
    if (req.body.session) {
        sessionAdmin = req.body.session;
    }
    if (req.query.session) {
        sessionAdmin = req.query.session;
    }
    if (req.headers.session) {
        sessionAdmin = req.headers.session;
    }
    if (req.decoded.session) {
        sessionAdmin = req.decoded.session;
    }
    if (!sessionAdmin) {
        setContent(400, errorCodes.authAUError.SESSION_REQUIRED);
        return res.status(400).json(getContentFail(req));
    }

    const sessionAdminData = await adminSession.findOne({
        where: {
            session: sessionAdmin,
        },
        raw: true,
    });
    if (!sessionAdminData) {
        setContent(400, errorCodes.authAUError.INVALID_CREDENTIAL);
        return res.status(400).json(getContentFail(req));
    }

    const adminData = await Admin.findOne({
        where: {
            admin_id: sessionAdminData.admin_id,
        },
        raw: true,
    });
    if (!adminData) {
        setContent(400, errorCodes.authAUError.INVALID_CREDENTIAL);
        return res.status(400).json(getContentFail(req));
    }
    Object.assign(adminData, {
        session: sessionAdminData.session,
    });
    req.adminData = adminData;

    const now = moment(Date.now()).tz('Asia/Jakarta').format();
    const expiry = moment(sessionAdminData.expiry_date).tz('Asia/Jakarta');
    const diff = expiry.diff(now);
    if (diff <= 0) {
        setContent(400, errorCodes.authAUError.SESSION_EXPIRED);
        return res.status(400).json(getContentFail(req));
    }
    const split = settingData.admin_session_expiry.split(';');
    const valueExp = split[0];
    const intervalExp = split[1];
    const sessionExpiry = moment(now).add(valueExp, `${intervalExp}`).tz('Asia/Jakarta');
    const diffNew = sessionExpiry.diff(now) / 1000;

    adminSession.update({
        expire_value: diffNew,
        expired_at: moment(sessionExpiry).tz('Asia/Jakarta').format(),
    }, {
        where: {
            admin_id: sessionAdminData.admin_id,
        },
    });
    return next();
};


// const checkUserData = async (req, res, next) => {
//     if (req.body.phone_number || req.query.phone_number) {
//         let userNotFound = false;
//         await db.user.findOne({
//             where: {
//                 phone_number: req.body.phone_number ? req.body.phone_number : req.query.phone_number,
//             },
//         })
//             .then((userFound) => {
//                 if (!userFound) {
//                     userNotFound = true;
//                 }
//                 if (userFound) {
//                     req.userData = {
//                         user_id: userFound.dataValues.user_id,
//                         first_name: userFound.dataValues.first_name,
//                         last_name: userFound.dataValues.last_name,
//                         email: userFound.dataValues.email,
//                         phone_number: userFound.dataValues.phone_number,
//                         account_number: userFound.dataValues.account_number,
//                         partner_token: userFound.dataValues.partner_token,
//                     };
//                 }
//             });
//         if (userNotFound) {
//             setContent(400, errorCodes.generalGEError.USER_NOT_REGISTERED);
//             return res.status(400).json(
//                 getContentFail(req, errorCodes.generalGEError.USER_NOT_REGISTERED),
//             );
//         }
//         return next();
//     }
//     setContent(400, errorCodes.generalGEError.PHONE_NUMBER_REQUIRED);
//     return res.status(400).json(getContentFail(req));
// };

// const checkMaintenance = async (req, res, next) => {
//     const searchExc = req.path.search('/api/v1.0/admin');
//     if (searchExc >= 0) {
//         return next();
//     }
//     let maintenanceError = false;
//     let maintenanceErrorData = null;
//     let maintenanceData = null;
//     await maintenance.findByPk(1)
//         .then((result) => {
//             if (result) {
//                 maintenanceData = result.dataValues;
//             }
//         }).catch((e) => {
//             maintenanceError = true;
//             maintenanceErrorData = e;
//         });
//     if (maintenanceError) {
//         setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//         return res.status(500).json(getContentFail(req, maintenanceErrorData));
//     }
//     if (!maintenanceData) {
//         setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//         return res.status(500).json(getContentFail(req, maintenanceData));
//     }
//     if (process.env.SYSTEM_ENV === 'sandbox') {
//         if (maintenanceData.sandbox === true) {
//             setContent(503, errorCodes.generalGEError.SYSTEM_MAINTENANCE);
//             return res.status(503).json(getContentFail(req));
//         }
//     }
//     if (process.env.SYSTEM_ENV === 'production') {
//         if (maintenanceData.production === true) {
//             setContent(503, errorCodes.generalGEError.SYSTEM_MAINTENANCE);
//             return res.status(503).json(getContentFail(req));
//         }
//     }
//     return next();
// };


// const checkPlatformSession = async (req, res, next) => {
//     let sessionPlatform = null;
//     if (req.body.session) {
//         sessionPlatform = req.body.session;
//     }
//     if (req.query.session) {
//         sessionPlatform = req.query.session;
//     }
//     if (req.headers.session) {
//         sessionPlatform = req.headers.session;
//     }
//     if (req.decoded.session) {
//         sessionPlatform = req.decoded.session;
//     }
//     if (!sessionPlatform) {
//         setContent(400, errorCodes.authAUError.SESSION_REQUIRED);
//         return res.status(400).json(getContentFail(req));
//     }

//     let settingError = false;
//     let settingErrorData = null;
//     let settingData = null;
//     await setting.findByPk(1)
//         .then((result) => {
//             if (result) {
//                 settingData = result.dataValues;
//             }
//         }).catch((e) => {
//             settingError = true;
//             settingErrorData = e;
//         });
//     if (settingError) {
//         setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//         return res.status(500).json(getContentFail(req, settingErrorData));
//     }
//     if (!settingData) {
//         setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//         return res.status(500).json(getContentFail(req, settingData));
//     }

//     let sessionPlatformError = false;
//     let sessionPlatformErrorData = null;
//     let sessionPlatformData = null;
//     await session_platform.findOne({
//         where: {
//             session: sessionPlatform,
//         },
//     }).then((result) => {
//         if (result) {
//             sessionPlatformData = result.dataValues;
//         }
//     }).catch((e) => {
//         sessionPlatformError = true;
//         sessionPlatformErrorData = e;
//     });
//     if (sessionPlatformError) {
//         setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//         return res.status(500).json(getContentFail(req, sessionPlatformErrorData));
//     }
//     if (!sessionPlatformData) {
//         setContent(400, errorCodes.authAUError.ACCOUNT_NOT_FOUND);
//         return res.status(400).json(getContentFail(req));
//     }
//     req.sessionPlatformData = sessionPlatformData;

//     let platformError = false;
//     let platformErrorData = null;
//     let platformData = null;
//     await platform.findByPk(sessionPlatformData.platform_id)
//         .then((platformResult) => {
//             if (platformResult) {
//                 platformData = platformResult.dataValues;
//             }
//         }).catch((e) => {
//             platformError = true;
//             platformErrorData = e;
//         });
//     if (platformError) {
//         setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//         return res.status(500).json(getContentFail(req, platformErrorData));
//     }
//     if (!platformData) {
//         setContent(400, errorCodes.authAUError.ACCOUNT_NOT_FOUND);
//         return res.status(400).json(getContentFail(req));
//     }
//     req.platformData = platformData;

//     const now = moment(Date.now()).tz('Asia/Jakarta').format();
//     const expiry = moment(sessionPlatformData.expiry_date).tz('Asia/Jakarta');
//     const diff = expiry.diff(now);
//     if (diff <= 0) {
//         setContent(400, errorCodes.authAUError.SESSION_EXPIRED);
//         return res.status(400).json(getContentFail(req));
//     }
//     const split = settingData.client_session_expiry.split(';');
//     const valueExp = split[0];
//     const intervalExp = split[1];
//     const sessionExpiry = moment(now).add(valueExp, `${intervalExp}`).tz('Asia/Jakarta');
//     const diffNew = sessionExpiry.diff(now) / 1000;

//     session_platform.update({
//         expiry_value: diffNew,
//         expiry_date: moment(sessionExpiry).tz('Asia/Jakarta').format(),
//     }, {
//         where: {
//             platform_id: sessionPlatformData.platform_id,
//         },
//     });
//     return next();
// };

// const checkRequest = async (req, res, next) => {
//     if (!req.headers['request-id']) {
//         setContent(400, errorCodes.generalGEError.REQUEST_ID_REQUIRED);
//         return res.status(400).json(getContentFail(req));
//     }

//     let decryptedData = null;
//     try {
//         const bytes = CryptoJS.AES.decrypt(req.headers['request-id'], process.env.CHIPER_SECRET_KEY);
//         const decrypt = bytes.toString(CryptoJS.enc.Utf8);
//         decryptedData = decrypt;
//     } catch (error) {
//         setContent(400, errorCodes.generalGEError.INVALID_KEY);
//         return res.status(400).json(getContentFail(req));
//     }
//     if (!decryptedData) {
//         setContent(400, errorCodes.generalGEError.INVALID_KEY);
//         return res.status(400).json(getContentFail(req));
//     }

//     let requestError = false;
//     let requestErrorData = null;
//     let requestData = null;
//     await request.findOne({
//         request_id: decryptedData,
//     }).then((result) => {
//         if (result) {
//             requestData = result;
//         }
//     }).catch((e) => {
//         requestError = true;
//         requestErrorData = e;
//     });

//     if (requestData) {
//         setContent(400, errorCodes.generalGEError.REQUEST_INVALID);
//         return res.status(400).json(getContentFail(req));
//     }
//     if (requestError) {
//         setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//         return res.status(500).json(getContentFail(req, requestErrorData));
//     }

//     request.create({
//         request_id: decryptedData,
//         request_date: moment(Date.now()).tz('Asia/Jakarta').format(),
//         platform_id: req.platformData.platform_id,
//         url: `${req.headers.host}${req.url}`,
//     });
//     return next();
// };

// const sanitizePhoneNumber = async (req, res, next) => {
//     let phone = null;
//     if (req.body.phone_number) {
//         phone = req.body.phone_number;
//     }
//     if (req.query.phone_number) {
//         phone = req.query.phone_number;
//     }
//     if (phone) {
//         const str = phone.toString();
//         const check1 = str.substr(0, 1);
//         const check3 = str.substr(0, 2);
//         if (check1 === '+') {
//             const check2 = str.substr(1, 2);
//             if (check2 === '62') {
//                 phone = `0${str.substr(3)}`;
//             } else {
//                 setContent(400, errorCodes.generalGEError.PHONE_NUMBER_INVALID);
//                 return res.status(400).json(getContentFail(req));
//             }
//         }
//         if (check3 === '62') {
//             phone = `0${str.substr(2)}`;
//         }
//         if (req.body.phone_number) {
//             req.body.phone_number = phone;
//         }
//         if (req.query.phone_number) {
//             req.query.phone_number = phone;
//         }
//         const codePhone = phone.substr(0, 4);
//         return operator_code.findOne({
//             where: {
//                 code: codePhone,
//             },
//         }).then((result) => {
//             if (!result) {
//                 setContent(400, errorCodes.generalGEError.PHONE_OPERATOR_NOT_FOUND);
//                 return res.status(400).json(getContentFail(req));
//             }
//             return next();
//         }).catch((e) => {
//             setContent(500, errorCodes.generalGEError.SOMETHING_WRONG);
//             return res.status(500).json(getContentFail(req, e));
//         });
//     }
//     return next();
// };


export default {
    getSetting,
    checkTokenJwt,
    checkAdminSession,
};
