const { insertUserData } = require("../database/db")

module.exports = {
    userSignUp: async(req,res) => {
        const userBody = {
            "fname":req.body.fname,
            "lname":req.body.lname,
            "email":req.body.email,
            "password":req.body.password,
            "gender": req.body.gender,
            "phone": req.body.ph,
        }
        const data = await insertUserData(userBody);
        if(!data.dbAck){
            return res.json({"flag":false,'Message':'User with this email already present, Please go to Login'})
        }
        else{
            return res.json({"flag":true});
        }
    }
}