const mongoose=require("mongoose");

let playlistschema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    songs:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"song",   
        }
    ]

});

let playlist=mongoose.model("playlist",playlistschema);

module.exports=playlist;