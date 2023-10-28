const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hashPassword: (myPlaintextPassword) => {
       return bcrypt.hash(myPlaintextPassword,saltRounds)
                .then(hash => hash)
                .catch(err => err)
    },
    cmpHashedPassword: (myPlaintextPassword,hashedPassword) => {
        return bcrypt.compare(myPlaintextPassword,hashedPassword)
               .then(found => found)
               .catch(err => console.error(err))
    }
}