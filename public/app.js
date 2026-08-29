


let player = new Audio();

let cards = document.querySelectorAll(".card");

cards.forEach((card)=>{
    card.addEventListener("click",function(){

        let song = card.dataset.audio;

        player.src = song;
        player.play();

    });
});

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

/*for adding into playlist */
let playlistid = document.querySelector("#searchpage").dataset.playlistid;
console.log(playlistid);

let addsong = document.querySelectorAll(".addsong");
for(let i=0; i<addsong.length; i++){
    addsong[i].addEventListener("click", async function(e){
        if(playlistid === "null" || !playlistid){
            alert("login is required");
        }
        else{
            let card = e.target.closest(".card");           // 👈 nearest song card dhundo
            let songtitle = card.querySelector("h3").innerText;
            let artistname = card.querySelector("p").innerText;
            let audio=card.dataset.audio;

            console.log(audio);
            let img = card.querySelector("img").dataset.img;
            console.log("img",img);
            let res = await fetch(`http://localhost:8080/addsongtoplaylist/${playlistid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: songtitle, artistname: artistname, audio:audio,img:img})
            });

            let data = await res.json();
            console.log("Song added:", data);

            window.location.href = "http://127.0.0.1:3000/index.html";
        }
    });
}