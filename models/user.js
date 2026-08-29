const mongoose=require("mongoose");

let userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilepic:{
        type:String,
        default:"/images/default-user.jpg",
    },
    createdat:{
        type:Date,
        default:Date.now,
    },

});
let user=mongoose.model("user",userschema);
module.exports=user;