const localStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt= require('bcrypt')

function init(passport){
    passport.use(new localStrategy({usernameField: 'email'},async (email,password,done)=>{
        //login
        //check if the email exists
       const user= await User.findOne({email: email})
       if(!user){
           return done(null,false,{message:'No user with this email'})
       }
       //Match password
       bcrypt.compare(password,user.password).then(match =>{
           if(match){
               return done(null,user,{message:'Logged in Successfully'})
           }
           else{
            return done(null,false,{message:'Wrong username or password'})
           }
       }).catch(err=>{
           return done(null,false,{message:'Something Went wrong'})
       })
    }))

    //To be stored in session after login.
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        })
    })
}

module.exports=init