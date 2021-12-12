//dependencies: nodemon, dotenv, express, ejs, bcrypt, mongoose, passport, passport-local, 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

//sets up passport configuration
const initializePassport = require('./passport-config')
initializePassport(passport) 

//more configurations
app.use(express.static(__dirname + '/views'))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false})) 
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//connection to database
mongoConnect()

//creates schema and collection for db 
const user = createSchema();
const Users = mongoose.model('Users', user)

// /****************************************************************
//  *   TODO:                .GET                                  *
//  *       have to change the a href for all the files            *
//  ****************************************************************/
app.get('/', (req, res) => {
    res.render('index.html')
})
app.get('/calendar.html', (req, res) => {
    res.render('calendar.html')
})
app.get('/notes.html', (req, res) => {
    res.render('notes.html')
})
app.get('/register', (req, res) => {
    res.render('register.ejs', { placeHold: "Email Address", classRed: ""})
})
app.get('/login', (req, res) => {
    res.render('login.ejs', { firstName: ""})
})
//when the user recently registered an account
//TODO: app.gets below NEEDS TO CHECK IF USER IS AUTHENTICATED before accessing
var firstN = ""
app.get('/rlogin', (req, res) => {
    res.render('login.ejs', { firstName: "Welcome " + firstN + ","})
})
app.get('/eregister', (req, res) => {
    res.render('register.ejs', { placeHold: "Email Already in Use", classRed: "redPlaceholder"})
})


/****************************************************
 *                     POST                         *
 ****************************************************/
//goes to home back on successful login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', async (req, res) => {
    //protects against a user inserting two emails with differing cases
    let lowerEmail = (req.body.email).toLowerCase()
    //looks for users with the same email address
    await Users.find({ email: lowerEmail}).exec( async (err, users) => {
        //if the email doesnt exist
        if (users.length === 0) {
            try {
                
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
                //creates user to insert in database
                const user1 = new Users({
                    fName: req.body.fname,
                    lName: req.body.lname,
                    password: hashedPassword,
                    email: lowerEmail
                })
                user1.save()

                //redirects user to custom login page prompting them to login
                firstN = req.body.fname
                res.redirect('/rlogin')
            } catch { 
                res.redirect('/register')
            }
        } else { //if the email exist in the database
            res.redirect('/eregister')
        }
    })
})



//TODO:
//get views to work with css--
//set up database with ability to add things--
//implement registering system --
//implement login system
    //create user authentication system
//figure out how to take from forms in html into the 
//then take from database to put into the html


app.listen(process.env.PORT || 3001, 
	() => console.log("Server is running..."));


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