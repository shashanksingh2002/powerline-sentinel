const { isEmailInDb, loginUser, insertJWT } = require("../database/db");
const { createJWT } = require('../middlewares/jwt')

const userLogin = async(req,res) =>{
    const isEmailPresent = await isEmailInDb(req.body.email);
    if(!isEmailPresent){
        return res.json({emailFlag:true,passwordFlag:true,Message:"No such Email Exists please check your email"});
    }
    const ispasswordCorrect = await loginUser(req.body);
    if(!ispasswordCorrect){
        return res.json({emailFlag:false,passwordFlag:true,Message:"Please enter the correct password"});
    }
    const jwt = await createJWT(req.body.email);
    
    await insertJWT(jwt);
    
        // Set the JWT token as a cookie
    res.cookie('jwt', jwt, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    });
        
        // Return the JWT token and a success message
    return res.json({emailFlag:false,passwordFlag:false,email: req.body.email,jwt:jwt});
}

module.exports = {
    userLogin,
}