let express = require('express');

let userInfoHandler = require('../router_handler/userInfo') // 处理函数模块
let schema = require('../schema/user'); // 验证规则模块
let express_joi = require('@escook/express-joi')

let router = express.Router();

// 获取用户信息
router.get('/userinfo', userInfoHandler.getUserInfo);

// 修改用户信息
router.post('/userinfo', express_joi(schema.updateUserInfo_schema), userInfoHandler.updateUserInfo);

// 修改密码
router.post('/updatepwd', express_joi(schema.updatePwd), userInfoHandler.updatePwd);

// 修改头像
router.post('/update/avatar', express_joi(schema.updateAvatar), userInfoHandler.updateAvatar)



module.exports = router