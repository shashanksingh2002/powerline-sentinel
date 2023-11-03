const { MongoClient } = require('mongodb');
const { hashPassword, cmpHashedPassword } = require('../services/bcrypt');

const uri = process.env.MONGO_URL;
const dbName = 'powerline';
let db = null;

const connectToDb = (cb) => {
    //connect to the database
    MongoClient.connect(uri)
    .then(client => {
        db = client.db(dbName);
        cb();
    })
    .catch(err => cb(err));
}

const isEmailInDb = (Email) => {
    return db.collection('users')
    .findOne({email:Email})
    .then(found => {
        if(found){
            return true;
        }
        else{
            return false;
        }
    })
    .catch(err => {
        console.error(err);
        throw err;
    })
}

const loginUser =  (body) => {
    let user = [];
    return db.collection('users')
    .find({email:body.email})
    .forEach(d => user.push(d))
    .then(async () => {
        const cmpPassword = await cmpHashedPassword(body.password,user[0].password);
        if(cmpPassword){
            return db.collection('users')
            .updateOne({email:body.email},{$set:{isLoggedIn:true}})
            .then(data => {
                useremail = body.email;
                return data;
            })
            .catch(err => err);
        }
        else{
            return false;
        }
    })
}

const insertUserData = async(body) => {
    //check if user is already present in database
    const checkEmailInDb = await isEmailInDb(body.email);
    if(checkEmailInDb){
        return checkEmailInDb;
    }
    //if user not present encrypt the password and add the user
    body.password = await hashPassword(body.password);
    return db.collection('users')
    .insertOne(body)
    .then(data => {
        return {
            "dbAck": data,
        };
    })
    .catch(err => {
        console.error(err);
        throw err;
    })
}

const insertJWT = async (jwt) => {
    return db.collection('jwt').insertOne({'jwt':jwt}).then(res => res)
}

const checkJWT = async (jwt) => {
    return db.collection('jwt')
    .findOne({jwt:jwt})
    .then(found => {
        if(found){
            return true;
        }
        else{
            return false;
        }
    })
    .catch(err => {
        console.error(err);
        throw err;
    })
}

const deleteJWT = async (jwt) => {
    return db.collection('jwt').deleteOne({'jwt':jwt}).then(res => res).catch(err => err)
}
module.exports = {
    connectToDb,
    loginUser,
    isEmailInDb,
    insertUserData,
    insertJWT,
    checkJWT,
    deleteJWT,
}
