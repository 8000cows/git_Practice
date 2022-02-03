const mysql = require('../db/index');
const bcrypt = require("bcryptjs")

// 获取用户信息
exports.getUserInfo = (req, resp) => {

    let sql = 'select id,username,nickname,email,user_pic from ev_users where id=?';

    mysql.query(sql, req.user.id, (err, result) => {
        if (err) return err;

        if (result.length === 0) return resp.cc('获取用户信息失败');

        resp.send({
            status: 0,
            msg: '获取用户信息成功',
            data: result[0]
        })
    })

}

// 修改用户信息
exports.updateUserInfo = (req, resp) => {
    let sql = 'update ev_users set ? where id=?';

    mysql.query(sql, [req.body, req.body.id], (err, result) => {
        if (err) return resp.cc(err);

        /**
         *  这里如果使用result.affectedRows会有bug，原因是：
         *  affectedRows仅代表受影响的数据条数，而changedRows是修改的记录条数
         */
        if (result.changedRows == 1) return resp.cc('修改成功', 0)

        return resp.cc('修改失败')
    })
}

// 修改密码
exports.updatePwd = (req, resp) => {

    // 首先查询oldPwd是否与数据库中的密码匹配，如果匹配才可以修改密码
    let sql = 'select password from ev_users where id=?';

    mysql.query(sql, req.user.id, (err, result) => {
        if (err) return resp.cc(err);

        let cpResult = bcrypt.compareSync(req.body.oldPwd, result[0].password);

        // 当密码匹配时，执行以下代码修改密码
        if (cpResult) {
            let sql = 'update ev_users set password=? where id=?';
            let newPwd = bcrypt.hashSync(req.body.newPwd, 10);

            mysql.query(sql, [newPwd, req.user.id], (err, result) => {
                if (err) return resp.cc(err)

                if (result.changedRows === 1) return resp.cc('修改密码成功', 0)

                return resp.cc('修改失败，稍后再试')
            })
        }
    })

}

// 更换头像
exports.updateAvatar = (req, resp) => {
    let sql = 'update ev_uesrs set user_pic=? where id=?';

    mysql.query(sql, [req.body.avatar, req.user.id], (err, result) => {

        if (err) return resp.cc(err);

        if (result.changedRows === 1) return resp.cc('更换头像成功', 0);

        return resp.cc('更换头像失败')
    })
}