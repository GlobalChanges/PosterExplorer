var youtubeId = null;
var newWindow = null;
var winSize = 75;

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}



var isNew = findGetParameter("popup");
if(!isNew) {
  var newHref = location.href + '?popup=1'
  if (location.href.indexOf('?') > -1) {
     newHref = location.href + '&popup=1';
  }
  var newUrl = findGetParameter("url");
  if(newUrl) {
    newHref = newUrl;
  }
  var fullWidth = window.outerWidth;
  var fullHeight = window.outerHeight;
  var winBorder = (100.0-winSize)/2;

  var posString = "width=" + Math.round(fullWidth*winSize/100).toString()+","
                + "height=" + Math.round(fullHeight*winSize/100).toString()+","
                + "left=" + Math.round(fullWidth*winBorder/100).toString()+","
                + "top=" + Math.round(fullHeight*winBorder/100).toString()+","
                + "location=no,menubar=no,status=no,titlebar=no,toolbar=no";
     
  newWindow = window.open(newHref, "_blank", posString);
  if(null!=newWindow) {
    window.history.back(); 
  }
} else {
  //window.resizeTo(700, 400);
  window.focus();
  youtubeId = findGetParameter("youtube");
  if(youtubeId) {
     initializeYoutube();
  }

}


function initializeYoutube() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

 var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtube', {
          height: '390',
          width: '640',
          videoId: youtubeId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }

