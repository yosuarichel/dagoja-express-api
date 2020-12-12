const content = {
    response: null,
    result: null,
};

const setContent = (response, result) => {
    content.response = response;
    content.result = result;
};

const setContentAndCount = (response, result) => {
    content.result = {};
    content.response = response;
    content.result.count = result.length;
    content.result.rows = result;
};

const getContentSuccess = () => content;

const getContentFail = (req, error) => {
    // eslint-disable-next-line no-console
    let errorResponse = null;
    errorResponse = content.result;
    if (content.result.code && content.result.message) {
        const err = {};
        err.code = content.result.code;
        err.message = req.t(content.result.message);
        err.detail = content.result.detail;
        errorResponse = err;
    }
    // const errorResponse = {
    //     code: content.result.code ? content.result.code : '',
    //     message: content.result.message ? req.t(content.result.message) : '',
    // };
    if (content.response === 500 && req.app.sentry) {
        req.app.sentry.captureException(error);
    }
    return errorResponse;
};

module.exports = {
    setContent,
    setContentAndCount,
    getContentSuccess,
    getContentFail,
};
