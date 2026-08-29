let trendingsongs=document.querySelectorAll(".trendingsong");
let songimg=document.querySelectorAll(".songimg");
let songname=document.querySelectorAll(".songname");
let artistname=document.querySelectorAll(".artistname");
let seekbar=document.querySelector("#seekbar");
let pause=document.querySelector("#pause");
let revind=document.querySelector("#revind");
let forward=document.querySelector("#forward");
let search=document.querySelector("#search");
let artistimg=document.querySelectorAll(".artistimg");
let rightside2=document.querySelector(".rightside2");
let currentplaylistid=null;//for playlist use
rightside2.style.display="none";

let player=new Audio();
async function gethardcodeddata(){
    let res=await fetch("http://localhost:8080/songs");
    let data=await res.json();
    for(let i=0;i<data.length;i++){
        songimg[i].src="http://localhost:8080"+data[i].songimg;
        songname[i].innerText=data[i].title;
        artistname[i].innerText=data[i].artistname;
        
        trendingsongs[i].addEventListener("click",function(){
            if(i==3){//pasoori is not available currently
                return;
            }
            else{
                playthesong(data[i].audio);
            }
        })

        //for click the artist
       
    }
}
gethardcodeddata();
gethardcodedartist();

async function gethardcodedartist(){
    let res=await fetch("http://localhost:8080/artist");
    let data=await res.json();
    for(let i=0;i<data.length;i++){
        artistimg[i].src="http://localhost:8080"+data[i].artistimg;
        let artistname2=data[i].artistname;
        artistimg[i].addEventListener("click",function(){
            click(artistname2);
        })
    }
}


function playthesong(song){
    player.src="http://localhost:8080"+song;
    player.play();
    pause.innerText="⏸️";
    let footer=document.querySelector("footer");
    footer.classList.add("active");
    console.log("footer hidden");
}
player.addEventListener("timeupdate",function(){
    let progress=(player.currentTime/player.duration)*100;
    seekbar.value=progress;
})
seekbar.addEventListener("input",function(){
    let time=(seekbar.value/100)*player.duration;
    player.currentTime=time;
})

pause.addEventListener("click",function(){
    if(player.paused){
        player.play();
        pause.innerText="⏸️";
    }
    else{
        player.pause();
        pause.innerText="▶️";
    }
})
forward.addEventListener("click",function(){
    player.currentTime+=10;
})
revind.addEventListener("click",function(){
    player.currentTime-=10;
})

search.addEventListener("keydown",async function(e){
    
    if(e.key==="Enter"){
        let query=search.value;
        // let res=await fetch("http://localhost:8080/search",
        //     {
        //         method:"post",
        //         headers:{
        //             "Content-Type":"application/json"
        //         },
        //         body:JSON.stringify({
        //             query:query
        //         })
        //     }
        // )
        // console.log(res.headers.get("content-type"));

        // let data=await res.json();
        // for(let i=0;i<data.results.length;i++){
        //     console.log(data.results[i].trackName);
        // }
        // console.log(data);
        if(currentplaylistid===null){
            window.location.href=`http://localhost:8080/search?q=${query}`;
        }
        else{
            window.location.href=`http://localhost:8080/search?q=${query}&playlistid=${currentplaylistid}`;
        }
        
    }
})

/*click on artist  */

function click(data){

    let query=data;
    window.location.href=`http://localhost:8080/search?q=${query}`;
}

/*playlist */
let createplaylist=document.querySelector("#createplaylist");
let overlay=document.querySelector("#overlay");
let notnow=document.querySelector("#notnow");
let loginbtn=document.querySelector("#loginbtn");

loginbtn.addEventListener("click",async function(){
    console.log("click");
    window.location.href="http://localhost:8080/login";
})

createplaylist.addEventListener("click",function(){
    if(localStorage.getItem("token")===null){
         overlay.style.display="flex";
    }
    else{
        let rightside=document.querySelector(".rightside");
        rightside.style.display="none";
        rightside2.style.display="flex";
        loadplaylist();
    }
   
})

notnow.addEventListener("click",function(){
    overlay.style.display="none";
})

/*login */

let login=document.querySelector("#login");
login.addEventListener("click",async function(){
    console.log("click");
    window.location.href="http://localhost:8080/login";
})

/*check for the login */
async function checklogin(){
    //after login when this  js  loaded we must check serchbar because serch have the userid when the user login

        let searchparams=new URLSearchParams(window.location.search);//all the things of the search bar is stored
        //now take the token from the serch bar
        let token=searchparams.get("token");

        if(token){
            // localStorage mein save karo taaki baad mein bhi mile
            localStorage.setItem("token",token);
            //  URL se token hata do (clean karne ke liye)
            window.history.replaceState({},"","/");
        }
        //now used that token always if exist or not exist
        let savedtoken=localStorage.getItem("token");
        console.log("this is the saved token::",savedtoken);

        if(savedtoken){
            let payloadBase64 = savedtoken.split(".")[1]; // JWT ka beech wala part
            let decodedPayload = JSON.parse(atob(payloadBase64));

            console.log("User ID:", decodedPayload.userid);
        }
        // let token=localStorage.getItem("token");
        if(!savedtoken) return;
        let res=await fetch("http://localhost:8080/me",{
            headers:{
                authorization:`bearer ${savedtoken}`
            }
        });
        if(res.ok){
            let data=await res.json();
            console.log("/me output from the server is :",data);
        }
        else{
            console.log("token invalid/expired ");
            localStorage.removeItem("token");
        }
}

checklogin();

/*playlists */


let container=document.querySelector("#listofallplaylist");

async function renderplaylist(data){
    container.innerHTML=""
    let addplaylist=document.createElement("button");
    addplaylist.id="creatnewplaylist";
    addplaylist.innerText="creat new playlist";
    container.appendChild(addplaylist);
    for(let i=0;i<data.length;i++){
        let playlistdiv=document.createElement("div");
        playlistdiv.className="playlists";
        playlistdiv.id=data[i]._id;
        let playlistinfo=document.createElement("div");
        playlistinfo.className="playlistinfo";
        let titleforplaylist=document.createElement("h1");
        titleforplaylist.id="titleforplaylist";
        let addnewsong=document.createElement("button");
        addnewsong.className="addsongbtn";
        

        //feel the data
        titleforplaylist.innerText=data[i].title;
        addnewsong.innerText = "add song";

        //appending playlistinfo
        playlistinfo.appendChild(titleforplaylist);
        playlistinfo.appendChild(addnewsong);
        playlistdiv.appendChild(playlistinfo); 

        /* */
        if(data[i].songs.length===0){
            let hassong=document.createElement("div");
            hassong.className="hassongs";
            let songtitle=document.createElement("p");
            //if song doesnt exist then doenst need of play and delete
            // let deletebtn=document.createElement("a");
            // deletebtn.className="deletebtn";
            // let playimg=document.createElement("img");
            // playimg.src="assets/play.png";
            // playimg.className="playbutton2";

            //feel the songs data
            songtitle.innerText="#nosongs";
            
            //append the data
            hassong.appendChild(songtitle);
            // hassong.appendChild(deletebtn);
            // hassong.appendChild(playimg);
            playlistdiv.appendChild(hassong);
            

        }
        else{
            for(let j=0;j<data[i].songs.length;j++){
                //now we have just songs id from the playlist doesnt have actual songs
                let id=data[i].songs[j];
                // console.log("searching for this song::",id);
                let findingsong= await fetch(`http://localhost:8080/song/${id}`);
                let foundsong=await findingsong.json();
                // console.log("fond song is",foundsong.title);

                let hassong=document.createElement("div");
                hassong.className="hassongs";
                let songtitle=document.createElement("p");
                let deletebtn=document.createElement("button");
                
                deletebtn.className="deletebtn";
                deletebtn.innerText="deletesong";
                let playimg=document.createElement("img");
                playimg.src="assets/play.png";
                playimg.className="playbutton2";

                playimg.addEventListener("click",function(){
                    player.pause();
                    player.src=foundsong.audio;
                    player.play();
                    pause.innerText="⏸️";
                    let footer=document.querySelector("footer");
                    footer.classList.add("active");
                    console.log("footer hidden");
                })

                //fill the songs data
                songtitle.innerText=foundsong.title;
                
                //append the data
                hassong.appendChild(songtitle);
                hassong.appendChild(deletebtn);
                hassong.appendChild(playimg);
                playlistdiv.appendChild(hassong);

                deletebtn.addEventListener("click",()=>{
                    alert("feture not available in this version")
                })
            }
        }
        container.appendChild(playlistdiv);

    }
}
async function loadplaylist(){
    console.log("serching for playlist")
    let res=await fetch("http://localhost:8080/getplaylist",{
        headers:{
            "Authorization": `bearer ${localStorage.getItem("token")}`
        }
    })
    let data=await res.json();
    console.log("play list found and ::",data);

    renderplaylist(data);
}



// let addnewsong=document.querySelectorAll(".addsongbtn");
// for(let i=0;i<addnewsong.length;i++){
//     addnewsong[i].addEventListener("click",function(){

//     search.focus();
// })
// }
// let addnewplaylist=document.querySelector("#creatnewplaylist");

// addnewplaylist.addEventListener("click",function(){
//     window.location.href="addplaylist.html";
// })


document.addEventListener("click", function(e){
    if(e.target.id === "creatnewplaylist"){
        window.location.href = "addplaylist.html";
    }
    if(e.target.classList.contains("addsongbtn")){
        let playlistdiv = e.target.closest(".playlists");
        currentplaylistid = playlistdiv.id;   // 👈 dataset.playlistid ki jagah bas .id
        console.log("Adding song to playlist ID:", currentplaylistid);
        search.focus();
    }
});


