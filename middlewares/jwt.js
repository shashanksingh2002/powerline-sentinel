const jwt = require('jsonwebtoken');

const secretKeyUser = process.env.SECRET_KEY_USER;
const secretKeyAdmin = process.env.SECRET_KEY_ADMIN;


module.exports = {
    createJWT: (id, role) => {
        return jwt.sign({id},(role === 'Admin')?secretKeyAdmin:secretKeyUser,{
            expiresIn:1000*60*60*24
        });
    },
    authenticateJWT: (req,res,next) => {
        const auth = req.cookies.jwt;
        const role = req.body.role;
        if(auth){
            jwt.verify(auth,(role === 'Admin')?secretKeyAdmin:secretKeyUser, (err,key) => {
                if(err) return res.json('Error in token');
                else next();
            })
        }
        else{
           return res.json({'Message':'go to login page no token present'});
        }
    }
}