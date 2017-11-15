/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');
const crypto = require('crypto');

/**
 * default options
 */
const defaultOptions = {
    session_name: 'csrf_token', // session存储key
    form_name: '_csrf', // csrf传递参数 key
    header_name: 'x-csrf-token', // csrf使用header传递参数 key
    errno: 403, // 错误码，未通过csrf检测抛出
    errmsg: 'invalid csrf token' // 错误信息，未通过csrf检测抛出
};

/**
 * 生成uid
 * @param length
 * @returns {string}
 */
const cookieUid = function (length) {
    let str = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
    return str.replace(/[\+\/]/g, '_');
};

/**
 * 
 * 
 * @param {any} ctx 
 * @param {any} { session_name } 
 * @returns 
 */
const ensureCsrfToken = function (ctx, session_name) {
    const token = cookieUid(32);
    return ctx.session(session_name).then(value => value ? Promise.resolve(value) : ctx.session(session_name, token).then(() => token));
};

/**
 * 
 * 
 * @param {any} ctx 
 * @param {any} options 
 * @returns 
 */
const checkCsrf = function (ctx, options) {
    return ctx.session(options.session_name).then(value => {
        if (!value) {
            ctx.throw(options.errno, options.errmsg);
        }
        const token = ctx.query[options.form_name] || (ctx.request.body.post && ctx.request.body.post[options.form_name]) || ctx.get(options.header_name);
        if (token !== value) {
            ctx.throw(options.errno, options.errmsg);
        }
    });
};

module.exports = function (options, app) {
    options = options ? lib.extend(defaultOptions, options, true) : defaultOptions;
    return function (ctx, next) {
        if (!ctx.session) {
            ctx.throw(500, 'please install think_session middleware');
        }

        if (ctx.method === 'GET' || ctx.method === 'HEAD' || ctx.method === 'OPTIONS' || ctx.method === 'TRACE') {
            return ensureCsrfToken(ctx, options).then(value => lib.define(ctx, 'csrf', value)).then(() => next());
        }

        return checkCsrf(ctx, options).then(() => next());
    };
};