const express = require('express');
const app = express();

const express_jwt = require('express-jwt'); // 生成token的中间件
const config = require('./schema/config'); // 全局配置文件模块

// 解决跨域问题
const cors = require('cors')
app.use(cors());

// 解析表单数据
app.use(express.urlencoded({ extended: false }))

app.use((req, resp, next) => {

    // err的值，可能是一个错误对象，可能是错误消息字符串
    resp.cc = (err, status = 1) => {
        resp.send({
            status,
            msg: err instanceof Error ? err.message : err
        })
    }

    next();
})

app.use(express_jwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: /^\/api/ }))

// 导入并使用路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

const getUserinfoRouter = require('./router/userInfo'); // 获取用户信息模块
app.use('/my', getUserinfoRouter);


app.use((err, req, resp, next) => {

    if (err.name === 'UnauthorizedError') return resp.cc('身份认证失败')

    resp.cc(err) // joi 检验失败
})


app.listen('80', () => {
    console.log('server is running')
})