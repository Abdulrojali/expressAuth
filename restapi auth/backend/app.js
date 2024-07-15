const express = require('express')
const morgan = require('morgan')
const app = express()
const accounts = require("./models/accounts")
const bcrypt = require('bcrypt')
const cors = require('cors')

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.get('/accounts',async(req,res)=>{
    try{
        res.status(200)
        const getAllAccounts = await accounts.find({})
        if(getAllAccounts){
            res.json(getAllAccounts)
        }
        else{
            res.status(300).send('invalid to get accounts')
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})
app.get('/registers',async(req,res)=>{
    res.status(200).send('registers menu')
})
app.post('/registers',async(req,res)=>{
    try{
        const {username,password} =req.body
        const authorizationUsername=async()=>{
            await accounts.insertOne({username :{$eq : username} })
        }
        if(authorizationUsername){
            res.status(302).send('username sudah terpakai')
        }
        else{
            const salt =await bcrypt.genSalt(10)
            const usernameHash = await bcrypt.hash(username,salt)
            const pasHash=await bcrypt.hash(password,salt)
            const newAccounts =new accounts({
                username:usernameHash,
                password:pasHash
            })
            if(newAccounts){
                await newAccounts.save()
                res.status(200).send('sukses to registers accounts')
            }
            else{
                res.status(300).send('invalid to registers accounts')
            }
        }
    }
    catch(err){
        res.status(404)
        .send(err)
    }
})
app.post('/login',async(req,res)=>{
    try{
        const authorizationUsername = await accounts.findOne({username : req.body.username})
        if(authorizationUsername){
            const authorizationPassword=bcrypt.compareSync(req.body.password,authorizationUsername.password)
            if(authorizationPassword){
                res.status(200).send('sukses to login')
            } 
            else{
                res.status(300).send('invalid login beacuse password not found')
            }
        }
        else{
            res.status(300).send('invalid login because username invalid')
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})
app.listen(8080,()=>{
    console.log('http://localhost:8080')
})