

// main tasks
window.addEventListener('DOMContentLoaded', async () => {
  const userPreferredLanguage = localStorage.getItem('language') || 'en';
  const langData = await fetchLanguageData(userPreferredLanguage);
  
  createCollapsableAlbums(langData);
  updateContent(langData);
  toggleArabicStylesheet(userPreferredLanguage);

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


  if (link.id === 'styles-link' && lang === 'tr') {
    head.removeChild(link); // Remove the old stylesheet link
    const newLink = document.createElement('link');
    newLink.id = 'styles-link';
    newLink.type = 'text/css';
    newLink.rel = 'stylesheet';
    newLink.href = 'style-tr.css'; // Path to Arabic stylesheet
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
  isSong = true;
  var accordion = document.getElementById("accordion");
  for (i = 0; i < totalAlbums - 1; i++) {
    var album = parentKeys[i];
    console.log(album);

    if(album.includes('novel') && isSong === true){
      var novelDiv = document.createElement('div');
      novelDiv.classList.add("elements-title", "mb-15", "mt-30", "text-center");
      accordion.appendChild(novelDiv);

      var h2 = document.createElement('h2');
      h2.setAttribute("data-i18n", "novel_title");
      novelDiv.appendChild(h2);
      isSong = false;
    }
    

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
    link.textContent = jsonData[album]["name"];
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
      
      const keys = Object.keys(song);
    //console.log(keys[1]);
    console.log(album + ".songs." + keys[1]);
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
      //s_name.setAttribute(`data-i18n`, keys[1]);
      s_name.textContent = song["songname"];
      songName.appendChild(s_name);

      var player = document.createElement('div');
      player.classList.add("audioplayer");
      playArea.appendChild(player);

      var audio = document.createElement('audio');
      audio.setAttribute("preload", "auto");
      audio.controls = true;
      audio.id = "audio_" + song.id;
      player.appendChild(audio);

      var source = document.createElement('source');
      source.setAttribute("src", song.url);
      audio.appendChild(source);

    }
  }
}

const audios = document.querySelectorAll('audio');
let audioOptions = {};

let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const audio = entry.target;
    //const newURL = audio.getAttribute('data-src');
    //audio.src = newURL;
    observer.unobserve(audio);
  });
}, audioOptions );

audios.forEach((audio) => {
  observer.observe(audio);
});



