require('./envloader')()

const express = require('express')
const app = express()
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const baseRouter = require('./router.js')
const morgan = require('morgan')
const PORT = process.env.PORT || 8080

//Middlewares
app.use(
    morgan(
        'REQUEST :response-time ms [:date[clf]] ":method :url HTTP/:http-version" :status :user-agent',
        {
            immediate: true,
            skip: function (req) { return (req.path === '/api/') },
        },
    ),
)
app.use(
    express.urlencoded({
        extended: true,
        limit: '2mb',
        parameterLimit: 1000000,
    }),
)

app.use(compression())
app.use(helmet())
app.use(cors())

//app.use('/api/', baseRouter)

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/index.html')
})

app.get('/logs', (req, res) => {
    res.sendFile(__dirname+'/public/pages/logs.html')
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname+'/public/pages/about.html')
})

app.get('/map', (req, res) => {
    res.sendFile(__dirname+'/public/pages/maps.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname+'/public/pages/login.html')
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname+'/public/pages/signup.html')
})

app.listen(PORT, () => {
    console.log('Server started at port:', PORT)
})