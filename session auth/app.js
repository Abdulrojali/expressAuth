const express = require('express')
const app = express()
const morgan = require('morgan')
const path =require('path')
const cors = require('cors')
const session = require('express-session')
app.set('view engine','ejs')
app.set('views','views')

app.set('trust proxy', 1) 
app.use(session({
  secret: 'notasecret',
  resave: false,
  saveUninitialized: false,
}))

app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

const {authLogin,createAccount}=require('./controllers/auth')

app.get('/login',(req,res)=>{
    try{
            res.render('login')
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})
app.post('/login',authLogin)
app.get('/createAccount',(req,res)=>{
    res.render('createAccount')
})
app.post('/createAccount',createAccount)

app.get('/dashboard',(req,res)=>{
    try{
        const {id} = req.session
        if(!id){
            res.render('/login')
        }
        else{
            res.render('dashboard')
        }
    }
    catch(err){
        throw new Error(err)
    }
})
app.get('/logout',(req,res)=>{
    try{
        req.session.destroy(function (err) {
            res.redirect('/login');
           });
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})
app.get('/404',(req,res)=>{
    res.render('404')
})
app.listen(8080,()=>{
    console.log('http://localhost:8080')
})
