require('./envloader')()

const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
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
const admin = require('firebase-admin');
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
        limit: '5mb',
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


// Enable Content Security Policy
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        scriptSrc: ["'self'", "https://unpkg.com"],
        imgSrc: ["'self'", "data:", "https://tile.openstreetmap.org"],
        // Add other directives as needed
      },
    })
);

const serviceAccount = require('./firebase.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ps-test-265bf-default-rtdb.firebaseio.com/' // Replace with your Firebase database URL
});

const db = admin.database();
const ref = db.ref('/transformers');

app.use('/logout', async (req,res,next) => {
    const ans = await deleteJWT(req.cookies.jwt)
    res.redirect('/')
})

app.post('/api/login', (req, res) => {
    try {
        const result = userLogin(req,res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});

app.delete('/api/deleteFile', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
        res.json({ message: 'File deleted successfully' });
    } else {
        res.status(404).json({ error: 'File not found' });
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

app.post('/api/maps', (req,res) => {
    ref.once('value', (snapshot) => {
        const data = snapshot.val();
        res.json(data); // Send the data back as a JSON response
      })
      .catch((error) => {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
      });
})

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