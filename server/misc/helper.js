/* eslint-disable camelcase */
/* eslint-disable max-len */
// import moment from 'moment';
// import db from '../../config/sequelize';
// import request from '../model/request.schema';

require('dotenv').config();

// const CryptoJS = require('crypto-js');
// const rp = require('request-promise-core');
// const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

const uploadCloudinary = async (path, fileName, folder, tags) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const options = {
        public_id: fileName,
        unique_filename: false,
        folder: `public/original/${folder}`,
    };
    if (tags) {
        options.tags = tags;
    }
    console.log(options);
    return cloudinary.uploader.upload(
        path,
        options, // directory and tags are optional
    ).then((result) => {
        const data = result;
        const x = data.public_id.split('/').length;
        data.unique_name = data.public_id.split('/')[x - 1];
        return data;
    }).catch((e) => {
        console.log(e);
        return null;
    });
};

const removeCloudinary = async (publicId) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return cloudinary.uploader.destroy(
        publicId,
    ).then((result) => result).catch((e) => {
        console.log(e);
        return null;
    });
};


export default {
    uploadCloudinary,
    removeCloudinary,
};
