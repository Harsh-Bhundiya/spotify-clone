const express=require("express");
const app=express();
const mongoose=require("mongoose");
const song=require("./models/song");
const artist=require("./models/artist")
const cors=require("cors");
const user=require("./models/user");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const playlist=require("./models/playlist");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
    origin:"http://127.0.0.1:3000",
    credentials:true
}));

app.use(express.static("public"));//all things in public served to browser
app.use(express.json());//for allowing post request
app.use(express.urlencoded({extended:true}));//for accepting post  request
app.set("view engine","ejs");

/*for database */
main()
.then(() => {
    console.log("database connected");
})
.catch((err) => {
    console.log(err);
});
/*for session  */
app.use(cors({
    origin:"http://127.0.0.1:3000",
    credentials:true
}));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/spotify");
}

let port=8080;
app.listen(port,function(){
    console.log("app is started");
})


app.use("/me",function varifytoken(req,res,next){
    let authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("bearer")){
        return res.status(401).json({ error: "No token provided" });
    }
    let token = authHeader.split(" ")[1];
    try{
        let decoded = jwt.verify(token, JWT_SECRET);
        req.userid = decoded.userid;
        next();
    } catch(err){
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    
})
app.use("/playlist",function varifytoken(req,res,next){
    let authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("bearer")){
        return res.status(401).json({ error: "No token provided" });
    }
    let token = authHeader.split(" ")[1];
    try{
        let decoded = jwt.verify(token, JWT_SECRET);
        req.userid = decoded.userid;
        next();
    } catch(err){
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    
})
app.use("/getplaylist",function varifytoken(req,res,next){
    let authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("bearer")){
        return res.status(401).json({ error: "No token provided" });
    }
    let token = authHeader.split(" ")[1];
    try{
        let decoded = jwt.verify(token, JWT_SECRET);
        req.userid = decoded.userid;
        next();
    } catch(err){
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    
})
app.get("/songs",async function(req,res){
    let songs=await song.find();
    res.send(songs);
})
app.get("/song/:id",async function(req,res){
    let id=req.params.id;
    let song1=await song.findById(id);
    console.log("data going to be sent:",song1);
    res.send(song1);
})
app.get("/artist",async function(req,res){
    let artists=await artist.find();
    res.send(artists); 
})
app.get("/search",async function (req,res) {
    let query=req.query.q;
    let playlistid=null;
    if(req.query.playlistid){
         playlistid=req.query.playlistid;
    }
    
    console.log("serching for api")
    console.log("playlistid is::",playlistid)
    let response=await fetch(`https://itunes.apple.com/search?term=${query}&entity=song`);
    let data=await response.json();
    // console.log(data);
    
    // let text=await response.text();
    // console.log(text);
    if(playlistid===null){
        res.render("search.ejs",{songs:data.results,playlist:null});
    }
    else{
        res.render("search.ejs",{songs:data.results,playlist:playlistid});
    }
      
})

/*for signup */
app.get("/signup",function(req,res){
    res.render("signup.ejs",{user});
})
app.post("/signup",async function(req,res){
    let data=req.body;
    let user1=new user();
    user1.username=data.username;
    let existinguser=await user.findOne({
        email:data.email
    });

    if(existinguser){
        return res.send("Email already registered");
    }
    user1.email=data.email;
    let hashpassword=await bcrypt.hash(data.password,10);
    user1.password=hashpassword;

    await user1.save();
    res.send('success');
})  
/*for login */
app.get("/login",function(req,res){
    res.render("login.ejs");
})
app.post("/login",async function(req,res){

    let data=req.body;

    let existinguser=await user.findOne({
        email:data.email
    });

    if(!existinguser){
        return res.send("User not found");
    }

    let ismatch=await bcrypt.compare(
        data.password,
        existinguser.password
    );

    if(!ismatch){
        return res.send("Wrong password");
    }
     let token = jwt.sign(
        { userid: existinguser._id },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
     res.redirect(`http://127.0.0.1:3000?token=${token}`);
});

/*for session test */
app.get("/test",function(req,res){
    console.log(req.session);
    console.log(req.session.userid);
    res.send("ok");
})
app.get("/me",async function(req,res){
   console.log("/me called");
   let currentuser=await user.findById(req.userid);
   res.send(currentuser);
})

/*for playlist route*/

app.post("/playlist",async function(req,res){
    let data=req.body;
    let playlist1=new playlist({
        title:data.title,
        owner:req.userid,
    })
    await playlist1.save();
    res.status(200).json("created successfully");
})

app.get("/getplaylist",async function (req,res){
    let data=await playlist.find({owner:req.userid});
    console.log("data of playlist::",data);
    res.json(data);
    
})

app.post("/addsongtoplaylist/:id",async function(req,res){
    let data=req.body; 
    console.log(data);
    let song1=new song({
        title:data.title,
        artistname:data.artistname,
        audio:data.audio,
        songimg:data.img,
    });

    //save the song
    await song1.save();

    // 2. find playlist 
    let playlist1 = await playlist.findById(req.params.id);

    // 3. push the song into playlist array
    playlist1.songs.push(song1);

    // 4. Updated playlist ko save karo
    await playlist1.save();

    res.json(playlist1);

    
})