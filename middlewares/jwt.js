const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;


module.exports = {
    createJWT: (id) => {
        return jwt.sign({id}, secretKey,{
            expiresIn:1000*60*60*24
        });
    },
    authenticateJWT: (req,res,next) => {
        const auth = req.cookies.jwt;
        let flag = false;
        if(auth){
            jwt.verify(auth,secretKey, (err) => {
                if(err) flag = false
                else flag = true
            })
        }
        return flag;
    }
}