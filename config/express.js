import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';
import moment from 'moment';
import winstonInstance from './winston';
import routes from '../server/routes/index.route';
import config from './config';
// import initialization from '../server/misc/initialization';
import middleware from '../server/misc/middleware';
import { setContent, getContentFail } from '../server/response/response';
import errorCodes from '../server/errors/index.error';

const sentry = require('@sentry/node');
const useragent = require('express-useragent');
const mongoose = require('mongoose');
const expressip = require('express-ip');
// const rid = require('connect-rid');
// const csurf = require('csurf');

// const csrfMiddleware = csurf({
//     cookie: true,
// });


mongoose.Promise = global.Promise;

require('dotenv').config();

const app = express();

// sentry.init({ dsn: process.env.SENTRY_URL });
sentry.init({
    debug: false,
    dsn: process.env.SENTRY_URL,
    environment: process.env.SENTRY_ENVIRONMENT,
});
// if (process.env.SENTRY_ENVIRONMENT !== 'local') {
//     sentry.init({
//         debug: false,
//         dsn: process.env.SENTRY_URL,
//         environment: process.env.SENTRY_ENVIRONMENT,
//     });
// }

app.use(sentry.Handlers.requestHandler());
app.use(sentry.Handlers.errorHandler());

app.sentry = sentry;

if (config.env === 'development') {
    app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// Get user agent information
app.use(useragent.express());

// Generate Rid
// app.use(rid({
//     headerName: 'X-RID',
// }));

// CSURF Protection
// app.use(csrfMiddleware);

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: `${__dirname}/../locales/{{lng}}/{{ns}}.json`,
            addPath: `${__dirname}/../locales/{{lng}}/{{ns}}.missing.json`,
        },
        fallbackLng: 'id',
        preload: ['en', 'id'],
        saveMissing: true,
        interpolation: {
            format: (value, format) => {
                if (format === 'uppercase') return value.charAt(0).toUpperCase() + value.slice(1);
                return value;
            },
        },
        detection: {
            // order and from where user language should be detected
            order: ['querystring', 'header', 'cookie'],
            // keys or params to lookup language from
            lookupQuerystring: 'lang',
            lookupHeader: 'accept-language',
        },
    });

app.use(i18nextMiddleware.handle(i18next));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');
app.use(expressWinston.logger({
    winstonInstance: winstonInstance.mongoLogger,
    msg: `{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms ${moment().tz('Asia/Jakarta').format()}`,
}));

// App Use Checker
app.use(expressip().getIpInfoMiddleware);
app.use(middleware.getSetting);
// app.use(initialization.sanitizePhoneNumber);
// app.use(initialization.checkUserData);

// Get API Version from .env (or else assume 1.0)
const baseUrl = `/api/v${config.apiVersion}`;

// mount all routes on /api path
app.use(`${baseUrl}`, routes);

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    return next(err);
});

// catch 404 and forward to error handler
// eslint-disable-next-line arrow-body-style
app.use((req, res) => {
    setContent(404, errorCodes.generalGEError.PAGE_NOT_FOUND);
    return res.status(404).json(getContentFail(req));
    // return next();
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
    app.use(expressWinston.errorLogger({
        winstonInstance: winstonInstance.mongoLogger,
    }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {},
    });
});

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    app.listen(process.env.MONGODB_PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Mongodb server started on port ${process.env.MONGODB_PORT}`);
    });
}).catch((e) => {
    // eslint-disable-next-line no-console
    console.log('Mongodb connection failed.');
    // eslint-disable-next-line no-console
    console.log('with error => ', e);
});

export default app;
