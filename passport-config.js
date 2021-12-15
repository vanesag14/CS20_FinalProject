/*
    file description
*/
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


async function initialize(passport, getUserByEmail, getUserById) {
    //authenticates the user (called from the login)
    const authenticateUser = async (logEmail, logPassword, done) => {
        //looks for a user with the entered email address - assumes that all emails are unique
        let user1 = await getUserByEmail(logEmail)
        //if no user is retrieved from query
        if (user1.length === 0 ) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            //if pw used to login matches database pw
            if(await bcrypt.compare(logPassword, user1[0].password)) {
                done(null, user1[0])
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (error) {
            return done(error)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => { 
        let user2 = await getUserById(id)
        return done(null, user2)
    })
}

module.exports = initialize