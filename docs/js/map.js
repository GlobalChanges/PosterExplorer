{




var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
 maxZoom: 16,
 minZoom: 1,
 noWrap: true,
 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 })


var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 16,
        minZoom: 1,
        noWrap: true,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
})


var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
        noWrap: true,
	ext: 'jpg'
})

var baseMaps = {
    "OSM": OpenStreetMap_DE,
    "OTM": OpenTopoMap,
    "Paint": Stamen_Watercolor
};

var markers = L.LayerGroup();

var overlayMaps = {
    // "Markers": markers
};


 function initMap() { 

 var map = L.map('map', {
     center: [0, 0],
     zoom: 1,
     layers: [OpenTopoMap] // [background, markers]
 });

 L.control.layers(baseMaps, overlayMaps).addTo(map);

 }

}
