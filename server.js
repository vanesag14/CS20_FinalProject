//dependencies: nodemon, dotenv, express, ejs, bcrypt, mongoose, passport, passport-local, 
const express = require('express')
const app = express()
const mongoose = require('mongoose')
//const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')

//express configuration
app.use(express.static(__dirname + '/views'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

//connection to database
mongoConnect()

//creates schema and collection for db 
// const user = createSchema();
// const Users = mongoose.model('Users', user)

// // /****************************************************************
// //  *   TODO:                .GET                                  *
// //  *       have to change the a href for all the files            *
// //  ****************************************************************/
// app.get('/', (req, res) => {
//     res.render('index.html')
// })
// app.get('/calendar.html', (req, res) => {
//     res.render('calendar.html')
// })
// app.get('/notes.html', (req, res) => {
//     res.render('notes.html')
// })
// app.get('/register', (req, res) => {
//     res.render('register.ejs', { placeHold: "Email Address", classRed: ""})
// })
// app.get('/login', (req, res) => {
//     res.render('login.ejs', { firstName: ""})
// })
// //when the user recently registered an account
// //TODO: app.gets below NEEDS TO CHECK IF USER IS AUTHENTICATED before accessing
// var firstN = ""
// app.get('/rlogin', (req, res) => {
//     res.render('login.ejs', { firstName: "Welcome " + firstN + ","})
// })
// app.get('/eregister', (req, res) => {
//     res.render('register.ejs', { placeHold: "Email Already in Use", classRed: "redPlaceholder"})
// })


// // /****************************************************
// //  *                     POST                         *
// //  ****************************************************/
// app.post('/register', async (req, res) => {
    
//     //looks for users with the same email address
//     await Users.find({ email: req.body.email}).exec( async (err, users) => {
//         //if the email doesnt exist
//         if (Object.keys(users).length === 0) {
//             try {
//                 //generates hashed password
//                 const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
//                 //creates user to insert in database
//                 const user1 = new Users({
//                     fName: req.body.fname,
//                     lName: req.body.lname,
//                     password: hashedPassword,
//                     email: req.body.email
//                 })
//                 //inserts user into database
//                 user1.save()

//                 //redirects user to custom login page prompting them to login
//                 firstN = req.body.fname
//                 res.redirect('/rlogin')
//             } catch { 
//                 res.redirect('/register')
//             }
//         } else { //if the email exist in the database
//             res.redirect('/eregister')
//         }
//     })
// })



//TODO:
//get views to work with css--
//set up database with ability to add things--
//implement registering system --
//implement login system
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
// function createSchema() {
    
//     const user = new mongoose.Schema({
//         fName: String,
//         lName: String,
//         password: String,
//         email: String,
//         calendar: {
//             date: Number, 
//             content: [String]
//         },
//         deadlines: [{ 
//             isChecked: Boolean, 
//             content: String, 
//             dueDate: Number 
//         }],
//         reminders: [{
//             content: String
//         }],
//         notes: [{
//             title: String,
//             content: [String]
//         }],
//         greatful: String
//     })

//     return user
// }