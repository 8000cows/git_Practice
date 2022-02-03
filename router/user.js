const expries = require('express')
const router = expries.Router();

const escook = require('@escook/express-joi');
const schema = require('../schema/user')

const userHandler = require('../router_handler/user')

// 注册新用户模块
router.post('/regester', escook(schema.reg_login_schema), userHandler.regUser)


// 登录模块
router.post('/login', escook(schema.reg_login_schema), userHandler.login)


module.exports = router