import errorCodes from '../../server/errors/index.error';

const multer = require('multer');
const path = require('path');
// require and configure dotenv, will load vars in .env in PROCESS.ENV
// require('dotenv').config();

const adminProfileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.env.ASSETS_ORIGINAL_PATH}/admin-profile/`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-').toLowerCase()}`);
    },
});
const adminProfileUploader = multer({
    storage: adminProfileStorage,
    fileFilter: async (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filetype = file.mimetype.split('/').shift();
        const allowedExt = ['.png', '.jpg', '.jpeg', '.svg'];
        if (filetype !== 'image') {
            req.fileValidationError = {
                param: file.fieldname,
                msg: req.t(errorCodes.generalGEError.FILE.FILE_MUST_BE_IMAGE.message),
            };
            return cb(null, false, req.fileValidationError);
        }
        if (!allowedExt.includes(ext)) {
            req.fileValidationError = {
                param: file.fieldname,
                msg: req.t(errorCodes.generalGEError.FILE.FILE_EXT_NOT_ALLOWED.message),
            };
            return cb(null, false, req.fileValidationError);
        }
        return cb(null, true);
    },
});

export default adminProfileUploader;
