require('dotenv').config()

const express = require('express')
const app= express()
const ejs= require('ejs')
const path= require('path')
const expressLayout= require('express-ejs-layouts')
const PORT= process.env.PORT || 3000
const session = require('express-session')
const mongoose = require('mongoose')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
//DB connection
const url = 'mongodb://localhost:27017/pizza'
mongoose.connect(url,{useCreateIndex: true,useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:true})
const connection= mongoose.connection;
connection.once('open',()=>{
    console.log('connection Established..');
}).catch(err =>{
    console.log('Connection Failed..')
})

//session Store
let mongoStore = new MongoDbStore({
        mongooseConnection: connection,
        collection: 'sessions'
    })

//session-config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge: 1000* 60 * 60 * 24} //24 hrs
}))

//passport config
app.use(passport.initialize())
app.use(passport.session())
passportInit = require('./app/config/passport')
passportInit(passport)

app.use(express.json())
app.use(flash())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

//Global Middlewares
app.use((req,res,next) =>{
    res.locals.session= req.session
    res.locals.user= req.user
    next()
})

//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)

app.listen(3000,() => {
 console.log(`listening on port ${PORT}`)
})

