let progress= document.getElementById("progress");
let song=document.getElementById("song");
let ctrlIcon=document.getElementById("ctrlIcon")

// console.log(ctrlIcon);

let title=document.getElementById("title");
let artist=document.getElementById("artist");
let songThumnail=document.querySelector(".song-img");

let playlist=document.getElementById("playlist");
let bars=document.querySelector(".fa-bars");
let back=document.querySelector(".fa-angle-left");

let songs = [
  {
    title: "Go!",
    artist: "NEFFEX",
    src: "Media/go.mp3",
    img: "Media/thumb1.jpg"
  },
  {
    title: "Fight Back",
    artist: "NEFFEX",
    src: "Media/fightback.mp3",
    img: "Media/thumb2.jpg"
  },
  {
    title: "Kholo Kholo",
    artist: "Raman Mahadevan",
    src: "Media/tareZameenKholo.mp3",
    img: "Media/thumb3.jpg"
  },
  {
    title: "AaneWala Pal Janewala Hai",
    artist: "Kishore Kumar",
    src: "Media/AanewalaPal.mp3",
    img: "Media/thumb4.jpg"
  },
  {
    title: "Chala Jata Hun",
    artist: "Kishore Kumar",
    src: "Media/ChalaJataHun.mp3",
    img: "Media/thumb5.jpg"
  },
  // {
  //   title: "Grateful",
  //   artist: "NEFFEX",
  //   src: "Media/grateful.mp3",
  //   img: "Media/thumb3.jpg"
  // }
];
let currentSongIndex=0;

// song.onloadedmetadata= function(){
//   progress.max=song.duration; // duration might not be fully ready ye , here problem is meta data might load late in browser so use event loadeddata
//   progress.value=song.currentTime; // so that progress changes as song goes on but its initial setted , we have to set progress.value at each time interval so bahar setted
// }

// set correct duration
song.addEventListener("loadeddata",()=>{ // when song is loaded on the audio tag
  progress.max=song.duration;
  // progress.value=song.currentTime;
})

// Don’t depend on class — depend on actual audio state:
// function playPause(e){
//   if(ctrlIcon.classList.contains("fa-pause")){
//     song.pause();
//     ctrlIcon.classList.remove("fa-pause");
//     ctrlIcon.classList.add("fa-play");
//   }
//   else{
//     song.play();
//     ctrlIcon.classList.remove("fa-play");
//     ctrlIcon.classList.add("fa-pause");
//   }
// }

// Uses real state (song.paused)
// ✔ Always correct UI sync
// function playPause(){
//   if(song.paused){
//     song.play();
//     ctrlIcon.classList.remove("fa-play");
//     ctrlIcon.classList.add("fa-pause");
//   } else {
//     song.pause();
//     ctrlIcon.classList.remove("fa-pause");
//     ctrlIcon.classList.add("fa-play");
//   }
// }

//playlist
bars.addEventListener("click",togglePlaylist);
back.addEventListener("click",togglePlaylist);

function renderPlaylist(){
  playlist.innerHTML=songs.map((s,i)=>`
    <div onClick="selectSong(${i})">
      <strong>${s.title}</strong><br/>
      <small>${s.artist}</small>
    </div>
  `).join("");
}
function selectSong(index){
  currentSongIndex=index;
  loadSong(currentSongIndex);
  playSong();
  togglePlaylist(); // close after selecting
}
function togglePlaylist(){
  playlist.classList.toggle("active");  
}

//  Detect click OUTSIDE playlist to remove active so that if playlist gets open you just close it by clicking outside not necessary to select a song so you continue listen to song 

document.addEventListener("click", function(e){
  if(
    playlist.classList.contains("active") &&
    !playlist.contains(e.target) && 
    !e.target.closest(".fa-bars")
  ){
    playlist.classList.remove("active");
  }
});

// load song
function loadSong(index){
  let s= songs[index];
  song.src=s.src;
  title.innerText= s.title;
  artist.innerText=s.artist;
  songThumnail.src=s.img;
}


// breaking above play/pause
function playSong(){
  song.play();
  ctrlIcon.classList.replace("fa-play","fa-pause");
}
function pauseSong(){
  song.pause();
  ctrlIcon.classList.replace("fa-pause","fa-play");
}
//toggle
function togglePlay(){
  if(song.paused){
    playSong();
  }
  else{
    pauseSong();
  }
}

// next and previous
function nextSong(){
  currentSongIndex= (currentSongIndex+1)%songs.length;
  loadSong(currentSongIndex);
  playSong();
}
function prevSong(){
  currentSongIndex= (currentSongIndex-1+songs.length)%songs.length;
  loadSong(currentSongIndex);
  playSong();
}



// this is wrong as song.play() returns a promise so its always truthy , it runned at page load only
// instead do this
// if(song.play()){
  //   setInterval(()=>{
    //     progress.value=song.currentTime;
    //   },500)
    // }
    
// update progress smoothly
song.addEventListener("timeupdate", () => {
  progress.value = song.currentTime;
});

// when i change progress bar so song should play at that time // seek
// Right now you use onchange → fires only after release
// 👉 Use oninput for smooth dragging:

// progress.onchange= function(){
  //   song.play();
  //   song.currentTime=progress.value; 
  //   ctrlIcon.classList.add("fa-pause");
  //   ctrlIcon.classList.remove("fa-play");
  // }
  
  progress.oninput= function(){
    song.currentTime=progress.value;
  }
      
// when song ends so icon should change to play again
song.addEventListener("ended",()=>{
  ctrlIcon.classList.remove("fa-pause");
  ctrlIcon.classList.add("fa-play");
  
})

// at bottom of js
loadSong(currentSongIndex);
renderPlaylist();
