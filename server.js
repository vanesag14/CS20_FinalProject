//dependencies: nodemon, dotenv, express, ejs, bcrypt, mongoose, passport, passport-local, 
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

//express configuration
app.use(express.static(__dirname + '/views'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

//connection to database
mongoConnect()

//creates schema and collection for db (CONNECTED)
const user = createSchema();
const Users = mongoose.model('Users', user)

/*
    TODO:
        have to change the a href for all the files
*/
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
    res.render('register.ejs')
})
app.get('/login', (req, res) => {
    res.render('login.ejs')
})


//TODO:
//get views to work with css--
//set up database with ability to add things--
//implement login system
//implement registering system
//figure out how to take from forms in html into the 
//then take from database to put into the html


app.listen(process.env.PORT || 3000, 
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

//creates the schema for the database
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
        mood: [{
            date: Number,
            mood: Number
        }]
    })

    return user
}