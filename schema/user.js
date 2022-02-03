const joi = require('joi');

const pwd = joi.string().pattern(/^[\S]{6,15}$/)
const avatar = joi.string().dataUri().required();

exports.reg_login_schema = {
    body: {
        username: joi.string().alphanum().min(3).max(12).required(),
        pwd: joi.string().pattern(/^[\S]{6,15}$/),
        repwd: joi.ref('pwd') // 该规则表示repwd要与pwd保持一致
    }
}

exports.updateUserInfo_schema = {
    body: {
        id: joi.number().integer().min(1).required(),
        nickname: joi.string().required(),
        email: joi.string().required()
    }
}

exports.updatePwd = {
    body: {
        oldPwd: pwd,
        newPwd: joi.not(joi.ref('oldPwd')).concat(pwd)
    }
}

exports.updateAvatar = {
    body: {
        avatar
    }
}