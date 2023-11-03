require('./envloader')()

const express = require('express')
const app = express()
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const { connectToDb, checkJWT, deleteJWT } = require('./database/db.js');
const { userLogin } = require('./services/userlogin.js')
const { userSignUp } = require('./services/usersignup.js')
const { authenticateJWT } = require('./middlewares/jwt.js')
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
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json())
app.use(express.static(__dirname+'/public'));

app.use('/logout', async (req,res,next) => {
    const ans = await deleteJWT(req.cookies.jwt)
    res.redirect('/')
})

app.post('/api/login', (req, res) => {
    try {
        // Call the userLogin function
        const result = userLogin(req,res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});

app.post('/api/signup', (req, res) => {
    try {
        // Call the userSignUp function
        const result = userSignUp(req,res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});


app.use(async (req,res,next) =>{
    if (req.path === '/login' || req.path === '/signup' || req.path === '/') {
        return next();
    }
    const flag = authenticateJWT(req,res,next);
    if(!flag) res.redirect('/login')
    const isJWTPresent = await checkJWT(req.cookies.jwt)
    console.log(flag,isJWTPresent)
    if(flag && isJWTPresent){
       if(req.path === '/home') res.sendFile(__dirname+'/public/pages/loggedinHome.html')
       else next()
    } 
    else if(!isJWTPresent){
        res.sendFile(__dirname+'/public/pages/login.html')
    }
    else next()
})

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/public/home.html')
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

app.get('/logout', async (req, res) => {
    res.sendFile(__dirname+'/public/home.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname+'/public/pages/login.html')
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname+'/public/pages/signup.html')
})

connectToDb((err) => {
    if(!err){
        app.listen(PORT,() => {
            console.log('Server is Running Successfully at Port:', PORT);
        });
    }
    else{
        console.error(err);
    }
});