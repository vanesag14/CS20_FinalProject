/* 
    TODO:
         - fix the character issue when retrieving from db
         - each entry in db should alligns with a date not the day of the week
         - figure out problem with deadlines and somehow find a way to read/update the date
         - figure out how to store if something has been checked or not 
         - some functionality to the month page
         - infinite notes
*/

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
 *                        .GET                                  *
 *                                                              *
 ****************************************************************/
app.get(['/', '/index.html'], checkNotAuthenticated, (req, res) => {
    //if user is authenticated, display none
    if (!req.isAuthenticated()) {
        res.render('index.ejs', { title: "", inputContent: "", styleChange: "display: none;", loginStyle: ""})
    }
})
app.get('/month.html', (req,res) => {
    if(req.isAuthenticated()) {
        res.render('month.ejs', { 
            styleChange: "", 
            loginStyle: "display: none;",
            reminder1: req.user[0].reminders[0].content,
            reminder2: req.user[0].reminders[1].content,
            reminder3: req.user[0].reminders[2].content,
            reminder4: req.user[0].reminders[3].content
        })
    } else {
        res.render('month.ejs', { 
            styleChange: "display: none;", 
            loginStyle: "",
            reminder1: "",
            reminder2: "",
            reminder3: "",
            reminder4: ""
        })
    }
    
})
app.get('/calendar.html', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('calendar.ejs', { 
            loginStyle: "display: none;",
            styleChange: "",
            reminder1: req.user[0].reminders[0].content,
            reminder2: req.user[0].reminders[1].content,
            reminder3: req.user[0].reminders[2].content,
            reminder4: req.user[0].reminders[3].content,
            deadline1: req.user[0].deadlines[0].content,
            deadline2: req.user[0].deadlines[1].content,
            deadline3: req.user[0].deadlines[2].content,
            deadline4: req.user[0].deadlines[3].content,
            deadline5: req.user[0].deadlines[4].content,
            deadline6: req.user[0].deadlines[5].content,
            deadline7: req.user[0].deadlines[6].content,
            deadline8: req.user[0].deadlines[7].content,
            deadline9: req.user[0].deadlines[8].content,
            deadline10: req.user[0].deadlines[9].content,
            mon1: req.user[0].calendar[0].day[0].content,
            mon2: req.user[0].calendar[0].day[1].content,
            mon3: req.user[0].calendar[0].day[2].content,
            mon4: req.user[0].calendar[0].day[3].content,
            mon5: req.user[0].calendar[0].day[4].content,
            mon6: req.user[0].calendar[0].day[5].content,
            tue1: req.user[0].calendar[1].day[0].content,
            tue2: req.user[0].calendar[1].day[1].content,
            tue3: req.user[0].calendar[1].day[2].content,
            tue4: req.user[0].calendar[1].day[3].content,
            tue5: req.user[0].calendar[1].day[4].content,
            tue6: req.user[0].calendar[1].day[5].content,
            wed1: req.user[0].calendar[2].day[0].content,
            wed2: req.user[0].calendar[2].day[1].content,
            wed3: req.user[0].calendar[2].day[2].content,
            wed4: req.user[0].calendar[2].day[3].content,
            wed5: req.user[0].calendar[2].day[4].content,
            wed6: req.user[0].calendar[2].day[5].content,
            thu1: req.user[0].calendar[3].day[0].content,
            thu2: req.user[0].calendar[3].day[1].content,
            thu3: req.user[0].calendar[3].day[2].content,
            thu4: req.user[0].calendar[3].day[3].content,
            thu5: req.user[0].calendar[3].day[4].content,
            thu6: req.user[0].calendar[3].day[5].content,
            fri1: req.user[0].calendar[4].day[0].content,
            fri2: req.user[0].calendar[4].day[1].content,
            fri3: req.user[0].calendar[4].day[2].content,
            fri4: req.user[0].calendar[4].day[3].content,
            fri5: req.user[0].calendar[4].day[4].content,
            fri6: req.user[0].calendar[4].day[5].content,
            sat1: req.user[0].calendar[5].day[0].content,
            sat2: req.user[0].calendar[5].day[1].content,
            sat3: req.user[0].calendar[5].day[2].content,
            sat4: req.user[0].calendar[5].day[3].content,
            sat5: req.user[0].calendar[5].day[4].content,
            sat6: req.user[0].calendar[5].day[5].content,
            sun1: req.user[0].calendar[6].day[0].content,
            sun2: req.user[0].calendar[6].day[1].content,
            sun3: req.user[0].calendar[6].day[2].content,
            sun4: req.user[0].calendar[6].day[3].content,
            sun5: req.user[0].calendar[6].day[4].content,
            sun6: req.user[0].calendar[6].day[5].content
        })
    } else {
        res.render('calendar.ejs', { 
            loginStyle: "",
            styleChange: "display: none;",
            reminder1: "",
            reminder2: "",
            reminder3: "",
            reminder4: "",
            deadline1: "",
            deadline2: "",
            deadline3: "",
            deadline4: "",
            deadline5: "",
            deadline6: "",
            deadline7: "",
            deadline8: "",
            deadline9: "",
            deadline10: "",
            mon1: "",
            mon2: "",
            mon3: "",
            mon4: "",
            mon5: "",
            mon6: "",
            tue1: "",
            tue2: "",
            tue3: "",
            tue4: "",
            tue5: "",
            tue6: "",
            wed1: "",
            wed2: "",
            wed3: "",
            wed4: "",
            wed5: "",
            wed6: "",
            thu1: "",
            thu2: "",
            thu3: "",
            thu4: "",
            thu5: "",
            thu6: "",
            fri1: "",
            fri2: "",
            fri3: "",
            fri4: "",
            fri5: "",
            fri6: "",
            sat1: "",
            sat2: "",
            sat3: "",
            sat4: "",
            sat5: "",
            sat6: "",
            sun1: "",
            sun2: "",
            sun3: "",
            sun4: "",
            sun5: "",
            sun6: ""
        })
    
    }
})
app.get('/notes.html', (req, res) => {
    //if user is logged in
    if(req.isAuthenticated()) { 
        res.render('notes.ejs', {
            loginStyle: "display: none;",
            styleChange: "",
            noteTitle1: req.user[0].notes[0].title,
            noteTitle2: req.user[0].notes[1].title,
            noteTitle3: req.user[0].notes[2].title,
            noteTitle4: req.user[0].notes[3].title,
            noteTitle5: req.user[0].notes[4].title,
            noteTitle6: req.user[0].notes[5].title,
            noteText1: req.user[0].notes[0].content,
            noteText2: req.user[0].notes[1].content,
            noteText3: req.user[0].notes[2].content,
            noteText4: req.user[0].notes[3].content,
            noteText5: req.user[0].notes[4].content,
            noteText6: req.user[0].notes[5].content
        })
    } else {
        res.render('notes.ejs', {
            loginStyle: "",
            styleChange: "display: none;",
            noteTitle1: "Note Title 1",
            noteTitle2: "Note Title 2",
            noteTitle3: "Note Title 3",
            noteTitle4: "Note Title 4",
            noteTitle5: "Note Title 5",
            noteTitle6: "Note Title 6",
            noteText1: "",
            noteText2: "",
            noteText3: "",
            noteText4: "",
            noteText5: "",
            noteText6: ""
        })
    }
    
})
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', { placeHold: "Email Address", classRed: ""})
})
app.get(['/login', 'login.html'], checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', { firstName: ""})
})
app.get('/ind', checkAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
        res.render('index.ejs', { title: ", " + req.user[0].fName, inputContent: req.user[0].greatful, styleChange: "", loginStyle: "display: none;"})
    }
    
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
 

app.post('/reminders', checkAuthenticated, async (req, res) => {
    
    await Users.updateOne({ _id: req.user[0]._id }, {
        calendar: [{
            date: req.body.monDate, 
            day: [{
                content: req.body.mon0,
                isChecked: false
            },
            {
                content: req.body.mon1,
                isChecked: false
            },
            {
                content: req.body.mon2,
                isChecked: false
            },
            {
                content: req.body.mon3,
                isChecked: false
            },
            {
                content: req.body.mon4,
                isChecked: false
            },
            {
                content: req.body.mon5,
                isChecked: false
            }
            ]
        },
        {
            date: req.body.tueDate, 
            day: [{
                content: req.body.tue0,
                isChecked: false
            },
            {
                content: req.body.tue1,
                isChecked: false
            },
            {
                content: req.body.tue2,
                isChecked: false
            },
            {
                content: req.body.tue3,
                isChecked: false
            },
            {
                content: req.body.tue4,
                isChecked: false
            },
            {
                content: req.body.tue5,
                isChecked: false
            }
            ]
        },
        {
            date: req.body.wedDate, 
            day: [{
                content: req.body.wed0,
                isChecked: false
            },
            {
                content: req.body.wed1,
                isChecked: false
            },
            {
                content: req.body.wed2,
                isChecked: false
            },
            {
                content: req.body.wed3,
                isChecked: false
            },
            {
                content: req.body.wed4,
                isChecked: false
            },
            {
                content: req.body.wed5,
                isChecked: false
            }
            ]
        },
        {
            date: req.body.thuDate, 
            day: [{
                content: req.body.thu0,
                isChecked: false
            },
            {
                content: req.body.thu1,
                isChecked: false
            },
            {
                content: req.body.thu2,
                isChecked: false
            },
            {
                content: req.body.thu3,
                isChecked: false
            },
            {
                content: req.body.thu4,
                isChecked: false
            },
            {
                content: req.body.thu5,
                isChecked: false
            }
            ]
        },
        {
            date: req.body.friDate, 
            day: [{
                content: req.body.fri0,
                isChecked: false
            },
            {
                content: req.body.fri1,
                isChecked: false
            },
            {
                content: req.body.fri2,
                isChecked: false
            },
            {
                content: req.body.fri3,
                isChecked: false
            },
            {
                content: req.body.fri4,
                isChecked: false
            },
            {
                content: req.body.fri5,
                isChecked: false
            }
            ]
        },
        {
            date: req.body.satDate, 
            day: [{
                content: req.body.sat0,
                isChecked: false
            },
            {
                content: req.body.sat1,
                isChecked: false
            },
            {
                content: req.body.sat2,
                isChecked: false
            },
            {
                content: req.body.sat3,
                isChecked: false
            },
            {
                content: req.body.sat4,
                isChecked: false
            },
            {
                content: req.body.sat5,
                isChecked: false
            }
            ]
        },
        {
            date: req.body.sunDate, 
            day: [{
                content: req.body.sun0,
                isChecked: false
            },
            {
                content: req.body.sun1,
                isChecked: false
            },
            {
                content: req.body.sun2,
                isChecked: false
            },
            {
                content: req.body.sun3,
                isChecked: false
            },
            {
                content: req.body.sun4,
                isChecked: false
            },
            {
                content: req.body.sun5,
                isChecked: false
            }
            ]
        }],
        reminders: [{
            content: req.body.one
        },
        {
            content: req.body.two
        },
        {
            content: req.body.three
        },
        {
            content: req.body.four
        }],
        deadlines: [{ 
            content: req.body.deadline1,
        },
        { 
            content: req.body.deadline2,
        },
        { 
            content: req.body.deadline3,
        },
        { 
            content: req.body.deadline4,
        },
        { 
            content: req.body.deadline5,
        },
        { 
            content: req.body.deadline6,
        },
        { 
            content: req.body.deadline7,
        },
        { 
            content: req.body.deadline8,
        },
        { 
            content: req.body.deadline9,
        },
        { 
            content: req.body.deadline10,
        }]


    })
    
    res.redirect('back')
})
app.post('/greatful', checkAuthenticated, async (req, res) => {
    
    await Users.updateOne({ _id: req.user[0]._id }, {
        greatful: req.body.msg
    })
    res.redirect('back') //quick fix to stop the reloading
})

app.post('/notes', checkAuthenticated, async (req, res) => {
    await Users.updateOne({ _id: req.user[0]._id }, {
        notes: [{
            title: req.body.title1,
            content: req.body.textare1
        },
        {
            title: req.body.title2,
            content: req.body.textare2
        },
        {
            title: req.body.title3,
            content: req.body.textare3
        },
        {
            title: req.body.title4,
            content: req.body.textare4
        },
        {
            title: req.body.title5,
            content: req.body.textare5
        },
        {
            title: req.body.title6,
            content: req.body.textare6
        }],
    })
    res.redirect('back')
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
                    email: lowerEmail,
                    calendar: [{
                        date: 0, 
                        day: [{
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        }
                        ]
                    },
                    {
                        date: 0, 
                        day: [{
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        }
                        ]
                    },
                    {
                        date: 0, 
                        day: [{
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        }
                        ]
                    },
                    {
                        date: 0, 
                        day: [{
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        }
                        ]
                    },
                    {
                        date: 0, 
                        day: [{
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        }
                        ]
                    },
                    {
                        date: 0, 
                        day: [{
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        }
                        ]
                    },
                    {
                        date: 0, 
                        day: [{
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        },
                        {
                            content: "",
                            isChecked: false
                        }
                        ]
                    }],
                    deadlines: [{ 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    },
                    { 
                        isChecked: false, 
                        content: "", 
                        dueDate: 0 
                    }],
                    reminders: [{
                        content: ""
                    },
                    {
                        content: ""
                    },
                    {
                        content: ""
                    },
                    {
                        content: ""
                    }],
                    notes: [{
                        title: "Note Title 1",
                        content: ""
                    },
                    {
                        title: "Note Title 2",
                        content: ""
                    },
                    {
                        title: "Note Title 3",
                        content: ""
                    },
                    {
                        title: "Note Title 4",
                        content: ""
                    },
                    {
                        title: "Note Title 5",
                        content: ""
                    },
                    {
                        title: "Note Title 6",
                        content: ""
                    }],
                    greatful: ""
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
    res.redirect('/')
})


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
            content: String
        }],
        greatful: String
    })

    return user
}