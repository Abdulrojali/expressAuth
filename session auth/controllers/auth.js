const accounts = require('../models/accounts')
const bcrypt = require('bcrypt')
 async function authLogin(req,res){
    try{
        const {username,password}=req.body
        if(username,password){
            const authorizationUsername = await accounts.findOne({username :{$eq:username}})
            if(authorizationUsername){
                const authorizationPassword= await bcrypt.compare(password,authorizationUsername.password)
                if(authorizationPassword){
                 req.session.id=authorizationUsername._id
                    res.status(200).redirect('/dashboard')
                } 
                else{
                    res.status(301).send('invalid password')
                }
            }
            else{
                res.status(301).send('invalid username')
            }
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
}
 async function createAccount(req,res){
    try{
        const {name,username,email,password} = req.body
        const salt= await bcrypt.genSalt(10)
        const passHash= await bcrypt.hash(password,salt)
        const newAccounts= await new accounts({
            nama:name,
            email:email,
            username:username,
            password: passHash
        })
        if(newAccounts){
            await newAccounts.save()
            res.status(200).redirect('/login')
        }
        else{
            res.status(300).send('invalid to create Accounts')
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
 }


module.exports={
    authLogin,
    createAccount
}