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
const methodOverride = require('method-override') //allows for app.delete to be uesd

//sets up passport configuration
const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    emailAdd => Users.find({ email: emailAdd}).then(),
    id => Users.find({ _id: id}).then()
)

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
app.use(methodOverride('_method'))

//connection to database
mongoConnect()

//creates schema and collection for db 
const user = createSchema();
const Users = mongoose.model('Users', user)

/****************************************************************
 *   TODO:                .GET                                  *
 *       have to change the a href for all the files            *
 ****************************************************************/
app.get(['/', '/index.html'], checkNotAuthenticated, (req, res) => {
    res.render('index.ejs', { title: "", inputContent: ""})
})
app.get('/calendar.html', (req, res) => {
    res.render('calendar.ejs')
})
app.get('/notes.html', (req, res) => {
    res.render('notes.ejs')
})
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', { placeHold: "Email Address", classRed: ""})
})
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', { firstName: ""})
})
app.get('/ind', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { title: ", " + req.user[0].fName, inputContent: req.user[0].greatful})
})

var firstN = ""
app.get('/rlogin', checkAuthenticated, (req, res) => {
    res.render('login.ejs', { firstName: "Welcome " + firstN + ","})
})
app.get('/eregister', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', { placeHold: "Email Already in Use", classRed: "redPlaceholder"})
})

app.get('/logout', checkAuthenticated, (req, res) => {
    res.render('logout.ejs')
})
/****************************************************
 *                     POST                         *
 ****************************************************/
app.post('/greatful', checkAuthenticated, async (req, res) => {
    
    await Users.updateOne({ email: req.user[0].email }, {
        greatful: req.body.msg
    })
    res.redirect('back') //quick fix to stop the reloading
})

//goes to home back on successful login
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/ind',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
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

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

//TODO:
//get views to work with css--
//set up database with ability to add things--
//implement registering system --
//implement login system--
    //create user authentication system--
//figure out how to take from forms in html into the 
//then take from database to put into the html


app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));


/****************************************************
 *               User Authentication                *
 ****************************************************/    
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/ind')
    }

    next()
}

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
        calendar: [{
            date: Number, 
            day: [{
                content: String,
                isChecked: Boolean
            }]
        }],
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