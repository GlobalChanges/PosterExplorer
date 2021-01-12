function initMap() {return null};

var jsonDBs = [
  {"url": "https://jsonbox.io/GLoBaLCHaNGePoSTeReXPLoReR/" },  // https://github.com/vasanthv/jsonbox#readme
  {"url": "https://jsonbase.com/GLoBaLCHaNGePoSTeReXPLoReR/" }

// https://jsonstorage.net/

];

function getJsonDb() {
 return jsonDBs[0].url;
}

var corsProxies = [
  {"url": "https://cors-anywhere.herokuapp.com/", "p": 0.4, "content": null},      // 200 in 60 min 
  {"url": "https://api.allorigins.win/get?url=", "p": 0.6, "content": "contents"}  // goes into contents:
 // NOT WORKING
 // "https://cors-proxy.htmldriven.com/?url=", // 404
 // "https://thingproxy.freeboard.io/fetch/", // ??
 // "http://www.whateverorigin.org/get?url=", // https needed
 // "http://alloworigin.com/get?url=", // https needed
 // "https://yacdn.org/proxy/"  // <uri>?maxAge=10  bad gateway
];

// geo&ip:  https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
// ip:      https://ourcodeworld.com/articles/read/257/how-to-get-the-client-ip-address-with-javascript-only

function getRandomProxy() {
  var randomFloat = Math.random();
  var proxy = null
  for (var i = 0; i < corsProxies.length; i++ ) {  
    proxy = corsProxies[i];
    randomFloat -= proxy.p;
    if(randomFloat < 0.0) {
      return proxy.url;
    }
  }
  return proxy.url;
}

var makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var crc32 = function(str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

function getFingerprint(days=5.0, delta=0.0) {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  var dateTs = Date.now() - 1000*60*60*24*delta;           // i.e. 2 days
  var dateTs = Math.round(dateTs/(1000*60*60*24*days));    // i.e. 4 days
  uid += navigator_info.userAgent.replace(/\D+/g, '');
  uid += navigator_info.plugins.length;                   // plugins: name,version
  uid += screen_info.height || '';
  uid += screen_info.width || '';
  uid += screen_info.pixelDepth || '';
  uid += dateTs.toString();
  return crc32(uid);
}

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

function checkUrlSubString(str) {
  return (location.href.indexOf(str) != -1);
}

function isoStr(str) {
   if (!str) return '';
   str = str.replace(' ','_');
   str = str.replace('ß','ss');
   str = str.replace('ü','ue');
   return str.toLowerCase();
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function transparentize(color, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return Color(color).alpha(alpha).rgbString();
}


var vueGCPE = new Vue({
  el: '#gcpe', 
  data: {
        uid: '0',
        uidOld: '0',
        //posterIds: [],
        allMapCountries: {},
        allPosterData: [],    
        selectedPosterData: [], 
        allPosterContinents: [],
        allPosterCountries: [],
        allPosterLandscapes: [],
        allPosterTopics: [],
        allPosterMethods: [],
        filterLocation: "Alle",
        filterLandscape: "Alle",
        filterTopic: "Alle",
        filterMethod: "Alle",
  },
  methods: {
     resetPosters: function() { 
       this.allPosterData = [];
       this.allPosterContinents = [];
       this.allPosterCountries = [];
       this.allPosterLandscapes = [];
       this.allPosterTopics = [];
       this.allPosterMethods = [];
     }, 
     addPoster: function(json) { 
        // Vue.set(this.allPosterData2, json.id, json); 
        this.allPosterData.push(json);
        this.selectedPosterData.push(json);
        if(json.location.continent && !this.allPosterContinents.includes(json.location.continent)) {
          this.allPosterContinents.push(json.location.continent);
          this.allPosterContinents.sort();
        }
        if(json.location.country && !this.allPosterCountries.includes(json.location.country)) {
          this.allPosterCountries.push(json.location.country);
          this.allPosterCountries.sort();
        }
        if(json.location.countries) {
          for(var j=0; j<json.location.countries.length; j++) {
            var country = json.location.countries[j]; 
            if(country && !this.allPosterCountries.includes(country)) {
              this.allPosterCountries.push(country);
              this.allPosterCountries.sort();
            }
          }
        }
        if(json.location.landscape && !this.allPosterLandscapes.includes(json.location.landscape)) {
          this.allPosterLandscapes.push(json.location.landscape);
          this.allPosterLandscapes.sort();
        }
        if(json.topic && !this.allPosterTopics.includes(json.topic)) {
          this.allPosterTopics.push(json.topic);
          this.allPosterTopics.sort();
        }
        if(json.subtopic && !this.allPosterTopics.includes(json.subtopic)) {
          this.allPosterTopics.push(json.subtopic);
          this.allPosterTopics.sort();
        }
        if(json.concept && !this.allPosterMethods.includes(json.concept)) {
          this.allPosterMethods.push(json.concept);
          this.allPosterMethods.sort();
        }

     },
     updatePoster: function(data) {
         var dbPostUrl = getJsonDb()+"poster";
         data.count += 1;
         var delta = (data.ts - Date.now())/(1000*60*60*24*90);  // 3 month
         data.value *= Math.exp(delta)
         data.value += 1.0;
         data.ts = Date.now();
         axios
          .post(dbPostUrl, data)
          .catch(function (error) {
             console.log(error);
           });
     },
     removeUpdatePoster: function (data) {
         var dbDelUrl = getJsonDb()+"poster?q=id:"+data.id;
         axios
           .delete(dbDelUrl)
           .catch(function (error) {
              console.log(error);
           })
           .then(response => { 
              this.updatePoster(data);
           }); 
     },
     getRemoveUpdatePoster: function (id) {
       var dbUrl = getJsonDb()+"poster?q=id:"+id;
       axios
         .get(dbUrl)
         .catch(error => {
              console.log(error);
              this.updatePoster({"id": id, "count": 0, "value": 0.0, "ts": Date.now()});
           })
         .then(response => { 
            if(response.data.length > 0) {
               this.removeUpdatePoster(response.data[0]);
            } else {
              this.updatePoster({"id": id, "count": 0, "value": 0.0, "ts": Date.now()});
            }
       });

     },
     openPoster: function (id) {
       this.getRemoveUpdatePoster(id);
       return true;
     },
     inqCountries: function () {
       var volumesUrl = "https://globalchanges.github.io/MetaData2020/countries.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setCountries(response.data);
       });
     },
     setCountries: function(data) { this.allMapCountries = data; },
     mapicon: function (str) {
       var c = this.allMapCountries[str]
       return c ? c.map : 'wrld' ;
     }, 
     inqTopics: function () {
       var volumesUrl = "https://globalchanges.github.io/MetaData2020/topics.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setTopics(response.data);
       });
     },
     setTopics: function(data) { this.allTopics = data; },
     awesome: function (str) {
       var c = this.allTopics[str]
       return c ? c.awesome : 'question';
     },
     inqIds: function() {
       var volumesUrl = "https://globalchanges.github.io/MetaData2020/volumes.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            var ids = response.data;
            this.resetPosters();
            for(var j=0; j<ids.length; j++) {
              var id = ids[j]; 
              var posterUrl = "https://globalchanges.github.io/MetaData2020/"+id+"/meta.json";   
              axios
                .get(posterUrl)
                .then(response => { 
                   this.addPoster(response.data);
              });              
            }
       });
     },
     setLocationFilter: function(location) {
       this.filterLocation = location;
       this.filterPosterData();
     },
     setLandscapeFilter: function(landscape) {
       this.filterLandscape = landscape;
       this.filterPosterData();
     },
     setTopicFilter: function(topic) {
       this.filterTopic = topic;
       this.filterPosterData();
     },
     setMethodFilter: function(method) {
       this.filterMethod = method;
       this.filterPosterData();
     },
    filterPosterData: function() {
       var result = [];
       for(var j=0; j<this.allPosterData.length; j++) {
          var poster = this.allPosterData[j]; 
          var locationFound =  ((this.filterLocation == 'Alle') || 
                                (this.filterLocation == poster.location.continent) ||
                                (this.filterLocation == poster.location.country) ||
                                (poster.location.countries && poster.location.countries.includes(this.filterLocation))
                               );
          var landscapeFound =  ((this.filterLandscape == 'Alle') || 
                                (this.filterLandscape == poster.location.landscape));
          var topicFound =  ((this.filterTopic == 'Alle') || 
                                (this.filterTopic == poster.topic) ||
                                (this.filterTopic == poster.subtopic));
          var methodFound =  ((this.filterMethod == 'Alle') || 
                                (this.filterMethod == poster.concept));
          if(locationFound && landscapeFound && topicFound && methodFound) {
            result.push(poster);
          }
       }
       shuffle(result)
       this.selectedPosterData = shuffle(result);
    },
  },
  computed: {


  },
  filters: {
    lowercase: function (str) {
      return isoStr(str);
    },
    shorting: function (str) {
      if(str.length > 715) {
        str = str.substr(0, 710)+' ...';
      }
      return str;
    },
  },
  mounted () { 
     this.inqCountries();
     this.inqTopics();
     this.initTs = Date.now();
     this.uid = getFingerprint(4.0, 0.0);
     this.uidOld = getFingerprint(4.0, 2.0);
     this.inqIds();

     initMap();
     //this.filterPosterData();
  }
}) 
