const mongoose=require("mongoose");

const artistschema=new mongoose.Schema({
    artistname:{
        type:String,
    },
    artistimg:{
        type:String,
    }
});

const artist=mongoose.model("artist",artistschema);

module.exports=artist;