var youtubeId = null;
//var iframeSrc = null;
var newWindow = null;
var newWidth = window.outerWidth;
var newHeight = window.outerHeight;
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

  var newSize = findGetParameter("size");
  if(newSize) {
     winSize = parseInt(newSize);
  }
  var fullWidth = window.outerWidth;
  var fullHeight = window.outerHeight;
  var winBorder = (100.0-winSize)/2;

  newWidth = Math.round(fullWidth*winSize/100);
  newHeight = Math.round(fullHeight*winSize/100);

  var posString = "width=" + (16+newWidth).toString()+","
                + "height=" + (16+newHeight).toString()+","
                + "left=" + Math.round(fullWidth*winBorder/100).toString()+","
                + "top=" + Math.round(fullHeight*winBorder/100).toString()+","
                + "location=no,menubar=no,status=no,titlebar=no,toolbar=no";
     
  newWindow = window.open(newHref, "_blank", posString);
  if(null!=newWindow) {
    var popup = document.getElementById("popup");
    popup.parentNode.removeChild(popup);
    window.history.back(); 
  }
} else {
  var popup = document.getElementById("popup");
  popup.parentNode.removeChild(popup);  
  //window.resizeTo(700, 400);
  window.focus();
  //youtube
  // https://developers.google.com/youtube/iframe_api_reference
  youtubeId = findGetParameter("youtube");
  if(youtubeId) {
     initializeYoutube();
  }
 //iframe
  var iframeSrc = findGetParameter("iframe");
  if(iframeSrc) {
     iframeAllow = findGetParameter("allow");
     initializeIframe(iframeSrc, iframeAllow);
  }
  //vimeo
  var vimeoId = findGetParameter("vimeo");
  if(vimeoId) {
     vimeoSrc = "https://player.vimeo.com/video/" + vimeoId;
     vimeoAllow = "autoplay; fullscreen; picture-in-picture";
     initializeIframe(vimeoSrc, vimeoAllow);
  }
  //tib
  var tibId = findGetParameter("tib");
  if(tibId) {
     tibSrc = "https://av.tib.eu/player/" + tibId;
     tibAllow = null;
     initializeIframe(tibSrc, tibAllow);
  }
  //dailymotion
  // https://developer.dailymotion.com/tools/sdks/#sdk-javascript
  var dailymotionId = findGetParameter("dailymotion");
  if(dailymotionId) {
     dailymotionSrc = "https://www.dailymotion.com/embed/video/" + dailymotionId;
     dailymotionSrc += "?autoplay=1";
     dailymotionAllow = "autoplay";
     initializeIframe(dailymotionSrc, dailymotionAllow);
  }
}

function initializeIframe(iframeSrc, iframeAllow) {
      var iframe = document.createElement('iframe');
      iframe.src = iframeSrc;
      iframe.width = newWidth.toString();
      iframe.height = newHeight.toString();
      iframe.frameborder = "0";
      iframe.scrolling = "no";
      iframe.allowfullscreen = "";
      if(iframeAllow) {
        iframe.allow = iframeAllow;
      }
      iframeDiv = document.getElementById("iframe");
      iframeDiv.appendChild(iframe);      
}

// https://developers.google.com/youtube/iframe_api_reference
function initializeYoutube() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

 var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtube', {
          height: newHeight.toString(),
          width: newWidth.toString(),
          videoId: youtubeId,
          playerVars: {
            playlist: youtubeId,
            autoplay: 1,
            start: 35,
            end: 45,
            loop: 1
          },
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
        // player.stopVideo();
      }

