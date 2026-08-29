const mongoose=require("mongoose");

const songschema=new mongoose.Schema({
    title:{
        type:String,
    },
    artistname:{
        type:String,
    },
    songimg:{
        type:String,
    },
    audio:{
        type:String,
    },
});

const song=mongoose.model("song",songschema);

module.exports=song;