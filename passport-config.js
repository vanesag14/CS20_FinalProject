/*
    file description
*/
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// //connection to database
mongoConnect()

//creates schema and collection for db 
const user = createSchema()
const Users = mongoose.model('User', user) //if data base connection does not work for this file, will have to export all database stuff to another file and use as a module


async function initialize(passport) {
    //authenticates the user (called from the login)
    const authenticateUser = async (logEmail, logPassword, done) => {
        //looks for a user with the entered email address - assumes that all emails are unique
        let user1 = await Users.find({ email: logEmail}).then() //returns an array of objects

        // if no user is retrieved from query
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

    passport.serializeUser((user, done) => done(null, user.id)) //user is the default name object that was instantiated in authenticateUser()
    passport.deserializeUser((id, done) => { 
        return done(null, user)
    })
}

module.exports = initialize

/****************************************************
 *          Mongoose Database functions             *
 ****************************************************/

 async function mongoConnect() {
    const url = process.env.MONGODB_URL || process.env.DB_URL;

    //connection to database
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

// creates the schema for the database
function createSchema() {
    
    const user = new mongoose.Schema({
        fName: String,
        lName: String,
        password: String,
        email: String,
        calendar: {
            date: Number, 
            content: [String]
        },
        deadlines: [{ 
            isChecked: Boolean, 
            content: String, 
            dueDate: Number 
        }],
        reminders: [{
            content: String
        }],
        notes: [{
            title: String,
            content: [String]
        }],
        greatful: String
    })

    return user
}