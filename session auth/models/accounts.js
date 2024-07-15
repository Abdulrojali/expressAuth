const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/jwtAuth')
.then((res)=>console.log(res))
.catch((err)=>console.log(err))


const schema = new mongoose.Schema({
    nama:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const accounts = mongoose.model('accounts',schema)

module.exports=accounts