let form=document.querySelector("form");
form.addEventListener("submit", async function(e){
    e.preventDefault();

    let title = document.querySelector("#playlisttitle").value;
    let token = localStorage.getItem("token");

    if(!token){
        alert("Please login first!");
        return;
    }
    let res = await fetch("http://127.0.0.1:8080/playlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`   // 👈 yehi missing tha native form mein
        },
        body: JSON.stringify({ title: title })
    });

    let data = await res.json();

    if(res.ok){
        console.log("Playlist created:", data);
        window.location.href = "index.html"; // apna main page ka naam yahan daalna
    } else {
        console.log("Error:", data.error);
        alert(data.error);
    }
});