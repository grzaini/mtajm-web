

// main tasks
window.addEventListener('DOMContentLoaded', async () => {
  const userPreferredLanguage = localStorage.getItem('language') || 'en';
  const langData = await fetchLanguageData(userPreferredLanguage);
  updateContent(langData);
  createCollapsableAlbums(langData);
  toggleArabicStylesheet(userPreferredLanguage);
  //makeFunctionality(langData);

  let playpauseBtns = document.querySelectorAll('.play-pause-button');
  let volumeButton = document.querySelectorAll('.audioplayer-volume-button');
  
  playpauseBtns.forEach(button => {
    console.log(button);
    button.addEventListener("click", function () {
      console.log('clocked');
      // Get the associated audio element ID from the data attribute
      const audioId = button.getAttribute('data-audio-id');
      const audioElement = document.getElementById(audioId);

      // Toggle play/pause
      if (audioElement.paused) {
        audioElement.play();
        //button.textContent = 'Pause';
      } else {
        audioElement.pause();
        //button.textContent = 'Play';
      }
    });

    //button.addEventListener('timeupdate', updateCurrentTime);
  });

  
  document.addEventListener('click', updateCurrentTime);


  const playBars = document.querySelectorAll('.play-bar');
  playBars.forEach(playBar => {
    playBar.addEventListener('input', () => {
        const audioId = playBar.getAttribute('data-audio-id');
        const audioElement = document.getElementById(audioId);

        // Calculate the seek time based on the play bar value
        const seekTime = audioElement.duration * (playBar.value / 100);

        // Set the current playback position of the audio element
        audioElement.currentTime = seekTime;
    });

    // Update the play bar as the audio plays
    const audioId = playBar.getAttribute('data-audio-id');
    const audioElement = document.getElementById(audioId);

    audioElement.addEventListener('timeupdate', () => {
        // Calculate the play bar value as a percentage of audio progress
        const playBarValue = (audioElement.currentTime / audioElement.duration) * 100;
        
        // Update the play bar position
        playBar.value = playBarValue;
    });
});

  // volumeButton.forEach(volbtn => {
  //   volbtn.addEventListener("click", );
  // });



});

async function fetchLanguageData(lang) {
  const response = await fetch(`languages/${lang}.json`);
  return response.json();
}

function updateContent(langData) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = langData["message"][key];
    //console.log(key);
  });
}

function toggleArabicStylesheet(lang) {
  const head = document.querySelector('head');
  const link = document.querySelector('#styles-link');

  if (link) {
    head.removeChild(link); // Remove the old stylesheet link
  }
  else if (lang === 'tr') {
    const newLink = document.createElement('link');
    newLink.id = 'styles-link';
    newLink.rel = 'stylesheet';
    newLink.href = './css/style-tr.css'; // Path to Arabic stylesheet
    head.appendChild(newLink);
  }
}

//change languge
async function changeLanguage(lang) {
  await setLanguagePreference(lang);

  const langData = await fetchLanguageData(lang);
  updateContent(langData);

  toggleArabicStylesheet(lang);// Toggle Arabic stylesheet
}

function setLanguagePreference(lang) {
  localStorage.setItem('language', lang);
  location.reload();
}

function createCollapsableAlbums(jsonData) {
  totalAlbums = Object.keys(jsonData).length;
  parentKeys = Object.keys(jsonData);
  var accordion = document.getElementById("accordion");
  for (i = 0; i < totalAlbums - 1; i++) {
    var album = parentKeys[i];

    // make collapsable album title
    var titleDiv = document.createElement('div');
    titleDiv.classList.add("panel", "single-accordion");
    accordion.appendChild(titleDiv);

    var h6 = document.createElement('h6');
    titleDiv.appendChild(h6);

    var link = document.createElement('a');
    link.setAttribute("role", "button");
    link.setAttribute("aria-expanded", "true");
    link.setAttribute("aria-controls", album + i);
    link.setAttribute("data-toggle", "collapse");
    link.setAttribute("data-parent", "#accordion");
    link.href = "#" + album + i;
    link.textContent = album;
    h6.appendChild(link);

    var open = document.createElement('span');
    open.classList.add("accor-open");
    var o_icon = document.createElement('i');
    o_icon.classList.add("fa", "fa-plus");
    o_icon.setAttribute("aria-hidden", "true");
    open.appendChild(o_icon);
    link.appendChild(open);

    var close = document.createElement('span');
    close.classList.add("accor-close");
    var c_icon = document.createElement('i');
    c_icon.classList.add("fa", "fa-plus");
    c_icon.setAttribute("aria-hidden", "true");
    close.appendChild(c_icon);
    link.appendChild(close);

    var collapseDiv = document.createElement('div');
    collapseDiv.id = album + i;
    collapseDiv.classList.add("accordion-content", "collapse");
    titleDiv.appendChild(collapseDiv);

    var rowDiv = document.createElement('div');
    rowDiv.classList.add("row");
    collapseDiv.appendChild(rowDiv);
    //end of (make collapsable album title)

    // single song area
    var songs = jsonData[album]["songs"];
    for (var song of songs) {
      var colDiv = document.createElement('div');
      colDiv.classList.add("col-12");
      rowDiv.appendChild(colDiv);

      var songArea = document.createElement('div');
      songArea.classList.add("single-song-area", "d-flex", "flex-wrap", "align-items-end");
      colDiv.appendChild(songArea);

      var playArea = document.createElement('div');
      playArea.classList.add("song-play-area");
      songArea.appendChild(playArea);

      var songName = document.createElement('div');
      songName.classList.add("song-name");
      playArea.appendChild(songName);

      var s_name = document.createElement('p');
      s_name.textContent = song["songname"];
      songName.appendChild(s_name);

      var player = document.createElement('div');
      player.classList.add("audioplayer");
      playArea.appendChild(player);

      var audio = document.createElement('audio');
      audio.setAttribute("preload", "auto");
      audio.setAttribute("visibility", "hidden");
      audio.style.width = "0px";
      audio.style.height = "0px";
      audio.controls = true;
      audio.id = "audio_" + song.id;
      player.appendChild(audio);

      var source = document.createElement('source');
      source.setAttribute("src", song.url);
      audio.appendChild(source);

      var playpause = document.createElement('div');
      playpause.classList.add("audioplayer-playpause");
      player.appendChild(playpause);

      // 1. play/pause button
      var pl = document.createElement('a');
      pl.id = "play_btn_" + song.id;
      pl.classList.add("play-pause-button");
      pl.setAttribute("data-audio-id", audio.id);
      playpause.appendChild(pl);

      // 2. curren time  
      var playertime = document.createElement('div');
      playertime.classList.add("audioplayer-time", "audioplayer-time-current", "current-time");
      playertime.textContent = "0:00";
      playertime.setAttribute("data-audio-id", audio.id);
      player.appendChild(playertime);

      // 3. bar 
      var bar = document.createElement('div');
      bar.classList.add("audioplayer-bar");
      //bar.style.width = "100%";
      player.appendChild(bar);

      var barLoaded = document.createElement('div');
      barLoaded.classList.add("audioplayer-bar-loaded");
      barLoaded.style.width = "100%";
      bar.appendChild(barLoaded);

      var barplayed = document.createElement('div');
      barplayed.classList.add("audioplayer-bar-played", "play-bar");
      barplayed.setAttribute("data-audio-id", audio.id);
      barplayed.setAttribute("min", 0);
      barplayed.setAttribute("value", 0);
      bar.appendChild(barplayed);

      // 4. duration
      var playDuration = document.createElement('div');
      playDuration.classList.add("audioplayer-time", "audioplayer-time-duration");
      playDuration.textContent = "04:20";
      player.appendChild(playDuration);

      var volume = document.createElement('div');
      volume.classList.add("audioplayer-volume");
      player.appendChild(volume);

      // 5. volume button
      var vol_button = document.createElement('div');
      vol_button.classList.add("audioplayer-volume-button");
      vol_button.setAttribute("title", "");
      volume.appendChild(vol_button);

      var vol_link = document.createElement('a');
      vol_link.href = "#";
      vol_button.appendChild(vol_link);

      var vol_adjust = document.createElement('div');
      vol_adjust.classList.add("audioplayer-volume-adjust");
      volume.appendChild(vol_adjust);

      var inAdjDiv = document.createElement('div');
      vol_adjust.appendChild(inAdjDiv);

      // 6. volume bar
      var innerDiv = document.createElement('div');
      innerDiv.style.width = "100%";
      inAdjDiv.appendChild(innerDiv);

    }
  }
}

function updateCurrentTime() {
  let currentTimeElements = document.querySelectorAll('.current-time');
    currentTimeElements.forEach(currentTimeElement => {
      console.log(currentTimeElement);
        const audioId = currentTimeElement.getAttribute('data-audio-id');
        const audioElement = document.getElementById(audioId);
        
        // Format the current time (in seconds) as mm:ss
        const currentTimeInSeconds = Math.floor(audioElement.currentTime);
        const minutes = Math.floor(currentTimeInSeconds / 60);
        const seconds = currentTimeInSeconds % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update the current time display
        currentTimeElement.textContent = formattedTime;
    });
}