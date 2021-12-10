//dependencies: nodemon, env, express, bcrypt, mongoose, passport, passport-local, 
const express = require('express')
const app = express()

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))


//TODO:
//get views to work with css
//set updatabase with ability to add things
//start login system