const mysql = require('../db/index')
const bcrypt = require("bcryptjs")
const config = require('../schema/config');
const jwt = require('jsonwebtoken');

// 注册路由
exports.regUser = (req, resp) => {

    let userInfo = req.body;

    // if (!userInfo.username || !userInfo.pwd) {
    //     return resp.send({ status: 1, msg: '账号或密码不能为空' })
    // }

    // 当密码不为空时，检查用户名是否重复
    let sqlStr = 'select username from ev_users where username=?';

    mysql.query(sqlStr, userInfo.username, (err, result) => {
        if (err) return console.log(err)

        // 当查询结果大于0时，说明用户名重复
        if (result.length > 0) {
            return resp.send({ status: 1, msg: '用户名重复' })
        }

        // 将密码进行加密后存入数据库
        userInfo.pwd = bcrypt.hashSync(userInfo.pwd, 10);
        let sqlStr = 'insert into ev_users(username,password) values(?,?)';

        mysql.query(sqlStr, [userInfo.username, userInfo.pwd], (err, result) => {
            if (err) return console.log(err)

            if (result.affectedRows === 1) {
                resp.send({ status: 0, msg: '注册成功' })
            } else {
                resp.send({ status: 1, msg: '注册失败' })
            }
        })

    })

    console.log('regest success')
}

// 登录路由
exports.login = (req, resp) => {
    let userInfo = req.body;

    let sql = 'select id,username,password,nickname,user_pic from ev_users where username=?'
    mysql.query(sql, userInfo.username, (err, result) => {
            if (err) {
                console.log(err);
                return resp.cc(err.msg);
            }

            let compareResult = bcrypt.compareSync(userInfo.pwd, result[0].password)

            if (result.length === 0 || !compareResult) {
                return resp.cc('登录失败，用户名或密码错误');
            }

            let info = {...result[0], password: '', user_pic: '' }

            let tokenStr = jwt.sign(info, config.jwtSecretKey, { expiresIn: '10h' })


            resp.send({
                status: 0,
                msg: '登录成功',
                token: 'Bearer ' + tokenStr
            })



            // if (result.length === 0) {
            //     return resp.cc('登录失败，用户' + userInfo.username + '不存在')
            // }
            // if (result[0].password === userInfo.pwd) return resp.cc('登录成功', 0)

            // resp.cc('登录失败，密码错误');
        })
        // resp.send(console.log('login success'))
}