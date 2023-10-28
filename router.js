const express = require('express')
const router = express.Router()

const adminRouter = require('./routers/admin.router')
const userRouter = require('./routers/user.router')

/*router.use('/admin', adminRouter)
router.use('/user', userRouter)*/

module.exports = router